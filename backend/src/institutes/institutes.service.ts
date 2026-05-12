import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchInstitutesDto } from './dto/search-institutes.dto';
import { Prisma } from '@prisma/client';
import { OnboardInstituteDto } from './dto/onboard-institute.dto';
import * as bcrypt from 'bcryptjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class InstitutesService {
  private supabase: SupabaseClient;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!
    );
  }

  async getRecent(lat?: number, lng?: number) {
    let ids: string[] = [];

    if (lat && lng) {
      // Find IDs of 3 nearest institutes using Haversine formula (Standard SQL)
      const nearby: any[] = await this.prisma.$queryRaw`
        SELECT 
          i.id,
          6371 * acos(
            cos(radians(${lat})) * cos(radians(b.latitude)) * 
            cos(radians(b.longitude) - radians(${lng})) + 
            sin(radians(${lat})) * sin(radians(b.latitude))
          ) as distance
        FROM "Institute" i
        INNER JOIN "Branch" b ON b."instituteId" = i.id
        WHERE i.status = 'APPROVED'
        AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
        ORDER BY distance ASC
        LIMIT 3;
      `;
      ids = nearby.map(n => n.id);
    }

    const institutes = await this.prisma.institute.findMany({
      where: ids.length > 0 
        ? { id: { in: ids } } 
        : { status: 'APPROVED' },
      include: {
        images: { orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], take: 1 },
        owner: { select: { firstName: true } },
        branches: { include: { city: true }, take: 1 },
        reviews: {
          where: { status: 'APPROVED' },
          select: { rating: true },
        },
      },
      orderBy: ids.length > 0 ? undefined : { createdAt: 'desc' },
      take: 3,
    });

    // If we used IDs, we need to sort them by the original ID order (distance)
    const sortedInstitutes = ids.length > 0 
      ? ids.map(id => institutes.find(i => i.id === id)).filter(Boolean) as typeof institutes
      : institutes;

    return sortedInstitutes.map((inst) => {
      const reviewCount = inst.reviews.length;
      const avgRating = reviewCount > 0 
        ? inst.reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewCount 
        : 0;
      
      const { reviews, ...rest } = inst;
      return {
        ...rest,
        reviewCount,
        avgRating,
      };
    });
  }

  async search(dto: SearchInstitutesDto) {
    let { lat, lng, radius = 5, serviceId, cityId, query, sort, location, minRating, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    if (!cityId && location) {
      const city = await this.prisma.city.findFirst({
        where: { name: { equals: location, mode: 'insensitive' } }
      });
      if (city) cityId = city.id;
    }

    if (lat && lng) {
      const radiusInMeters = radius * 1000;
      
      // Find IDs and distances of matching institutes nearby using Haversine formula
      // 6371 is the radius of the Earth in KM
      const nearby: any[] = await this.prisma.$queryRaw`
        SELECT 
          i.id,
          i."isFeatured",
          i."isVerified",
          MIN(6371 * acos(
            cos(radians(${lat})) * cos(radians(b.latitude)) * 
            cos(radians(b.longitude) - radians(${lng})) + 
            sin(radians(${lat})) * sin(radians(b.latitude))
          )) as "distanceKm"
        FROM "Institute" i
        INNER JOIN "Branch" b ON b."instituteId" = i.id
        LEFT JOIN "InstituteService" "is" ON "is"."instituteId" = i.id
        LEFT JOIN "Service" s ON s.id = "is"."serviceId"
        WHERE i.status = 'APPROVED'
        AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
        ${query ? Prisma.sql`AND (i.name ILIKE ${'%' + query + '%'} OR s.name ILIKE ${'%' + query + '%'})` : Prisma.empty}
        ${cityId ? Prisma.sql`AND b."cityId" = ${cityId}` : Prisma.empty}
        ${serviceId ? Prisma.sql`AND "is"."serviceId" = ${serviceId}` : Prisma.empty}
        GROUP BY i.id, i."isFeatured", i."isVerified"
        HAVING MIN(6371 * acos(
          cos(radians(${lat})) * cos(radians(b.latitude)) * 
          cos(radians(b.longitude) - radians(${lng})) + 
          sin(radians(${lat})) * sin(radians(b.latitude))
        )) <= ${radius}
        ORDER BY i."isFeatured" DESC, "distanceKm" ASC
        LIMIT ${limit} OFFSET ${skip};
      `;

      // Get total count for pagination using a subquery to handle the HAVING clause
      const totalCountRes: any[] = await this.prisma.$queryRaw`
        SELECT COUNT(*)::int as count FROM (
          SELECT i.id
          FROM "Institute" i
          INNER JOIN "Branch" b ON b."instituteId" = i.id
          LEFT JOIN "InstituteService" "is" ON "is"."instituteId" = i.id
          LEFT JOIN "Service" s ON s.id = "is"."serviceId"
          WHERE i.status = 'APPROVED'
          AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
          ${query ? Prisma.sql`AND (i.name ILIKE ${'%' + query + '%'} OR s.name ILIKE ${'%' + query + '%'})` : Prisma.empty}
          ${cityId ? Prisma.sql`AND b."cityId" = ${cityId}` : Prisma.empty}
          ${serviceId ? Prisma.sql`AND "is"."serviceId" = ${serviceId}` : Prisma.empty}
          GROUP BY i.id
          HAVING MIN(6371 * acos(
            cos(radians(${lat})) * cos(radians(b.latitude)) * 
            cos(radians(b.longitude) - radians(${lng})) + 
            sin(radians(${lat})) * sin(radians(b.latitude))
          )) <= ${radius}
        ) as subquery;
      `;
      const total = totalCountRes[0]?.count || 0;

      const ids = nearby.map(n => n.id);
      if (ids.length === 0) return { data: [], total: 0, page, limit };

      // Fetch full records for these IDs
      const results = await this.prisma.institute.findMany({
        where: { id: { in: ids } },
        include: {
          branches: { include: { city: true, area: true } },
          services: { include: { service: true } },
          images: { orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], take: 1 },
          reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
        }
      });

      // Map statistics and merge distance from SQL query
      const sortedResults = results.map(inst => {
        const reviewCount = inst.reviews.length;
        const avgRating = reviewCount > 0 
          ? inst.reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewCount 
          : 0;
        
        const distanceData = nearby.find(n => n.id === inst.id);
        
        return {
          id: inst.id,
          name: inst.name,
          description: inst.description,
          logoUrl: inst.logoUrl,
          website: inst.website,
          isVerified: inst.isVerified,
          isFeatured: inst.isFeatured,
          images: inst.images,
          branches: inst.branches,
          services: inst.services,
          avgRating,
          reviewCount,
          distanceKm: distanceData?.distanceKm,
          cityName: inst.branches[0]?.city?.name,
          areaName: inst.branches[0]?.area?.name,
        };
      }).filter(inst => !minRating || inst.avgRating >= minRating)
        .sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        });

      return {
        data: sortedResults,
        total,
        page,
        limit
      };
    }

    // Fallback simple Prisma lookup if no coordinates provided
    const [institutes, total] = await Promise.all([
      this.prisma.institute.findMany({
        where: {
          status: 'APPROVED',
          OR: query ? [
            { name: { contains: query, mode: 'insensitive' } },
            { services: { some: { service: { name: { contains: query, mode: 'insensitive' } } } } }
          ] : undefined,
          branches: cityId ? { some: { cityId } } : undefined,
          services: serviceId ? { some: { serviceId } } : undefined,
        },
        include: {
          branches: {
            include: { city: true, area: true },
          },
          services: {
            include: { service: true }
          },
          images: { orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], take: 1 },
          reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: skip,
      }),
      this.prisma.institute.count({
        where: {
          status: 'APPROVED',
          OR: query ? [
            { name: { contains: query, mode: 'insensitive' } },
            { services: { some: { service: { name: { contains: query, mode: 'insensitive' } } } } }
          ] : undefined,
          branches: cityId ? { some: { cityId } } : undefined,
          services: serviceId ? { some: { serviceId } } : undefined,
        },
      }),
    ]);

    const data = institutes.map(inst => {
      const reviewCount = inst.reviews.length;
      const avgRating = reviewCount > 0 
        ? inst.reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewCount 
        : 0;

      return {
        id: inst.id,
        name: inst.name,
        description: inst.description,
        logoUrl: inst.logoUrl,
        website: inst.website,
        isVerified: inst.isVerified,
        isFeatured: inst.isFeatured,
        images: inst.images,
        branches: inst.branches,
        services: inst.services,
        avgRating,
        reviewCount,
        cityName: inst.branches[0]?.city?.name,
        areaName: inst.branches[0]?.area?.name,
      };
    }).filter(inst => !minRating || inst.avgRating >= minRating)
      .sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0; // Maintain createdAt order from Prisma if both same featured status
      });

    return {
      data,
      total,
      page,
      limit
    };
  }

  async findOne(id: string) {
    return this.prisma.institute.findUnique({
      where: { id },
      include: {
        branches: { include: { schedules: true, city: true, area: true } },
        services: { include: { service: true } },
        images: { orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] },
        featuredListings: {
          orderBy: { endsAt: 'desc' },
          take: 1
        }
      }
    });
  }

  async delete(id: string) {
    return this.prisma.institute.delete({
      where: { id }
    });
  }

  async getMetadata() {
    const [cities, services] = await Promise.all([
      this.prisma.city.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.service.findMany({ orderBy: { name: 'asc' } }),
    ]);
    return { cities, services };
  }

  async getSitemapData() {
    return this.prisma.institute.findMany({
      where: { status: 'APPROVED' },
      select: { id: true, updatedAt: true }
    });
  }

  async onboard(dto: OnboardInstituteDto) {
    return this.prisma.$transaction(async (tx) => {
      let userId = dto.ownerId;

      if (!userId) {
        // 0. Check for existing user by email if ownerId is not provided
        const existingUser = await tx.user.findUnique({
          where: { email: dto.email },
        });

        if (existingUser) {
          throw new Error('Αυτό το email χρησιμοποιείται ήδη.');
        }

        // 1. Create User (Owner)
        const hashedPassword = await bcrypt.hash(dto.password!, 10);
        const user = await tx.user.create({
          data: {
            email: dto.email!,
            passwordHash: hashedPassword,
            firstName: dto.firstName!,
            lastName: dto.lastName!,
            role: 'OWNER',
          },
        });
        userId = user.id;
      } else {
        // Verify existing owner
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Owner not found');
      }

      // 3. Create Institute
      const institute = await tx.institute.create({
        data: {
          ownerId: userId,
          name: dto.instituteName,
          description: dto.description,
          website: dto.website,
          status: 'PENDING',
        },
      });

      // 4. Create Institute Membership (Owner)
      await tx.instituteMember.create({
        data: {
          instituteId: institute.id,
          userId: userId,
          role: 'OWNER',
        },
      });

      // 5. Create Branch
      await tx.branch.create({
        data: {
          instituteId: institute.id,
          name: 'Κεντρικό',
          address: dto.address,
          phone: dto.phone,
          cityId: dto.cityId,
          latitude: dto.latitude ?? null,
          longitude: dto.longitude ?? null,
          isMain: true,
          status: 'PENDING',
        },
      });

      // 6. Create Institute Services
      if (dto.serviceIds && dto.serviceIds.length > 0) {
        await tx.instituteService.createMany({
          data: dto.serviceIds.map((serviceId) => ({
            instituteId: institute.id,
            serviceId,
          })),
        });
      }

      return {
        message: 'Registration successful. Your profile is under review.',
        instituteId: institute.id,
      };
    });
  }

  async login(email: string, passwordPlain: string) {
    // 1. Try to authenticate with Supabase first
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password: passwordPlain,
    });

    if (authError) {
      // 2. Fallback to local DB check for legacy/admin accounts if Supabase fails
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await (bcrypt as any).compare(passwordPlain, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      return user;
    }

    // 3. If Supabase succeeded, return the user from our DB
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User record missing in database');
    }

    return user;
  }

  async requestPasswordReset(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) throw error;
    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, passwordPlain: string) {
    // If token is provided, we use it to set the session
    if (token) {
      const { error: sessionError } = await this.supabase.auth.setSession({
        access_token: token,
        refresh_token: token, // Dummy for setSession if only access_token is used
      });
      if (sessionError) throw sessionError;
    }

    const { error } = await this.supabase.auth.updateUser({
      password: passwordPlain,
    });

    if (error) throw error;

    // Sync with local DB passwordHash if it exists (optional but good for fallback)
    const { data: { user } } = await this.supabase.auth.getUser();
    if (user?.email) {
      const hashedPassword = await bcrypt.hash(passwordPlain, 10);
      await this.prisma.user.update({
        where: { email: user.email },
        data: { passwordHash: hashedPassword }
      });
    }

    return { message: 'Password updated successfully' };
  }

  async findByOwner(ownerId: string) {
    return this.prisma.institute.findMany({
      where: { ownerId },
      include: {
        branches: { include: { city: true } },
        images: true,
      },
    });
  }

  async createContactRequest(instituteId: string | null, dto: any) {
    return this.prisma.contactRequest.create({
      data: {
        instituteId: instituteId ?? undefined,
        guestName: dto.guestName,
        guestEmail: dto.guestEmail,
        guestPhone: dto.guestPhone,
        message: dto.message,
        subject: dto.subject,
        serviceId: dto.serviceId,
        userId: dto.userId,
      }
    });
  }
}

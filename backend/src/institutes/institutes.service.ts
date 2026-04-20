import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchInstitutesDto } from './dto/search-institutes.dto';
import { Prisma } from '@prisma/client';
import { OnboardInstituteDto } from './dto/onboard-institute.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class InstitutesService {
  constructor(private prisma: PrismaService) {}

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
        images: { orderBy: { createdAt: 'desc' }, take: 1 },
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
    let { lat, lng, radius = 5, serviceId, cityId, query, sort, location, minRating } = dto;

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
        GROUP BY i.id
        HAVING MIN(6371 * acos(
          cos(radians(${lat})) * cos(radians(b.latitude)) * 
          cos(radians(b.longitude) - radians(${lng})) + 
          sin(radians(${lat})) * sin(radians(b.latitude))
        )) <= ${radius}
        ORDER BY "distanceKm" ASC
        LIMIT 50;
      `;

      const ids = nearby.map(n => n.id);
      if (ids.length === 0) return [];

      // Fetch full records for these IDs
      const results = await this.prisma.institute.findMany({
        where: { id: { in: ids } },
        include: {
          branches: { include: { city: true, area: true } },
          services: { include: { service: true } },
          images: { orderBy: { createdAt: 'desc' }, take: 1 },
          reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
        }
      });

      // Map statistics and merge distance from SQL query
      return results.map(inst => {
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
        .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)); // Re-sort to maintain SQL order
    }

    // Fallback simple Prisma lookup if no coordinates provided
    const institutes = await this.prisma.institute.findMany({
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
        images: { orderBy: { createdAt: 'desc' }, take: 1 },
        reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    // Flatten for consistent frontend consumption and add stats
    return institutes.map(inst => {
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
        images: inst.images,
        branches: inst.branches,
        services: inst.services,
        avgRating,
        reviewCount,
        cityName: inst.branches[0]?.city?.name,
        areaName: inst.branches[0]?.area?.name,
      };
    }).filter(inst => !minRating || inst.avgRating >= minRating);
  }

  async findOne(id: string) {
    return this.prisma.institute.findUnique({
      where: { id },
      include: {
        branches: { include: { schedules: true, city: true, area: true } },
        services: { include: { service: true } },
        images: true,
      }
    });
  }

  async getMetadata() {
    const [cities, services] = await Promise.all([
      this.prisma.city.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.service.findMany({ orderBy: { name: 'asc' } }),
    ]);
    return { cities, services };
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
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await (bcrypt as any).compare(passwordPlain, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
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

  async createContactRequest(instituteId: string, dto: any) {
    return this.prisma.contactRequest.create({
      data: {
        instituteId,
        guestName: dto.guestName,
        guestEmail: dto.guestEmail,
        guestPhone: dto.guestPhone,
        message: dto.message,
        serviceId: dto.serviceId,
        userId: dto.userId,
      }
    });
  }
}

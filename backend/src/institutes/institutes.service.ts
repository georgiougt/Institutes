import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchInstitutesDto } from './dto/search-institutes.dto';
import { Prisma } from '@prisma/client';
import { OnboardInstituteDto } from './dto/onboard-institute.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class InstitutesService {
  constructor(private prisma: PrismaService) {}

  async getRecent() {
    return this.prisma.institute.findMany({
      where: { status: 'APPROVED' },
      include: {
        images: { take: 1 },
        owner: { select: { firstName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  }

  async search(dto: SearchInstitutesDto) {
    const { lat, lng, radius = 5, serviceId, cityId, query, sort } = dto;

    if (lat && lng) {
      const radiusInMeters = radius * 1000;
      
      // Expanded geospatial query to include service name matching
      const results = await this.prisma.$queryRaw`
        SELECT DISTINCT
          i.id as "instituteId",
          i.name as "instituteName",
          i."logoUrl",
          b.id as "nearestBranchId",
          b.address,
          b.phone,
          c.name as "cityName",
          ST_Distance(
            b.location::geography, 
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
          ) / 1000 as "distanceKm"
        FROM "Institute" i
        INNER JOIN "Branch" b ON b."instituteId" = i.id
        LEFT JOIN "City" c ON c.id = b."cityId"
        LEFT JOIN "InstituteService" "is" ON "is"."instituteId" = i.id
        LEFT JOIN "Service" s ON s.id = "is"."serviceId"
        WHERE i.status = 'APPROVED'
        AND ST_DWithin(
          b.location::geography, 
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, 
          ${radiusInMeters}
        )
        ${query ? Prisma.sql`AND (i.name ILIKE ${'%' + query + '%'} OR s.name ILIKE ${'%' + query + '%'})` : Prisma.empty}
        ${cityId ? Prisma.sql`AND b."cityId" = ${cityId}` : Prisma.empty}
        ORDER BY "distanceKm" ASC
        LIMIT 50;
      `;
      
      return results;
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
          where: cityId ? { cityId } : { isMain: true },
          include: { city: true, area: true },
          take: 1
        },
        services: {
          include: { service: true }
        },
        images: { take: 1 }
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    // Flatten for consistent frontend consumption
    return institutes.map(inst => ({
      ...inst,
      cityName: inst.branches[0]?.city?.name,
      areaName: inst.branches[0]?.area?.name,
    }));
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
          latitude: 35.1264, // Default Nicosia lat/lng for now
          longitude: 33.3677,
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
}

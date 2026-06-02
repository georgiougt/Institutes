"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const supabase_js_1 = require("@supabase/supabase-js");
let InstitutesService = class InstitutesService {
    prisma;
    supabase;
    constructor(prisma) {
        this.prisma = prisma;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async getRecent(lat, lng, country) {
        await this.checkAndExpireStatus();
        let ids = [];
        const countryCode = 'CY';
        if (lat && lng) {
            const nearby = await this.prisma.$queryRaw `
        SELECT 
          i.id,
          6371 * acos(
            cos(radians(${lat})) * cos(radians(b.latitude)) * 
            cos(radians(b.longitude) - radians(${lng})) + 
            sin(radians(${lat})) * sin(radians(b.latitude))
          ) as distance
        FROM "Institute" i
        INNER JOIN "Branch" b ON b."instituteId" = i.id
        INNER JOIN "City" c ON c.id = b."cityId"
        WHERE i.status = 'APPROVED'
        AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
        ${countryCode ? client_1.Prisma.sql `AND c."countryCode" = ${countryCode}` : client_1.Prisma.empty}
        ORDER BY distance ASC
        LIMIT 3;
      `;
            ids = nearby.map(n => n.id);
        }
        const institutes = await this.prisma.institute.findMany({
            where: ids.length > 0
                ? { id: { in: ids } }
                : {
                    status: 'APPROVED',
                    branches: countryCode ? {
                        some: {
                            city: { countryCode }
                        }
                    } : undefined
                },
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
        const sortedInstitutes = ids.length > 0
            ? ids.map(id => institutes.find(i => i.id === id)).filter(Boolean)
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
    async search(dto) {
        await this.checkAndExpireStatus();
        let { lat, lng, radius = 5, serviceId, cityId, query, sort, location, minRating, page = 1, limit = 20, country } = dto;
        country = 'CY';
        const skip = (page - 1) * limit;
        if (!cityId && location) {
            const city = await this.prisma.city.findFirst({
                where: { name: { equals: location, mode: 'insensitive' } }
            });
            if (city)
                cityId = city.id;
        }
        if (lat && lng) {
            const radiusInMeters = radius * 1000;
            const nearby = await this.prisma.$queryRaw `
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
        INNER JOIN "City" c ON c.id = b."cityId"
        LEFT JOIN "InstituteService" "is" ON "is"."instituteId" = i.id
        LEFT JOIN "Service" s ON s.id = "is"."serviceId"
        WHERE i.status = 'APPROVED'
        AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
        ${query ? client_1.Prisma.sql `AND (i.name ILIKE ${'%' + query + '%'} OR s.name ILIKE ${'%' + query + '%'})` : client_1.Prisma.empty}
        ${cityId ? client_1.Prisma.sql `AND b."cityId" = ${cityId}` : client_1.Prisma.empty}
        ${serviceId ? client_1.Prisma.sql `AND "is"."serviceId" = ${serviceId}` : client_1.Prisma.empty}
        ${country ? client_1.Prisma.sql `AND c."countryCode" = ${country.toUpperCase()}` : client_1.Prisma.empty}
        GROUP BY i.id, i."isFeatured", i."isVerified"
        HAVING MIN(6371 * acos(
          cos(radians(${lat})) * cos(radians(b.latitude)) * 
          cos(radians(b.longitude) - radians(${lng})) + 
          sin(radians(${lat})) * sin(radians(b.latitude))
        )) <= ${radius}
        ORDER BY i."isFeatured" DESC, "distanceKm" ASC
        LIMIT ${limit} OFFSET ${skip};
      `;
            const totalCountRes = await this.prisma.$queryRaw `
        SELECT COUNT(*)::int as count FROM (
          SELECT i.id
          FROM "Institute" i
          INNER JOIN "Branch" b ON b."instituteId" = i.id
          INNER JOIN "City" c ON c.id = b."cityId"
          LEFT JOIN "InstituteService" "is" ON "is"."instituteId" = i.id
          LEFT JOIN "Service" s ON s.id = "is"."serviceId"
          WHERE i.status = 'APPROVED'
          AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
          ${query ? client_1.Prisma.sql `AND (i.name ILIKE ${'%' + query + '%'} OR s.name ILIKE ${'%' + query + '%'})` : client_1.Prisma.empty}
          ${cityId ? client_1.Prisma.sql `AND b."cityId" = ${cityId}` : client_1.Prisma.empty}
          ${serviceId ? client_1.Prisma.sql `AND "is"."serviceId" = ${serviceId}` : client_1.Prisma.empty}
          ${country ? client_1.Prisma.sql `AND c."countryCode" = ${country.toUpperCase()}` : client_1.Prisma.empty}
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
            if (ids.length === 0)
                return { data: [], total: 0, page, limit };
            const results = await this.prisma.institute.findMany({
                where: { id: { in: ids } },
                include: {
                    branches: { include: { city: true, area: true } },
                    services: { include: { service: true } },
                    images: { orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], take: 1 },
                    reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
                }
            });
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
                if (a.isFeatured && !b.isFeatured)
                    return -1;
                if (!a.isFeatured && b.isFeatured)
                    return 1;
                return (a.distanceKm || 0) - (b.distanceKm || 0);
            });
            return {
                data: sortedResults,
                total,
                page,
                limit
            };
        }
        const [institutes, total] = await Promise.all([
            this.prisma.institute.findMany({
                where: {
                    status: 'APPROVED',
                    OR: query ? [
                        { name: { contains: query, mode: 'insensitive' } },
                        { services: { some: { service: { name: { contains: query, mode: 'insensitive' } } } } }
                    ] : undefined,
                    branches: cityId || country ? {
                        some: {
                            cityId: cityId || undefined,
                            city: country ? { countryCode: country.toUpperCase() } : undefined
                        }
                    } : undefined,
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
                    branches: cityId || country ? {
                        some: {
                            cityId: cityId || undefined,
                            city: country ? { countryCode: country.toUpperCase() } : undefined
                        }
                    } : undefined,
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
            if (a.isFeatured && !b.isFeatured)
                return -1;
            if (!a.isFeatured && b.isFeatured)
                return 1;
            return 0;
        });
        return {
            data,
            total,
            page,
            limit
        };
    }
    async findOne(id) {
        await this.checkAndExpireStatus();
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
    async delete(id) {
        return this.prisma.institute.delete({
            where: { id }
        });
    }
    async getMetadata(country) {
        const cityWhere = { countryCode: 'CY' };
        const [cities, services] = await Promise.all([
            this.prisma.city.findMany({ where: cityWhere, orderBy: { name: 'asc' } }),
            this.prisma.service.findMany({ orderBy: { name: 'asc' } }),
        ]);
        return { cities, services };
    }
    async getSitemapData() {
        return this.prisma.institute.findMany({
            where: {
                status: 'APPROVED',
                branches: {
                    some: {
                        city: { countryCode: 'CY' }
                    }
                }
            },
            select: { id: true, updatedAt: true }
        });
    }
    async onboard(dto) {
        return this.prisma.$transaction(async (tx) => {
            let userId = dto.ownerId;
            if (!userId) {
                const existingUser = await tx.user.findUnique({
                    where: { email: dto.email },
                });
                if (existingUser) {
                    throw new Error('Αυτό το email χρησιμοποιείται ήδη.');
                }
                const hashedPassword = await bcrypt.hash(dto.password, 10);
                const user = await tx.user.create({
                    data: {
                        email: dto.email,
                        passwordHash: hashedPassword,
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        role: 'OWNER',
                    },
                });
                userId = user.id;
            }
            else {
                const user = await tx.user.findUnique({ where: { id: userId } });
                if (!user)
                    throw new Error('Owner not found');
            }
            const institute = await tx.institute.create({
                data: {
                    ownerId: userId,
                    name: dto.instituteName,
                    description: dto.description,
                    website: dto.website,
                    status: 'PENDING',
                },
            });
            await tx.instituteMember.create({
                data: {
                    instituteId: institute.id,
                    userId: userId,
                    role: 'OWNER',
                },
            });
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
    async login(email, passwordPlain) {
        const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
            email,
            password: passwordPlain,
        });
        if (authError) {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!user || !user.passwordHash) {
                throw new Error('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            return user;
        }
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('User record missing in database');
        }
        return user;
    }
    async requestPasswordReset(email) {
        const localUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (localUser) {
            try {
                const { data: authUser, error: getUserError } = await this.supabase.auth.admin.getUserById(localUser.id);
                if (getUserError || !authUser?.user) {
                    console.log(`Auto-migrating user ${email} to Supabase Auth on password reset request`);
                    const randomPassword = Math.random().toString(36).slice(-10) + 'S' + Math.random().toString(36).slice(-3) + '!';
                    const { error: createError } = await this.supabase.auth.admin.createUser({
                        id: localUser.id,
                        email: email,
                        password: randomPassword,
                        email_confirm: true,
                    });
                    if (createError) {
                        console.error(`Failed to auto-migrate user ${email} to Supabase Auth:`, createError.message);
                    }
                    else {
                        console.log(`Successfully auto-migrated user ${email} to Supabase Auth`);
                    }
                }
            }
            catch (err) {
                console.error('Error during auto-migration check:', err.message || err);
            }
        }
        const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
        });
        if (error)
            throw error;
        return { message: 'Password reset email sent' };
    }
    async resetPassword(token, passwordPlain) {
        if (token) {
            const { error: sessionError } = await this.supabase.auth.setSession({
                access_token: token,
                refresh_token: token,
            });
            if (sessionError)
                throw sessionError;
        }
        const { error } = await this.supabase.auth.updateUser({
            password: passwordPlain,
        });
        if (error)
            throw error;
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
    async findByOwner(ownerId) {
        await this.checkAndExpireStatus();
        return this.prisma.institute.findMany({
            where: { ownerId },
            include: {
                branches: { include: { city: true } },
                images: true,
            },
        });
    }
    async createContactRequest(instituteId, dto) {
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
    async checkAndExpireStatus() {
        const now = new Date();
        try {
            await this.prisma.institute.updateMany({
                where: {
                    isVerified: true,
                    verifiedUntil: {
                        lt: now
                    }
                },
                data: {
                    isVerified: false
                }
            });
            await this.prisma.featuredListing.updateMany({
                where: {
                    isActive: true,
                    endsAt: {
                        lt: now
                    }
                },
                data: {
                    isActive: false
                }
            });
            const featuredInstitutes = await this.prisma.institute.findMany({
                where: { isFeatured: true },
                select: { id: true }
            });
            for (const inst of featuredInstitutes) {
                const activeListingCount = await this.prisma.featuredListing.count({
                    where: {
                        instituteId: inst.id,
                        isActive: true,
                        OR: [
                            { endsAt: null },
                            { endsAt: { gt: now } }
                        ]
                    }
                });
                if (activeListingCount === 0) {
                    await this.prisma.institute.update({
                        where: { id: inst.id },
                        data: { isFeatured: false }
                    });
                }
            }
        }
        catch (error) {
            console.error('Failed to check and expire premium status:', error);
        }
    }
};
exports.InstitutesService = InstitutesService;
exports.InstitutesService = InstitutesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstitutesService);
//# sourceMappingURL=institutes.service.js.map
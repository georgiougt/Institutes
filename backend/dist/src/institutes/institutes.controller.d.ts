import { InstitutesService } from './institutes.service';
import { SearchInstitutesDto } from './dto/search-institutes.dto';
import { OnboardInstituteDto } from './dto/onboard-institute.dto';
import { LoginDto } from './dto/login.dto';
import { CreateContactRequestDto } from './dto/contact-request.dto';
export declare class InstitutesController {
    private readonly institutesService;
    constructor(institutesService: InstitutesService);
    search(searchDto: SearchInstitutesDto): Promise<{
        data: {
            id: string;
            slug: string | null;
            name: string;
            description: string | null;
            logoUrl: string | null;
            website: string | null;
            isVerified: boolean;
            isFeatured: boolean;
            images: {
                id: string;
                createdAt: Date;
                order: number;
                instituteId: string;
                url: string;
                caption: string | null;
                isApproved: boolean;
            }[];
            branches: ({
                city: {
                    id: string;
                    name: string;
                    slug: string | null;
                    createdAt: Date;
                    nameEn: string | null;
                    displayOrder: number;
                    countryCode: string;
                };
                area: {
                    id: string;
                    name: string;
                    slug: string | null;
                    nameEn: string | null;
                    cityId: string;
                } | null;
            } & {
                id: string;
                name: string;
                status: import("@prisma/client").$Enums.ListingStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                email: string | null;
                phone: string;
                instituteId: string;
                address: string;
                cityId: string;
                areaId: string | null;
                latitude: number | null;
                longitude: number | null;
                isMain: boolean;
            })[];
            services: ({
                service: {
                    id: string;
                    name: string;
                    slug: string | null;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    displayOrder: number;
                    category: string | null;
                    iconUrl: string | null;
                    isActive: boolean;
                };
            } & {
                id: string;
                instituteId: string;
                serviceId: string;
                priceInfo: string | null;
                isOnline: boolean;
                isInPerson: boolean;
            })[];
            avgRating: number;
            reviewCount: number;
            distanceKm: any;
            cityName: string;
            areaName: string | undefined;
        }[];
        total: any;
        page: number;
        limit: number;
    } | {
        data: {
            id: string;
            slug: string | null;
            name: string;
            description: string | null;
            logoUrl: string | null;
            website: string | null;
            isVerified: boolean;
            isFeatured: boolean;
            images: {
                id: string;
                createdAt: Date;
                order: number;
                instituteId: string;
                url: string;
                caption: string | null;
                isApproved: boolean;
            }[];
            branches: ({
                city: {
                    id: string;
                    name: string;
                    slug: string | null;
                    createdAt: Date;
                    nameEn: string | null;
                    displayOrder: number;
                    countryCode: string;
                };
                area: {
                    id: string;
                    name: string;
                    slug: string | null;
                    nameEn: string | null;
                    cityId: string;
                } | null;
            } & {
                id: string;
                name: string;
                status: import("@prisma/client").$Enums.ListingStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                email: string | null;
                phone: string;
                instituteId: string;
                address: string;
                cityId: string;
                areaId: string | null;
                latitude: number | null;
                longitude: number | null;
                isMain: boolean;
            })[];
            services: ({
                service: {
                    id: string;
                    name: string;
                    slug: string | null;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    displayOrder: number;
                    category: string | null;
                    iconUrl: string | null;
                    isActive: boolean;
                };
            } & {
                id: string;
                instituteId: string;
                serviceId: string;
                priceInfo: string | null;
                isOnline: boolean;
                isInPerson: boolean;
            })[];
            avgRating: number;
            reviewCount: number;
            cityName: string;
            areaName: string | undefined;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getRecent(lat?: number, lng?: number, country?: string): Promise<{
        reviewCount: number;
        avgRating: number;
        branches: ({
            city: {
                id: string;
                name: string;
                slug: string | null;
                createdAt: Date;
                nameEn: string | null;
                displayOrder: number;
                countryCode: string;
            };
        } & {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string;
            instituteId: string;
            address: string;
            cityId: string;
            areaId: string | null;
            latitude: number | null;
            longitude: number | null;
            isMain: boolean;
        })[];
        images: {
            id: string;
            createdAt: Date;
            order: number;
            instituteId: string;
            url: string;
            caption: string | null;
            isApproved: boolean;
        }[];
        owner: {
            firstName: string | null;
        };
        id: string;
        ownerId: string;
        name: string;
        slug: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.ListingStatus;
        isFlagged: boolean;
        flagReason: string | null;
        logoUrl: string | null;
        website: string | null;
        mergedIntoId: string | null;
        viewCount: number;
        completenessScore: number;
        isClaimed: boolean;
        isVerified: boolean;
        isFeatured: boolean;
        verifiedAt: Date | null;
        verifiedUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    metadata(country?: string): Promise<{
        cities: {
            id: string;
            name: string;
            slug: string | null;
            createdAt: Date;
            nameEn: string | null;
            displayOrder: number;
            countryCode: string;
        }[];
        services: {
            id: string;
            name: string;
            slug: string | null;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            displayOrder: number;
            category: string | null;
            iconUrl: string | null;
            isActive: boolean;
        }[];
    }>;
    sitemap(): Promise<{
        id: string;
        slug: string | null;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        branches: ({
            city: {
                id: string;
                name: string;
                slug: string | null;
                createdAt: Date;
                nameEn: string | null;
                displayOrder: number;
                countryCode: string;
            };
            area: {
                id: string;
                name: string;
                slug: string | null;
                nameEn: string | null;
                cityId: string;
            } | null;
            schedules: {
                id: string;
                branchId: string;
                dayOfWeek: number;
                openTime: string;
                closeTime: string;
                isClosed: boolean;
            }[];
        } & {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string;
            instituteId: string;
            address: string;
            cityId: string;
            areaId: string | null;
            latitude: number | null;
            longitude: number | null;
            isMain: boolean;
        })[];
        featuredListings: {
            id: string;
            createdAt: Date;
            instituteId: string;
            isActive: boolean;
            endsAt: Date | null;
            placementType: string;
            placementKey: string | null;
            priority: number;
            startsAt: Date;
            createdBy: string;
        }[];
        images: {
            id: string;
            createdAt: Date;
            order: number;
            instituteId: string;
            url: string;
            caption: string | null;
            isApproved: boolean;
        }[];
        services: ({
            service: {
                id: string;
                name: string;
                slug: string | null;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                displayOrder: number;
                category: string | null;
                iconUrl: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            instituteId: string;
            serviceId: string;
            priceInfo: string | null;
            isOnline: boolean;
            isInPerson: boolean;
        })[];
    } & {
        id: string;
        ownerId: string;
        name: string;
        slug: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.ListingStatus;
        isFlagged: boolean;
        flagReason: string | null;
        logoUrl: string | null;
        website: string | null;
        mergedIntoId: string | null;
        viewCount: number;
        completenessScore: number;
        isClaimed: boolean;
        isVerified: boolean;
        isFeatured: boolean;
        verifiedAt: Date | null;
        verifiedUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    deleteInstitute(id: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        slug: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.ListingStatus;
        isFlagged: boolean;
        flagReason: string | null;
        logoUrl: string | null;
        website: string | null;
        mergedIntoId: string | null;
        viewCount: number;
        completenessScore: number;
        isClaimed: boolean;
        isVerified: boolean;
        isFeatured: boolean;
        verifiedAt: Date | null;
        verifiedUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    onboard(onboardDto: OnboardInstituteDto): Promise<{
        message: string;
        instituteId: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string | null;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        adminRole: import("@prisma/client").$Enums.AdminRole | null;
        isSuspended: boolean;
        suspendedAt: Date | null;
        suspendReason: string | null;
        lastLoginAt: Date | null;
        emailVerifiedAt: Date | null;
        onboardingStep: number | null;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: any): Promise<{
        message: string;
    }>;
    findByOwner(ownerId: string): Promise<({
        branches: ({
            city: {
                id: string;
                name: string;
                slug: string | null;
                createdAt: Date;
                nameEn: string | null;
                displayOrder: number;
                countryCode: string;
            };
        } & {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            email: string | null;
            phone: string;
            instituteId: string;
            address: string;
            cityId: string;
            areaId: string | null;
            latitude: number | null;
            longitude: number | null;
            isMain: boolean;
        })[];
        images: {
            id: string;
            createdAt: Date;
            order: number;
            instituteId: string;
            url: string;
            caption: string | null;
            isApproved: boolean;
        }[];
    } & {
        id: string;
        ownerId: string;
        name: string;
        slug: string | null;
        description: string | null;
        status: import("@prisma/client").$Enums.ListingStatus;
        isFlagged: boolean;
        flagReason: string | null;
        logoUrl: string | null;
        website: string | null;
        mergedIntoId: string | null;
        viewCount: number;
        completenessScore: number;
        isClaimed: boolean;
        isVerified: boolean;
        isFeatured: boolean;
        verifiedAt: Date | null;
        verifiedUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    sendGeneralContact(dto: CreateContactRequestDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ContactStatus;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string | null;
        userId: string | null;
        guestName: string | null;
        serviceId: string | null;
        message: string;
        guestEmail: string | null;
        guestPhone: string | null;
        subject: string | null;
        isSpam: boolean;
    }>;
    sendContact(id: string, dto: CreateContactRequestDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ContactStatus;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string | null;
        userId: string | null;
        guestName: string | null;
        serviceId: string | null;
        message: string;
        guestEmail: string | null;
        guestPhone: string | null;
        subject: string | null;
        isSpam: boolean;
    }>;
}

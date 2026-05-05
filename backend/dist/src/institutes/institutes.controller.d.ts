import { InstitutesService } from './institutes.service';
import { SearchInstitutesDto } from './dto/search-institutes.dto';
import { OnboardInstituteDto } from './dto/onboard-institute.dto';
import { LoginDto } from './dto/login.dto';
import { CreateContactRequestDto } from './dto/contact-request.dto';
export declare class InstitutesController {
    private readonly institutesService;
    constructor(institutesService: InstitutesService);
    search(searchDto: SearchInstitutesDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        logoUrl: string | null;
        website: string | null;
        isVerified: boolean;
        isFeatured: boolean;
        images: {
            id: string;
            createdAt: Date;
            instituteId: string;
            url: string;
            caption: string | null;
            order: number;
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
            instituteId: string;
            email: string | null;
            phone: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
            isMain: boolean;
            cityId: string;
            areaId: string | null;
        })[];
        services: ({
            service: {
                id: string;
                name: string;
                slug: string | null;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                displayOrder: number;
                category: string | null;
                iconUrl: string | null;
            };
        } & {
            id: string;
            instituteId: string;
            priceInfo: string | null;
            isOnline: boolean;
            isInPerson: boolean;
            serviceId: string;
        })[];
        avgRating: number;
        reviewCount: number;
        cityName: string;
        areaName: string | undefined;
    }[]>;
    getRecent(lat?: number, lng?: number): Promise<{
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
            };
        } & {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            instituteId: string;
            email: string | null;
            phone: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
            isMain: boolean;
            cityId: string;
            areaId: string | null;
        })[];
        images: {
            id: string;
            createdAt: Date;
            instituteId: string;
            url: string;
            caption: string | null;
            order: number;
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
    metadata(): Promise<{
        cities: {
            id: string;
            name: string;
            slug: string | null;
            createdAt: Date;
            nameEn: string | null;
            displayOrder: number;
        }[];
        services: {
            id: string;
            name: string;
            slug: string | null;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            displayOrder: number;
            category: string | null;
            iconUrl: string | null;
        }[];
    }>;
    sitemap(): Promise<{
        id: string;
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
            instituteId: string;
            email: string | null;
            phone: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
            isMain: boolean;
            cityId: string;
            areaId: string | null;
        })[];
        featuredListings: {
            id: string;
            createdAt: Date;
            instituteId: string;
            placementType: string;
            placementKey: string | null;
            priority: number;
            startsAt: Date;
            endsAt: Date | null;
            isActive: boolean;
            createdBy: string;
        }[];
        images: {
            id: string;
            createdAt: Date;
            instituteId: string;
            url: string;
            caption: string | null;
            order: number;
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
                isActive: boolean;
                displayOrder: number;
                category: string | null;
                iconUrl: string | null;
            };
        } & {
            id: string;
            instituteId: string;
            priceInfo: string | null;
            isOnline: boolean;
            isInPerson: boolean;
            serviceId: string;
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
    findByOwner(ownerId: string): Promise<({
        branches: ({
            city: {
                id: string;
                name: string;
                slug: string | null;
                createdAt: Date;
                nameEn: string | null;
                displayOrder: number;
            };
        } & {
            id: string;
            name: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            instituteId: string;
            email: string | null;
            phone: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
            isMain: boolean;
            cityId: string;
            areaId: string | null;
        })[];
        images: {
            id: string;
            createdAt: Date;
            instituteId: string;
            url: string;
            caption: string | null;
            order: number;
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

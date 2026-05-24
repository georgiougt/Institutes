import { PrismaService } from '../prisma/prisma.service';
import { UpdateInstituteProfileDto } from './dto/owner-dashboard.dto';
export declare class InstituteMgmtService {
    private prisma;
    private supabase;
    constructor(prisma: PrismaService);
    getDashboardMetrics(instituteId: string): Promise<{
        status: import("@prisma/client").$Enums.ListingStatus;
        completeness: number;
        completenessSteps: any[];
        unreadInquiries: number;
        recentInquiries: ({
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
            } | null;
        } & {
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
        })[];
        stats: {
            branches: number;
            services: number;
            images: number;
        };
    }>;
    private calculateCompleteness;
    updateProfile(instituteId: string, dto: UpdateInstituteProfileDto): Promise<{
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
    getInquiries(instituteId: string): Promise<({
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
        } | null;
        notes: {
            id: string;
            createdAt: Date;
            content: string;
            authorId: string;
            contactRequestId: string;
        }[];
    } & {
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
    })[]>;
    updateInquiryStatus(inquiryId: string, status: any): Promise<{
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
    updateServices(instituteId: string, serviceIds: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
    getSchedules(instituteId: string): Promise<({
        branch: {
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
        };
    } & {
        id: string;
        branchId: string;
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
        isClosed: boolean;
    })[]>;
    updateBranchSchedules(branchId: string, schedules: any[]): Promise<{
        success: boolean;
    }>;
    getImages(instituteId: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }[]>;
    addImage(instituteId: string, url: string, caption?: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }>;
    deleteImage(imageId: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }>;
    setCoverImage(instituteId: string, imageId: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }>;
    setLogo(instituteId: string, url: string): Promise<{
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
    getTeam(instituteId: string): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        role: import("@prisma/client").$Enums.InstRole;
        userId: string;
    })[]>;
    addMemberByEmail(instituteId: string, email: string, role: 'MANAGER' | 'STAFF'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        role: import("@prisma/client").$Enums.InstRole;
        userId: string;
    }>;
    removeMember(memberId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        role: import("@prisma/client").$Enums.InstRole;
        userId: string;
    }>;
    updateBranch(branchId: string, dto: any): Promise<{
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
    }>;
    updateOwnerEmail(userId: string, newEmail: string): Promise<{
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
    updateOwnerProfile(userId: string, dto: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }): Promise<{
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
    updateOwnerPassword(userId: string, newPasswordPlain: string): Promise<{
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
}

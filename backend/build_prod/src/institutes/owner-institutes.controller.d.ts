import { InstituteMgmtService } from './institute-mgmt.service';
import { StorageService } from '../common/storage/storage.service';
import { UpdateInstituteProfileDto, UpdateBranchDto } from './dto/owner-dashboard.dto';
export declare class OwnerInstitutesController {
    private readonly mgmtService;
    private readonly storageService;
    constructor(mgmtService: InstituteMgmtService, storageService: StorageService);
    getMetrics(id: string): Promise<{
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
    updateProfile(id: string, dto: UpdateInstituteProfileDto): Promise<{
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
    getInquiries(id: string): Promise<({
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
    updateInquiryStatus(inquiryId: string, status: string): Promise<{
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
    updateServices(id: string, serviceIds: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
    updateBranch(branchId: string, dto: UpdateBranchDto): Promise<{
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
    getSchedules(id: string): Promise<({
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
    getMedia(id: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }[]>;
    addMedia(id: string, url: string, caption?: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }>;
    uploadMedia(id: string, file: Express.Multer.File, caption?: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }>;
    deleteMedia(imageId: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }>;
    setCoverImage(id: string, imageId: string): Promise<{
        id: string;
        createdAt: Date;
        instituteId: string;
        url: string;
        caption: string | null;
        order: number;
        isApproved: boolean;
    }>;
    setLogo(id: string, url: string): Promise<{
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
    uploadLogo(id: string, file: Express.Multer.File): Promise<{
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
    getTeam(id: string): Promise<({
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
    addTeamMember(id: string, email: string, role: 'MANAGER' | 'STAFF'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        role: import("@prisma/client").$Enums.InstRole;
        userId: string;
    }>;
    removeTeamMember(memberId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        role: import("@prisma/client").$Enums.InstRole;
        userId: string;
    }>;
}

import { AdminService } from './admin.service';
import { AuditService } from './audit.service';
export declare class AdminController {
    private readonly adminService;
    private readonly auditService;
    constructor(adminService: AdminService, auditService: AuditService);
    getMetrics(): Promise<{
        pendingRequests: number;
        verifiedOwners: number;
        approvalRate: number;
    }>;
    getDashboardCounts(): Promise<{
        totalInstitutes: number;
        activeInstitutes: number;
        pendingInstitutes: number;
        rejectedInstitutes: number;
        totalOwners: number;
        totalUsers: number;
        totalContacts: number;
        unreadContacts: number;
        openClaims: number;
        featuredCount: number;
    }>;
    getInstitutes(page?: string, limit?: string, status?: string, cityId?: string, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: ({
            _count: {
                branches: number;
                contactRequests: number;
                services: number;
            };
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
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getInstituteDetail(id: string): Promise<{
        _count: {
            branches: number;
            contactRequests: number;
            images: number;
            services: number;
        };
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
        claims: {
            id: string;
            status: import("@prisma/client").$Enums.ClaimStatus;
            createdAt: Date;
            updatedAt: Date;
            instituteId: string;
            message: string | null;
            claimantId: string;
            proofUrl: string | null;
            claimerEmail: string;
            claimerPhone: string | null;
            reviewerId: string | null;
            reviewNotes: string | null;
            resolvedAt: Date | null;
        }[];
        contactRequests: {
            id: string;
            status: import("@prisma/client").$Enums.ContactStatus;
            createdAt: Date;
            updatedAt: Date;
            instituteId: string | null;
            userId: string | null;
            guestName: string | null;
            guestEmail: string | null;
            serviceId: string | null;
            message: string;
            guestPhone: string | null;
            subject: string | null;
            isSpam: boolean;
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
        owner: {
            id: string;
            createdAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
        };
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
        statusHistory: {
            id: string;
            createdAt: Date;
            instituteId: string;
            reason: string | null;
            fromStatus: import("@prisma/client").$Enums.ListingStatus;
            toStatus: import("@prisma/client").$Enums.ListingStatus;
            changedBy: string;
        }[];
        moderationNotes: {
            id: string;
            createdAt: Date;
            instituteId: string;
            content: string;
            authorId: string;
            isInternal: boolean;
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
    }>;
    updateInstitute(id: string, data: any, req: any): Promise<{
        branches: {
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
        }[];
        owner: {
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
        };
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
    approveInstitute(id: string, req: any): Promise<{
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
    rejectInstitute(id: string, body: {
        reason: string;
    }, req: any): Promise<{
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
    suspendInstitute(id: string, body: {
        reason: string;
    }, req: any): Promise<{
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
    archiveInstitute(id: string, req: any): Promise<{
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
    getPendingRequests(): Promise<({
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
        owner: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
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
    })[]>;
    getRejectedRequests(): Promise<({
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
        owner: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
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
    legacyApprove(id: string): Promise<{
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
    legacyReject(id: string): Promise<{
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
    getUsers(page?: string, limit?: string, role?: string, search?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    updateUserStatus(id: string, body: {
        isActive: boolean;
    }, req: any): Promise<{
        isActive: boolean;
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
    getContactRequests(page?: string, limit?: string, status?: string): Promise<{
        data: ({
            institute: {
                id: string;
                name: string;
            } | null;
            user: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            } | null;
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ContactStatus;
            createdAt: Date;
            updatedAt: Date;
            instituteId: string | null;
            userId: string | null;
            guestName: string | null;
            guestEmail: string | null;
            serviceId: string | null;
            message: string;
            guestPhone: string | null;
            subject: string | null;
            isSpam: boolean;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    updateContactRequestStatus(id: string, body: {
        status: string;
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ContactStatus;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string | null;
        userId: string | null;
        guestName: string | null;
        guestEmail: string | null;
        serviceId: string | null;
        message: string;
        guestPhone: string | null;
        subject: string | null;
        isSpam: boolean;
    }>;
    getServices(): Promise<({
        _count: {
            institutes: number;
        };
    } & {
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
    })[]>;
    createService(body: {
        name: string;
        category?: string;
        slug?: string;
    }): Promise<{
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
    }>;
    updateService(id: string, body: any, req: any): Promise<{
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
    }>;
    deleteService(id: string): Promise<{
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
    }>;
    getCities(): Promise<({
        _count: {
            branches: number;
            areas: number;
        };
    } & {
        id: string;
        name: string;
        slug: string | null;
        createdAt: Date;
        nameEn: string | null;
        displayOrder: number;
        countryCode: string;
    })[]>;
    getAreas(cityId?: string): Promise<({
        _count: {
            branches: number;
        };
        city: {
            name: string;
        };
    } & {
        id: string;
        name: string;
        slug: string | null;
        nameEn: string | null;
        cityId: string;
    })[]>;
    getAuditLogs(page?: string, limit?: string, actionType?: string, entityType?: string, actorId?: string): Promise<{
        data: ({
            actor: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
                adminRole: import("@prisma/client").$Enums.AdminRole | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            actorRole: string | null;
            actionType: string;
            entityType: string | null;
            entityId: string | null;
            oldValues: import("@prisma/client/runtime/library").JsonValue | null;
            newValues: import("@prisma/client/runtime/library").JsonValue | null;
            reason: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            actorId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    bulkApprove(ids: string[], req: any): Promise<({
        id: string;
        status: string;
        error?: undefined;
    } | {
        id: string;
        status: string;
        error: any;
    })[]>;
    bulkReject(body: {
        ids: string[];
        reason: string;
    }, req: any): Promise<({
        id: string;
        status: string;
        error?: undefined;
    } | {
        id: string;
        status: string;
        error: any;
    })[]>;
    bulkDelete(ids: string[], req: any): Promise<({
        id: string;
        status: string;
        error?: undefined;
    } | {
        id: string;
        status: string;
        error: any;
    })[]>;
    getRevisions(status?: string): Promise<({
        institute: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.RevStatus;
        createdAt: Date;
        instituteId: string;
        proposedData: import("@prisma/client/runtime/library").JsonValue;
        currentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        appliedAt: Date | null;
        appliedBy: string | null;
    })[]>;
    approveRevision(id: string, req: any): Promise<{
        success: boolean;
    }>;
    rejectRevision(id: string, body: {
        reason: string;
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.RevStatus;
        createdAt: Date;
        instituteId: string;
        proposedData: import("@prisma/client/runtime/library").JsonValue;
        currentData: import("@prisma/client/runtime/library").JsonValue | null;
        adminNote: string | null;
        appliedAt: Date | null;
        appliedBy: string | null;
    }>;
    getNotifications(): Promise<{
        items: any[];
        totalCount: number;
    }>;
    getAnalytics(): Promise<{
        dailyRegistrations: {
            date: string;
            count: number;
        }[];
        dailyTraffic: {
            date: string;
            count: number;
        }[];
        categoryDistribution: {
            name: string;
            value: number;
        }[];
        statusBreakdown: {
            name: import("@prisma/client").$Enums.ListingStatus;
            value: number;
        }[];
    }>;
}

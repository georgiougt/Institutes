import { InstituteMgmtService } from './institute-mgmt.service';
export declare class OwnerAccountController {
    private readonly mgmtService;
    constructor(mgmtService: InstituteMgmtService);
    updateEmail(userId: string, newEmail: string): Promise<{
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
    updateProfile(userId: string, dto: {
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
}

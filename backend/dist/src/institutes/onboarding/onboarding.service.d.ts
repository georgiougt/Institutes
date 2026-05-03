import { PrismaService } from '../../prisma/prisma.service';
import { OnboardingSignupDto, UpdateDraftDto, ClaimSubmitDto } from './onboarding.dto';
export declare class OnboardingService {
    private prisma;
    constructor(prisma: PrismaService);
    signup(dto: OnboardingSignupDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    updateDraft(dto: UpdateDraftDto): Promise<{
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
    submitForReview(instituteId: string): Promise<{
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
    submitClaim(dto: ClaimSubmitDto): Promise<{
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
    }>;
    searchToClaim(query: string): Promise<{
        id: string;
        name: string;
        logoUrl: string | null;
        website: string | null;
        branches: {
            city: {
                name: string;
            };
            address: string;
        }[];
    }[]>;
}

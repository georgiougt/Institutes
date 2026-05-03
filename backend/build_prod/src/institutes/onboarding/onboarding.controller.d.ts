import { OnboardingService } from './onboarding.service';
import { OnboardingSignupDto, UpdateDraftDto, ClaimSubmitDto, SearchClaimsDto } from './onboarding.dto';
export declare class OnboardingController {
    private readonly onboardingService;
    constructor(onboardingService: OnboardingService);
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
    submit(id: string): Promise<{
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
    searchClaim(dto: SearchClaimsDto): Promise<{
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
}

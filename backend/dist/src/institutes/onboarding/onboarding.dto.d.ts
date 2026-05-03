export declare class OnboardingSignupDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export declare class UpdateDraftDto {
    userId: string;
    instituteId?: string;
    step: number;
    name?: string;
    description?: string;
    website?: string;
    address?: string;
    cityId?: string;
    phone?: string;
    serviceIds?: string[];
    logoUrl?: string;
    coverUrl?: string;
}
export declare class ClaimSubmitDto {
    instituteId: string;
    claimantId: string;
    email: string;
    phone?: string;
    message?: string;
    proofUrl?: string;
}
export declare class SearchClaimsDto {
    query: string;
}

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface OnboardingData {
  userId?: string;
  instituteId?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  
  // Institute Info
  name?: string;
  description?: string;
  website?: string;
  
  // Location
  address?: string;
  cityId?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  
  // Services
  serviceIds: string[];
  
  // Visuals
  logoUrl?: string;
  coverUrl?: string;
  
  // Claim
  claimInstituteId?: string;
  claimMessage?: string;
  claimProofUrl?: string;
  
  path: 'CREATE' | 'CLAIM' | null;
}

export interface OnboardingContextType {
  data: OnboardingData;
  step: OnboardingStep;
  setStep: (step: OnboardingStep) => void;
  updateData: (newData: Partial<OnboardingData>) => void;
  isLoading: boolean;
  saveDraft: () => Promise<void>;
}

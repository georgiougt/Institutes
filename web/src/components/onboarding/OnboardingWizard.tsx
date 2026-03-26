'use client';

import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { OnboardingLayout } from './OnboardingLayout';
import { StepAccount } from './steps/StepAccount';
import { StepChoice } from './steps/StepChoice';
import { StepBasicInfo } from './steps/StepBasicInfo';
import { StepLocation } from './steps/StepLocation';
import { StepServices } from './steps/StepServices';
import { StepMedia } from './steps/StepMedia';
import { StepReview } from './steps/StepReview';
import { StepClaimSearch } from './steps/StepClaimSearch';
import { StepClaimForm } from './steps/StepClaimForm';

export function OnboardingWizard() {
  const { step, data } = useOnboarding();

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return <StepAccount />;
      case 2: return <StepChoice />;
      case 3: 
        return data.path === 'CLAIM' ? <StepClaimSearch /> : <StepBasicInfo />;
      case 4: 
        return data.path === 'CLAIM' ? <StepClaimForm /> : <StepLocation />;
      case 5: return <StepServices />;
      case 6: return <StepMedia />;
      case 7: return <StepReview />;
      default: return <StepAccount />;
    }
  };

  return (
    <OnboardingLayout>
      {renderCurrentStep()}
    </OnboardingLayout>
  );
}

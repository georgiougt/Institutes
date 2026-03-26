'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OnboardingData, OnboardingStep, OnboardingContextType } from './types';
import { toast } from 'sonner';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<OnboardingStep>(1); // Step 1 is account creation or login check
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    serviceIds: [],
    path: null,
  });

  // Load from local storage on mount (session recovery)
  useEffect(() => {
    const saved = localStorage.getItem('edutrack_onboarding');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(prev => ({ ...prev, ...parsed.data }));
        setStep(parsed.step || 1);
      } catch (e) {
        console.error('Failed to load onboarding state');
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('edutrack_onboarding', JSON.stringify({ data, step }));
  }, [data, step]);

  const updateData = useCallback((newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const saveDraft = async () => {
    if (!data.userId || !data.instituteId) return;
    
    setIsLoading(true);
    try {
      const resp = await fetch('/api/v1/onboard/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.userId,
            instituteId: data.instituteId,
            step,
            ...data
          })
      });
      if (!resp.ok) throw new Error('Failed to save draft');
    } catch (err) {
      console.error('Draft save failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingContext.Provider value={{ data, step, setStep, updateData, isLoading, saveDraft }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
  return context;
}

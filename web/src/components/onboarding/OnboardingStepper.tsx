'use client';

import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OnboardingStepper() {
  const { step } = useOnboarding();

  const steps = [
    { id: 1, name: 'Λογαριασμός' },
    { id: 2, name: 'Επιλογή' },
    { id: 3, name: 'Προφίλ' },
    { id: 4, name: 'Τοποθεσία' },
    { id: 5, name: 'Υπηρεσίες' },
    { id: 6, name: 'Πολυμέσα' },
    { id: 7, name: 'Υποβολή' },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((s, idx) => (
          <li key={s.id} className={cn(idx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
            {step > s.id ? (
              <div className="flex items-center" aria-current="step">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <span className="absolute left-0 -bottom-6 w-max text-[10px] font-medium text-slate-500 uppercase tracking-tighter hidden sm:block">
                  {s.name}
                </span>
              </div>
            ) : step === s.id ? (
              <div className="flex items-center" aria-current="step">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-black" />
                </span>
                <span className="absolute left-0 -bottom-6 w-max text-[10px] font-bold text-black uppercase tracking-tighter hidden sm:block">
                  {s.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                </span>
                 <span className="absolute left-0 -bottom-6 w-max text-[10px] font-medium text-slate-300 uppercase tracking-tighter hidden sm:block">
                  {s.name}
                </span>
              </div>
            )}
            
            {idx !== steps.length - 1 && (
              <div className={cn(
                "absolute top-4 left-8 -right-0 h-0.5 w-full sm:w-20",
                step > s.id ? "bg-black" : "bg-slate-100"
              )} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

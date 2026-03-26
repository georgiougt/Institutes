'use client';

import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { OnboardingStepper } from './OnboardingStepper';
import { LiveProfilePreview } from './LiveProfilePreview';
import { motion, AnimatePresence } from 'framer-motion';

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { step } = useOnboarding();

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col md:flex-row">
      {/* Left Pane: Form Flow */}
      <div className="flex-1 max-w-3xl mx-auto px-6 py-12 lg:px-12 w-full">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <span className="text-xl font-bold tracking-tight">EduTrack</span>
          </div>
          
          <OnboardingStepper />
        </div>

        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Right Pane: Live Preview (Desktop Only) */}
      <div className="hidden lg:block w-[450px] bg-slate-50 border-l border-slate-200 sticky top-0 h-screen overflow-y-auto">
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Προεπισκόπηση Προφίλ</h3>
            <p className="text-xs text-slate-400">Δείτε πώς θα εμφανίζεται το κέντρο σας στους γονείς σε πραγματικό χρόνο.</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
             <LiveProfilePreview />
          </div>
        </div>
      </div>
    </div>
  );
}

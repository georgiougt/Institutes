'use client';

import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { PlusCircle, Search, ArrowRight } from 'lucide-react';

export function StepChoice() {
  const { updateData, setStep, saveDraft } = useOnboarding();

  const handleSelect = async (path: 'CREATE' | 'CLAIM') => {
    updateData({ path });
    
    if (path === 'CREATE') {
      // Proactively create the draft institute record in DB
      await saveDraft(); 
      setStep(3);
    } else {
      setStep(3); // For CLAIM, step 3 will be the search step
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Πώς θέλετε να προχωρήσετε;</h1>
        <p className="text-lg text-slate-500">
          Υπάρχει πιθανότητα το κέντρο σας να βρίσκεται ήδη στον κατάλογό μας.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option: Create New */}
        <button
          onClick={() => handleSelect('CREATE')}
          className="group relative p-8 bg-white border-2 border-slate-100 hover:border-black rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-xl"
        >
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
            <PlusCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Προσθήκη Νέου</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Δημιουργήστε μια νέα καταχώρηση από το μηδέν. Ιδανικό για νέα κέντρα ή παραρτήματα.
          </p>
          <div className="flex items-center gap-2 text-black font-bold text-sm">
            Ξεκινήστε τώρα <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Option: Claim Existing */}
        <button
          onClick={() => handleSelect('CLAIM')}
          className="group relative p-8 bg-white border-2 border-slate-100 hover:border-blue-500 rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-xl"
        >
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Διεκδίκηση Υπάρχοντος</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Βρείτε το κέντρο σας ανάμεσα σε χιλιάδες καταχωρίσεις και αναλάβετε τη διαχείρισή του.
          </p>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
            Αναζήτηση <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          * Η διεκδίκηση απαιτεί έλεγχο ταυτοποίησης από την ομάδα μας για να διασφαλιστεί η εγκυρότητα της ιδιοκτησίας.
        </p>
      </div>
    </div>
  );
}

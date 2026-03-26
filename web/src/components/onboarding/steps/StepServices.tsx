'use client';

import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Check, BookOpen, Calculator, Languages, Microscope, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StepServices() {
  const { data, updateData, setStep, saveDraft } = useOnboarding();
  const [allServices, setAllServices] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/v1/institutes/metadata/lists')
      .then(res => res.json())
      .then(d => setAllServices(d.services || []));
  }, []);

  const toggleService = (id: string) => {
    const current = [...data.serviceIds];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    updateData({ serviceIds: current });
  };

  const handleNext = async () => {
    setLoading(true);
    await saveDraft();
    setLoading(false);
    setStep(6);
  };

  const categories = [
    { name: 'Γενική Εκπαίδευση', icon: <BookOpen size={18} /> },
    { name: 'Ξένες Γλώσσες', icon: <Languages size={18} /> },
    { name: 'Θετικές Επιστήμερες', icon: <Calculator size={18} /> },
    { name: 'Τεχνολογία', icon: <Code size={18} /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Τι μαθήματα προσφέρετε;</h1>
        <p className="text-lg text-slate-500">
          Επιλέξτε όλα τα αντικείμενα στα οποία εξειδικεύεται το κέντρο σας.
        </p>
      </div>

      <div className="space-y-8 max-w-3xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allServices.map(service => {
            const isSelected = data.serviceIds.includes(service.id);
            return (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={cn(
                  "relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group flex flex-col justify-between h-28",
                  isSelected 
                    ? "border-black bg-black text-white shadow-xl shadow-black/10 scale-[1.02]" 
                    : "border-slate-100 hover:border-slate-300 bg-white text-slate-600"
                )}
              >
                <div className="flex justify-between items-start">
                   <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isSelected ? "bg-white/20" : "bg-slate-50 group-hover:bg-slate-100"
                   )}>
                      <BookOpen size={16} />
                   </div>
                   {isSelected && <Check size={16} className="text-white animate-in zoom-in" />}
                </div>
                <span className="text-sm font-bold leading-tight truncate w-full">
                  {service.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4 items-start">
           <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500 flex-shrink-0">
             <Microscope size={20} />
           </div>
           <div>
             <h4 className="font-bold text-amber-800 text-sm mb-1">Δεν βρίσκετε αυτό που ψάχνετε;</h4>
             <p className="text-xs text-amber-600 leading-relaxed">
               Μπορείτε να προσθέσετε εξειδικευμένα μαθήματα αργότερα από το Dashboard σας μετά την έγκριση της καταχώρησης.
             </p>
           </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="outline" onClick={() => setStep(4)} className="h-12 px-8 rounded-xl font-bold">Πίσω</Button>
          <Button 
            onClick={handleNext} 
            disabled={data.serviceIds.length === 0 || loading}
            className="flex-1 h-12 rounded-xl font-bold bg-black shadow-lg shadow-black/10"
          >
            Συνέχεια
          </Button>
        </div>
      </div>
    </div>
  );
}

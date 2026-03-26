'use client';

import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function StepBasicInfo() {
  const { data, updateData, setStep, saveDraft } = useOnboarding();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    await saveDraft();
    setLoading(false);
    setStep(4);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Πείτε μας για το κέντρο σας</h1>
        <p className="text-lg text-slate-500">
          Αυτές οι πληροφορίες θα εμφανίζονται στην κορυφή της σελίδας σας.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Όνομα Εκπαιδευτηρίου</Label>
          <Input 
            id="name" 
            placeholder="π.χ. Φροντιστήριο Η Πρόοδος" 
            value={data.name || ''}
            onChange={(e) => updateData({ name: e.target.value })}
            className="h-12 border-slate-200 focus:border-black transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Σύντομη Περιγραφή</Label>
          <Textarea 
            id="description" 
            placeholder="Περιγράψτε το όραμα και τις υπηρεσίες σας..." 
            rows={4}
            value={data.description || ''}
            onChange={(e) => updateData({ description: e.target.value })}
            className="border-slate-200 focus:border-black transition-all resize-none"
          />
          <p className="text-[10px] text-slate-400">Προτείνεται: 100-300 χαρακτήρες για βέλτιστη εμφάνιση.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Ιστοσελίδα (Προαιρετικό)</Label>
          <Input 
            id="website" 
            placeholder="https://www.example.gr" 
            value={data.website || ''}
            onChange={(e) => updateData({ website: e.target.value })}
            className="h-12 border-slate-200 focus:border-black transition-all"
          />
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="outline" onClick={() => setStep(2)} className="h-12 px-8 rounded-xl font-bold">Πίσω</Button>
          <Button 
            onClick={handleNext} 
            disabled={!data.name || loading}
            className="flex-1 h-12 rounded-xl font-bold bg-black shadow-lg shadow-black/10"
          >
            Συνέχεια
          </Button>
        </div>
      </div>
    </div>
  );
}

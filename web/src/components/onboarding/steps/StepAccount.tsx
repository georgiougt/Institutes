'use client';

import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function StepAccount() {
  const { updateData, setStep } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resp = await fetch('/api/v1/onboard/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || 'Signup failed');
      }

      const user = await resp.json();
      updateData({ userId: user.id, email: user.email });
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || 'Παρουσιάστηκε σφάλμα κατά την εγγραφή.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Καλώς ορίσατε στο EduTrack</h1>
        <p className="text-lg text-slate-500">
          Η πιο σύγχρονη πλατφόρμα για την προβολή του εκπαιδευτικού σας κέντρου.
          Ξεκινήστε δημιουργώντας τον λογαριασμό σας.
        </p>
      </div>

      <form onSubmit={handleNext} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="π.χ. info@frontistirio.gr" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Κωδικός Πρόσβασης</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Τουλάχιστον 8 χαρακτήρες" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-bold bg-black hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
          disabled={loading}
        >
          {loading ? 'Δημιουργία...' : 'Συνέχεια'}
        </Button>

        <p className="text-sm text-slate-400 text-center">
          Έχετε ήδη λογαριασμό; <button type="button" className="text-black font-bold hover:underline">Σύνδεση</button>
        </p>
      </form>
    </div>
  );
}

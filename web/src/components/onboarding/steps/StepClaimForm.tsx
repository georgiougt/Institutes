'use client';

import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function StepClaimForm() {
  const { data, updateData, setStep } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resp = await fetch('/api/v1/onboard/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instituteId: data.claimInstituteId,
          claimantId: data.userId,
          email: data.email,
          phone: data.phone,
          message: data.claimMessage,
          proofUrl: data.claimProofUrl
        })
      });

      if (!resp.ok) throw new Error('Claim submission failed');
      setSubmitted(true);
      toast.success('Το αίτημα διεκδίκησης υποβλήθηκε!');
    } catch (err) {
      toast.error('Σφάλμα κατά την υποβολή. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 bg-blue-50/50 rounded-3xl border border-blue-100 p-8">
        <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-200">
           <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-black text-slate-900">Αίτημα Υπό Εξέταση</h2>
           <p className="max-w-md text-slate-500 leading-relaxed italic">
             Ευχαριστούμε για την υποβολή! Η ομάδα μας θα εξετάσει τα στοιχεία σας και θα επικοινωνήσει μαζί σας εντός 24-48 ωρών για την ολοκλήρωση της ταυτοποίησης.
           </p>
        </div>
        <Button onClick={() => window.location.href = '/owner'} className="bg-black font-bold h-12 px-10 rounded-xl">
          Μετάβαση στο Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
         <div className="p-2 bg-blue-600 text-white rounded-xl">
           <ShieldCheck size={24} />
         </div>
         <div>
            <h3 className="font-bold text-blue-900">Διαδικασία Ταυτοποίησης</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Για να σας παραχωρηθεί η διαχείριση του <span className="font-bold">"{data.name}"</span>, πρέπει να αποδείξετε τη σχέση σας με την επιχείρηση.
            </p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
           <Label className="text-base font-bold">Προαιρετικό Μήνυμα προς την ομάδα ελέγχου</Label>
           <Textarea 
             placeholder="π.χ. Είμαι ο ιδιοκτήτης και θέλω να ενημερώσω το ωράριο και τα μαθήματα..."
             value={data.claimMessage || ''}
             onChange={(e) => updateData({ claimMessage: e.target.value })}
             className="min-h-[120px] rounded-xl border-slate-200"
           />
        </div>

        <div className="space-y-4">
           <Label className="text-base font-bold">Αποδεικτικό Έγγραφο (Προαιρετικό)</Label>
           <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
              <Upload className="text-slate-300 group-hover:text-black transition-colors" size={24} />
              <div className="text-center">
                 <p className="text-xs font-bold text-slate-600">Ανεβάστε μια άδεια λειτουργίας ή εταιρικό έγγραφο</p>
                 <p className="text-[10px] text-slate-400 mt-1">PDF, JPG (Μέγιστο 5MB)</p>
              </div>
           </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-800">
           <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
           <p className="text-[10px] leading-relaxed">
             <span className="font-bold">Σημείωση:</span> Αν το email του λογαριασμού σας ταιριάζει με το domain της ιστοσελίδας του φροντιστηρίου, η έγκριση θα είναι ταχύτερη.
           </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setStep(3)} className="h-12 px-8 rounded-xl font-bold">Πίσω</Button>
          <Button 
            type="submit"
            disabled={loading}
            className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
          >
            {loading ? 'Υποβολή...' : 'Υποβολή Αιτήματος'}
          </Button>
        </div>
      </form>
    </div>
  );
}

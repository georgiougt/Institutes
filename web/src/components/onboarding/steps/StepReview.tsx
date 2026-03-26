'use client';

import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Rocket, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function StepReview() {
  const { data, setStep } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/v1/onboard/submit/${data.instituteId}`, {
        method: 'POST'
      });
      if (!resp.ok) throw new Error('Submission failed');
      
      setComplete(true);
      toast.success('Η καταχώρηση υποβλήθηκε με επιτυχία!');
    } catch (err) {
      toast.error('Παρουσιάστηκε σφάλμα κατά την υποβολή.');
    } finally {
      setLoading(false);
    }
  };

  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
           <Rocket size={48} />
        </div>
        <div className="space-y-3">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Συγχαρητήρια!</h2>
           <p className="max-w-md text-slate-500 text-lg">
             Το κέντρο <span className="text-black font-bold">"{data.name}"</span> είναι πλέον στην ουρά ελέγχου. 
           </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
           <div className="p-6 bg-white border border-slate-100 rounded-3xl text-left space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Επόμενο Βήμα: Έλεγχος</h4>
              <p className="text-xs text-slate-400">Η ομάδα μας θα ελέγξει τα στοιχεία σας εντός 24 ωρών.</p>
           </div>
           <div className="p-6 bg-white border border-slate-100 rounded-3xl text-left space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Dashboard</h4>
              <p className="text-xs text-slate-400">Μπορείτε ήδη να εξερευνήσετε το περιβάλλον διαχείρισης.</p>
           </div>
        </div>

        <Button 
          onClick={() => window.location.href = `/owner/${data.instituteId}`}
          className="h-14 px-12 rounded-2xl font-black text-lg bg-black shadow-xl shadow-black/20 group"
        >
          Μετάβαση στο Dashboard <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Έτοιμοι για την υποβολή;</h1>
        <p className="text-lg text-slate-500">
          Κάντε έναν τελευταίο έλεγχο στα στοιχεία σας πριν τα στείλετε για έγκριση.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
         <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Στοιχεία Προφίλ</h3>
            <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm">
               <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Όνομα</label>
                  <p className="font-bold text-slate-900">{data.name}</p>
               </div>
               <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Τοποθεσία</label>
                  <p className="text-sm text-slate-600">{data.address}, {data.cityId}</p>
               </div>
               <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Υπηρεσίες</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                     {data.serviceIds.map(sid => (
                        <span key={sid} className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-100">
                           {sid.slice(0, 8)}
                        </span>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Πολυμέσα</h3>
            <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                     {data.logoUrl && <img src={data.logoUrl} className="w-full h-full object-contain" />}
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-slate-900">Λογότυπο</p>
                     <p className="text-xs text-slate-400">{data.logoUrl ? 'Έχει προστεθεί' : 'Δεν βρέθηκε'}</p>
                  </div>
                  {data.logoUrl && <CheckCircle2 className="text-green-500" size={20} />}
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                     {data.coverUrl && <img src={data.coverUrl} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-slate-900">Εξώφυλλο</p>
                     <p className="text-xs text-slate-400">{data.coverUrl ? 'Έχει προστεθεί' : 'Δεν βρέθηκε'}</p>
                  </div>
                  {data.coverUrl && <CheckCircle2 className="text-green-500" size={20} />}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex gap-4 items-start max-w-2xl">
         <div className="p-2 bg-black text-white rounded-xl">
            <ShieldCheck size={20} />
         </div>
         <p className="text-xs text-slate-500 leading-relaxed italic">
           Με την υποβολή, δηλώνετε ότι τα στοιχεία είναι αληθή και κατέχετε τα δικαιώματα διαχείρισης του εν λόγω εκπαιδευτηρίου.
         </p>
      </div>

      <div className="flex gap-3 pt-4 max-w-2xl">
        <Button variant="outline" onClick={() => setStep(6)} className="h-12 px-8 rounded-xl font-bold">Πίσω</Button>
        <Button 
          onClick={handleFinalSubmit} 
          disabled={loading}
          className="flex-1 h-12 rounded-xl font-black text-lg bg-black hover:bg-slate-800 shadow-xl shadow-black/20"
        >
          {loading ? 'Υποβολή...' : 'Ολοκλήρωση & Υποβολή'}
        </Button>
      </div>
    </div>
  );
}

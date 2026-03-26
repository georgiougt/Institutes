'use client';

import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function StepClaimSearch() {
  const { updateData, setStep } = useOnboarding();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (query.length < 3) return;
    setLoading(true);
    try {
      const resp = await fetch(`/api/v1/onboard/search-claim?query=${encodeURIComponent(query)}`);
      if (!resp.ok) throw new Error('Search failed');
      const data = await resp.json();
      setResults(data);
      if (data.length === 0) toast.info('Δεν βρέθηκαν αποτελέσματα. Δοκιμάστε με διαφορετικό όνομα.');
    } catch (err) {
      toast.error('Παρουσιάστηκε σφάλμα κατά την αναζήτηση.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (inst: any) => {
    updateData({ 
      claimInstituteId: inst.id,
      name: inst.name,
      logoUrl: inst.logoUrl,
      website: inst.website,
      address: inst.branches[0]?.address
    });
    setStep(4); // Move to Claim Form (Verification)
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Βρείτε το κέντρο σας</h1>
        <p className="text-lg text-slate-500">
          Αναζητήστε με το όνομα του εκπαιδευτηρίου σας για να ξεκινήσετε τη διεκδίκηση.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 max-w-xl">
           <div className="relative flex-1">
             <Input 
               placeholder="π.χ. Προοδευτική Παιδεία" 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
               className="h-14 pl-12 rounded-2xl border-2 focus-visible:ring-black"
             />
             <Search className="absolute left-4 top-4.5 text-slate-400" size={20} />
           </div>
           <Button 
            onClick={handleSearch} 
            disabled={loading || query.length < 3}
            className="h-14 px-8 rounded-2xl font-bold bg-black"
           >
             {loading ? <Loader2 className="animate-spin" /> : 'Αναζήτηση'}
           </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 max-w-2xl">
           {results.map((inst) => (
             <button
               key={inst.id}
               onClick={() => handleSelect(inst)}
               className="group flex items-center gap-4 p-4 bg-white border border-slate-100 hover:border-blue-500 rounded-2xl transition-all hover:shadow-lg text-left"
             >
               <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0">
                  {inst.logoUrl ? <img src={inst.logoUrl} className="w-full h-full object-contain" /> : <MapPin size={24} className="text-slate-300" />}
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{inst.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} /> {inst.branches[0]?.address || 'Διεύθυνση μη διαθέσιμη'}
                  </p>
               </div>
               <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
             </button>
           ))}
        </div>

        {results.length === 0 && !loading && (
           <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                 <Search size={20} className="text-slate-300" />
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-600">Δεν βλέπετε το κέντρο σας;</p>
                 <p className="text-xs text-slate-400">Δοκιμάστε να γράψετε μόνο ένα μέρος του ονόματος.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-blue-600 font-bold hover:bg-white">
                Επιστροφή στην επιλογή
              </Button>
           </div>
        )}
      </div>
    </div>
  );
}

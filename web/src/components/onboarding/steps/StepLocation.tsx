'use client';

import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation } from 'lucide-react';

export function StepLocation() {
  const { data, updateData, setStep, saveDraft } = useOnboarding();
  const [cities, setCities] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/v1/institutes/metadata/lists')
      .then(res => res.json())
      .then(d => setCities(d.cities || []));
  }, []);

  const handleNext = async () => {
    setLoading(true);
    await saveDraft();
    setLoading(false);
    setStep(5);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Πού βρίσκεται το κέντρο σας;</h1>
        <p className="text-lg text-slate-500">
          Η τοποθεσία είναι το πιο σημαντικό κριτήριο αναζήτησης για τους γονείς.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Πόλη</Label>
            <Select 
              value={data.cityId || ''} 
              onValueChange={(val) => updateData({ cityId: val ?? undefined })}
            >
              <SelectTrigger className="h-12 border-slate-200">
                <SelectValue placeholder="Επιλέξτε πόλη" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Τηλέφωνο Επικοινωνίας</Label>
            <Input 
              id="phone" 
              placeholder="π.χ. 22 123456" 
              value={data.phone || ''}
              onChange={(e) => updateData({ phone: e.target.value })}
              className="h-12 border-slate-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Διεύθυνση & Αριθμός</Label>
          <div className="relative">
            <Input 
              id="address" 
              placeholder="π.χ. Λεωφόρος Αρχαγγέλου 12" 
              value={data.address || ''}
              onChange={(e) => updateData({ address: e.target.value })}
              className="h-12 pl-11 border-slate-200"
            />
            <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
          </div>
        </div>

        {/* Mock Map Placeholder */}
        <div className="w-full h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 overflow-hidden relative group">
           <Navigation size={32} className="group-hover:animate-pulse" />
           <span className="text-xs font-bold uppercase tracking-widest">Επιλογή στο Χάρτη</span>
           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="secondary" size="sm" className="font-bold">Άνοιγμα Χάρτη</Button>
           </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="outline" onClick={() => setStep(3)} className="h-12 px-8 rounded-xl font-bold">Πίσω</Button>
          <Button 
            onClick={handleNext} 
            disabled={!data.address || !data.cityId || loading}
            className="flex-1 h-12 rounded-xl font-bold bg-black shadow-lg shadow-black/10"
          >
            Συνέχεια
          </Button>
        </div>
      </div>
    </div>
  );
}

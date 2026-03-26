'use client';

import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StepMedia() {
  const { data, updateData, setStep, saveDraft } = useOnboarding();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    await saveDraft();
    setLoading(false);
    setStep(7);
  };

  const mockUpload = (type: 'logo' | 'cover') => {
    // In a real app, this would be an actual file upload to S3/Cloudinary
    const mockUrls = {
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=' + (data.name || 'Edu'),
      cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200'
    };
    
    if (type === 'logo') updateData({ logoUrl: mockUrls.logo });
    else updateData({ coverUrl: mockUrls.cover });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Δώστε πρόσωπο στο κέντρο σας</h1>
        <p className="text-lg text-slate-500">
          Οι καταχωρήσεις με λογότυπο και φωτογραφία εξωφύλλου έχουν 5x περισσότερες προβολές.
        </p>
      </div>

      <div className="space-y-10 max-w-2xl">
        {/* Logo Upload */}
        <div className="space-y-4">
           <Label className="text-base font-bold">Λογότυπο (1:1)</Label>
           <div className="flex items-center gap-6">
              <div className={cn(
                "w-32 h-32 rounded-3xl border-2 flex items-center justify-center relative overflow-hidden transition-all duration-300",
                data.logoUrl ? "border-black shadow-lg" : "border-dashed border-slate-200 bg-slate-50"
              )}>
                {data.logoUrl ? (
                   <>
                     <img src={data.logoUrl} className="w-full h-full object-contain p-2" alt="Logo" />
                     <button 
                        onClick={() => updateData({ logoUrl: undefined })}
                        className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white text-red-500 shadow-sm transition-colors"
                     >
                        <X size={14} />
                     </button>
                   </>
                ) : (
                   <ImageIcon className="text-slate-300" size={32} />
                )}
              </div>
              <div className="space-y-2">
                 <Button variant="outline" onClick={() => mockUpload('logo')} className="font-bold gap-2">
                   <Upload size={16} /> Ανέβασμα Αρχείου
                 </Button>
                 <p className="text-xs text-slate-400">Προτεινόμενο μέγεθος: 512x512px (PNG, JPG)</p>
              </div>
           </div>
        </div>

        {/* Cover Upload */}
        <div className="space-y-4">
           <Label className="text-base font-bold">Φωτογραφία Εξωφύλλου</Label>
           <div className={cn(
             "w-full h-44 rounded-3xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300",
             data.coverUrl ? "border-black shadow-lg" : "border-dashed border-slate-200 bg-slate-50"
           )}>
             {data.coverUrl ? (
                <>
                  <img src={data.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                  <button 
                     onClick={() => updateData({ coverUrl: undefined })}
                     className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white text-red-500 shadow-sm transition-colors"
                  >
                     <X size={18} />
                  </button>
                </>
             ) : (
                <div className="flex flex-col items-center gap-3">
                   <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-300">
                      <ImageIcon size={32} />
                   </div>
                   <Button variant="ghost" onClick={() => mockUpload('cover')} className="font-bold text-slate-500">
                     Κάντε κλικ για ανέβασμα
                   </Button>
                </div>
             )}
           </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 flex gap-4 items-center">
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-400 flex-shrink-0 animate-pulse">
              <Sparkles size={24} />
           </div>
           <div>
              <p className="text-sm font-medium leading-relaxed">
                <span className="font-bold text-white">Pro Tip:</span> Χρησιμοποιήστε μια φωτογραφία που δείχνει την κύρια είσοδο ή τις αίθουσες διδασκαλίας για να εμπνεύσετε εμπιστοσύνη.
              </p>
           </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setStep(5)} className="h-12 px-8 rounded-xl font-bold">Πίσω</Button>
          <Button 
            onClick={handleNext} 
            className="flex-1 h-12 rounded-xl font-bold bg-black shadow-lg shadow-black/10"
          >
            Συνέχεια
          </Button>
        </div>
      </div>
    </div>
  );
}

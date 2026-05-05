'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2, Globe, Send, Sparkles, User, Mail, Phone, Check, ArrowRight } from 'lucide-react';

interface InterestFormValues {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  message: string;
}

interface InterestFormDialogProps {
  instituteName?: string;
  trigger?: React.ReactElement;
  defaultValues?: Partial<InterestFormValues>;
}

export function InterestFormDialog({ instituteName, trigger, defaultValues }: InterestFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'landing' | 'website'>('website');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InterestFormValues>({
    defaultValues
  });

  const onSubmit = async (data: InterestFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/general/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subject: 'Website Interest',
          message: `Ενδιαφέρον για Δωρεάν Ιστοσελίδα${instituteName ? ` (Από: ${instituteName})` : ''}. \nΕπιλεγμένο Πακέτο: ${selectedPackage === 'landing' ? 'Landing Page' : '5-Page Website'}\n\nΣημειώσεις: ${data.message}`
        }),
      });

      if (res.ok) {
        toast.success('Το ενδιαφέρον σας καταγράφηκε!', {
          description: 'Ήρθατε ένα βήμα πιο κοντά στην νέα σας ιστοσελίδα. Θα επικοινωνήσουμε μαζί σας σύντομα.'
        });
        reset();
        setOpen(false);
      } else {
        throw new Error('Failed to send interest');
      }
    } catch (error) {
      console.error(error);
      toast.error('Σφάλμα κατά την αποστολή', {
        description: 'Παρακαλούμε προσπαθήστε ξανά αργότερα.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={trigger || (
          <Button className="bg-white text-indigo-600 hover:bg-white/90 font-black px-6 rounded-xl h-10 shadow-lg shadow-indigo-200">
            Ενδιαφέρομαι
          </Button>
        )}
      />
      <DialogContent className="max-w-[95vw] sm:max-w-[550px] p-0 overflow-y-auto max-h-[90vh] border-none shadow-2xl rounded-2xl">
        <DialogHeader className="p-5 sm:p-8 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 hidden sm:block">
            <Globe className="h-48 w-48" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300" />
              </div>
              <DialogTitle className="text-lg sm:text-2xl font-black italic tracking-tight leading-tight">
                Αποκτήστε το Επαγγελματικό Website σας με €0 Κόστος Κατασκευής
              </DialogTitle>
            </div>
            <DialogDescription className="text-indigo-100 font-medium text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              Γλιτώστε πάνω από €1000 σε έξοδα ανάπτυξης. Επιλέξτε το πακέτο που σας ταιριάζει.
            </DialogDescription>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Landing Page Package */}
              <button 
                type="button"
                onClick={() => setSelectedPackage('landing')}
                className={cn(
                  "relative flex flex-col text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group",
                  selectedPackage === 'landing' 
                    ? "bg-white text-indigo-900 border-yellow-400 shadow-xl scale-[1.01]" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                )}
              >
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <span className={cn("text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", selectedPackage === 'landing' ? "bg-indigo-100 text-indigo-700" : "bg-white/20 text-white")}>
                    Landing Page
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-black mb-1">€33<span className="text-[10px] sm:text-xs font-normal opacity-70">/μήνα</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-2 gap-y-1 mt-1">
                  {['One Page', 'Mobile Ready', 'Hosting', 'SSL'].map(f => (
                    <div key={f} className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold">
                      <div className={cn("h-3 w-3 rounded-full flex items-center justify-center shrink-0", selectedPackage === 'landing' ? "bg-green-100 text-green-600" : "bg-white/20 text-white")}>
                        <Check className="h-2 w-2" />
                      </div>
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </button>

              {/* 5-Page Website Package */}
              <button 
                type="button"
                onClick={() => setSelectedPackage('website')}
                className={cn(
                  "relative flex flex-col text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group",
                  selectedPackage === 'website' 
                    ? "bg-white text-indigo-900 border-yellow-400 shadow-xl scale-[1.01]" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                )}
              >
                <div className="absolute -top-2.5 right-4 bg-yellow-400 text-indigo-900 text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg z-20">
                  BEST VALUE
                </div>
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <span className={cn("text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", selectedPackage === 'website' ? "bg-indigo-100 text-indigo-700" : "bg-white/20 text-white")}>
                    5-Page Website
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-black mb-1">€50<span className="text-[10px] sm:text-xs font-normal opacity-70">/μήνα</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-2 gap-y-1 mt-1">
                  {['Full Site', 'Adv. SEO', 'Premium Host', 'Priority'].map(f => (
                    <div key={f} className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold">
                      <div className={cn("h-3 w-3 rounded-full flex items-center justify-center shrink-0", selectedPackage === 'website' ? "bg-green-100 text-green-600" : "bg-white/20 text-white")}>
                        <Check className="h-2 w-2" />
                      </div>
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            </div>
            
            <div className="mt-4 sm:mt-6 flex flex-col gap-0.5 text-[8px] sm:text-[10px] font-medium text-center leading-tight">
              <p className="text-yellow-300">Πλήρης μεταβίβαση κυριότητας μετά από 2 έτη</p>
              <p className="opacity-70 italic text-white">*Αποκλειστική προσφορά για τα μέλη μας</p>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 space-y-4 sm:space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName" className="font-bold text-slate-700 flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-slate-400" /> Ονοματεπώνυμο
              </Label>
              <Input 
                id="guestName" 
                {...register('guestName', { required: true })} 
                placeholder="Ιωάννης Παπαδόπουλος"
                className="rounded-xl border-slate-200 h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestEmail" className="font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                </Label>
                <Input 
                  id="guestEmail" 
                  type="email"
                  {...register('guestEmail', { required: true })} 
                  placeholder="info@example.com"
                  className="rounded-xl border-slate-200 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestPhone" className="font-bold text-slate-700 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Τηλέφωνο
                </Label>
                <Input 
                  id="guestPhone" 
                  {...register('guestPhone', { required: true })} 
                  placeholder="99123456"
                  className="rounded-xl border-slate-200 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="font-bold text-slate-700">Επιπλέον Σημειώσεις (Προαιρετικό)</Label>
              <Textarea 
                id="message" 
                {...register('message')} 
                placeholder="π.χ. Έχω ήδη logo, Θέλω συγκεκριμένα χρώματα κτλ..."
                className="rounded-xl min-h-[80px] border-slate-200 p-4"
              />
            </div>
          </div>

          <DialogFooter className="pt-0">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-12 sm:h-14 rounded-xl shadow-xl shadow-indigo-100 gap-2 text-base sm:text-lg transition-all group"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              {loading ? 'Αποστολή...' : 'Θέλω το δικό μου Website'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2, Send, MessageSquare, User, Mail, Phone, CalendarCheck } from 'lucide-react';

interface ContactFormValues {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceId?: string;
  message: string;
}

interface ContactFormDialogProps {
  instituteId: string;
  instituteName: string;
  services?: any[];
  trigger?: React.ReactElement;
}

export function ContactFormDialog({ instituteId, instituteName, services = [], trigger }: ContactFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/${instituteId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Το μήνυμα στάλθηκε!', {
          description: 'Το φροντιστήριο θα ενημερωθεί και θα επικοινωνήσει μαζί σας σύντομα.'
        });
        reset();
        setOpen(false);
      } else {
        throw new Error('Failed to send message');
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
          <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 gap-2">
            <MessageSquare className="h-4 w-4" />
            Στείλτε Μήνυμα
          </Button>
        )}
      />
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 bg-red-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <CalendarCheck className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-black">Κλείστε Ραντεβού</DialogTitle>
          </div>
          <DialogDescription className="text-red-100 font-medium text-base">
            Στείλτε ένα μήνυμα στο {instituteName} και θα σας απαντήσουν το συντομότερο.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              {errors.guestName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Required</p>}
            </div>
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
              {errors.guestEmail && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Invalid Email</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              {errors.guestPhone && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceId" className="font-bold text-slate-700">Ενδιαφέρον για</Label>
              <Select onValueChange={(val) => setValue('serviceId', val)}>
                <SelectTrigger className="rounded-xl border-slate-200 w-full h-11 bg-white">
                  <SelectValue placeholder="Επιλέξτε μάθημα" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((svc) => (
                    <SelectItem key={svc.id} value={svc.service?.id || svc.id}>
                      {svc.service?.name}
                    </SelectItem>
                  ))}
                  {services.length === 0 && (
                     <SelectItem value="general" disabled>Γενικό Ενδιαφέρον</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="font-bold text-slate-700">Το μήνυμά σας</Label>
            <Textarea 
              id="message" 
              {...register('message', { required: true })} 
              placeholder="Πώς μπορούμε να σας βοηθήσουμε;"
              className="rounded-xl min-h-[100px] border-slate-200 p-4"
            />
            {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Required</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-red-100 gap-2 text-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
              {loading ? 'Αποστολή...' : 'Αποστολή Μηνύματος'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Mail, Phone, User, MessageCircle, MapPin } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useParams } from 'next/navigation';

interface ContactFormValues {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  message: string;
}

export function ContactClient() {
  const params = useParams();
  const country = (params?.country as string) || 'cy';
  const isGreece = country.toLowerCase() === 'gr';

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/general/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Το μήνυμα στάλθηκε!', {
          description: 'Η ομάδα μας θα επικοινωνήσει μαζί σας σύντομα.'
        });
        reset();
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

  const contactDetails = [
    { icon: Phone, title: 'Τηλέφωνο', text: isGreece ? '+30 210 1234567' : '+357 99717717', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Mail, title: 'Email', text: isGreece ? 'info@tofrontistirio.gr' : 'info@tofrontistirio.com', color: 'bg-blue-50 text-blue-600' },
    { icon: MapPin, title: 'Έδρα', text: isGreece ? 'Αθήνα, Ελλάδα' : 'Λευκωσία, Κύπρος', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-slate-50 pt-32 pb-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Column: Info */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                    Επικοινωνήστε <br />
                    <span className="text-red-600">μαζί μας</span>
                  </h1>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Έχετε κάποια απορία ή χρειάζεστε βοήθεια; Η ομάδα του ToFrontistirio είναι εδώ για να σας υποστηρίξει.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactDetails.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{item.title}</p>
                        <p className="text-slate-800 font-bold">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-red-600 rounded-3xl text-white shadow-xl shadow-red-200">
                  <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" /> Είστε ιδιοκτήτης;
                  </h3>
                  <p className="text-red-100 font-medium mb-4">
                    Θέλετε να εγγράψετε το φροντιστήριό σας στην πλατφόρμα μας;
                  </p>
                  <Button variant="secondary" className="bg-white text-red-600 hover:bg-red-50 font-black h-12 px-6 rounded-xl border-none shadow-lg">
                    Ξεκινήστε τώρα
                  </Button>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="guestName" className="font-bold text-slate-700 ml-1 flex items-center gap-2">
                        <User className="h-4 w-4 text-red-500" /> Ονοματεπώνυμο
                      </Label>
                      <Input 
                        id="guestName" 
                        {...register('guestName', { required: true })} 
                        placeholder="π.χ. Μάριος Παπαδόπουλος"
                        className="rounded-2xl border-slate-200 h-14 bg-slate-50 focus:bg-white transition-all text-base px-6"
                      />
                      {errors.guestName && <p className="text-xs text-red-500 font-bold ml-1">Απαιτείται όνομα</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="guestEmail" className="font-bold text-slate-700 ml-1 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-red-500" /> Email
                        </Label>
                        <Input 
                          id="guestEmail" 
                          type="email"
                          {...register('guestEmail', { required: true })} 
                          placeholder="info@mail.com"
                          className="rounded-2xl border-slate-200 h-14 bg-slate-50 focus:bg-white transition-all px-6"
                        />
                        {errors.guestEmail && <p className="text-xs text-red-500 font-bold ml-1">Λανθασμένο email</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestPhone" className="font-bold text-slate-700 ml-1 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-red-500" /> Τηλέφωνο
                        </Label>
                        <Input 
                          id="guestPhone" 
                          {...register('guestPhone', { required: true })} 
                          placeholder={isGreece ? "+30 69XXXXXXXX" : "+357 99XXXXXX"}
                          className="rounded-2xl border-slate-200 h-14 bg-slate-50 focus:bg-white transition-all px-6"
                        />
                        {errors.guestPhone && <p className="text-xs text-red-500 font-bold ml-1">Απαιτείται τηλέφωνο</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-bold text-slate-700 ml-1">Περιγράψτε το θέμα σας</Label>
                      <Textarea 
                        id="message" 
                        {...register('message', { required: true })} 
                        placeholder="Πώς μπορούμε να σας βοηθήσουμε σήμερα;"
                        className="rounded-[2rem] min-h-[160px] border-slate-200 p-6 bg-slate-50 focus:bg-white transition-all text-base leading-relaxed"
                      />
                      {errors.message && <p className="text-xs text-red-500 font-bold ml-1">Απαιτείται μήνυμα</p>}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-20 rounded-[2rem] shadow-2xl shadow-red-100 gap-3 text-2xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                  >
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Send className="h-8 w-8" />}
                    {loading ? 'Αποστολή...' : 'Αποστολή Μηνύματος'}
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

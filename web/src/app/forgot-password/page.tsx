'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Παρουσιάστηκε σφάλμα. Βεβαιωθείτε ότι το email είναι σωστό.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4" translate="no">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Link className="flex items-center gap-1 group mb-2" href="/">
            <span className="text-red-600 font-extrabold text-4xl leading-none">*</span>
            <span className="font-extrabold text-4xl tracking-tighter text-slate-900">ToFrontistirio</span>
          </Link>
          <p className="text-slate-500 font-medium">Επαναφορά Κωδικού</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          {!isSuccess ? (
            <>
              <div className="mb-6 text-center">
                <p className="text-slate-600 text-sm">
                  Εισαγάγετε το email σας και θα σας στείλουμε έναν σύνδεσμο για να επαναφέρετε τον κωδικό σας.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-slate-200 focus:border-red-500 focus:ring-red-500/10 rounded-xl"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all flex gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Αποστολή...</span>
                    </>
                  ) : (
                    <>
                      <span>Αποστολή Συνδέσμου</span>
                      <Mail className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Το email στάλθηκε!</h3>
              <p className="text-slate-500 text-sm mb-8">
                Ελέγξτε τα εισερχόμενά σας (και τα ανεπιθύμητα) για τον σύνδεσμο επαναφοράς κωδικού.
              </p>
              <Link 
                href="/login" 
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold flex gap-2 justify-center items-center"
                )}
              >
                <ArrowLeft className="h-5 w-5" />
                Επιστροφή στη Σύνδεση
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link href="/login" className="text-slate-500 text-sm font-medium hover:text-red-600 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Πίσω στη Σύνδεση
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

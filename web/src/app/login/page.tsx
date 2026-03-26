'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Λανθασμένα στοιχεία σύνδεσης.');
      }

      const user = await res.json();
      
      // Store user info in localStorage for this demo (Real app would use cookies/JWT)
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push(`/owner?id=${user.id}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Link className="flex items-center gap-1 group mb-2" href="/">
            <span className="text-red-600 font-extrabold text-4xl leading-none">*</span>
            <span className="font-extrabold text-4xl tracking-tighter text-slate-900">EduTrack</span>
          </Link>
          <p className="text-slate-500 font-medium">Σύνδεση στην πλατφόρμα</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Κωδικός Πρόσβασης</label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Γίνεται σύνδεση...
                </>
              ) : (
                <>
                  Σύνδεση
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Δεν έχετε λογαριασμό; {' '}
              <Link href="/onboard" className="text-red-600 font-bold hover:underline underline-offset-4">
                Ξεκινήστε τώρα
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

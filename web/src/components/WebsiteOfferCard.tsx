'use client';

import { motion } from 'framer-motion';
import { Globe, Sparkles, ArrowRight } from 'lucide-react';
import { InterestFormDialog } from './InterestFormDialog';
import { cn } from '@/lib/utils';

interface WebsiteOfferCardProps {
  className?: string;
  instituteName?: string;
  defaultValues?: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
  };
}

export function WebsiteOfferCard({ className, instituteName, defaultValues }: WebsiteOfferCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-xl shadow-indigo-200",
        className
      )}
    >
      {/* Decorative Elements */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
          <Globe className="h-8 w-8 text-white" />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="bg-yellow-400 text-indigo-900 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">SPECIAL OFFER</span>
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
          </div>
          <h3 className="text-xl font-black tracking-tight leading-tight">
            Χρειάζεστε Επαγγελματική Ιστοσελίδα;
          </h3>
          <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-md">
            Αποκτήστε την δική σας ιστοσελίδα <span className="font-black underline underline-offset-4 decoration-yellow-400">ΕΝΤΕΛΩΣ ΔΩΡΕΑΝ</span> από τον επίσημο συνεργάτη μας. 
            Ενισχύστε την online παρουσία του φροντιστηρίου σας!
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <InterestFormDialog 
            instituteName={instituteName}
            defaultValues={defaultValues}
            trigger={
              <button className="group w-full md:w-auto bg-white hover:bg-indigo-50 text-indigo-700 font-black px-8 py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                Θέλω Περισσότερα
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            }
          />
        </div>
      </div>
    </motion.div>
  );
}

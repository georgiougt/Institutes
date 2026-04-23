'use client';

import { useState, use, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Check, ArrowRight, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PremiumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [institute, setInstitute] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/institutes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInstitute(data);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [id]);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Η ενεργοποίηση ολοκληρώθηκε!', {
        description: 'Η υπηρεσία σας είναι πλέον ενεργή. Οι αλλαγές θα εμφανιστούν άμεσα στα αποτελέσματα αναζήτησης.'
      });
      fetchStatus(); // Refresh status after success
    }
  }, [searchParams]);

  const getServiceStatus = (planId: string) => {
    if (!institute) return { isActive: false };

    if (planId === 'verified') {
      const isActive = institute.isVerified;
      const expiryDate = institute.verifiedUntil ? new Date(institute.verifiedUntil) : null;
      return { isActive, expiryDate };
    }

    if (planId === 'featured') {
      const isActive = institute.isFeatured;
      const latestListing = institute.featuredListings?.[0];
      const expiryDate = latestListing ? new Date(latestListing.endsAt) : null;
      
      // If we have a listing record, use its expiration. If not but isFeatured is true, it's indefinite/handled elsewhere
      return { isActive, expiryDate };
    }

    return { isActive: false };
  };

  const plans = [
    {
      id: 'verified',
      title: 'Verified Badge',
      description: 'Ενισχύστε την αξιοπιστία σας με το επίσημο σήμα επαλήθευσης.',
      monthlyPrice: '1.99',
      yearlyPrice: '20',
      icon: null,
      imageIcon: '/images/verified.gif',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      features: [
        'Μπλε Σήμα Επαλήθευσης (Verified Badge)',
        'Υψηλότερη κατάταξη στις προτιμήσεις γονέων',
        'Πιστοποιημένο Προφίλ',
        'Προτεραιότητα στην υποστήριξη'
      ]
    },
    {
      id: 'featured',
      title: 'Featured Placement',
      description: 'Εμφανιστείτε στην κορυφή των αποτελεσμάτων αναζήτησης.',
      monthlyPrice: '9.99',
      yearlyPrice: '99',
      icon: null,
      imageIcon: '/images/crown.gif',
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      featured: true,
      features: [
        'Πρώτη θέση στα αποτελέσματα αναζήτησης',
        'Ειδικό πλαίσιο ανάδειξης (Featured)',
        '3x περισσότερες προβολές προφίλ',
        'Εμφάνιση στην αρχική σελίδα (Προσεχώς)'
      ]
    }
  ];

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setIsLoading(planId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instituteId: id,
          planId,
          billingCycle,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Παρουσιάστηκε σφάλμα κατά την προετοιμασία της πληρωμής.', {
        description: 'Παρακαλώ δοκιμάστε ξανά σε λίγο.'
      });
      setIsLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2"
        >
          <Zap className="h-3 w-3" /> Growth Accelerator
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
        >
          Απογειώστε το <span className="text-indigo-600">Φροντιστήριό</span> σας
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg max-w-2xl mx-auto font-medium"
        >
          Επιλέξτε τα εργαλεία που χρειάζεστε για να ξεχωρίσετε από τον ανταγωνισμό και να προσελκύσετε περισσότερους μαθητές.
        </motion.p>

        {/* Billing Switcher */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 pt-4"
        >
          <span className={cn("text-sm font-bold transition-colors", billingCycle === 'monthly' ? "text-slate-900" : "text-slate-400")}>Μηνιαία</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-7 bg-slate-200 rounded-full relative p-1 transition-colors hover:bg-slate-300"
          >
            <div className={cn(
              "bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-200",
              billingCycle === 'yearly' ? "translate-x-7" : "translate-x-0"
            )} />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-bold transition-colors", billingCycle === 'yearly' ? "text-slate-900" : "text-slate-400")}>Ετήσια</span>
            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Save 15%</span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
          >
            <Card className={cn(
              "relative h-full overflow-hidden border-2 transition-all hover:shadow-2xl hover:scale-[1.01]",
              plan.featured ? "border-indigo-600 shadow-xl shadow-indigo-100" : "border-slate-100"
            )}>
              {plan.featured && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                  Popular Choice
                </div>
              )}
              
              <CardHeader className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border shadow-sm", plan.bgColor, plan.borderColor)}>
                    {plan.imageIcon ? (
                      <img src={plan.imageIcon} className="h-10 w-10 object-contain mix-blend-multiply" alt={plan.title} />
                    ) : (
                      plan.icon && (() => {
                        const Icon = plan.icon as any;
                        return <Icon className={cn("h-8 w-8", plan.iconColor)} />;
                      })()
                    )}
                  </div>
                  {getServiceStatus(plan.id).isActive && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                        Ενεργό
                      </span>
                      {getServiceStatus(plan.id).expiryDate && (
                        <span className="text-[10px] font-bold text-slate-400">
                          Λήγει: {getServiceStatus(plan.id).expiryDate?.toLocaleDateString('el-GR')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">{plan.title}</CardTitle>
                  <CardDescription className="text-slate-500 font-medium leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-0 space-y-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">€{billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}</span>
                  <span className="text-slate-400 font-bold">/{billingCycle === 'monthly' ? 'μήνα' : 'έτος'}</span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Τι περιλαμβάνεται:</p>
                  <ul className="space-y-3">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="p-8 pt-0">
                <Button 
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isLoading !== null || getServiceStatus(plan.id).isActive}
                  className={cn(
                    "w-full h-14 rounded-xl font-black text-lg gap-2 shadow-lg transition-all",
                    getServiceStatus(plan.id).isActive
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : plan.featured 
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100" 
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                  )}
                >
                  {isLoading === plan.id ? 'Περιμένετε...' : getServiceStatus(plan.id).isActive ? 'Πλάνο σε Ισχύ' : 'Ενεργοποίηση Τώρα'}
                  {!isLoading && !getServiceStatus(plan.id).isActive && <ArrowRight className="h-5 w-5" />}
                  {getServiceStatus(plan.id).isActive && <Check className="h-5 w-5" />}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-50 border border-slate-100 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6"
      >
        <div className="h-12 w-12 rounded-full bg-slate-900/5 flex items-center justify-center shrink-0">
          <Info className="h-6 w-6 text-slate-400" />
        </div>
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h4 className="font-bold text-slate-900 uppercase text-sm tracking-wide">Χρειάζεστε βοήθεια στην επιλογή;</h4>
          <p className="text-slate-500 text-sm font-medium">
            Η ομάδα μας είναι εδώ για να σας βοηθήσει να βρείτε το κατάλληλο πλάνο για τις ανάγκες σας. Επικοινωνήστε μαζί μας στο <span className="text-indigo-600 cursor-pointer hover:underline">support@tofrontistirio.cy</span>
          </p>
        </div>
        <Button variant="outline" className="rounded-xl font-bold border-slate-200">
          Σχετικές Ερωτήσεις (FAQ)
        </Button>
      </motion.div>
    </div>
  );
}

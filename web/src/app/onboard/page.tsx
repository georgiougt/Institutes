'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Building2, 
  MapPin, 
  BookOpen, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Metadata {
  cities: { id: string; name: string }[];
  services: { id: string; name: string }[];
}

export default function OnboardPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    instituteName: '',
    description: '',
    website: '',
    address: '',
    phone: '',
    cityId: '',
    serviceIds: [] as string[],
    ownerId: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetadata() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/metadata/lists`);
        const data = await res.json();
        setMetadata(data);
      } catch (e) {
        console.error('Failed to fetch metadata', e);
      } finally {
        setLoading(false);
      }
    }
    
    // Check for logged in user or query param
    const storedUser = localStorage.getItem('user');
    const urlParams = new URLSearchParams(window.location.search);
    const urlOwnerId = urlParams.get('ownerId');
    
    if (storedUser || urlOwnerId) {
      const user = storedUser ? JSON.parse(storedUser) : null;
      setFormData(prev => ({
        ...prev,
        ownerId: urlOwnerId || user?.id || '',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
      }));
      setStep(2); // Skip Step 1
    }

    fetchMetadata();
  }, []);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter(sid => sid !== id)
        : [...prev.serviceIds, id]
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || 'Κάτι πήγε στραβά. Παρακαλώ προσπαθήστε ξανά.');
      }
    } catch (e) {
      console.error('Submission error:', e);
      setError('Σφάλμα σύνδεσης με τον διακομιστή.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-none shadow-xl text-center p-8">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <ShieldCheck className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Η εγγραφή ολοκληρώθηκε!</CardTitle>
            <CardDescription className="text-base">
              Το προφίλ σας δημιουργήθηκε και βρίσκεται υπό έλεγχο από την ομάδα μας. 
              Θα λάβετε ενημέρωση μόλις εγκριθεί.
            </CardDescription>
            <Link href={formData.ownerId ? `/owner?id=${formData.ownerId}` : "/"} className="mt-8 block">
               <Button className="w-full h-12 text-lg">
                 {formData.ownerId ? 'Επιστροφή στο Dashboard' : 'Επιστροφή στην Αρχική'}
               </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
      {/* Progress Header */}
      <div className="max-w-2xl w-full mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                step >= i ? 'bg-primary text-white' : 'bg-white text-slate-400 border-2 border-slate-200'
              }`}
            >
              {step > i ? <Check className="h-5 w-5" /> : i}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          <span>Προφίλ</span>
          <span>Φροντιστήριο</span>
          <span>Τοποθεσία</span>
          <span>Μαθήματα</span>
        </div>
      </div>

      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="border-none shadow-premium overflow-hidden">
                <CardHeader className="bg-primary/5 text-center py-8">
                  <div className="bg-white p-3 rounded-2xl shadow-sm w-fit mx-auto mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Στοιχεία Ιδιοκτήτη</CardTitle>
                  <CardDescription>Δημιουργήστε τον λογαριασμό διαχείρισης</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Όνομα</label>
                      <Input 
                        placeholder="π.χ. Γιώργος"
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Επίθετο</label>
                      <Input 
                        placeholder="π.χ. Παπαδόπουλος"
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email</label>
                    <Input 
                      type="email"
                      placeholder="owner@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Κωδικός Πρόσβασης</label>
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleNext} className="w-full h-12 mt-4" disabled={!formData.email || !formData.password}>
                    Επόμενο <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="border-none shadow-premium overflow-hidden">
                <CardHeader className="bg-primary/5 text-center py-8">
                  <div className="bg-white p-3 rounded-2xl shadow-sm w-fit mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Στοιχεία Φροντιστηρίου</CardTitle>
                  <CardDescription>Πώς ονομάζεται το κέντρο σας;</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Όνομα Φροντιστηρίου</label>
                    <Input 
                      placeholder="π.χ. Φροντιστήριο Η Γνώση"
                      value={formData.instituteName}
                      onChange={e => setFormData({...formData, instituteName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Περιγραφή</label>
                    <textarea 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                      placeholder="Περιγράψτε την φιλοσοφία και τις επιτυχίες σας..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Ιστοσελίδα (Προαιρετικό)</label>
                    <Input 
                      placeholder="https://yourwebsite.cy"
                      value={formData.website}
                      onChange={e => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={handleBack} className="flex-1 h-12">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Πίσω
                    </Button>
                    <Button onClick={handleNext} className="flex-[2] h-12" disabled={!formData.instituteName}>
                      Επόμενο <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="border-none shadow-premium overflow-hidden">
                <CardHeader className="bg-primary/5 text-center py-8">
                  <div className="bg-white p-3 rounded-2xl shadow-sm w-fit mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Τοποθεσία & Επικοινωνία</CardTitle>
                  <CardDescription>Πού βρίσκεται το κεντρικό σας κατάστημα;</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Πόλη</label>
                    <Select value={formData.cityId} onValueChange={id => id && setFormData({...formData, cityId: id})}>
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder="Επιλέξτε πόλη">
                          <span className="flex items-center">
                            {metadata?.cities.find(city => city.id === formData.cityId)?.name || ''}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {metadata?.cities.map(city => (
                          <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Διεύθυνση</label>
                    <Input 
                      placeholder="π.χ. Λεωφόρος Αμαθούντος 123"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Τηλέφωνο Επικοινωνίας</label>
                    <Input 
                      placeholder="π.χ. 25123456"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={handleBack} className="flex-1 h-12">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Πίσω
                    </Button>
                    <Button onClick={handleNext} className="flex-[2] h-12" disabled={!formData.cityId || !formData.address || !formData.phone}>
                      Επόμενο <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="border-none shadow-premium overflow-hidden">
                <CardHeader className="bg-primary/5 text-center py-8">
                  <div className="bg-white p-3 rounded-2xl shadow-sm w-fit mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Επιλογή Μαθημάτων</CardTitle>
                  <CardDescription>Ποια μαθήματα διδάσκονται στο φροντιστήριο σας;</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto mb-6 p-1">
                    {metadata?.services.map(service => (
                      <div 
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.serviceIds.includes(service.id)
                            ? 'bg-primary/5 border-primary ring-1 ring-primary'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-md flex items-center justify-center border ${
                          formData.serviceIds.includes(service.id) ? 'bg-primary border-primary' : 'bg-white border-slate-300'
                        }`}>
                          {formData.serviceIds.includes(service.id) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-sm font-medium">{service.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl mb-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Επιλεγμένα:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.serviceIds.length === 0 && <span className="text-sm text-slate-400 italic">Κανένα μάθημα ακόμα</span>}
                      {formData.serviceIds.map(id => {
                        const s = metadata?.services.find(x => x.id === id);
                        return <Badge key={id} variant="secondary" className="bg-white border-slate-200 font-medium">{s?.name}</Badge>
                      })}
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                       <span className="font-bold">!</span> {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleBack} className="flex-1 h-12">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Πίσω
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      className="flex-[2] h-12 shadow-lg" 
                      disabled={formData.serviceIds.length === 0 || submitting}
                    >
                      {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                      {submitting ? 'Επεξεργασία...' : 'Ολοκλήρωση Εγγραφής'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-slate-500 text-sm max-w-lg text-center">
        Συνεχίζοντας, συμφωνείτε με τους Όρους Χρήσης και την Πολιτική Απορρήτου του EduTrack. 
        Όλες οι πληροφορίες θα επαληθευτούν από την ομάδα μας.
      </p>
    </div>
  );
}

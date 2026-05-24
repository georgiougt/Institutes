'use client';

import { useEffect, useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface AccountFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export default function AccountSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { register, handleSubmit, reset } = useForm<AccountFormValues>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (!localUser.id) return;

        // Fetch latest user data from our DB
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/owner/${localUser.id}`);
        // Wait, I don't have a direct "get user" endpoint yet for owners, 
        // but the local storage has the info, and we can fetch the owner's institutes to verify.
        // Actually, I'll just use the localStorage data and update it on save.
        
        setUser(localUser);
        reset({
          firstName: localUser.firstName || '',
          lastName: localUser.lastName || '',
          phone: localUser.phone || '',
          email: localUser.email || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [reset]);

  const onUpdateProfile = async (values: Partial<AccountFormValues>) => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/account/profile`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': user.id
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      
      const updatedUser = { ...user, ...values };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Προφίλ ενημερώθηκε!', {
        description: 'Τα στοιχεία σας αποθηκεύτηκαν με επιτυχία.'
      });
    } catch (err) {
      toast.error('Σφάλμα κατά την αποθήκευση');
    } finally {
      setSaving(false);
    }
  };

  const onUpdateEmail = async (values: AccountFormValues) => {
    if (values.email === user.email) return;
    
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/account/email`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': user.id
        },
        body: JSON.stringify({ newEmail: values.email }),
      });

      if (!res.ok) throw new Error('Failed to initiate email change');

      toast.success('Το email άλλαξε!', {
        description: 'Ελέγξτε το νέο σας email για τον σύνδεσμο επιβεβαίωσης.'
      });
    } catch (err) {
      toast.error('Σφάλμα κατά την αλλαγή email');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Φόρτωση ρυθμίσεων...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ρυθμίσεις Λογαριασμού</h2>
        <p className="text-slate-500">Διαχειριστείτε τα στοιχεία πρόσβασης και το προφίλ σας.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Personal Info */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <UserIcon className="h-5 w-5 text-red-600" />
              <CardTitle>Προσωπικά Στοιχεία</CardTitle>
            </div>
            <CardDescription>Το όνομα και το τηλέφωνό σας για επικοινωνία.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Όνομα</label>
                <Input {...register('firstName')} className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Επώνυμο</label>
                <Input {...register('lastName')} className="rounded-xl border-slate-200" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Τηλέφωνο Επικοινωνίας</label>
              <Input {...register('phone')} className="rounded-xl border-slate-200" placeholder="e.g. 99123456" />
            </div>
            <Button 
              onClick={handleSubmit(onUpdateProfile)} 
              disabled={saving}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl mt-4"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Αποθήκευση Στοιχείων
            </Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-5 w-5 text-red-600" />
              <CardTitle>Email Σύνδεσης</CardTitle>
            </div>
            <CardDescription>Αλλάξτε το email με το οποίο συνδέεστε στην πλατφόρμα.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Λογαριασμού</label>
              <Input {...register('email')} type="email" className="rounded-xl border-slate-200" />
              <p className="text-[10px] text-slate-400 italic">Σημείωση: Θα σας σταλεί email επιβεβαίωσης στη νέα διεύθυνση.</p>
            </div>
            <Button 
              onClick={handleSubmit(onUpdateEmail)} 
              disabled={saving}
              variant="outline"
              className="w-full rounded-xl border-slate-200 text-slate-900 font-bold hover:bg-slate-50"
            >
              Αλλαγή Email
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-none shadow-sm bg-white md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-5 w-5 text-red-600" />
              <CardTitle>Ασφάλεια</CardTitle>
            </div>
            <CardDescription>Διαχειριστείτε τον κωδικό πρόσβασής σας.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 bg-slate-50/50 rounded-b-2xl">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Κωδικός Πρόσβασης</p>
                <p className="text-sm text-slate-500 max-w-md">
                  Συνιστούμε να αλλάζετε τον κωδικό σας τακτικά για μεγαλύτερη ασφάλεια, ειδικά αν χρησιμοποιείτε τον προσωρινό κωδικό που σας δόθηκε.
                </p>
              </div>
            </div>
            <Button 
              variant="default"
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-bold px-8 h-12 shadow-sm"
              onClick={async () => {
                const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) toast.error('Σφάλμα κατά την αποστολή');
                else toast.success('Email εστάλη!', { description: 'Ελέγξτε τα εισερχόμενά σας.' });
              }}
            >
              Αλλαγή Κωδικού
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

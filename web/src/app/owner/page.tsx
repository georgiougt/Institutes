'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

function OwnerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ownerId = searchParams.get('id');
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser || !ownerId) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    const fetchInstitutes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/owner/${ownerId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setInstitutes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutes();
  }, [ownerId, router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-red-100 rounded-full mb-4 flex items-center justify-center text-red-600">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <p className="text-slate-400 font-medium">Φόρτωση Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 min-h-screen hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">EduTrack Owner</span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2 px-3">Μενού</div>
          <Link href={`/owner?id=${ownerId}`} className="w-full">
            <Button variant="secondary" className="w-full justify-start gap-3 bg-red-50 text-red-600 hover:bg-red-100 font-medium px-3 py-6 rounded-xl">
              <LayoutDashboard className="h-5 w-5" />
              Πίνακας Ελέγχου
            </Button>
          </Link>
          <Link href={`/owner?id=${ownerId}`} className="w-full">
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 font-medium px-3 py-6 rounded-xl">
              <Building2 className="h-5 w-5" />
              Τα Φροντιστήρια μου
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 font-medium px-3 py-6 rounded-xl" onClick={() => alert('Η συνολική διαχείριση εγγραφών θα είναι σύντομα διαθέσιμη.')}>
            <Users className="h-5 w-5" />
            Εγγραφές Μαθητών
          </Button>
        </nav>
        
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 font-medium px-3 py-6 rounded-xl">
            <Settings className="h-5 w-5" />
            Ρυθμίσεις
          </Button>
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 font-medium px-3 py-6 rounded-xl">
            <LogOut className="h-5 w-5" />
            Αποσύνδεση
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Καλώς ήρθες, {user?.firstName}!</h1>
            <p className="text-sm text-slate-500">Διαχείριση των φροντιστηρίων σας</p>
          </div>
          <Link href={`/onboard?ownerId=${ownerId}`}>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex gap-2">
              <Plus className="h-5 w-5" />
              Νέα Καταχώρηση
            </Button>
          </Link>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
               <CardContent className="p-6">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                     <Building2 className="h-6 w-6" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Σύνολο Φροντιστηρίων</p>
                     <h3 className="text-2xl font-bold text-slate-900">{institutes.length}</h3>
                   </div>
                 </div>
               </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white overflow-hidden">
               <CardContent className="p-6">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                     <Clock className="h-6 w-6" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Σε Αναμονή</p>
                     <h3 className="text-2xl font-bold text-slate-900">
                       {institutes.filter(i => i.status === 'PENDING').length}
                     </h3>
                   </div>
                 </div>
               </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-red-600 text-white overflow-hidden">
               <CardContent className="p-6">
                 <div className="flex items-center gap-4 text-white">
                   <div className="p-3 bg-white/20 rounded-xl">
                     <TrendingUp className="h-6 w-6" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-white/70 uppercase tracking-wider">Προβολές Προφίλ</p>
                     <h3 className="text-2xl font-bold">124</h3>
                   </div>
                 </div>
               </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Οι Καταχωρήσεις σας</h2>
            <div className="grid grid-cols-1 gap-4">
              {institutes.length === 0 ? (
                <Card className="border-dashed border-2 bg-slate-50 p-12 text-center">
                  <p className="text-slate-400 font-medium">Δεν έχετε προσθέσει ακόμα κάποιο φροντιστήριο.</p>
                </Card>
              ) : (
                institutes.map((inst) => (
                  <motion.div key={inst.id} whileHover={{ y: -2 }}>
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white">
                      <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="h-24 w-40 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          <img 
                            src={inst.images?.[0]?.url || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop"} 
                            className="w-full h-full object-cover"
                            alt={inst.name}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900">{inst.name}</h3>
                            <Badge className={
                              inst.status === 'APPROVED' 
                                ? "bg-green-100 text-green-700 border-none" 
                                : "bg-amber-100 text-amber-700 border-none"
                            }>
                              {inst.status === 'APPROVED' ? 'Ενεργό' : 'Σε αναμονή'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {inst.branches?.[0]?.city?.name || 'Unknown City'}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-4 w-4" />
                              {inst.branches?.[0]?.phone || 'No phone'}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Link href={`/owner/${inst.id}`}>
                            <Button variant="outline" className="flex-1 md:flex-none border-slate-200 rounded-xl">
                              Επεξεργασία
                            </Button>
                          </Link>
                          <Link href={`/institute/${inst.id}`}>
                            <Button variant="ghost" className="p-2 h-10 w-10 text-slate-400 hover:text-slate-900">
                              <ChevronRight className="h-6 w-6" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OwnerDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OwnerDashboardContent />
    </Suspense>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, Star } from 'lucide-react';
import { ClientSearchForm } from '@/components/client-search-form';
import { Footer } from '@/components/footer';

import { SubjectsSection } from '@/components/subjects-section';

async function getRecentInstitutes() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/recent`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch recent institutes:', error);
    return [];
  }
}

export default async function Home() {
  const recentInstitutes = await getRecentInstitutes();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <section className="relative w-full h-[550px] sm:h-[650px] flex flex-col items-center">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/5212336/pexels-photo-5212336.jpeg')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Header */}
        <header className="relative z-10 px-4 sm:px-8 py-6 flex items-center justify-between w-full">
          {/* Logo Yelp-Style */}
          <Link className="flex items-center gap-1 group shrink-0" href="/">
            <span className="text-red-600 font-extrabold text-3xl leading-none">*</span>
            <span className="font-extrabold text-3xl tracking-tighter text-white">EduTrack</span>
          </Link>
          
          {/* Navigation */}
             <div className="hidden lg:flex flex-1 mx-8 relative">
             </div>
          
          <nav className="flex gap-2 items-center shrink-0">
            <Link className="hidden lg:flex items-center text-sm font-bold text-white hover:underline underline-offset-4 px-3 h-10" href="/onboard">Για Φροντιστήρια</Link>
            <Link className="hidden lg:flex items-center text-sm font-bold text-white hover:underline underline-offset-4 px-3 h-10" href="/search">Γράψε Κριτική</Link>
            <Link href="/login" className="hidden sm:flex items-center">
              <Button variant="ghost" className="font-bold text-white hover:bg-white/20 hover:text-white px-4 h-10">
                Σύνδεση
              </Button>
            </Link>
            <Link href="/onboard" className="flex items-center ml-2">
              <Button className="font-bold rounded bg-red-600 hover:bg-red-700 text-white border-0 px-6 h-10 shadow-md">
                Εγγραφή
              </Button>
            </Link>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 w-full -mt-10">
          <h1 className="text-[2.5rem] font-bold tracking-tight sm:text-5xl md:text-[3.5rem] leading-tight text-white text-center mb-8 px-4">
             Βρες το ιδανικό φροντιστήριο
          </h1>

          {/* Search Bar Yelp Clone */}
          <ClientSearchForm />
        </div>
      </section>

      <SubjectsSection />

      {/* Recent Activity */}
      <main className="w-full bg-white pt-14 pb-24">
        <div className="container px-4 md:px-6 mx-auto max-w-[1000px]">
          <h2 className="text-[22px] font-bold text-center text-[#d32323] mb-8">Πρόσφατη Δραστηριότητα</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {recentInstitutes.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500 py-10">Δεν βρέθηκαν πρόσφατα φροντιστήρια.</div>
            ) : (
              recentInstitutes.map((inst: any) => (
                <div key={inst.id} className="border border-gray-200 rounded-sm overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col">
                  <div className="p-3 border-b border-gray-100 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-0.5">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(inst.owner?.name || 'User')}&background=random&color=fff&size=80`} alt="Avatar" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-gray-900 leading-tight">
                        {inst.owner?.name || 'Χρήστης'} <span className="text-gray-600 font-normal">πρόσθεσε μια καταχώρηση</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {new Date(inst.createdAt).toLocaleDateString('el-GR', { day: 'numeric', month: 'long' })}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <Link href={`/institute/${inst.id}`} className="font-bold text-base text-[#0073bb] hover:underline">
                      {inst.name}
                    </Link>
                    <div className="flex text-amber-500 gap-[1px] my-1.5 align-middle items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <div key={star} className={`flex ${star <= 4 ? 'bg-[#f15c00]' : 'bg-gray-300'} rounded-[3px] p-1 text-white`}>
                          <Star className="h-3 w-3 fill-white stroke-none"/>
                        </div>
                      ))}
                      <span className="text-[13px] text-gray-600 font-medium ml-1">Νέο</span>
                    </div>
                    <p className="text-[13px] text-gray-800 mt-2 line-clamp-3">
                      {inst.description || 'Καλώς ήρθατε στο νέο μας φροντιστήριο. Επικοινωνήστε μαζί μας για περισσότερες πληροφορίες.'}
                    </p>
                  </div>
                  <div className="h-44 w-full bg-gray-100 overflow-hidden relative">
                    <img 
                      src={inst.images?.[0]?.url || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop"} 
                      className="w-full h-full object-cover" 
                      alt={inst.name} 
                    />
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

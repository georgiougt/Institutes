import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { ChevronDown, Star } from 'lucide-react';
import { ClientSearchForm } from '@/components/client-search-form';
import { Footer } from '@/components/footer';
import { cn } from "@/lib/utils";

import { SubjectsSection } from '@/components/subjects-section';

import { RecentActivityFeed } from '@/components/recent-activity-feed';

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
      {/* ... (Existing sections: Hero, Subjects) ... */}
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
        <div className="container px-4 md:px-6 mx-auto max-w-[1100px]">
          <RecentActivityFeed initialData={recentInstitutes} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { ChevronDown, Star } from 'lucide-react';
import { ClientSearchForm } from '@/components/client-search-form';
import { Footer } from '@/components/footer';
import { cn } from "@/lib/utils";

import { SubjectsSection } from '@/components/subjects-section';
import { Navbar } from '@/components/navbar';
import { RecentActivityFeed } from '@/components/recent-activity-feed';

async function getRecentInstitutes() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/institutes/recent`;
    console.log(`[Next.js] Fetching recent institutes from: ${url}`);
    
    const res = await fetch(url, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!res.ok) {
      console.warn(`[Next.js] Fetch failed with status: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    console.log(`[Next.js] Successfully fetched ${data.length} institutes`);
    return data;
  } catch (error) {
    console.error('[Next.js] Failed to fetch recent institutes:', error);
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

        <Navbar transparent />

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

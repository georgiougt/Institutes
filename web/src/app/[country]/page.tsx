import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const isGreece = country.toLowerCase() === 'gr';

  return {
    title: isGreece 
      ? 'ToFrontistirio — Βρες το ιδανικό Φροντιστήριο στην Ελλάδα' 
      : 'ToFrontistirio — Βρες το ιδανικό Φροντιστήριο στην Κύπρο',
    description: isGreece
      ? 'Η μεγαλύτερη πλατφόρμα αναζήτησης φροντιστηρίων στην Ελλάδα. Ανακάλυψε κορυφαία φροντιστήρια για Μαθηματικά, Αγγλικά και όλα τα μαθήματα σε Αθήνα, Θεσσαλονίκη, Πάτρα και Ηράκλειο.'
      : 'Η μεγαλύτερη πλατφόρμα αναζήτησης φροντιστηρίων στην Κύπρο. Ανακάλυψε κορυφαία φροντιστήρια για Μαθηματικά, Αγγλικά και όλα τα μαθήματα σε Λεμεσό, Λευκωσία, Λάρνακα και Πάφο.',
    alternates: {
      canonical: `https://tofrontistirio.com/${country}`,
    },
  };
}

import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { ChevronDown, Star } from 'lucide-react';
import { ClientSearchForm } from '@/components/client-search-form';
import { Footer } from '@/components/footer';
import { cn } from "@/lib/utils";

import { SubjectsSection } from '@/components/subjects-section';
import { Navbar } from '@/components/navbar';
import { RecentActivityFeed } from '@/components/recent-activity-feed';
import { FAQSection } from '@/components/faq-section';

async function getRecentInstitutes(country: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1'}/institutes/recent?country=${country}`;
    console.log(`[Next.js] Fetching recent institutes from: ${url}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout for build
    
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every minute
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
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

export default async function Home({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const recentInstitutes = await getRecentInstitutes(country);

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

      <FAQSection country={country} />

      <Footer />
    </div>
  );
}

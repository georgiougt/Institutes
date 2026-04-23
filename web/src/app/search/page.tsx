import { Suspense } from 'react';
import Link from 'next/link';
import { Star, MapPin, Globe, Phone, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import ClientMap from '@/components/ClientMap';
import { cn } from "@/lib/utils";
import { SearchSidebar } from '@/components/SearchSidebar';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';

import { SearchPageContent } from '@/components/SearchPageContent';

async function performSearch(params: { 
  query?: string; 
  cityId?: string; 
  serviceId?: string; 
  minRating?: string;
  radius?: string;
  lat?: string;
  lng?: string;
}) {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const res = await fetch(`${apiUrl}/institutes?${searchParams.toString()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Search fetch failed:', error);
    return [];
  }
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    query?: string; 
    cityId?: string; 
    serviceId?: string; 
    minRating?: string;
    radius?: string;
    lat?: string;
    lng?: string;
  }>
}) {
  const resolvedParams = await searchParams;
  const results = await performSearch(resolvedParams);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <header className="px-6 py-4 border-b border-gray-100 shadow-sm flex items-center justify-between sticky top-0 bg-white z-40">
         <Link href="/" className="flex items-center shrink-0">
            <img 
              src="/images/logo.svg" 
              className="h-12 sm:h-14 w-auto object-contain" 
              alt="ToFrontistirio Logo" 
            />
         </Link>
      </header>

      <SearchPageContent results={results} resolvedParams={resolvedParams} />
      
      <Footer />
    </div>
  )
}

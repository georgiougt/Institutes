import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Αναζήτηση Φροντιστηρίων | ToFrontistirio',
  description: 'Βρες φροντιστήρια στην περιοχή σου με βάση το μάθημα, την πόλη ή την απόσταση. Δες αξιολογήσεις και στοιχεία επικοινωνίας.',
};

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
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const res = await fetch(`${apiUrl}/institutes?${searchParams.toString()}`, { 
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) return { data: [], total: 0, page: 1, limit: 20 };
    const json = await res.json();
    // Handle both old array format and new paginated object format
    if (Array.isArray(json)) {
      return { data: json, total: json.length, page: 1, limit: json.length };
    }
    return json;
  } catch (error) {
    console.error('Search fetch failed:', error);
    return { data: [], total: 0, page: 1, limit: 20 };
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

      <SearchPageContent initialResults={results} resolvedParams={resolvedParams} />
      
      <Footer />
    </div>
  )
}

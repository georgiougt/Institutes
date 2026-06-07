import { Metadata } from 'next';
import { Suspense } from 'react';
import { permanentRedirect } from 'next/navigation';
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

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ country: string; slugs?: string[] }>;
  searchParams: Promise<{ 
    query?: string;
  }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const isGreece = country.toLowerCase() === 'gr';
  const slugs = resolvedParams.slugs || [];

  const resolvedSearchParams = await searchParams;
  const canonicalParams = new URLSearchParams();
  if (resolvedSearchParams.query) canonicalParams.set('query', resolvedSearchParams.query);

  const queryStr = canonicalParams.toString();
  const prettyPath = slugs.length > 0 ? `/${slugs.join('/')}` : '';
  const canonicalUrl = `https://tofrontistirio.com/${country}/search${prettyPath}${queryStr ? `?${queryStr}` : ''}`;

  return {
    title: isGreece ? 'Αναζήτηση Φροντιστηρίων στην Ελλάδα | ToFrontistirio' : 'Αναζήτηση Φροντιστηρίων στην Κύπρο | ToFrontistirio',
    description: isGreece
      ? 'Βρες φροντιστήρια στην Ελλάδα με βάση το μάθημα, την πόλη ή την απόσταση. Δες αξιολογήσεις και στοιχεία επικοινωνίας.'
      : 'Βρες φροντιστήρια στην Κύπρο με βάση το μάθημα, την πόλη ή την απόσταση. Δες αξιολογήσεις και στοιχεία επικοινωνίας.',
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

async function performSearch(params: { 
  query?: string; 
  cityId?: string; 
  serviceId?: string; 
  minRating?: string;
  radius?: string;
  lat?: string;
  lng?: string;
  country?: string;
  slugs?: string[];
}) {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        if (key === 'slugs' && Array.isArray(value)) {
          if (value.length > 0) {
            searchParams.append('slugs', value.join(','));
          }
        } else {
          searchParams.append(key, value as string);
        }
      }
    });
    // Always send pagination params for initial load
    if (!searchParams.has('page')) searchParams.set('page', '1');
    if (!searchParams.has('limit')) searchParams.set('limit', '20');
    
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
  params,
  searchParams,
}: {
  params: Promise<{ country: string; slugs?: string[] }>;
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
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const slugs = resolvedParams.slugs || [];

  // Legacy Redirect Check
  if (resolvedSearchParams.cityId || resolvedSearchParams.serviceId) {
    let citySlug = '';
    let serviceSlug = '';

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const metadataRes = await fetch(`${apiUrl}/institutes/metadata/lists?country=${country}`, {
        next: { revalidate: 3600 }
      });
      if (metadataRes.ok) {
        const metadata = await metadataRes.json();
        if (resolvedSearchParams.cityId) {
          const city = metadata.cities.find((c: any) => c.id === resolvedSearchParams.cityId);
          if (city) citySlug = city.slug;
        }
        if (resolvedSearchParams.serviceId) {
          const service = metadata.services.find((s: any) => s.id === resolvedSearchParams.serviceId);
          if (service) serviceSlug = service.slug;
        }
      }
    } catch (e) {
      console.error('Failed to fetch metadata for 308 redirect:', e);
    }

    let redirectPath = `/${country}/search`;
    if (citySlug && serviceSlug) {
      redirectPath += `/${citySlug}/${serviceSlug}`;
    } else if (citySlug) {
      redirectPath += `/${citySlug}`;
    } else if (serviceSlug) {
      redirectPath += `/${serviceSlug}`;
    }

    const redirectParams = new URLSearchParams();
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (key !== 'cityId' && key !== 'serviceId' && value) {
        redirectParams.set(key, value as string);
      }
    });

    const queryStr = redirectParams.toString();
    const finalRedirectUrl = `${redirectPath}${queryStr ? `?${queryStr}` : ''}`;
    
    permanentRedirect(finalRedirectUrl);
  }

  const results = await performSearch({ ...resolvedSearchParams, country, slugs });

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <header className="px-6 py-4 border-b border-gray-100 shadow-sm flex items-center justify-between sticky top-0 bg-white z-40">
         <Link href={`/${country}`} className="flex items-center shrink-0">
            <img 
              src="/images/logo.svg" 
              className="h-12 sm:h-14 w-auto object-contain" 
              alt="ToFrontistirio Logo" 
            />
         </Link>
      </header>

      <SearchPageContent initialResults={results} resolvedParams={resolvedSearchParams} />
      
      <Footer />
    </div>
  )
}

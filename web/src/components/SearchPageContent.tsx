'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, MapPin, Globe, Phone, Navigation, List, Map as MapIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface SearchPageContentProps {
  initialResults: {
    data: any[];
    total: number;
    page: number;
    limit: number;
  };
  resolvedParams: {
    query?: string;
    cityId?: string;
    serviceId?: string;
    minRating?: string;
    radius?: string;
    lat?: string;
    lng?: string;
  };
}

export function SearchPageContent({ initialResults, resolvedParams }: SearchPageContentProps) {
  const params = useParams();
  const country = (params?.country as string) || 'cy';
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [institutes, setInstitutes] = useState(initialResults?.data || []);
  const [page, setPage] = useState(initialResults?.page || 1);
  const [total, setTotal] = useState(initialResults?.total || 0);
  const [loading, setLoading] = useState(false);
  const limit = initialResults?.limit || 20;
  const hasMore = institutes.length < total;

  useEffect(() => {
    setInstitutes(initialResults?.data || []);
    setPage(initialResults?.page || 1);
    setTotal(initialResults?.total || 0);
  }, [resolvedParams, initialResults]);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const searchParams = new URLSearchParams();
      Object.entries(resolvedParams).forEach(([key, value]) => {
        if (value) searchParams.append(key, value as string);
      });
      searchParams.append('page', nextPage.toString());
      searchParams.append('limit', '20');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const res = await fetch(`${apiUrl}/institutes?${searchParams.toString()}`);
      
      if (res.ok) {
        const json = await res.json();
        // Handle both array and paginated object formats
        const newItems = Array.isArray(json) ? json : (json.data || []);
        if (newItems.length > 0) {
          setInstitutes(prev => [...prev, ...newItems]);
          setPage(nextPage);
          // Update total if the response includes it
          if (!Array.isArray(json) && json.total !== undefined) {
            setTotal(json.total);
          }
        } else {
          // No more results, set total to current length to hide the button
          setTotal(institutes.length);
        }
      }
    } catch (error) {
      console.error('Load more failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const userLocation = resolvedParams.lat && resolvedParams.lng ? {
    lat: parseFloat(resolvedParams.lat),
    lng: parseFloat(resolvedParams.lng)
  } : undefined;

  return (
    <div className="flex flex-1 relative flex-col lg:flex-row">
      {/* Floating Toggle Button (Mobile Only) */}
      <div className="xl:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Button 
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="rounded-full shadow-2xl bg-slate-900 border border-slate-800 text-white px-6 py-6 font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all group"
        >
          {viewMode === 'list' ? (
            <>
              <MapIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span>Προβολή Χάρτη</span>
            </>
          ) : (
            <>
              <List className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
              <span>Προβολή Λίστας</span>
            </>
          )}
        </Button>
      </div>

      {/* Left Sidebar - Filters (Desktop Only) */}
      <aside className="hidden lg:block w-[300px] shrink-0 p-6 border-r border-gray-50 bg-slate-50/50">
        <Suspense fallback={<div className="h-40 w-full bg-slate-100 animate-pulse rounded-xl" />}>
          <SearchSidebar />
        </Suspense>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Results List */}
        <main className={cn(
          "flex-1 p-6 md:p-8 lg:p-10 max-w-[900px]",
          viewMode === 'map' ? "hidden xl:block" : "block"
        )}>
          <div className="pb-6 mb-8 border-b border-gray-100 flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900">
              {total > 0 
                ? `${total} Φροντιστήρια` 
                : (
                  <div className="space-y-2">
                    <span className="block text-red-600">Δεν βρέθηκαν αποτελέσματα</span>
                    <p className="text-sm font-medium text-gray-500 max-w-sm normal-case">
                      Δοκιμάστε να μειώσετε το φίλτρο της <b>αξιολόγησης</b> ή να αυξήσετε την <b>ακτίνα</b> αναζήτησης για να δείτε περισσότερα κέντρα στην περιοχή σας.
                    </p>
                    {resolvedParams.lat && resolvedParams.lng && resolvedParams.cityId && (
                       <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm mt-4 max-w-lg">
                         <p className="font-bold flex items-center gap-2 mb-1">
                           <Navigation className="h-4 w-4 fill-amber-500" /> Πιθανή ανακρίβεια τοποθεσίας
                         </p>
                         <p className="mb-3">
                           Η τοποθεσία σας φαίνεται να απέχει αρκετά από την επιλεγμένη πόλη. 
                           Δοκιμάστε να αυξήσετε την <b>ακτίνα</b> στα 30km ή απενεργοποιήστε την "Κοντά σε μένα" αναζήτηση.
                         </p>
                         <Link 
                           href={`/${country}/search?${(() => {
                             const p = new URLSearchParams(resolvedParams as any);
                             p.delete('lat');
                             p.delete('lng');
                             return p.toString();
                           })()}`}
                           className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-700 transition-colors"
                         >
                           Απενεργοποίηση "Κοντά σε μένα"
                         </Link>
                       </div>
                    )}
                  </div>
                )}
              {resolvedParams.query && <span className="text-gray-400 font-medium ml-2">για "{resolvedParams.query}"</span>}
            </h1>
            
            <div className="lg:hidden">
               <Sheet>
                 <SheetTrigger
                   render={
                     <Button variant="outline" size="sm" className="rounded-full shadow-sm border-gray-200 font-bold px-5">
                       Φίλτρα
                     </Button>
                   }
                 />
                 <SheetContent side="left" className="p-0 overflow-y-auto">
                   <div className="p-6">
                     <SheetHeader>
                       <SheetTitle>Φίλτρα Αναζήτησης</SheetTitle>
                     </SheetHeader>
                     <div className="mt-4">
                       <SearchSidebar className="static border-none p-0 shadow-none bg-transparent" />
                     </div>
                     <div className="mt-8 pb-10">
                       <SheetClose
                         render={
                           <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest cursor-pointer">
                             Προβολή Αποτελεσμάτων
                           </Button>
                         }
                       />
                     </div>
                   </div>
                 </SheetContent>
               </Sheet>
            </div>
          </div>

          <div className="space-y-12">
            {institutes.map((inst: any, index: number) => (
              <div 
                key={inst.id} 
                className={cn(
                  "flex flex-col sm:flex-row gap-8 group p-4 rounded-2xl transition-all",
                  inst.isFeatured ? "bg-indigo-50/50 border-2 border-indigo-100 shadow-sm" : "bg-transparent border-2 border-transparent"
                )}
              >
                {/* Image Section */}
                <div className="w-full sm:w-[240px] h-[240px] rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm relative">
                  <img 
                    src={inst.images?.[0]?.url || inst.logoUrl || "/images/placeholder-institute.webp"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={inst.name} 
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {inst.isFeatured && (
                      <div className="bg-white p-0.5 rounded-lg shadow-lg border border-indigo-100 flex items-center justify-center">
                        <img src="/images/crown.gif" className="h-7 w-7 object-contain mix-blend-multiply" alt="Featured" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-black uppercase text-slate-900 shadow-sm border border-gray-100">
                      {inst.branches?.[0]?.city?.name || 'Κύπρος'}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 py-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/${country}/institute/${inst.id}`} className="text-2xl font-black text-slate-900 hover:text-red-600 transition-colors leading-tight">
                        {index + 1}. {inst.name}
                      </Link>
                      {inst.isVerified && (
                        <div className="flex items-center mt-1" title="Επαληθευμένο Φροντιστήριο">
                          <img src="/images/verified.gif" className="h-6 w-6 object-contain mix-blend-multiply" alt="Verified" />
                        </div>
                      )}
                      {inst.isFeatured && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200 mt-1">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Rating Logic */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-[2px]">
                      {[1, 2, 3, 4, 5].map(star => (
                        <div key={star} className={cn(
                          "rounded-[4px] p-0.5 shadow-sm",
                          star <= Math.round(inst.avgRating || 0) ? "bg-[#f15c00]" : "bg-gray-100"
                        )}>
                          <Star className={cn(
                            "h-3 w-3",
                            star <= Math.round(inst.avgRating || 0) ? "fill-white stroke-none" : "fill-gray-300 stroke-none"
                          )} />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {inst.avgRating > 0 ? inst.avgRating.toFixed(1) : 'Νέο'}
                    </span>
                    <span className="text-xs font-medium text-slate-400 ml-1">
                      ({inst.reviewCount || 0} κριτικές)
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {inst.services?.slice(0, 3).map((s: any) => (
                      <span key={s.id} className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-bold border border-slate-100">
                        {s.service?.name}
                      </span>
                    ))}
                    {inst.services?.length > 3 && (
                      <span className="text-slate-400 text-[11px] font-bold self-center">+ {inst.services.length - 3}</span>
                    )}
                  </div>

                  <p className="text-[14px] text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {inst.description || 'Καλώς ήρθατε στο φροντιστήριό μας. Προσφέρουμε ποιοτική εκπαίδευση με έμφαση στην επιτυχία των μαθητών μας.'}
                  </p>

                  <div className="flex flex-wrap gap-5 text-xs font-bold text-slate-400 uppercase tracking-widest pt-5 border-t border-slate-50">
                    {inst.branches?.[0]?.latitude && inst.branches?.[0]?.longitude ? (
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${inst.branches[0].latitude},${inst.branches[0].longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                      >
                        <MapPin className="h-3.5 w-3.5" /> Χάρτης
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Χάρτης</div>
                    )}

                    {inst.distanceKm !== undefined && (
                      <div className="flex items-center gap-1.5 text-red-600">
                        <Navigation className="h-3 w-3 fill-red-600" /> 
                        {inst.distanceKm < 1 
                          ? `${(inst.distanceKm * 1000).toFixed(0)}m` 
                          : `${inst.distanceKm.toFixed(1)}km`}
                      </div>
                    )}

                    {inst.branches?.[0]?.phone ? (
                      <a 
                        href={`tel:${inst.branches[0].phone}`}
                        className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" /> {inst.branches[0].phone}
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Τηλέφωνο</div>
                    )}

                    {inst.website ? (
                      <a 
                        href={inst.website.startsWith('http') ? inst.website : `https://${inst.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                      >
                        <Globe className="h-3.5 w-3.5" /> Website
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-300"><Globe className="h-3.5 w-3.5" /> Website</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center pb-20">
              <Button 
                onClick={handleLoadMore} 
                disabled={loading}
                variant="outline"
                className="h-14 px-10 rounded-2xl border-2 border-slate-900 text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? 'Φόρτωση...' : 'Φόρτωση Περισσότερων'}
              </Button>
            </div>
          )}
        </main>

        {/* Map Area */}
        <aside className={cn(
          "flex-1 border-l border-gray-50 bg-slate-50/30",
          viewMode === 'list' ? "hidden xl:block" : "fixed inset-0 top-[73px] z-40 bg-white"
        )}>
          <div className="sticky top-[73px] h-[calc(100vh-73px)] w-full">
            <ClientMap 
              key={viewMode}
              institutes={institutes} 
              userLocation={userLocation}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

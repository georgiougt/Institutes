import Link from 'next/link';
import { Star, MapPin, Globe, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import ClientMap from '@/components/ClientMap';

async function performSearch(query?: string, location?: string) {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (location) params.append('location', location);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes?${params.toString()}`, { cache: 'no-store' });
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
  searchParams: Promise<{ query?: string; location?: string }>
}) {
  const resolvedParams = await searchParams;
  const results = await performSearch(resolvedParams.query, resolvedParams.location);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 border-t border-gray-100">
      <header className="px-6 py-6 border-b border-gray-200 shadow-sm flex items-center justify-between sticky top-0 bg-white z-20">
         <Link href="/" className="flex items-center gap-1 group shrink-0">
            <span className="text-red-600 font-extrabold text-3xl leading-none">*</span>
            <span className="font-extrabold text-3xl tracking-tighter text-slate-900">EduTrack</span>
         </Link>
         <div className="flex items-center gap-4 shrink-0">
            <Link href="/onboard" className="flex items-center">
              <Button variant="ghost" className="font-bold text-gray-600 text-sm h-10">Για Φροντιστήρια</Button>
            </Link>
            <Link href="/onboard" className="flex items-center">
              <Button className="font-bold rounded bg-red-600 hover:bg-red-700 text-white px-6 h-10 shadow-sm">Είσοδος</Button>
            </Link>
         </div>
      </header>

      <main className="flex-1 container mx-auto max-w-[1100px] p-6 lg:p-10 flex flex-col md:flex-row gap-10">
        {/* Results List */}
        <div className="flex-1 space-y-8">
          <div className="pb-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">
              {results.length > 0 
                ? `Βρέθηκαν ${results.length} φροντιστήρια` 
                : 'Δεν βρέθηκαν αποτελέσματα'}
              {resolvedParams.query && ` για "${resolvedParams.query}"`}
              {resolvedParams.location && ` κοντά σε "${resolvedParams.location}"`}
            </h1>
          </div>

          <div className="space-y-10">
            {results.map((inst: any, index: number) => (
              <div key={inst.id} className="flex flex-col sm:flex-row gap-6 group">
                <div className="w-full sm:w-[220px] h-[220px] rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                  <img 
                    src={inst.images?.[0]?.url || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    alt={inst.name} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Link href={`/institute/${inst.id}`} className="text-xl font-bold text-gray-900 hover:underline">
                      {index + 1}. {inst.name}
                    </Link>
                  </div>
                  
                  <div className="flex items-center mt-1 gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <div key={star} className={`w-4 h-4 rounded-sm flex items-center justify-center ${star <= 4 ? 'bg-[#f15c00]' : 'bg-gray-200'}`}>
                        <Star className="h-2.5 w-2.5 fill-white text-white stroke-none" />
                      </div>
                    ))}
                    <span className="text-xs text-gray-500 font-medium ml-1">45 κριτικές</span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center text-[13px] text-gray-600 font-medium">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] uppercase tracking-wide mr-2">Φροντιστήριο</span>
                      {inst.cityName || 'Άγνωστη τοποθεσία'} 
                      {inst.areaName && <span className="text-gray-400 ml-1">· {inst.areaName}</span>}
                    </div>
                  </div>

                  <p className="mt-4 text-[14px] text-gray-700 leading-relaxed line-clamp-3 italic">
                    {inst.description || 'Ένας χώρος μάθησης με έμφαση στην ποιότητα και την εξατομικευμένη προσέγγιση σε κάθε μαθητή.'}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-t border-gray-50 pt-4">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Χάρτης</span>
                    <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Τηλέφωνο</span>
                    <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Website</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Space (Map) */}
        <div className="hidden lg:block w-[350px] shrink-0">
          <div className="sticky top-28 h-[600px] w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <ClientMap institutes={results} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

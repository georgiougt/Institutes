'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, BookOpen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Metadata {
  cities: { id: string; name: string }[]
  services: { id: string; name: string }[]
}

export function ClientSearchForm() {
  const router = useRouter();
  const params = useParams();
  const country = (params?.country as string) || 'cy';

  const [query, setQuery] = useState('');
  const [serviceId, setServiceId] = useState<string>("all");
  const [location, setLocation] = useState("all");
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
        const res = await fetch(`${apiUrl}/institutes/metadata/lists?country=${country}`)
        if (res.ok) {
          setMetadata(await res.json())
        }
      } catch (err) {
        console.error("Failed to fetch search metadata:", err)
      }
    }
    fetchMetadata()
  }, [country])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (query) searchParams.append('query', query);
    if (location && location !== "all") searchParams.append("cityId", location);
    if (serviceId && serviceId !== "all") searchParams.append("serviceId", serviceId);
    
    router.push(`/${country}/search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-[900px] mx-auto shadow-2xl rounded-xl overflow-visible bg-white p-1.5 flex flex-col lg:flex-row gap-0 group">
      {/* Subject Select */}
      <div className="relative flex-[1.2] flex items-center bg-white px-4 border-r border-gray-200">
         <BookOpen className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
         <Select value={serviceId || ""} onValueChange={(v) => setServiceId(v || "")}>
           <SelectTrigger className="h-12 border-0 shadow-none focus:ring-0 text-[15px] font-bold px-1 bg-transparent text-slate-700">
             <SelectValue placeholder="Τι μάθημα;" />
           </SelectTrigger>
           <SelectContent className="max-h-[300px]">
             <SelectItem value="all" className="font-bold">Όλα τα μαθήματα</SelectItem>
             {metadata?.services.map((s) => (
               <SelectItem key={s.id} value={s.id} className="font-medium" label={s.name}>
                 {s.name}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
      </div>

      {/* Query Search */}
      <div className="relative flex-[1.5] flex items-center bg-white px-4 lg:border-r border-gray-200">
         <Search className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
         <Input 
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           className="h-12 bg-transparent border-0 rounded-none text-[15px] focus-visible:ring-0 placeholder:text-gray-400 font-medium px-1 shadow-none" 
           placeholder="Όνομα φροντιστηρίου..." 
         />
      </div>

      {/* Location Select */}
      <div className="relative flex-1 flex items-center bg-white px-4">
         <MapPin className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
         <Select value={location || "all"} onValueChange={(v) => setLocation(v || "all")}>
           <SelectTrigger className="h-12 border-0 shadow-none focus:ring-0 text-[15px] font-bold px-1 bg-transparent text-slate-700">
             <SelectValue placeholder="Που;" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all" className="font-bold" label="Όλες οι πόλεις">Όλες οι πόλεις</SelectItem>
             {metadata?.cities.map((city) => (
               <SelectItem key={city.id} value={city.id} className="font-medium" label={city.name}>
                 {city.name}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
      </div>

      <Button type="submit" className="h-14 w-full lg:w-20 rounded-lg bg-red-600 hover:bg-red-700 p-0 text-white flex-shrink-0 flex items-center justify-center mt-2 lg:mt-0 shadow-lg transition-transform active:scale-95">
         <Search className="h-6 w-6 stroke-[3]" />
      </Button>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ClientSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Λευκωσία');

  const CYPRUS_CITIES = [
    'Λευκωσία',
    'Λεμεσός',
    'Λάρνακα',
    'Πάφος',
    'Αμμόχωστος'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (location) params.append('location', location);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-[800px] mx-auto shadow-2xl rounded overflow-visible bg-white p-1 flex flex-col sm:flex-row gap-0">
      <div className="relative flex-1 flex items-center bg-white rounded-l px-3 border-r border-gray-300">
         <Input 
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           className="h-12 bg-transparent border-0 rounded-none text-[15px] focus-visible:ring-0 placeholder:text-gray-500 font-medium px-1 shadow-none" 
           placeholder="φροντιστήρια, καθηγητές, ξένες γλώσσες..." 
         />
      </div>
      <div className="relative flex-1 flex items-center bg-white px-3">
         <MapPin className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
         <Select value={location} onValueChange={(val) => val && setLocation(val)}>
           <SelectTrigger className="h-12 border-0 shadow-none focus:ring-0 text-[15px] font-medium px-1 bg-transparent">
             <SelectValue placeholder="Επιλέξτε πόλη" />
           </SelectTrigger>
           <SelectContent>
             {CYPRUS_CITIES.map((city) => (
               <SelectItem key={city} value={city} className="font-medium">
                 {city}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
      </div>
      <Button type="submit" className="h-14 w-full sm:w-16 rounded-r bg-[#E00707] hover:bg-[#c90606] p-0 text-white flex-shrink-0 flex items-center justify-center mt-1 sm:mt-0">
         <Search className="h-[26px] w-[26px] stroke-[3]" />
      </Button>
    </form>
  );
}

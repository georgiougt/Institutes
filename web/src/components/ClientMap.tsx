'use client';

import dynamic from 'next/dynamic';

const SearchMap = dynamic(() => import('./SearchMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-50 animate-pulse flex items-center justify-center text-slate-400 font-bold text-center p-4">
    Φόρτωση Χάρτη...<br/>Παρακαλώ περιμένετε
  </div>
});

export default function ClientMap({ institutes }: { institutes: any[] }) {
  return <SearchMap institutes={institutes} />;
}

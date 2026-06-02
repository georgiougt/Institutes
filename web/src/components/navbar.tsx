'use client';

import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
  className?: string;
  transparent?: boolean;
}

export function Navbar({ className, transparent = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const country = (params?.country as string) || 'cy';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchCountry = (targetCountry: string) => {
    // Write cookie to store selection
    document.cookie = `country=${targetCountry}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Switch route segment (e.g. /cy/search -> /gr/search or /cy -> /gr)
    let newPath = pathname;
    if (pathname.startsWith('/cy') || pathname.startsWith('/gr')) {
      newPath = pathname.replace(/^\/(cy|gr)/i, `/${targetCountry}`);
    } else {
      newPath = `/${targetCountry}${pathname}`;
    }
    router.push(newPath);
  };

  const isTransparent = transparent && !isScrolled;

  return (
    <header 
      translate="no"
      className={cn(
        "fixed top-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between w-full transition-all duration-300",
      isTransparent ? "bg-transparent" : "bg-white border-b border-slate-200 shadow-sm",
      className
    )}>
      {/* Logo Yelp-Style */}
      <Link className="flex items-center shrink-0" href={`/${country}`}>
        <img 
          src={isTransparent ? "/images/logo-white.svg" : "/images/logo.svg"} 
          className="h-12 sm:h-16 w-auto object-contain" 
          alt="ToFrontistirio Logo" 
        />
      </Link>
      
      <nav className="flex gap-4 items-center shrink-0">
        <Link 
          className={cn(
            "hidden lg:flex items-center text-sm font-bold hover:underline underline-offset-4 px-3 h-10 transition-colors",
            isTransparent ? "text-white" : "text-slate-600 hover:text-red-600"
          )} 
          href={`/${country}/search`}
        >
          Βρες Φροντιστήριο
        </Link>

        {/* Country Selector Toggle Button (Hidden until Greece launch) */}
        {/* <button
          onClick={() => switchCountry(country === 'cy' ? 'gr' : 'cy')}
          className={cn(
            "text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer select-none",
            isTransparent 
              ? "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          )}
        >
          {country.toUpperCase() === 'CY' ? '🇨🇾 ΚΥΠΡΟΣ' : '🇬🇷 ΕΛΛΑΔΑ'}
        </button> */}

        <Link 
          href="/login"
          className={cn(
            "text-sm font-bold px-4 py-2 rounded-xl transition-all",
            isTransparent 
              ? "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          )}
        >
          Σύνδεση
        </Link>
      </nav>
    </header>
  );
}

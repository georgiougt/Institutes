'use client';

import Link from 'next/link';
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
  transparent?: boolean;
}

export function Navbar({ className, transparent = false }: NavbarProps) {
  return (
    <header 
      translate="no"
      className={cn(
        "fixed top-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between w-full transition-all duration-300",
      transparent ? "bg-transparent" : "bg-white border-b border-slate-200",
      className
    )}>
      {/* Logo Yelp-Style */}
      <Link className="flex items-center shrink-0" href="/">
        <img 
          src="/images/logo.png" 
          className={cn("h-10 sm:h-12 w-auto", transparent && "brightness-0 invert")} 
          alt="ToFrontistirio Logo" 
        />
      </Link>
      
      <nav className="flex gap-4 items-center shrink-0">
        <Link 
          className={cn(
            "hidden lg:flex items-center text-sm font-bold hover:underline underline-offset-4 px-3 h-10 transition-colors",
            transparent ? "text-white" : "text-slate-600 hover:text-red-600"
          )} 
          href="/search"
        >
          Βρες Φροντιστήριο
        </Link>
        <Link 
          href="/login"
          className={cn(
            "text-sm font-bold px-4 py-2 rounded-xl transition-all",
            transparent 
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

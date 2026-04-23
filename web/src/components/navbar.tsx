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
      <Link className="flex items-center gap-2 group shrink-0" href="/">
        <div className="h-10 w-10 flex items-center justify-center bg-red-600 rounded-xl shadow-lg shadow-red-900/20 group-hover:scale-105 transition-transform">
          <span className="text-white font-black text-2xl">Φ</span>
        </div>
        <div className="flex flex-col -space-y-1">
          <span className={cn(
            "font-black text-2xl tracking-tighter transition-colors",
            transparent ? "text-white" : "text-slate-900"
          )}>
            To<span className="text-red-600">Frontistirio</span>
          </span>
          <span className={cn(
            "text-[8px] font-bold uppercase tracking-[0.2em] transition-colors",
            transparent ? "text-white/60" : "text-slate-400"
          )}>
            The Premier Institute Directory
          </span>
        </div>
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

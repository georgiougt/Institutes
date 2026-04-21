'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const [lang, setLang] = useState('el');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Check for existing Google Translate cookie
    const cookies = document.cookie.split('; ');
    const transCookie = cookies.find(row => row.startsWith('googtrans='));
    if (transCookie) {
      const value = transCookie.split('=')[1];
      if (value.includes('/en')) setLang('en');
      else setLang('el');
    }
  }, []);

  const handleLanguageChange = (newLang: string) => {
    if (newLang === lang) return;
    
    setIsChanging(true);
    setLang(newLang);
    
    // Google Translate uses a specific cookie format: /source/target
    const cookieValue = newLang === 'en' ? '/el/en' : '/el/el';
    
    // Set cookie for both current domain and subdomains
    const domain = window.location.hostname;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain};`;
    
    // Triggers Google Translate to re-process the page
    // Adding a short delay so the user can see the "Changing Language" message
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="w-full group">
      <h4 className="text-gray-900 font-bold mb-4 text-[15px] flex items-center gap-2">
        {lang === 'el' ? 'Γλώσσα' : 'Language'}
      </h4>
      <div className={cn(
        "relative transition-opacity duration-300",
        isChanging ? "opacity-50 pointer-events-none" : "opacity-100"
      )}>
        <select 
          value={lang}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-white border-2 text-gray-900 font-extrabold border-gray-200 rounded-xl p-4 pr-12 text-sm sm:text-[13px] w-full outline-none shadow-sm cursor-pointer hover:border-red-500 hover:ring-2 hover:ring-red-500/10 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 appearance-none transition-all duration-200"
        >
          <option value="el">🇬🇷 Ελληνικά (Greek)</option>
          <option value="en">🇺🇸 English (Αγγλικά)</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
           <ChevronDown size={20} className="sm:size-4" />
        </div>
        {isChanging && (
          <div className="absolute -top-10 left-0 right-0 flex justify-center">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase animate-pulse">
              {lang === 'el' ? 'ΑΛΛΑΓΗ ΓΛΩΣΣΑΣ...' : 'CHANGING LANGUAGE...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

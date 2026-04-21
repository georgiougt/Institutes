'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const [lang, setLang] = useState('el');

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
    
    console.log('Changing language to:', newLang);
    const domain = window.location.hostname;
    
    if (newLang === 'el') {
      // THE ULTIMATE NUCLEAR COOKIE CLEAR
      const cookieName = 'googtrans';
      const domainParts = domain.split('.');
      const paths = ['/', '', '/search', '/contact', '/login', '/admin'];
      
      // We want to hit every possible combination that could EXIST
      while (domainParts.length >= 2) { // Stop at 'com' or 'net'
        const d = domainParts.join('.');
        paths.forEach(p => {
          const base = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
          document.cookie = `${base} path=${p}; domain=${d};`;
          document.cookie = `${base} path=${p}; domain=.${d};`;
          document.cookie = `${base} path=${p};`;
        });
        domainParts.shift();
      }
      
      // Generic clears
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; path=/;"; // Sometimes value as empty works better than expire
    } else {
      // SET COOKIE for English
      const cookieValue = '/el/en';
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain};`;
    }
    
    // FORCE RELOAD IMMEDIATELY
    window.location.reload();
  };

  return (
    <div className="w-full group" translate="no">
      <h4 className="text-gray-900 font-bold mb-4 text-[15px] flex items-center gap-2">
        <span translate="no">{lang === 'el' ? 'Γλώσσα' : 'Language'}</span>
      </h4>
      <div className="relative">
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
      </div>
    </div>
  );
}

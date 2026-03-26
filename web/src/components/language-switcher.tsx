'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
    setLang(newLang);
    
    // Google Translate uses a specific cookie format: /source/target
    const cookieValue = newLang === 'en' ? '/el/en' : '/el/el';
    
    // Set cookie for both current domain and subdomains
    const domain = window.location.hostname;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain};`;
    
    // Triggers Google Translate to re-process the page
    window.location.reload();
  };

  return (
    <div className="w-full group">
      <h4 className="text-gray-900 font-bold mb-3 text-[15px] flex items-center gap-2">
        {lang === 'el' ? 'Γλώσσα' : 'Language'}
      </h4>
      <div className="relative">
        <select 
          value={lang}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-white border text-gray-700 font-bold border-gray-300 rounded-md p-2.5 pr-10 text-[13px] w-full outline-none shadow-sm cursor-pointer hover:border-red-500 hover:ring-1 hover:ring-red-500/10 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none transition-all duration-200"
        >
          <option value="el">Ελληνικά</option>
          <option value="en">English (US)</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
           <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}

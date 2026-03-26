'use client';

import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { MapPin, Phone, Globe, Star, Clock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export function LiveProfilePreview() {
  const { data } = useOnboarding();

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Mock Browser Header */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-300" />
          <div className="w-2 h-2 rounded-full bg-yellow-300" />
          <div className="w-2 h-2 rounded-full bg-green-300" />
        </div>
        <div className="flex-1 bg-white rounded py-1 px-3 text-[10px] text-slate-400 font-mono truncate">
          edutrack.gr/listing/{data.name?.toLowerCase().replace(/\s+/g, '-') || 'listing-name'}
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1">
        {/* Banner */}
        <div className="h-32 bg-slate-200 relative">
          {data.coverUrl ? (
            <img src={data.coverUrl} className="w-full h-full object-cover" alt="Banner" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
               <Image className="opacity-20" src="/placeholder-cover.jpg" width={450} height={128} alt="" />
            </div>
          )}
          
          {/* Logo Overlay */}
          <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-xl bg-white shadow-lg border-2 border-white flex items-center justify-center overflow-hidden">
            {data.logoUrl ? (
              <img src={data.logoUrl} className="w-full h-full object-contain" alt="Logo" />
            ) : (
              <div className="text-xl font-bold text-slate-300">{data.name?.charAt(0) || 'E'}</div>
            )}
          </div>
        </div>

        <div className="pt-10 px-6 pb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {data.name || 'Το Εκπαιδευτήριο Σας'}
              </h2>
              <div className="flex items-center gap-1 mt-1">
                 <div className="flex text-yellow-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} />
                 </div>
                 <span className="text-[10px] text-slate-400 font-medium">(Νέο Καταχωρημένο)</span>
              </div>
            </div>
            {data.path === 'CLAIM' && (
               <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                 <ShieldCheck size={10} />
                 <span>Verified</span>
               </div>
            )}
          </div>

          <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
            {data.description || 'Εδώ θα εμφανίζεται η περιγραφή του κέντρου σας. Πείτε στους γονείς τι σας κάνει ξεχωριστούς, τις μεθόδους διδασκαλίας σας και την εμπειρία σας.'}
          </p>

          <div className="space-y-2 border-t border-slate-50 pt-4">
            <div className="flex items-center gap-3 text-slate-500">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-xs">{data.address || 'Διεύθυνση, Πόλη'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <Phone size={14} className="text-slate-400" />
              <span className="text-xs">{data.phone || '22 123456'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <Globe size={14} className="text-slate-400" />
              <span className="text-xs">{data.website || 'www.website.com'}</span>
            </div>
            <div className="flex items-center gap-3 text-green-600">
              <Clock size={14} />
              <span className="text-xs font-medium">Ανοιχτά τώρα (09:00 - 21:00)</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {data.serviceIds.length > 0 ? (
               data.serviceIds.map(sid => (
                 <span key={sid} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-medium">
                   Service #{sid.slice(0,3)}
                 </span>
               ))
            ) : (
               <>
                 <span className="bg-slate-50 text-slate-300 px-2 py-1 rounded text-[10px] font-medium border border-dashed border-slate-200">
                   Μαθήματα...
                 </span>
                 <span className="bg-slate-50 text-slate-300 px-2 py-1 rounded text-[10px] font-medium border border-dashed border-slate-200">
                   Επίπεδα...
                 </span>
               </>
            )}
          </div>
          
          <button className="w-full mt-8 bg-black text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-black/10 flex items-center justify-center gap-2">
            Εκδήλωση Ενδιαφέροντος
          </button>
        </div>
      </div>
      
      {/* Mock Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-100">
         <div className="w-full h-20 bg-slate-200 rounded-xl overflow-hidden grayscale relative">
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               Χάρτης Περιοχής
            </div>
         </div>
      </div>
    </div>
  );
}

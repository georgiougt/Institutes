'use client';

import { use } from 'react';
import { BarChart3, Clock, Sparkles } from 'lucide-react';

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 h-[80vh] flex flex-col justify-center items-center text-center">
      <div className="max-w-md space-y-6">
        <div className="h-24 w-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-red-100">
           <BarChart3 className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Analytics</h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest border border-slate-200">
             <Clock className="h-3 w-3" />
             Coming Soon
          </div>
        </div>
        <p className="text-slate-500 leading-relaxed font-medium">
          We are building a powerful new analytics dashboard to help you track profile views, student inquiries, lead conversion rates, and actionable insights to grow your institute.
        </p>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-4 text-left">
           <Sparkles className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
           <p className="text-sm font-medium text-amber-800 leading-relaxed">
             Full data exporting, benchmark comparisons against other institutes, and AI-driven growth tips will be part of the next major release.
           </p>
        </div>
      </div>
    </div>
  );
}

import { OwnerSidebar } from './components/OwnerSidebar';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function OwnerLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch status via API
  let status = 'PENDING';
  let name = 'Institute Dashboard';
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${id}/metrics`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      status = data.status || 'PENDING';
    }
  } catch (e) {
    console.error('Failed to fetch institute status', e);
  }

  const getStatusConfig = (s: string) => {
    switch(s) {
      case 'DRAFT': return { label: 'Draft', color: 'bg-slate-100 text-slate-600 border-slate-200' };
      case 'PENDING': return { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-100', animate: true };
      case 'APPROVED': return { label: 'Live / Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'REJECTED': return { label: 'Action Required', color: 'bg-red-50 text-red-700 border-red-100' };
      case 'SUSPENDED': return { label: 'Suspended', color: 'bg-gray-800 text-white border-gray-900' };
      default: return { label: s, color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <OwnerSidebar instituteId={id} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
             <Link href="/owner" className="hover:text-slate-900 transition-colors">My Institutes</Link>
             <span>/</span>
             <span className="text-slate-900 font-medium">{name}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase",
              statusConfig.color
            )}>
               {statusConfig.animate && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
               <span>Status: {statusConfig.label}</span>
            </div>
            
            <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm cursor-pointer hover:bg-slate-800 transition-colors">
               OG
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

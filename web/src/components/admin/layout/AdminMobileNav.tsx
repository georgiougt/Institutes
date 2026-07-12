'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AdminNav } from './AdminNav';
import { AdminSidebarBrand, AdminSidebarFooter } from './AdminSidebar';

/**
 * Mobile-only top bar with a hamburger that opens the admin nav in a slide-in
 * drawer. Hidden on md+ where the persistent sidebar takes over.
 */
export function AdminMobileNav({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 text-white">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-indigo-500 flex items-center justify-center">
          <span className="text-red-600 font-extrabold text-2xl leading-none">*</span>
        </div>
        <span className="font-bold text-sm tracking-tight">ToFrontistirio Admin</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-72 max-w-[85%] flex flex-col bg-slate-900 text-slate-300 border-slate-800 p-0"
        >
          <AdminSidebarBrand />
          <AdminNav currentPath={currentPath} onNavigate={() => setOpen(false)} />
          <AdminSidebarFooter />
        </SheetContent>
      </Sheet>
    </div>
  );
}

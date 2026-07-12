'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { OwnerNavContent } from './OwnerNavContent';

/**
 * Hamburger button (rendered in the owner topbar) that opens the institute nav
 * in a slide-in drawer. Hidden on md+ where the persistent sidebar takes over.
 */
export function OwnerMobileNav({ instituteId }: { instituteId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-72 max-w-[85%] flex flex-col bg-slate-900 text-slate-300 border-slate-800 p-0"
        >
          <OwnerNavContent instituteId={instituteId} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

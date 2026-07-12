'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  BookOpen,
  Clock,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function getOwnerRoutes(instituteId: string) {
  return [
    { label: 'Overview', icon: LayoutDashboard, href: `/owner/${instituteId}` },
    { label: 'Premium Services', icon: Sparkles, href: `/owner/${instituteId}/premium`, badge: 'PRO' },
    { label: 'Public Profile', icon: Building2, href: `/owner/${instituteId}/profile` },
    { label: 'Branches', icon: MapPin, href: `/owner/${instituteId}/branches` },
    { label: 'Services', icon: BookOpen, href: `/owner/${instituteId}/services` },
    { label: 'Schedules', icon: Clock, href: `/owner/${instituteId}/schedules` },
    { label: 'Media Gallery', icon: ImageIcon, href: `/owner/${instituteId}/media` },
    { label: 'Analytics', icon: BarChart3, href: `/owner/${instituteId}/analytics` },
    { label: 'Inquiries', icon: MessageSquare, href: `/owner/${instituteId}/inquiries`, badge: 'New' },
    { label: 'Account Settings', icon: ShieldCheck, href: `/owner/${instituteId}/settings` },
  ];
}

interface OwnerNavContentProps {
  instituteId: string;
  /** Collapsed rail mode (desktop only). */
  isCollapsed?: boolean;
  /** Show the collapse toggle button (desktop sidebar only). */
  onToggleCollapse?: () => void;
  /** Called when a link is tapped — used by the mobile drawer to close itself. */
  onNavigate?: () => void;
}

/**
 * Shared brand + nav + footer used by both the desktop sidebar and the mobile
 * drawer so the two never drift apart.
 */
export function OwnerNavContent({
  instituteId,
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
}: OwnerNavContentProps) {
  const pathname = usePathname();
  const routes = getOwnerRoutes(instituteId);

  return (
    <>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white uppercase">ToFrontistirio</span>
          </div>
        )}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {routes.map((route) => {
          const active = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all group',
                active
                  ? 'bg-red-600/10 text-red-500 font-semibold'
                  : 'hover:bg-slate-800 hover:text-white'
              )}
            >
              <route.icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  active ? 'text-red-500' : 'text-slate-400 group-hover:text-white'
                )}
              />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{route.label}</span>
                  {route.badge && (
                    <span className="bg-red-600 text-[10px] text-white px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">
                      {route.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <Link
          href={`/institute/${instituteId}`}
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Public Page</span>}
        </Link>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/';
          }}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all font-medium"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </>
  );
}

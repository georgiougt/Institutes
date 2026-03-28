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
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface OwnerSidebarProps {
  instituteId: string;
}

export function OwnerSidebar({ instituteId }: OwnerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const routes = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: `/owner/${instituteId}`,
      active: pathname === `/owner/${instituteId}`,
    },
    {
      label: 'Public Profile',
      icon: Building2,
      href: `/owner/${instituteId}/profile`,
      active: pathname === `/owner/${instituteId}/profile`,
    },
    {
      label: 'Branches',
      icon: MapPin,
      href: `/owner/${instituteId}/branches`,
      active: pathname === `/owner/${instituteId}/branches`,
    },
    {
      label: 'Services',
      icon: BookOpen,
      href: `/owner/${instituteId}/services`,
      active: pathname === `/owner/${instituteId}/services`,
    },
    {
      label: 'Schedules',
      icon: Clock,
      href: `/owner/${instituteId}/schedules`,
      active: pathname === `/owner/${instituteId}/schedules`,
    },
    {
      label: 'Media Gallery',
      icon: ImageIcon,
      href: `/owner/${instituteId}/media`,
      active: pathname === `/owner/${instituteId}/media`,
    },
    {
      label: 'Inquiries',
      icon: MessageSquare,
      href: `/owner/${instituteId}/inquiries`,
      active: pathname === `/owner/${instituteId}/inquiries`,
      badge: 'New'
    },
  ];

  return (
    <aside className={cn(
      "flex flex-col h-screen bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800",
      isCollapsed ? "w-20" : "w-72"
    )}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white uppercase">EduTrack</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
              route.active 
                ? "bg-red-600/10 text-red-500 font-semibold" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <route.icon className={cn(
              "h-5 w-5 shrink-0",
              route.active ? "text-red-500" : "text-slate-400 group-hover:text-white"
            )} />
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
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <Link
          href={`/institute/${instituteId}`}
          target="_blank"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Public Page</span>}
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Account Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all text-left"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

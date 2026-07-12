'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { OwnerNavContent } from './OwnerNavContent';

interface OwnerSidebarProps {
  instituteId: string;
}

export function OwnerSidebar({ instituteId }: OwnerSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      <OwnerNavContent
        instituteId={instituteId}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
    </aside>
  );
}

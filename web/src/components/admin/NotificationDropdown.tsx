'use client';

import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  Star, 
  Building2, 
  ShieldAlert, 
  ArrowRight,
  Clock
} from 'lucide-react';
import Link from 'next/link';

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface Notification {
  id: string;
  type: 'INSTITUTE' | 'CONTACT' | 'REVIEW' | 'CLAIM';
  title: string;
  message: string;
  createdAt: string;
  link: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  totalCount: number;
  onClose: () => void;
}

export function NotificationDropdown({ notifications, totalCount, onClose }: NotificationDropdownProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'INSTITUTE': return <Building2 className="h-4 w-4 text-emerald-500" />;
      case 'CONTACT': return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case 'REVIEW': return <Star className="h-4 w-4 text-amber-500" />;
      case 'CLAIM': return <ShieldAlert className="h-4 w-4 text-rose-500" />;
      default: return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const getBg = (type: Notification['type']) => {
    switch (type) {
      case 'INSTITUTE': return 'bg-emerald-50';
      case 'CONTACT': return 'bg-indigo-50';
      case 'REVIEW': return 'bg-amber-50';
      case 'CLAIM': return 'bg-rose-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
          {totalCount} New
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
              <Bell className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm text-slate-500 font-medium">All caught up!</p>
            <p className="text-xs text-slate-400 mt-1">No new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((notif) => (
              <Link 
                key={notif.id} 
                href={notif.link}
                onClick={onClose}
                className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors group"
              >
                <div className={`mt-0.5 h-8 w-8 rounded-lg ${getBg(notif.type)} flex items-center justify-center shrink-0`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(new Date(notif.createdAt))}
                  </div>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-2 border-top border-slate-100 bg-slate-50/30">
          <Link 
            href="/admin"
            className="flex items-center justify-center w-full py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            onClick={onClose}
          >
            Go to dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

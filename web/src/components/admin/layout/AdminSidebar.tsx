import Link from 'next/link';
import { 
  LayoutDashboard, Building2, Users, BookOpen, MapPin, 
  Mail, Shield, Star, BarChart3, Settings, ScrollText,
  UserCog, X, FileWarning, ChevronRight
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
};

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Institutes', href: '/admin/institutes', icon: <Building2 className="h-4 w-4" />,
        children: [
          { label: 'All Institutes', href: '/admin/institutes' },
          { label: 'Pending Review', href: '/admin/institutes?status=PENDING' },
          { label: 'Rejected', href: '/admin/institutes?status=REJECTED' },
          { label: 'Suspended', href: '/admin/institutes?status=SUSPENDED' },
          { label: 'Duplicates', href: '/admin/institutes/duplicates' },
        ],
      },
      {
        label: 'Owners', href: '/admin/owners', icon: <UserCog className="h-4 w-4" />,
        children: [
          { label: 'All Owners', href: '/admin/owners' },
          { label: 'Ownership Claims', href: '/admin/owners/claims' },
        ],
      },
      { label: 'Users', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Services', href: '/admin/services', icon: <BookOpen className="h-4 w-4" /> },
      { label: 'Locations', href: '/admin/locations', icon: <MapPin className="h-4 w-4" /> },
      { label: 'Moderation', href: '/admin/moderation', icon: <FileWarning className="h-4 w-4" /> },
      { label: 'Featured', href: '/admin/featured', icon: <Star className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Contact Requests', href: '/admin/contact-requests', icon: <Mail className="h-4 w-4" /> },
      { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: <Settings className="h-4 w-4" /> },
      { label: 'Admin Users', href: '/admin/admins', icon: <Shield className="h-4 w-4" /> },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: <ScrollText className="h-4 w-4" /> },
    ],
  },
];

export function AdminSidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-800">
        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-base text-white tracking-tight">EduTrack Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2 px-2">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/') || currentPath.startsWith(item.href + '?');
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.children && (
                        <ChevronRight className={`h-3 w-3 ml-auto transition-transform ${isActive ? 'rotate-90' : ''}`} />
                      )}
                    </Link>
                    {/* Sub-items visible when parent is active */}
                    {item.children && isActive && (
                      <div className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-700 pl-2.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                              currentPath === child.href
                                ? 'text-indigo-400'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <div className="h-7 w-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">Admin User</p>
            <p className="text-[10px] text-slate-500">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

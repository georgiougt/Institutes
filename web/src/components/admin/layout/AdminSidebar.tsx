import { AdminNav } from './AdminNav';

function SidebarBrand() {
  return (
    <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-800 shrink-0">
      <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
        <span className="text-red-600 font-extrabold text-3xl leading-none">*</span>
      </div>
      <span className="font-bold text-base text-white tracking-tight">ToFrontistirio Admin</span>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="p-3 border-t border-slate-800 shrink-0">
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
  );
}

export function AdminSidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 min-h-screen flex-col border-r border-slate-800">
      <SidebarBrand />
      <AdminNav currentPath={currentPath} />
      <SidebarFooter />
    </aside>
  );
}

export { SidebarBrand as AdminSidebarBrand, SidebarFooter as AdminSidebarFooter };

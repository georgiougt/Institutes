import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminMobileNav } from '@/components/admin/layout/AdminMobileNav';
import { headers } from 'next/headers';
import { Toaster } from 'sonner';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current path for sidebar active state
  const headersList = await headers();
  const currentPath = headersList.get('x-pathname') || '/admin';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar currentPath={currentPath} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminMobileNav currentPath={currentPath} />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

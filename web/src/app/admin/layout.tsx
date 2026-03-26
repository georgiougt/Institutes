import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
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
    <div className="flex min-h-screen bg-slate-50 flex-row">
      <AdminSidebar currentPath={currentPath} />
      <main className="flex-1 min-w-0">
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

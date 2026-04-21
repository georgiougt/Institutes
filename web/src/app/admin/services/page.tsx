export const dynamic = 'force-dynamic';

import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { BookOpen, Plus } from 'lucide-react';
import { ServicesTable } from '@/components/admin/ServicesTable';

import { AddServiceButton } from '@/components/admin/AddServiceButton';
import { adminFetch } from '@/lib/admin-fetch';

async function fetchServices() {
  try {
    const res = await adminFetch('/admin/services', { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <>
      <AdminTopbar title="Services" subtitle={`${services.length} services configured`} />
      <div className="p-6 max-w-[1000px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Manage the service taxonomy. Reorder, activate/deactivate, or add new services.</p>
          <AddServiceButton />
        </div>

        {/* Services list */}
        {services.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-16">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                <BookOpen className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No services yet</p>
            </div>
          </div>
        ) : (
          <ServicesTable initialServices={services} />
        )}
      </div>
    </>
  );
}

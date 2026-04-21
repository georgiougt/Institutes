import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Mail } from 'lucide-react';
import Link from 'next/link';

import { adminFetch } from '@/lib/admin-fetch';
import { ContactRequestsTable } from '@/components/admin/ContactRequestsTable';

async function fetchContactRequests(params: URLSearchParams) {
  try {
    const res = await adminFetch(`/admin/contact-requests?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 25, pages: 0 } };
  }
}

export default async function ContactRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();
  if (resolvedParams.status) params.set('status', resolvedParams.status);
  if (resolvedParams.page) params.set('page', resolvedParams.page);
  params.set('limit', '25');

  const { data: requests, meta } = await fetchContactRequests(params);

  return (
    <>
      <AdminTopbar title="Contact Requests" subtitle={`${meta.total} total requests`} />
      <div className="p-6 max-w-[1400px] mx-auto space-y-4">
        {/* Filter */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4">
          <div className="flex gap-1.5">
            {['', 'NEW', 'READ', 'RESOLVED', 'SPAM'].map(s => (
              <Link key={s} href={`/admin/contact-requests${s ? `?status=${s}` : ''}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  (resolvedParams.status || '') === s ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}>{s || 'All'}</Link>
            ))}
          </div>
        </div>

        {/* Table */}
        <ContactRequestsTable initialRequests={requests} />
      </div>
    </>
  );
}

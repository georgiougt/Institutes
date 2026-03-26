import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Mail } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchContactRequests(params: URLSearchParams) {
  try {
    const res = await fetch(`${API}/admin/contact-requests?${params.toString()}`, { cache: 'no-store' });
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
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left font-semibold text-slate-600 px-5 py-3 text-xs uppercase tracking-wider">Date</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">From</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Institute</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider hidden md:table-cell">Message</th>
                <th className="text-center font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                        <Mail className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">No contact requests</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((req: any) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-slate-700">{req.user?.firstName || req.guestName || 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{req.user?.email || req.guestEmail || ''}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{req.institute?.name || '—'}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500 max-w-xs truncate">{req.message}</td>
                    <td className="px-4 py-3.5 text-center"><StatusBadge status={req.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

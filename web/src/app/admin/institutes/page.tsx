import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Building2, Search } from 'lucide-react';
import Link from 'next/link';
import { InstitutesTable } from '@/components/admin/InstitutesTable';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchInstitutes(params: URLSearchParams) {
  try {
    const res = await fetch(`${API}/admin/institutes?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 25, pages: 0 } };
  }
}

export default async function InstitutesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; search?: string; sortBy?: string; sortOrder?: string }>;
}) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();
  if (resolvedParams.status) params.set('status', resolvedParams.status);
  if (resolvedParams.page) params.set('page', resolvedParams.page);
  if (resolvedParams.search) params.set('search', resolvedParams.search);
  if (resolvedParams.sortBy) params.set('sortBy', resolvedParams.sortBy);
  if (resolvedParams.sortOrder) params.set('sortOrder', resolvedParams.sortOrder);
  params.set('limit', '25');

  const { data: institutes, meta } = await fetchInstitutes(params);

  const statusFilter = resolvedParams.status || '';
  const currentPage = meta.page;

  return (
    <>
      <AdminTopbar
        title="Institutes"
        subtitle={`${meta.total} total · Page ${meta.page} of ${meta.pages || 1}`}
      />

      <div className="p-6 max-w-[1400px] mx-auto space-y-4">

        {/* ── Filter Bar ────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <form>
                <input
                  name="search"
                  type="text"
                  defaultValue={resolvedParams.search || ''}
                  placeholder="Search by name, owner email..."
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </form>
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'ARCHIVED'].map((s) => (
                <Link
                  key={s}
                  href={`/admin/institutes${s ? `?status=${s}` : ''}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    statusFilter === s
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {s || 'All'}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Data Table ────────────────────────────────────────── */}
        <InstitutesTable institutes={institutes} />

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-white rounded-xl border border-slate-200/60 shadow-sm mt-4">
            <p className="text-xs text-slate-400">
              Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
            </p>
            <div className="flex gap-1">
              {currentPage > 1 && (
                <Link
                  href={`/admin/institutes?page=${currentPage - 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Previous
                </Link>
              )}
              {currentPage < meta.pages && (
                <Link
                  href={`/admin/institutes?page=${currentPage + 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

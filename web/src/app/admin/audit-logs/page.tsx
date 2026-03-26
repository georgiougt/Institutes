import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { ScrollText } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchAuditLogs(params: URLSearchParams) {
  try {
    const res = await fetch(`${API}/admin/audit-logs?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 25, pages: 0 } };
  }
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; actionType?: string; entityType?: string }>;
}) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();
  if (resolvedParams.page) params.set('page', resolvedParams.page);
  if (resolvedParams.actionType) params.set('actionType', resolvedParams.actionType);
  if (resolvedParams.entityType) params.set('entityType', resolvedParams.entityType);
  params.set('limit', '50');

  const { data: logs, meta } = await fetchAuditLogs(params);

  return (
    <>
      <AdminTopbar title="Audit Logs" subtitle={`${meta.total} total entries`} />
      <div className="p-6 max-w-[1400px] mx-auto space-y-4">
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left font-semibold text-slate-600 px-5 py-3 text-xs uppercase tracking-wider">Timestamp</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Actor</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Action</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider hidden md:table-cell">Entity</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                        <ScrollText className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">No audit logs yet</p>
                      <p className="text-xs text-slate-400 mt-1">Admin actions will be recorded here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 text-xs text-slate-500 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700 font-medium">
                        {log.actor?.firstName || 'System'} {log.actor?.lastName || ''}
                      </p>
                      <p className="text-xs text-slate-400">{log.actorRole || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-700 font-mono">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">
                      {log.entityType && (
                        <>
                          {log.entityType}
                          {log.entityId && <span className="text-slate-400 ml-1">#{log.entityId.substring(0, 8)}</span>}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500 max-w-xs truncate">
                      {log.reason || '—'}
                    </td>
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

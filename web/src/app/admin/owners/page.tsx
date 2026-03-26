import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { UsersTable } from '@/components/admin/UsersTable';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchOwners(params: URLSearchParams) {
  try {
    params.set('role', 'OWNER');
    const res = await fetch(`${API}/admin/users?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 25, pages: 0 } };
  }
}

export default async function OwnersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();
  if (resolvedParams.page) params.set('page', resolvedParams.page);
  if (resolvedParams.search) params.set('search', resolvedParams.search);
  params.set('limit', '25');

  const { data: owners, meta } = await fetchOwners(params);

  return (
    <>
      <AdminTopbar title="Owners" subtitle={`${meta.total} registered institute owners`} />
      <div className="p-6 max-w-[1400px] mx-auto space-y-4">
        <UsersTable initialUsers={owners} />
      </div>
    </>
  );
}

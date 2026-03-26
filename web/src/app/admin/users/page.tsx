import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { UsersTable } from '@/components/admin/UsersTable';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchUsers(params: URLSearchParams) {
  try {
    const res = await fetch(`${API}/admin/users?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 25, pages: 0 } };
  }
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; page?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams();
  if (resolvedParams.role) params.set('role', resolvedParams.role);
  if (resolvedParams.page) params.set('page', resolvedParams.page);
  if (resolvedParams.search) params.set('search', resolvedParams.search);
  params.set('limit', '25');

  const { data: users, meta } = await fetchUsers(params);

  return (
    <>
      <AdminTopbar title="Users" subtitle={`${meta.total} total users`} />
      <div className="p-6 max-w-[1400px] mx-auto space-y-4">
        <UsersTable initialUsers={users} />
      </div>
    </>
  );
}

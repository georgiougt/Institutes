import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { UsersTable } from '@/components/admin/UsersTable';

import { adminFetch } from '@/lib/admin-fetch';

async function fetchUsers(params: URLSearchParams) {
  try {
    const res = await adminFetch(`/admin/users?${params.toString()}`, { cache: 'no-store' });
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

  const { data: usersData, meta } = await fetchUsers(params);
  
  // Format dates on the server to prevent hydration mismatch
  const users = usersData.map((u: any) => ({
    ...u,
    displayDate: new Date(u.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }));

  return (
    <>
      <AdminTopbar title="Users" subtitle={`${meta.total} total users`} />
      <div className="p-6 max-w-[1400px] mx-auto space-y-4">
        <UsersTable initialUsers={users} />
      </div>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import { User, Shield, ShieldAlert, MoreHorizontal, UserCheck, UserX, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  adminRole?: string | null;
  isActive: boolean;
  createdAt: string;
}

interface UsersTableProps {
  initialUsers: any[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/users/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error();
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">User</th>
            <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Role</th>
            <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Joined</th>
            <th className="text-center font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Status</th>
            <th className="text-right font-semibold text-slate-600 px-5 py-3 text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs border border-slate-200">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1.5">
                  {(user.adminRole === 'SUPER_ADMIN' || user.role === 'ADMIN') ? (
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                  ) : user.role === 'OWNER' ? (
                    <Shield className="h-3.5 w-3.5 text-indigo-500" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    (user.adminRole === 'SUPER_ADMIN' || user.role === 'ADMIN') 
                      ? 'bg-rose-50 text-rose-600' 
                      : user.role === 'OWNER' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {(user.adminRole || user.role || 'USER').replace('_', ' ')}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-slate-500 text-xs">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-4 text-center">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  user.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2 text-slate-400">
                  <button 
                    onClick={() => toggleStatus(user.id, user.isActive)}
                    className={`p-1.5 rounded-md transition-colors ${user.isActive ? 'hover:text-rose-600 hover:bg-rose-50' : 'hover:text-emerald-600 hover:bg-emerald-50'}`}
                    title={user.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </button>
                  <button className="p-1.5 rounded-md hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-md hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

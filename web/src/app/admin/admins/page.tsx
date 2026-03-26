import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { Shield, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminUsersPage() {
  return (
    <>
      <AdminTopbar title="Admin Users" subtitle="Manage administrator accounts and roles" />
      <div className="p-6 max-w-[1000px] mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Configure admin access and role assignments.</p>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4" /> Add Admin
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left font-semibold text-slate-600 px-5 py-3 text-xs uppercase tracking-wider">Name</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Email</th>
                <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Role</th>
                <th className="text-right font-semibold text-slate-600 px-5 py-3 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td colSpan={4} className="text-center py-16">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                      <Shield className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">Admin management will be available after database sync</p>
                    <p className="text-xs text-slate-400 mt-1">Assign Super Admin, Ops Admin, Support Admin, or Content Mod roles</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Role descriptions */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Available Roles</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { role: 'Super Admin', desc: 'Full access to all features, settings, and admin management' },
              { role: 'Ops Admin', desc: 'Manage institutes, owners, claims, services, and locations' },
              { role: 'Support Admin', desc: 'View-only access to institutes, users, contact requests, and analytics' },
              { role: 'Content Mod', desc: 'Moderate descriptions, images, and content quality' },
            ].map(r => (
              <div key={r.role} className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-800">{r.role}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

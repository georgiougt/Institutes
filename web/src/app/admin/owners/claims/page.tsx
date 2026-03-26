import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { ShieldCheck } from 'lucide-react';

export default function OwnershipClaimsPage() {
  return (
    <>
      <AdminTopbar title="Ownership Claims" subtitle="Manage institute verification and claims" />
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-6 w-6 text-indigo-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Ownership Claims coming soon</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            We are working on the verification workflow. This screen will allow you to review and approve institutional ownership claims.
          </p>
        </div>
      </div>
    </>
  );
}

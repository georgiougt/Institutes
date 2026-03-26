import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { FileWarning } from 'lucide-react';

export default function ModerationPage() {
  return (
    <>
      <AdminTopbar title="Moderation" subtitle="Content review and flagging queue" />
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <FileWarning className="h-6 w-6 text-amber-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Moderation Queue coming soon</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            This module will handle flagged content, reviews, and community reports.
          </p>
        </div>
      </div>
    </>
  );
}

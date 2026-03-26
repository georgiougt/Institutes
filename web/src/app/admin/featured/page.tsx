import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { Star } from 'lucide-react';

export default function FeaturedPage() {
  return (
    <>
      <AdminTopbar title="Featured" subtitle="Manage promoted institutes and placements" />
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-yellow-50 flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Featured Placements coming soon</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Manage the list of institutes featured on the homepage and at the top of search results.
          </p>
        </div>
      </div>
    </>
  );
}

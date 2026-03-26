import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <>
      <AdminTopbar title="Analytics" subtitle="Platform metrics and insights" />
      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        {/* Time filter */}
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', 'All'].map(period => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                period === '30d'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Charts placeholder grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            'New Institutes Over Time',
            'Approval vs Rejection Rate',
            'Top Services by Institute Count',
            'Top Cities by Institute Count',
            'Contact Requests Volume',
            'Most Contacted Institutes',
          ].map(title => (
            <div key={title} className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">{title}</h3>
              <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Chart data loading...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

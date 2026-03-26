import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { MapPin, Plus } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchCities() {
  try {
    const res = await fetch(`${API}/admin/cities`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchAreas() {
  try {
    const res = await fetch(`${API}/admin/areas`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

export default async function LocationsPage() {
  const [cities, areas] = await Promise.all([fetchCities(), fetchAreas()]);

  return (
    <>
      <AdminTopbar title="Locations" subtitle={`${cities.length} cities · ${areas.length} areas`} />
      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cities */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">Cities</h2>
              <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {cities.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-400">No cities configured</p>
                </div>
              ) : (
                cities.map((city: any) => (
                  <div key={city.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{city.name}</p>
                      {city.nameEn && <p className="text-xs text-slate-400">{city.nameEn}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{city._count?.branches || 0} branches</span>
                      <span className="text-xs text-slate-400">{city._count?.areas || 0} areas</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Areas */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">Areas</h2>
              <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
              {areas.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-400">No areas configured</p>
                </div>
              ) : (
                areas.map((area: any) => (
                  <div key={area.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{area.name}</p>
                      <p className="text-xs text-slate-400">{area.city?.name}</p>
                    </div>
                    <span className="text-xs text-slate-400">{area._count?.branches || 0} branches</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

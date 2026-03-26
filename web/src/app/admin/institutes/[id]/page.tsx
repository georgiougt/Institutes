import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Building2, MapPin, Phone, Mail, Clock, User, BookOpen, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { InstituteActions } from '@/components/admin/InstituteActions';
import { InlineEdit } from '@/components/admin/InlineEdit';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchInstitute(id: string) {
  try {
    const res = await fetch(`${API}/admin/institutes/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return null;
  }
}

async function updateInstitute(id: string, data: any) {
  const res = await fetch(`${API}/admin/institutes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

function computeCompleteness(inst: any): number {
  let score = 0;
  if (inst.name) score += 10;
  if (inst.description?.length > 50) score += 15;
  if (inst.services?.length > 0) score += 15;
  const main = inst.branches?.find((b: any) => b.isMain) || inst.branches?.[0];
  if (main?.phone) score += 10;
  if (main?.email) score += 5;
  if (main?.address) score += 10;
  if (main?.latitude && main?.longitude) score += 10;
  if (inst.branches?.some((b: any) => b.schedules?.length > 0)) score += 10;
  if (inst.images?.length > 0) score += 10;
  if (inst.owner) score += 5;
  return score;
}

export default async function InstituteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inst = await fetchInstitute(id);

  if (!inst) {
    return (
      <>
        <AdminTopbar title="Institute Not Found" />
        <div className="p-6 text-center py-20">
          <p className="text-sm text-slate-500">This institute could not be found.</p>
          <Link href="/admin/institutes" className="text-sm text-indigo-600 mt-2 inline-block">← Back to list</Link>
        </div>
      </>
    );
  }

  const completeness = computeCompleteness(inst);
  const main = inst.branches?.find((b: any) => b.isMain) || inst.branches?.[0];

  return (
    <>
      <AdminTopbar title={inst.name} subtitle={`Institute detail · ID: ${inst.id.substring(0, 8)}...`} />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 max-w-md">
                  <InlineEdit 
                    value={inst.name} 
                    onSave={async (val) => {
                      'use server';
                      await updateInstitute(id, { name: val });
                    }} 
                  />
                </div>
                <StatusBadge status={inst.status} />
                {inst.isFlagged && <StatusBadge status="FLAGGED" />}
              </div>
              
              <div className="mt-2">
                <InlineEdit 
                  value={inst.description || ''} 
                  multiline 
                  onSave={async (val) => {
                    'use server';
                    await updateInstitute(id, { description: val });
                  }} 
                />
              </div>

              {/* Completeness bar */}
              <div className="mt-4 max-w-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Profile completeness</span>
                  <span className={`font-semibold ${completeness >= 70 ? 'text-emerald-600' : completeness >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {completeness}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${completeness >= 70 ? 'bg-emerald-500' : completeness >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 items-center">
              <InstituteActions 
                instituteId={inst.id} 
                instituteName={inst.name} 
                status={inst.status} 
              />
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <Link
                href={`/institutes/${id}`}
                target="_blank"
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Preview →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Details Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column — Institute Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Branches */}
            <Section title="Branches" icon={MapPin} count={inst.branches?.length}>
              {inst.branches?.map((branch: any) => (
                <div key={branch.id} className="p-4 border border-slate-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-800">{branch.name}</p>
                    {branch.isMain && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Main</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {branch.address}</div>
                    <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {branch.phone}</div>
                    {branch.email && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {branch.email}</div>}
                    <div className="flex items-center gap-1.5">📍 {branch.city?.name || '—'}</div>
                    <div className="flex items-center gap-1.5">
                      🗺️ {branch.latitude?.toFixed(4)}, {branch.longitude?.toFixed(4)}
                      {(!branch.latitude || !branch.longitude) && <span className="text-amber-500 font-medium">Missing!</span>}
                    </div>
                  </div>
                </div>
              ))}
            </Section>

            {/* Services */}
            <Section title="Services" icon={BookOpen} count={inst.services?.length}>
              <div className="flex flex-wrap gap-2">
                {inst.services?.map((is: any) => (
                  <span key={is.id} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                    {is.service?.name}
                    {is.isOnline && <span className="ml-1 text-indigo-500">🌐</span>}
                  </span>
                ))}
                {(!inst.services || inst.services.length === 0) && (
                  <p className="text-xs text-slate-400">No services linked</p>
                )}
              </div>
            </Section>

            {/* Images */}
            <Section title="Images" icon={ImageIcon} count={inst.images?.length}>
              {inst.images?.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {inst.images.map((img: any) => (
                    <div key={img.id} className="aspect-video rounded-lg bg-slate-100 overflow-hidden">
                      <img src={img.url} alt={img.caption || 'Institute image'} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No images uploaded</p>
              )}
            </Section>

            {/* Contact Requests */}
            <Section title="Recent Contact Requests" icon={Mail} count={inst._count?.contactRequests}>
              {inst.contactRequests?.length > 0 ? (
                <div className="space-y-2">
                  {inst.contactRequests.map((cr: any) => (
                    <div key={cr.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm text-slate-700">{cr.user?.firstName || cr.guestName || 'Unknown'}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{cr.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={cr.status} />
                        <span className="text-xs text-slate-400">{new Date(cr.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No contact requests yet</p>
              )}
            </Section>
          </div>

          {/* Right Column — Owner & Meta */}
          <div className="space-y-6">

            {/* Owner */}
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Owner
              </h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-slate-400 text-xs">Name</span><p className="text-slate-800 font-medium">{inst.owner?.firstName} {inst.owner?.lastName}</p></div>
                <div><span className="text-slate-400 text-xs">Email</span><p className="text-slate-800">{inst.owner?.email}</p></div>
                {inst.owner?.phone && <div><span className="text-slate-400 text-xs">Phone</span><p className="text-slate-800">{inst.owner?.phone}</p></div>}
                <div><span className="text-slate-400 text-xs">Joined</span><p className="text-slate-800">{new Date(inst.owner?.createdAt).toLocaleDateString()}</p></div>
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Status History
              </h3>
              {inst.statusHistory?.length > 0 ? (
                <div className="space-y-3">
                  {inst.statusHistory.map((sh: any) => (
                    <div key={sh.id} className="flex items-start gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={sh.fromStatus} />
                          <span className="text-xs text-slate-400">→</span>
                          <StatusBadge status={sh.toStatus} />
                        </div>
                        {sh.reason && <p className="text-xs text-slate-500 mt-1">{sh.reason}</p>}
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(sh.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No status changes yet</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Branches', value: inst._count?.branches || 0 },
                  { label: 'Services', value: inst._count?.services || 0 },
                  { label: 'Images', value: inst._count?.images || 0 },
                  { label: 'Inquiries', value: inst._count?.contactRequests || 0 },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Section wrapper ────────────────────────────────────────

function Section({ title, icon: Icon, count, children }: {
  title: string;
  icon: React.ElementType;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" /> {title}
        {count !== undefined && (
          <span className="ml-auto text-[10px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-medium">{count}</span>
        )}
      </h3>
      {children}
    </div>
  );
}

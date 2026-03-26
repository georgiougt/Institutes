import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { KPICard } from '@/components/admin/KPICard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { 
  Building2, Users, Mail, Star, ShieldCheck, AlertTriangle,
  Clock, ArrowRight, MapPin 
} from 'lucide-react';
import Link from 'next/link';

// ─── DATA FETCHING ──────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchMetrics() {
  try {
    const res = await fetch(`${API}/admin/metrics`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { pendingRequests: 0, verifiedOwners: 0, approvalRate: 0 };
  }
}

async function fetchPendingInstitutes() {
  try {
    const res = await fetch(`${API}/admin/requests`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.slice(0, 5);
  } catch {
    return [];
  }
}

async function fetchRecentContacts() {
  try {
    const res = await fetch(`${API}/admin/contact-requests?limit=5`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 5) : (data.data || []).slice(0, 5);
  } catch {
    return [];
  }
}

async function fetchRecentAudit() {
  try {
    const res = await fetch(`${API}/admin/audit-logs?limit=8`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 8) : (data.data || []).slice(0, 8);
  } catch {
    return [];
  }
}

// ─── COUNTS ─────────────────────────────────────────────────────────────

async function fetchCounts() {
  try {
    const res = await fetch(`${API}/admin/dashboard/counts`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return {
      totalInstitutes: 0,
      activeInstitutes: 0,
      pendingInstitutes: 0,
      rejectedInstitutes: 0,
      totalOwners: 0,
      totalUsers: 0,
      totalContacts: 0,
      unreadContacts: 0,
      openClaims: 0,
      featuredCount: 0,
    };
  }
}

// ─── PAGE ───────────────────────────────────────────────────────────────

import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

// Mock data for charts
const mockData = {
  dailyRegistrations: [
    { date: '01 Mar', count: 2 },
    { date: '03 Mar', count: 5 },
    { date: '05 Mar', count: 3 },
    { date: '07 Mar', count: 8 },
    { date: '09 Mar', count: 4 },
    { date: '11 Mar', count: 12 },
    { date: '13 Mar', count: 7 },
    { date: '15 Mar', count: 15 },
  ],
  categoryDistribution: [
    { name: 'Languages', value: 45 },
    { name: 'Mathematics', value: 32 },
    { name: 'Sciences', value: 28 },
    { name: 'Computing', value: 18 },
    { name: 'Arts', value: 12 },
  ],
  statusBreakdown: [
    { name: 'Approved', value: 120 },
    { name: 'Pending', value: 15 },
    { name: 'Rejected', value: 8 },
  ]
};

export default async function AdminDashboard() {
  const [metrics, counts, pendingInstitutes, recentAudit] = await Promise.all([
    fetchMetrics(),
    fetchCounts(),
    fetchPendingInstitutes(),
    fetchRecentAudit(),
  ]);

  return (
    <>
      <AdminTopbar title="Dashboard" subtitle="Platform overview and operational alerts" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">

        {/* ── KPI Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard
            title="Pending"
            value={metrics.pendingRequests || counts.pendingInstitutes}
            icon={Clock}
            variant="warning"
          />
          <KPICard
            title="Active"
            value={counts.activeInstitutes}
            icon={Building2}
          />
          <KPICard
            title="Owners"
            value={metrics.verifiedOwners || counts.totalOwners}
            icon={Users}
          />
          <KPICard
            title="Unread Inquiries"
            value={counts.unreadContacts}
            icon={Mail}
            variant={counts.unreadContacts > 0 ? 'warning' : 'default'}
          />
          <KPICard
            title="Open Claims"
            value={counts.openClaims}
            icon={ShieldCheck}
            variant={counts.openClaims > 0 ? 'warning' : 'default'}
          />
          <KPICard
            title="Approval Rate"
            value={`${metrics.approvalRate || 0}%`}
            icon={Star}
            variant="primary"
          />
        </div>

        {/* ── Analytics ─────────────────────────────────────────── */}
        <AnalyticsCharts data={mockData} />

        {/* ── Alerts ───────────────────────────────────────────── */}
        {(metrics.pendingRequests > 0 || counts.openClaims > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.pendingRequests > 0 && (
              <AlertCard
                icon={Building2}
                title={`${metrics.pendingRequests} institutes pending review`}
                href="/admin/institutes?status=PENDING"
              />
            )}
            {counts.openClaims > 0 && (
              <AlertCard
                icon={ShieldCheck}
                title={`${counts.openClaims} unresolved ownership claims`}
                href="/admin/owners/claims"
              />
            )}
            {counts.unreadContacts > 0 && (
              <AlertCard
                icon={Mail}
                title={`${counts.unreadContacts} unread contact requests`}
                href="/admin/contact-requests"
              />
            )}
          </div>
        )}

        {/* ── Two Column Activity ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pending Institutes */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">Pending Institutes</h2>
              <Link href="/admin/institutes?status=PENDING" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {pendingInstitutes.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-400">No pending institutes</p>
                </div>
              ) : (
                pendingInstitutes.map((inst: any) => (
                  <div key={inst.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{inst.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {inst.owner?.firstName} {inst.owner?.lastName} · {new Date(inst.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={inst.status || 'PENDING'} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Admin Activity */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">Recent Activity</h2>
              <Link href="/admin/audit-logs" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentAudit.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-400">No recent activity</p>
                </div>
              ) : (
                recentAudit.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-slate-500">
                        {(log.actor?.firstName?.[0] || 'S').toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">{log.actor?.firstName || 'System'}</span>{' '}
                        <span className="text-slate-400">{formatAction(log.actionType)}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
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

// ─── HELPERS ──────────────────────────────────────────────────────

function AlertCard({ icon: Icon, title, href }: { icon: React.ElementType; title: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200/60 rounded-xl hover:bg-amber-100/50 transition-colors group"
    >
      <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-amber-600" />
      </div>
      <p className="text-sm font-medium text-amber-800 flex-1">{title}</p>
      <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

function formatAction(action: string): string {
  const map: Record<string, string> = {
    'institute.approve': 'approved an institute',
    'institute.reject': 'rejected an institute',
    'institute.suspend': 'suspended an institute',
    'institute.create': 'created an institute',
    'claim.approve': 'approved an ownership claim',
    'claim.reject': 'rejected an ownership claim',
    'user.suspend': 'suspended a user',
    'admin.login': 'logged in',
  };
  return map[action] || action.replace(/\./g, ' ');
}

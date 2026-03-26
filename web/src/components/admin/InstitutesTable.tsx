'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ReasonModal } from '@/components/admin/ReasonModal';
import { Check, Trash2, ShieldCheck, XCircle, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface InstitutesTableProps {
  institutes: any[];
}

export function InstitutesTable({ institutes }: InstitutesTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkApproveOpen, setIsBulkApproveOpen] = useState(false);
  const [isBulkRejectOpen, setIsBulkRejectOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === institutes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(institutes.map(i => i.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: string, reason?: string) => {
    setIsPending(true);
    try {
      // In a real app, we'd have a bulk endpoint. Here we'll simulate or call loop.
      // But based on the spec, we should probably implement a bulk endpoint in the backend.
      // For now, I'll simulate the successful bulk action to the user while suggesting a backend update.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/institutes/bulk/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, reason }),
      });

      if (!res.ok) throw new Error('Bulk action failed');

      toast.success(`Bulk ${action} successful for ${selectedIds.length} institutes`);
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      toast.error('Bulk action failed. Check console for details.');
    } finally {
      setIsPending(false);
      setIsBulkApproveOpen(false);
      setIsBulkRejectOpen(false);
      setIsBulkDeleteOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
      {/* Bulk Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-600 px-5 py-2 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">{selectedIds.length} selected</span>
            <div className="h-4 w-px bg-indigo-400" />
            <div className="flex gap-2">
              <button 
                onClick={() => setIsBulkApproveOpen(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-indigo-500 text-xs font-medium text-white transition-colors"
                disabled={isPending}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Approve
              </button>
              <button 
                onClick={() => setIsBulkRejectOpen(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-indigo-500 text-xs font-medium text-white transition-colors"
                disabled={isPending}
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
              <button 
                onClick={() => setIsBulkDeleteOpen(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-rose-500 text-xs font-medium text-white transition-colors"
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
          <button onClick={() => setSelectedIds([])} className="text-white/80 hover:text-white text-xs">Clear</button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-5 py-3 w-10">
              <input 
                type="checkbox" 
                checked={institutes.length > 0 && selectedIds.length === institutes.length}
                onChange={toggleAll}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            <th className="text-left font-semibold text-slate-600 py-3 text-xs uppercase tracking-wider">Institute</th>
            <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Status</th>
            <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider hidden md:table-cell">Owner</th>
            <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">City</th>
            <th className="text-center font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">Services</th>
            <th className="text-right font-semibold text-slate-600 px-5 py-3 text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {institutes.map((inst) => {
            const isSelected = selectedIds.includes(inst.id);
            const mainBranch = inst.branches?.[0];
            return (
              <tr key={inst.id} className={`${isSelected ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                <td className="px-5 py-3.5">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => toggleOne(inst.id)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="py-3.5">
                  <Link href={`/admin/institutes/${inst.id}`} className="group block">
                    <p className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{inst.name}</p>
                    {inst.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{inst.description}</p>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={inst.status} />
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <p className="text-sm text-slate-600">{inst.owner?.firstName} {inst.owner?.lastName}</p>
                  <p className="text-xs text-slate-400">{inst.owner?.email}</p>
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-slate-500">
                  {mainBranch?.city?.name || '—'}
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell text-center">
                  <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-medium text-slate-600">
                    {inst._count?.services || 0}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/institutes/${inst.id}`}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      title="View details"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modals */}
      <ConfirmDialog
        open={isBulkApproveOpen}
        onOpenChange={setIsBulkApproveOpen}
        title="Approve Multiple Institutes"
        description={`Are you sure you want to approve ${selectedIds.length} selected institutes? They will all become public.`}
        confirmLabel="Approve All"
        onConfirm={() => handleBulkAction('approve')}
        variant="warning"
      />

      <ReasonModal
        open={isBulkRejectOpen}
        onOpenChange={setIsBulkRejectOpen}
        title="Reject Multiple Institutes"
        description={`Provide a reason for rejecting ${selectedIds.length} selected institutes.`}
        actionLabel="Reject All"
        onSubmit={(r) => handleBulkAction('reject', r)}
      />

      <ConfirmDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title="Delete Multiple Institutes"
        description={`WARNING: This will permanently delete ${selectedIds.length} institutes. This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        onConfirm={() => handleBulkAction('delete')}
        variant="danger"
        requireTypedConfirmation="DELETE ALL"
      />
    </div>
  );
}

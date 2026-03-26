'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ReasonModal } from '@/components/admin/ReasonModal';
import { toast } from 'sonner';

interface InstituteActionsProps {
  instituteId: string;
  instituteName: string;
  status: string;
}

export function InstituteActions({ instituteId, instituteName, status }: InstituteActionsProps) {
  const router = useRouter();
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleApprove = async () => {
    setIsPending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/institutes/${instituteId}/approve`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to approve');
      toast.success('Institute approved');
      router.refresh();
      setIsApproveOpen(false);
    } catch (err) {
      toast.error('Error approving institute');
    } finally {
      setIsPending(false);
    }
  };

  const handleReject = async (reason: string) => {
    setIsPending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/institutes/${instituteId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      toast.success('Institute rejected');
      router.refresh();
      setIsRejectOpen(false);
    } catch (err) {
      toast.error('Error rejecting institute');
    } finally {
      setIsPending(false);
    }
  };

  const handleSuspend = async (reason: string) => {
    setIsPending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/institutes/${instituteId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to suspend');
      toast.success('Institute suspended');
      router.refresh();
      setIsSuspendOpen(false);
    } catch (err) {
      toast.error('Error suspending institute');
    } finally {
      setIsPending(false);
    }
  };

  const handleArchive = async () => {
    setIsPending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/institutes/${instituteId}/archive`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to archive');
      toast.success('Institute archived');
      router.refresh();
      setIsArchiveOpen(false);
    } catch (err) {
      toast.error('Error archiving institute');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status === 'PENDING' && (
        <>
          <button
            onClick={() => setIsApproveOpen(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            disabled={isPending}
          >
            Approve
          </button>
          <button
            onClick={() => setIsRejectOpen(true)}
            className="px-4 py-2 rounded-lg bg-white border border-rose-200 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50"
            disabled={isPending}
          >
            Reject
          </button>
        </>
      )}

      {status === 'APPROVED' && (
        <button
          onClick={() => setIsSuspendOpen(true)}
          className="px-4 py-2 rounded-lg bg-white border border-amber-200 text-amber-600 text-sm font-medium hover:bg-amber-50 transition-colors disabled:opacity-50"
          disabled={isPending}
        >
          Suspend
        </button>
      )}

      {status !== 'ARCHIVED' && (
        <button
          onClick={() => setIsArchiveOpen(true)}
          className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-400 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          disabled={isPending}
        >
          Archive
        </button>
      )}

      <ConfirmDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        title="Approve Institute"
        description={`Are you sure you want to approve "${instituteName}"? This will make the listing public.`}
        confirmLabel="Approve"
        onConfirm={handleApprove}
        variant="warning"
      />

      <ReasonModal
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        title="Reject Institute"
        description={`Please provide a reason for rejecting "${instituteName}". This will be shared with the owner.`}
        placeholder="e.g. Invalid license number, low quality images..."
        actionLabel="Reject Institute"
        onSubmit={handleReject}
      />

      <ReasonModal
        open={isSuspendOpen}
        onOpenChange={setIsSuspendOpen}
        title="Suspend Institute"
        description={`Please provide a reason for suspending "${instituteName}".`}
        placeholder="e.g. Repeated policy violations..."
        actionLabel="Suspend"
        onSubmit={handleSuspend}
      />

      <ConfirmDialog
        open={isArchiveOpen}
        onOpenChange={setIsArchiveOpen}
        title="Archive Institute"
        description={`Are you sure you want to archive "${instituteName}"? It will no longer appear in search results or the active management list.`}
        confirmLabel="Archive"
        onConfirm={handleArchive}
        variant="danger"
        requireTypedConfirmation={instituteName}
      />
    </div>
  );
}

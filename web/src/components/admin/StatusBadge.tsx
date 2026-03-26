type StatusType = 
  | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'ARCHIVED'
  | 'SUBMITTED' | 'UNDER_REVIEW' | 'NEEDS_MORE_INFO' | 'CANCELED'
  | 'NEW' | 'READ' | 'ASSIGNED' | 'RESOLVED' | 'SPAM'
  | 'FLAGGED' | 'ACTIVE' | 'INACTIVE';

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  // Listing
  DRAFT:       { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400' },
  PENDING:     { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-400' },
  APPROVED:    { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-400' },
  REJECTED:    { bg: 'bg-rose-50',     text: 'text-rose-700',    dot: 'bg-rose-400' },
  SUSPENDED:   { bg: 'bg-orange-50',   text: 'text-orange-700',  dot: 'bg-orange-400' },
  ARCHIVED:    { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-400' },
  // Claims
  SUBMITTED:       { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-400' },
  UNDER_REVIEW:    { bg: 'bg-violet-50',   text: 'text-violet-700',  dot: 'bg-violet-400' },
  NEEDS_MORE_INFO: { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-400' },
  CANCELED:        { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-400' },
  // Contacts
  NEW:         { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-400' },
  READ:        { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400' },
  ASSIGNED:    { bg: 'bg-indigo-50',   text: 'text-indigo-700',  dot: 'bg-indigo-400' },
  RESOLVED:    { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-400' },
  SPAM:        { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500' },
  // Generic
  FLAGGED:     { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-400' },
  ACTIVE:      { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-400' },
  INACTIVE:    { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-400' },
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
  ARCHIVED: 'Archived',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  NEEDS_MORE_INFO: 'Needs Info',
  CANCELED: 'Canceled',
  NEW: 'New',
  READ: 'Read',
  ASSIGNED: 'Assigned',
  RESOLVED: 'Resolved',
  SPAM: 'Spam',
  FLAGGED: 'Flagged',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export function StatusBadge({ status }: { status: StatusType | string }) {
  const style = statusStyles[status] || statusStyles.DRAFT;
  const label = statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}

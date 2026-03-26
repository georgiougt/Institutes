'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ReasonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actionLabel: string;
  variant?: 'danger' | 'warning' | 'default';
  minLength?: number;
  placeholder?: string;
  onSubmit: (reason: string) => void | Promise<void>;
};

export function ReasonModal({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  variant = 'danger',
  minLength = 10,
  placeholder = 'Please provide a reason...',
  onSubmit,
}: ReasonModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = reason.trim().length >= minLength;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await onSubmit(reason.trim());
      setReason('');
    } finally {
      setLoading(false);
    }
  };

  const buttonClass =
    variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700 text-white' :
    variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
    'bg-indigo-600 hover:bg-indigo-700 text-white';

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) { setReason(''); onOpenChange(v); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-slate-500">
              {description} 
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-24 px-3 py-2 rounded-md border border-slate-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            placeholder={placeholder}
            disabled={loading}
          />
          <p className={`text-xs mt-1 ${canSubmit ? 'text-slate-400' : 'text-amber-500'}`}>
            {reason.trim().length}/{minLength} characters minimum
          </p>
        </div>

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!canSubmit || loading}
            onClick={handleSubmit}
            className={buttonClass}
          >
            {loading ? 'Processing...' : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

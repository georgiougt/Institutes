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
import { AlertTriangle, Trash2 } from 'lucide-react';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
  requireTypedConfirmation?: string; // entity name to type for extra safety
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  variant = 'danger',
  requireTypedConfirmation,
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('');
  const [executing, setExecuting] = useState(false);

  const canConfirm = requireTypedConfirmation
    ? typed.trim().toLowerCase() === requireTypedConfirmation.trim().toLowerCase()
    : true;

  const handleConfirm = async () => {
    setExecuting(true);
    try {
      await onConfirm();
    } finally {
      setExecuting(false);
      setTyped('');
    }
  };

  const isLoading = loading || executing;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isLoading) { setTyped(''); onOpenChange(v); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              variant === 'danger' ? 'bg-rose-100' : 'bg-amber-100'
            }`}>
              {variant === 'danger'
                ? <Trash2 className="h-5 w-5 text-rose-600" />
                : <AlertTriangle className="h-5 w-5 text-amber-600" />
              }
            </div>
            <DialogTitle className="text-base">{title}</DialogTitle>
          </div>
          <DialogDescription className="mt-3 text-sm text-slate-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        {requireTypedConfirmation && (
          <div className="mt-2">
            <p className="text-xs text-slate-500 mb-1.5">
              Type <strong className="text-slate-700">{requireTypedConfirmation}</strong> to confirm:
            </p>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400"
              placeholder={requireTypedConfirmation}
              disabled={isLoading}
            />
          </div>
        )}

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!canConfirm || isLoading}
            onClick={handleConfirm}
            className={variant === 'danger'
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
            }
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  label?: string;
  multiline?: boolean;
}

export function InlineEdit({ value, onSave, multiline }: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
      toast.success('Updated successfully');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 w-full animate-in fade-in duration-200">
        {multiline ? (
          <textarea
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-h-[100px]"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="w-full text-sm rounded-lg border-slate-200 bg-white px-3 h-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setCurrentValue(value);
                setIsEditing(false);
              }
            }}
          />
        )}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-9 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Save
          </button>
          <button
            onClick={() => {
              setCurrentValue(value);
              setIsEditing(false);
            }}
            disabled={isSaving}
            className="h-9 w-9 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="pr-10">
        {multiline ? (
          <p className="text-sm text-slate-500 whitespace-pre-wrap">{value || 'No content'}</p>
        ) : (
          <p className="text-sm text-slate-700 font-medium">{value || 'No content'}</p>
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute right-0 top-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600"
        title="Edit"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

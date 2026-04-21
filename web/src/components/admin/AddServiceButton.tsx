'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ServiceDialog } from './ServiceDialog';

export function AddServiceButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        <Plus className="h-4 w-4" /> Add Service
      </button>

      <ServiceDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

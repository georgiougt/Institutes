'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function ContactButton() {
  return (
    <Button 
      className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-lg shadow-lg"
      onClick={() => document.getElementById('contact-card')?.scrollIntoView({ behavior: 'smooth' })}
    >
      Επικοινωνία
    </Button>
  );
}

export function SendMessageButton() {
  return (
    <Button 
      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12"
      onClick={() => alert('Η φόρμα επικοινωνίας θα είναι σύντομα διαθέσιμη.')}
    >
      Στείλτε Μήνυμα
    </Button>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { ContactFormDialog } from './ContactFormDialog';

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

interface SendMessageButtonProps {
  instituteId: string;
  instituteName: string;
  services?: any[];
}

export function SendMessageButton({ instituteId, instituteName, services }: SendMessageButtonProps) {
  return (
    <ContactFormDialog 
      instituteId={instituteId}
      instituteName={instituteName}
      services={services || []}
    />
  );
}

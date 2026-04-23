'use client';

import { Button } from '@/components/ui/button';
import { ContactFormDialog } from './ContactFormDialog';

import { toast } from 'sonner';
import { Share2 } from 'lucide-react';

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

export function ShareButton({ name }: { name: string }) {
  const handleShare = async () => {
    const shareData = {
      title: name,
      text: `Δείτε το φροντιστήριο ${name} στο ToFrontistirio`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Ο σύνδεσμος αντιγράφηκε!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <Button variant="ghost" size="sm" className="font-bold text-gray-600" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" /> Κοινοποίηση
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

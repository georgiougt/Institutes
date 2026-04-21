'use client';

import React, { useState } from 'react';
import { Mail, Send, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface MessageModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageModal({ user, isOpen, onClose }: MessageModalProps) {
  const [subject, setSubject] = useState(`Information regarding your EduTrack account`);
  const [message, setMessage] = useState('');

  if (!user) return null;

  const handleSend = () => {
    const mailtoLink = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
            <Mail className="h-5 w-5 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl">Send Message</DialogTitle>
          <DialogDescription>
            Compose a message to {user.firstName} {user.lastName}. This will open your email client.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input 
              id="recipient" 
              value={user.email} 
              disabled 
              className="bg-slate-50 text-slate-500 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="Enter subject..." 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Type your message here..." 
              className="min-h-[150px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-700">
            <Send className="mr-2 h-4 w-4" />
            Open Email App
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

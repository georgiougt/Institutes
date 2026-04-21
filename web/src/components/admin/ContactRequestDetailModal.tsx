'use client';

import React, { useState } from 'react';
import { Mail, Phone, User, Calendar, Building, CheckCircle2, MessageSquare, Trash2, X, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { toast } from 'sonner';
import { adminFetch } from '@/lib/admin-fetch';

interface ContactRequest {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  message: string;
  subject: string | null;
  status: string;
  createdAt: string;
  institute?: { name: string } | null;
  user?: { firstName: string; lastName: string; email: string } | null;
}

interface ContactRequestDetailModalProps {
  request: ContactRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export function ContactRequestDetailModal({ request, isOpen, onClose, onStatusUpdate }: ContactRequestDetailModalProps) {
  const [loading, setLoading] = useState(false);

  if (!request) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await adminFetch(`/admin/contact-requests/${request.id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      toast.success('Status updated', {
        description: `Message marked as ${newStatus.toLowerCase()}.`
      });
      onStatusUpdate(request.id, newStatus);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const senderName = request.user 
    ? `${request.user.firstName} ${request.user.lastName}` 
    : request.guestName || 'Unknown';
    
  const senderEmail = request.user?.email || request.guestEmail;
  const senderPhone = request.guestPhone;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        {/* Header Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-8 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Mail className="h-7 w-7 text-indigo-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900 leading-none mb-2">Message Details</DialogTitle>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                     <Calendar className="h-3.5 w-3.5" />
                     {new Date(request.createdAt).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </div>
                   {request.subject && (
                     <span className={cn(
                       "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                       request.subject === 'Website Interest' 
                        ? "bg-indigo-100 text-indigo-700 border-indigo-200" 
                        : "bg-slate-100 text-slate-500 border-slate-200"
                     )}>
                       {request.subject}
                     </span>
                   )}
                </div>
              </div>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <User className="h-3 w-3" /> Sender Info
              </p>
              <p className="text-slate-900 font-black truncate">{senderName}</p>
              <p className="text-slate-500 text-xs font-medium truncate">{senderEmail}</p>
              {senderPhone && <p className="text-slate-500 text-xs font-medium">{senderPhone}</p>}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Building className="h-3 w-3" /> Target Institute
              </p>
              <p className="text-slate-900 font-black truncate">{request.institute?.name || 'Platform (General)'}</p>
              <p className="text-slate-500 text-xs font-medium">
                {request.institute ? 'Direct Inquiry' : 'Platform Inquiry'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3" /> Inquiry Content
            </p>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-slate-700 leading-relaxed font-normal whitespace-pre-wrap break-words min-h-[120px]">
              {request.message}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="bg-slate-50 border-t border-slate-100 p-6 flex flex-row sm:justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleUpdateStatus('SPAM')}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold"
              disabled={loading || request.status === 'SPAM'}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Spam
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {request.status === 'NEW' && (
              <Button 
                variant="outline" 
                onClick={() => handleUpdateStatus('READ')}
                className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-black"
                disabled={loading}
              >
                Mark as Read
              </Button>
            )}
            
            <Button 
              onClick={() => handleUpdateStatus('RESOLVED')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl px-6"
              disabled={loading || request.status === 'RESOLVED'}
            >
              {loading ? (
                'Updating...'
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Resolved
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

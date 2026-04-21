'use client';

import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ContactRequestDetailModal } from './ContactRequestDetailModal';
import { useRouter } from 'next/navigation';

interface ContactRequest {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  message: string;
  subject: string | null;
  status: string;
  createdAt: string;
  institute?: { id: string; name: string } | null;
  user?: { id: string; firstName: string; lastName: string; email: string } | null;
}

interface ContactRequestsTableProps {
  initialRequests: ContactRequest[];
}

export function ContactRequestsTable({ initialRequests }: ContactRequestsTableProps) {
  const [requests, setRequests] = useState<ContactRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRowClick = (req: ContactRequest) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    // Refresh the page data to update the counts in the topbar/filters if they are server-side
    router.refresh();
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left font-semibold text-slate-600 px-5 py-3 text-xs uppercase tracking-wider">Date</th>
              <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">From</th>
              <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Subject</th>
              <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Institute</th>
              <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider hidden md:table-cell">Message</th>
              <th className="text-center font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Status</th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                      <Mail className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No contact requests</p>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr 
                  key={req.id} 
                  onClick={() => handleRowClick(req)}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {mounted ? new Date(req.createdAt).toLocaleDateString() : '...'}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {req.user ? `${req.user.firstName} ${req.user.lastName}` : req.guestName || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-400">{req.user?.email || req.guestEmail || ''}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {req.subject === 'Website Interest' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-tighter">
                        Website Offer
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">{req.subject || <span className="text-slate-300">General</span>}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">
                    {req.institute?.name || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500 max-w-xs truncate">
                    {req.message}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ContactRequestDetailModal 
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}

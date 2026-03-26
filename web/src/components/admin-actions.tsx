'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, X, FileText, MoreHorizontal, Loader2, MapPin, BookOpen, Globe, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge';

export function AdminActions({ data }: { data: any }) {
  const { id, name, description, website, owner, branches, services } = data;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/requests/${id}/${action}`, {
        method: 'POST',
      });
      if (res.ok) {
        router.refresh();
      } else {
        console.error(`Failed to ${action} institute`);
      }
    } catch (error) {
      console.error('Error performing admin action:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog>
        <DialogTrigger
          render={
            <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200 hover:bg-slate-50 transition-all rounded-lg">
              <FileText className="h-4 w-4" />
              <span className="font-medium text-xs">Review Details</span>
            </Button>
          }
        />
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              {name}
            </DialogTitle>
            <DialogDescription>
              Review all submitted information before approval.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {/* Header / Owner Info */}
            <section className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Owner Name</span>
                <p className="font-semibold text-slate-900">{owner?.firstName} {owner?.lastName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                <p className="font-semibold text-slate-900">{owner?.email}</p>
              </div>
            </section>

            {/* About Section */}
            <section className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                About Institute
              </h4>
              <div className="bg-white border rounded-xl p-4 space-y-4">
                <p className="text-slate-600 leading-relaxed italic">
                  "{description || 'No description provided.'}"
                </p>
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary font-medium hover:underline text-sm">
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
              </div>
            </section>

            {/* Location Section */}
            <section className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Location & Contact
              </h4>
              <div className="bg-white border rounded-xl p-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">City</span>
                  <p className="font-medium">{branches?.[0]?.city?.name || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">Phone</span>
                  <p className="font-medium">{branches?.[0]?.phone || 'N/A'}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-xs font-medium text-slate-500">Address</span>
                  <p className="font-medium">{branches?.[0]?.address || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Subjects Section */}
            <section className="space-y-3 pb-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Offered Subjects
              </h4>
              <div className="flex flex-wrap gap-2">
                {services?.map((s: any) => (
                  <Badge key={s.id} variant="secondary" className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-semibold px-3 py-1">
                    {s.service?.name}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Sticky/Fixed Actions Bar if needed, otherwise here */}
            <div className="flex items-center gap-4 pt-6 border-t">
              <Button 
                onClick={() => handleAction('approve')} 
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="mr-2 h-5 w-5" />}
                Approve Request
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleAction('reject')} 
                className="flex-1 h-12 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-base"
                disabled={loading}
              >
                <X className="mr-2 h-5 w-5" />
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" disabled={loading}>
          <Button variant="ghost" className="h-9 w-9 p-0 border border-slate-200 hover:bg-white hover:text-primary hover:shadow-sm transition-all rounded-lg">
            <span className="sr-only">Open menu</span>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-5 w-5" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-100 p-1.5">
          <DropdownMenuItem 
            onClick={() => handleAction('approve')}
            className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer rounded-md p-2"
          >
            <Check className="mr-2 h-4 w-4" />
            <span className="font-medium">Quick Approve</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleAction('reject')}
            className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer rounded-md p-2"
          >
            <X className="mr-2 h-4 w-4" />
            <span className="font-medium">Quick Reject</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

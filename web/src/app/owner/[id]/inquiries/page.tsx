'use client';

import { useEffect, useState, use } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal,
  ChevronRight,
  Mail,
  Phone,
  StickyNote
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function InquiriesCRMPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/inquiries`, {
          headers: { 'X-User-Id': userId }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setInquiries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [instituteId]);

  const updateStatus = async (inquiryId: string, status: string) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/inquiries/${inquiryId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status } : inq));
        if (selectedInquiry?.id === inquiryId) setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Loading inquiries...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inquiries</h2>
          <p className="text-slate-500">Track and respond to potential student leads.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input placeholder="Search leads..." className="pl-10 w-64 rounded-xl border-slate-200" />
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200">
             <Filter className="mr-2 h-4 w-4" />
             Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0 overflow-hidden">
        {/* List View */}
        <Card className="flex-1 border-none shadow-sm bg-white overflow-hidden flex flex-col">
           <CardContent className="p-0 flex-1 overflow-y-auto">
              <Table>
                 <TableHeader className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                    <TableRow className="hover:bg-transparent border-slate-100">
                       <TableHead className="w-[250px] font-bold text-slate-600">Lead</TableHead>
                       <TableHead className="font-bold text-slate-600">Service</TableHead>
                       <TableHead className="font-bold text-slate-600">Date</TableHead>
                       <TableHead className="font-bold text-slate-600">Status</TableHead>
                       <TableHead className="w-[50px] text-right"></TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {inquiries.map((inq) => (
                      <TableRow 
                        key={inq.id} 
                        onClick={() => setSelectedInquiry(inq)}
                        className={`cursor-pointer transition-colors border-slate-50 ${
                          selectedInquiry?.id === inq.id ? "bg-red-50/50" : "hover:bg-slate-50"
                        }`}
                      >
                         <TableCell>
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                                  {inq.guestName ? inq.guestName[0] : (inq.senderName ? inq.senderName[0] : 'G')}
                               </div>
                               <div>
                                  <div className="font-bold text-slate-900">{inq.guestName || inq.senderName || 'Guest'}</div>
                                  <div className="text-xs text-slate-400">{inq.guestEmail || 'no-email'}</div>
                               </div>
                            </div>
                         </TableCell>
                         <TableCell className="font-medium text-slate-600">
                            {inq.service?.name || inq.subject || 'General'}
                         </TableCell>
                         <TableCell className="text-slate-400 text-sm">
                            {new Date(inq.createdAt).toLocaleDateString()}
                         </TableCell>
                         <TableCell>
                            <Badge className={`rounded-lg border-none ${
                               inq.status === 'NEW' ? "bg-red-100 text-red-700 font-bold" :
                               inq.status === 'RESOLVED' ? "bg-emerald-100 text-emerald-700" :
                               "bg-slate-100 text-slate-600"
                            }`}>
                               {inq.status}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-right">
                            <DropdownMenu>
                               <DropdownMenuTrigger className="h-8 w-8 text-slate-400 hover:bg-slate-100 rounded-full flex items-center justify-center">
                                  <MoreHorizontal className="h-4 w-4" />
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="rounded-xl">
                                  <DropdownMenuItem onClick={() => updateStatus(inq.id, 'RESOLVED')}>Mark as Resolved</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(inq.id, 'SPAM')} className="text-red-600">Mark as Spam</DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                         </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </CardContent>
        </Card>

        {/* Side Panel Detail (Desktop Only) */}
        {selectedInquiry && (
          <Card className="w-96 border-none shadow-sm bg-white overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300">
             <CardHeader className="bg-slate-50/50 pb-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-4">
                   <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl font-black text-red-600 border border-slate-100">
                      {(selectedInquiry.guestName || selectedInquiry.senderName || 'G')[0]}
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setSelectedInquiry(null)} className="h-8 w-8 text-slate-400 hover:bg-white rounded-full">
                      <ChevronRight className="h-5 w-5" />
                   </Button>
                </div>
                <CardTitle className="text-xl font-black">{selectedInquiry.guestName || selectedInquiry.senderName || 'Guest'}</CardTitle>
                <CardDescription>Inquired about {selectedInquiry.service?.name || selectedInquiry.subject || 'General'}</CardDescription>
             </CardHeader>
             <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {selectedInquiry.guestEmail || 'No email provided'}
                   </div>
                   <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {selectedInquiry.guestPhone || 'No phone provided'}
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                   <p className="text-sm font-bold text-slate-900 mb-2">Message</p>
                   <div className="bg-slate-50 p-4 rounded-xl text-sm leading-relaxed text-slate-700 italic">
                      "{selectedInquiry.message || 'No message content.'}"
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">Internal Notes</p>
                      <Button variant="ghost" size="sm" className="text-xs text-red-600 font-bold hover:bg-red-50">Add Note</Button>
                   </div>
                   {selectedInquiry.notes?.length > 0 ? (
                      <div className="space-y-3">
                         {selectedInquiry.notes.map((note: any) => (
                           <div key={note.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100/50 shadow-sm">
                              <p className="text-xs text-amber-800 leading-relaxed font-medium">{note.content}</p>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/30">
                                 <span className="text-[10px] text-amber-600/70">{new Date(note.createdAt).toLocaleDateString()}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                         <StickyNote className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                         <p className="text-xs text-slate-400 font-medium">No internal notes yet.</p>
                      </div>
                   )}
                </div>
             </CardContent>
             <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex gap-2">
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold h-12 shadow-sm">
                   Reply to Lead
                </Button>
             </div>
          </Card>
        )}
      </div>
    </div>
  );
}

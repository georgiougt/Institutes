'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {  
  Building2, 
  Target, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  MousePointer2,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function OwnerOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/metrics`, {
          headers: { 'X-User-Id': userId }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const metrics = await res.json();
        setData(metrics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [instituteId]);

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-red-500 font-medium">Error loading data.</div>;



  const recentInquiries = data.recentInquiries || [];
  const completeness = data.completeness;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Welcome back. Here is what is happening with your institute.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
             <Calendar className="mr-2 h-4 w-4" />
             Last 30 Days
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
             Download Report
          </Button>
        </div>
      </div>

      {/* Top Section: Status & Completeness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
           <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <Target className="h-5 w-5 text-red-600" />
                 Profile Completeness
              </CardTitle>
           </CardHeader>
           <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-12">
                 <div className="relative h-32 w-32 flex items-center justify-center shrink-0">
                    <svg className="h-full w-full rotate-[-90deg]">
                       <circle
                          cx="64" cy="64" r="58"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="12"
                          className="text-slate-100"
                       />
                       <circle
                          cx="64" cy="64" r="58"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="12"
                          strokeDasharray={364.4}
                          strokeDashoffset={364.4 * (1 - completeness / 100)}
                          strokeLinecap="round"
                          className="text-red-600 transition-all duration-1000"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center rotate-[0deg]">
                       <span className="text-3xl font-black text-slate-900">{completeness}%</span>
                    </div>
                 </div>
                                  <div className="flex-1 space-y-4">
                    <p className="text-slate-600 leading-relaxed font-medium">
                       {completeness === 100 
                          ? "Your profile is fully optimized for maximum visibility! Keep maintaining your content to rank higher."
                          : "Your profile is almost ready for maximum visibility! Complete the remaining steps to improve your search ranking."}
                    </p>
                    <div className="space-y-2">
                       {(() => {
                         const steps = data.completenessSteps || [];
                         const completed = steps.filter((s: any) => s.completed);
                         const uncompleted = steps.filter((s: any) => !s.completed);
                         const display = [...completed.slice(0, Math.max(0, 3 - uncompleted.length)), ...uncompleted.slice(0, 3)].slice(0, 3);
                         
                         return display.map((step: any, idx: number) => (
                           step.completed ? (
                             <div key={idx} className="flex items-center gap-2 text-sm text-slate-500 line-through decoration-slate-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                {step.label}
                             </div>
                           ) : (
                             <Link 
                               key={idx} 
                               href={`/owner/${instituteId}/${step.path || 'profile'}`}
                               className="flex items-center gap-2 text-sm text-slate-900 font-semibold group cursor-pointer hover:text-red-600 transition-colors block"
                             >
                                <AlertCircle className="h-4 w-4 text-amber-500 group-hover:text-red-500 shrink-0" />
                                {step.label} <span className="text-red-600/80 group-hover:text-red-600">(+{step.value}%)</span>
                                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                             </Link>
                           )
                         ));
                       })()}
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden flex flex-col justify-between">
           <CardHeader>
              <CardTitle className="text-lg font-bold">Listing Status</CardTitle>
           </CardHeader>
           <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                 <div className="text-slate-400 text-sm uppercase tracking-widest font-bold">Current State</div>
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-3 w-3 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]",
                      data.status === 'APPROVED' ? "bg-emerald-500 shadow-emerald-500/50" :
                      data.status === 'REJECTED' ? "bg-red-500 shadow-red-500/50" :
                      data.status === 'DRAFT' ? "bg-slate-500 shadow-slate-500/50" :
                      "bg-amber-500 animate-pulse shadow-amber-500/50"
                    )} />
                    <span className="text-2xl font-black uppercase tracking-tight">
                      {data.status.replace('_', ' ')}
                    </span>
                 </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                 {data.status === 'PENDING' && "Our administrators are currently reviewing your profile. This usually takes 24-48 hours."}
                 {data.status === 'DRAFT' && "Your listing is currently a draft. Submit it when you are ready for review."}
                 {data.status === 'APPROVED' && "Your listing is live! Users can now find you on the platform."}
                 {data.status === 'REJECTED' && "Your listing requires corrections. Please check the feedback below."}
                 {data.status === 'SUSPENDED' && "Your listing has been suspended. Please contact support."}
              </p>
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl py-6 font-bold">
                 View History
              </Button>
           </CardContent>
        </Card>
      </div>



      {/* Recent Activity & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
               <CardTitle className="text-lg font-bold">Recent Inquiries</CardTitle>
               <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 rounded-lg">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {recentInquiries.map((inq: any) => (
                    <div key={inq.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                             {(inq.senderName || inq.guestName || 'G')[0]}
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900">{inq.senderName || inq.guestName || 'Guest'}</h4>
                             <p className="text-sm text-slate-400">Message snippet: <span className="text-slate-600 font-medium truncate inline-block max-w-[200px]">{inq.message}</span></p>
                          </div>
                       </div>
                       <div className="text-right flex flex-col items-end gap-2">
                          <span className="text-xs font-medium text-slate-400">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                          <Badge className={cn(
                            "rounded-lg border-none",
                            inq.status === 'NEW' ? "bg-red-100 text-red-700" : 
                            inq.status === 'IN_PROGRESS' ? "bg-amber-100 text-amber-700" : 
                            "bg-emerald-100 text-emerald-700"
                          )}>
                             {inq.status.replace('_', ' ')}
                          </Badge>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-50 pb-6">
               <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
               <Link href={`/owner/${instituteId}/media`} className="block group">
                 <Button className="w-full justify-start gap-3 h-14 rounded-xl border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all" variant="outline">
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                    <span className="font-bold text-slate-700">Upload Media</span>
                 </Button>
               </Link>
               
               <Link href={`/owner/${instituteId}/inquiries`} className="block group">
                 <Button className="w-full justify-start gap-3 h-14 rounded-xl border-slate-200 group-hover:border-red-200 group-hover:bg-red-50 transition-all" variant="outline">
                    <MessageSquare className="h-5 w-5 text-red-500" />
                    <span className="font-bold text-slate-700">View Inquiries</span>
                 </Button>
               </Link>

               <Link href={`/owner/${instituteId}/schedules`} className="block group">
                 <Button className="w-full justify-start gap-3 h-14 rounded-xl border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all" variant="outline">
                    <Calendar className="h-5 w-5 text-emerald-500" />
                    <span className="font-bold text-slate-700">Update Schedule</span>
                 </Button>
               </Link>
               <div className="pt-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        Tip of the day
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Listings with at least 5 photos receive 40% more inquiries on average. Update your gallery today!
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

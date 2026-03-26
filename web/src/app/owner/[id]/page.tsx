'use client';

import { useEffect, useState, use } from 'react';
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/metrics`);
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

  const stats = [
    { label: 'Profile Views', value: '1.2k', change: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Inquiries', value: data.unreadInquiries + (data.recentInquiries?.length || 0), change: `+${data.unreadInquiries}`, icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Conversion Rate', value: '4.2%', change: '+0.4%', icon: MousePointer2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Favorites', value: '156', change: '+18', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

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
                       Your profile is almost ready for maximum visibility! Complete the remaining steps to improve your search ranking.
                    </p>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-sm text-slate-500 line-through decoration-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          Add secondary branch branches
                       </div>
                       <div className="flex items-center gap-2 text-sm text-slate-900 font-semibold group cursor-pointer hover:text-red-600 transition-colors">
                          <AlertCircle className="h-4 w-4 text-amber-500 group-hover:text-red-500" />
                          Add a profile cover image (+15%)
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                       </div>
                       <div className="flex items-center gap-2 text-sm text-slate-900 font-semibold group cursor-pointer hover:text-red-600 transition-colors">
                          <AlertCircle className="h-4 w-4 text-amber-500 group-hover:text-red-500" />
                          Specify opening hours (+10%)
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                       </div>
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

      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, idx) => (
           <Card key={idx} className="border-none shadow-sm bg-white overflow-hidden group cursor-pointer active:scale-95 transition-all">
              <CardContent className="p-6">
                 <div className="flex items-start justify-between">
                    <div>
                       <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                       <p className="text-xs font-bold text-emerald-500 mt-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {stat.change}
                       </p>
                    </div>
                    <div className={cn("p-3 rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-6 shadow-sm", stat.bg, stat.color)}>
                       <stat.icon className="h-6 w-6" />
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))}
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
               <Button className="w-full justify-start gap-3 h-14 rounded-xl border-slate-200" variant="outline">
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                  <span className="font-bold text-slate-700">Upload Media</span>
               </Button>
               <Button className="w-full justify-start gap-3 h-14 rounded-xl border-slate-200" variant="outline">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <span className="font-bold text-slate-700">Add New Branch</span>
               </Button>
               <Button className="w-full justify-start gap-3 h-14 rounded-xl border-slate-200" variant="outline">
                  <Users className="h-5 w-5 text-emerald-500" />
                  <span className="font-bold text-slate-700">Invite Team Member</span>
               </Button>
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

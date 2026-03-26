'use client';

import { use } from 'react';

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer2,
  Calendar,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analytics & Insights</h2>
          <p className="text-slate-500">Track your institute's performance and audience engagement.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-slate-200">
           <Calendar className="mr-2 h-4 w-4" />
           Last 30 Days
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Profile Views', value: '1,284', trend: '+12.5%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Inquiry Rate', value: '4.8%', trend: '+0.4%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Total Leads', value: '62', trend: '+8', icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
           { label: 'Click-to-Call', value: '18', trend: '-2', icon: MousePointer2, color: 'text-amber-600', bg: 'bg-amber-50' },
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                       <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold border-slate-100 text-slate-400">
                       <ArrowUpRight className="h-3 w-3 mr-1" />
                       {stat.trend}
                    </Badge>
                 </div>
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
                 <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden h-[400px] flex flex-col">
            <CardHeader className="pb-0">
               <CardTitle className="text-lg font-bold">Engagement Over Time</CardTitle>
               <CardDescription>Daily profile views vs inquiry submissions</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-12">
               <div className="space-y-4">
                  <div className="h-48 flex items-end gap-2 px-8">
                     {[40, 70, 45, 90, 65, 80, 55, 100, 85, 75, 50, 60].map((h, i) => (
                       <div key={i} className="flex-1 bg-red-100 rounded-t-lg group relative hover:bg-red-600 transition-colors" style={{ height: `${h}%` }}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                             {h * 10} Views
                          </div>
                       </div>
                     ))}
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Visualization: Monthly Traffic Distribution</p>
               </div>
            </CardContent>
         </Card>

         <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
               <CardHeader>
                  <CardTitle className="text-lg">AI Performance Tip</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                     <p className="text-sm leading-relaxed text-slate-300">
                        "Your profile completeness is at <strong>85%</strong>. Adding 2 more images of your classroom could increase your inquiry conversion by up to <strong>15%</strong> based on similar institutes in Nicosia."
                     </p>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                     Optimize Profile
                  </Button>
               </CardContent>
            </Card>

            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
               <Info className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
               <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Analytics data is refreshed every 6 hours. Exporting full reports as CSV will be available in the next platform update.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

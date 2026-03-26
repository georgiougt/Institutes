'use client';

import { useEffect, useState, use } from 'react';
import { 
  Clock, 
  MapPin, 
  Save, 
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

const DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
  { id: 0, name: 'Sunday' },
];

export default function SchedulesManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/${instituteId}`);
        const data = await res.json();
        setBranches(data.branches || []);
        if (data.branches?.length > 0) {
          setSelectedBranchId(data.branches[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instituteId]);

  useEffect(() => {
    if (!selectedBranchId) return;
    const fetchSchedules = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/schedules`);
        const allSchedules = await res.json();
        // Filter for current branch or create defaults
        const branchSchedules = allSchedules.filter((s: any) => s.branchId === selectedBranchId);
        
        const fullWeek = DAYS.map(day => {
          const existing = branchSchedules.find((s: any) => s.dayOfWeek === day.id);
          return existing || { 
            dayOfWeek: day.id, 
            dayName: day.name, 
            openTime: '09:00', 
            closeTime: '18:00', 
            isClosed: false 
          };
        });
        setSchedules(fullWeek);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchedules();
  }, [selectedBranchId, instituteId]);

  const updateDay = (dayId: number, field: string, value: any) => {
    setSchedules(prev => prev.map(s => s.dayOfWeek === dayId ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/branches/${selectedBranchId}/schedules`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedules }),
      });
      if (res.ok) alert('Schedules updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Loading schedules...</div>;

  const selectedBranchName = branches.find(b => b.id === selectedBranchId)?.name;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Operating Hours</h2>
          <p className="text-slate-500">Define the weekly schedule for each of your branches.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving || !selectedBranchId}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl min-w-[140px]"
        >
           {saving ? 'Saving...' : (
             <>
               <Save className="mr-2 h-4 w-4" />
               Save Schedule
             </>
           )}
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
         <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between py-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-600 border border-slate-200">
                  <MapPin className="h-6 w-6" />
               </div>
               <div>
                  <CardTitle className="text-lg font-bold">Branch Selection</CardTitle>
                  <CardDescription>Currently editing: <strong className="text-slate-900">{selectedBranchName || 'None'}</strong></CardDescription>
               </div>
            </div>
            <div className="w-64">
               <Select value={selectedBranchId} onValueChange={(val) => val && setSelectedBranchId(val)}>
                  <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                     <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                     {branches.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </CardHeader>
         <CardContent className="p-8">
            <div className="space-y-4 max-w-4xl mx-auto">
               {DAYS.map((day) => {
                  const dayData = schedules.find(s => s.dayOfWeek === day.id) || { isClosed: true };
                  return (
                    <div 
                      key={day.id} 
                      className={`grid grid-cols-1 md:grid-cols-4 items-center gap-6 p-6 rounded-2xl border transition-all ${
                        dayData.isClosed 
                          ? "bg-slate-50/50 border-slate-100 opacity-60" 
                          : "bg-white border-slate-200 shadow-sm hover:border-red-200"
                      }`}
                    >
                       <div className="col-span-1">
                          <p className="text-lg font-black text-slate-900">{day.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Switch 
                               checked={!dayData.isClosed} 
                               onCheckedChange={(val) => updateDay(day.id, 'isClosed', !val)}
                             />
                             <span className="text-xs font-bold uppercase tracking-tighter text-slate-500">
                                {dayData.isClosed ? 'Closed' : 'Open'}
                             </span>
                          </div>
                       </div>

                       <div className="md:col-span-3 flex items-center gap-6">
                          <div className={`flex-1 space-y-1.5 transition-opacity ${dayData.isClosed ? 'pointer-events-none' : ''}`}>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Opening Time</p>
                             <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                <Input 
                                  type="time" 
                                  value={dayData.openTime || '09:00'} 
                                  onChange={(e) => updateDay(day.id, 'openTime', e.target.value)}
                                  className="pl-10 rounded-xl border-slate-200 focus:border-red-500 transition-colors"
                                />
                             </div>
                          </div>

                          <div className="h-4 w-4 text-slate-200 flex items-center justify-center pt-5">
                             <ChevronRight className="h-4 w-4" />
                          </div>

                          <div className={`flex-1 space-y-1.5 transition-opacity ${dayData.isClosed ? 'pointer-events-none' : ''}`}>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Closing Time</p>
                             <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                <Input 
                                  type="time" 
                                  value={dayData.closeTime || '18:00'} 
                                  onChange={(e) => updateDay(day.id, 'closeTime', e.target.value)}
                                  className="pl-10 rounded-xl border-slate-200 focus:border-red-500 transition-colors"
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  );
               })}
            </div>

            <div className="mt-12 p-6 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
               <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
               <div>
                  <h4 className="font-bold text-red-900">Schedule Visibility</h4>
                  <p className="text-sm text-red-700 leading-relaxed">
                     These hours will be displayed on each branch's public profile page. Public users can filter for centers that are currently open. Be sure to keep these updated during holiday seasons.
                  </p>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

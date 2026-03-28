'use client';

import { useEffect, useState, use } from 'react';
import { 
  MapPin, 
  Plus, 
  Navigation, 
  Phone, 
  Clock, 
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BranchesManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/${instituteId}`, {
          headers: { 'X-User-Id': userId }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setBranches(data.branches || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [instituteId]);

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Loading branches...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Branches</h2>
          <p className="text-slate-500">Manage your physical locations and their operational status.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
           <Plus className="mr-2 h-4 w-4" />
           Add New Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {branches.map((branch) => (
           <Card key={branch.id} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
              <div className="h-2 bg-red-600" />
              <CardHeader className="pb-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <CardTitle className="text-xl font-bold">{branch.name}</CardTitle>
                       <CardDescription className="flex items-center gap-1">
                          {branch.isMain ? (
                             <Badge className="bg-red-100 text-red-600 border-none font-bold text-[10px] uppercase">Main Branch</Badge>
                          ) : (
                             <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-200">Satellite Branch</Badge>
                          )}
                       </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical className="h-4 w-4" /></Button>
                 </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-6">
                 <div className="space-y-3">
                    <div className="flex items-start gap-3">
                       <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                       <div className="text-sm font-medium text-slate-600 leading-snug">
                          {branch.address}, {branch.city?.name || 'Nicosia'}
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                       <span className="text-sm font-medium text-slate-600">{branch.phone}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 flex-1">
                       {branch.status === 'APPROVED' ? (
                          <>
                             <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                             <span className="text-xs font-bold text-emerald-700 uppercase tracking-tighter">Live on Platform</span>
                          </>
                       ) : (
                          <>
                             <AlertCircle className="h-4 w-4 text-amber-500" />
                             <span className="text-xs font-bold text-amber-700 uppercase tracking-tighter">Pending Approval</span>
                          </>
                       )}
                    </div>
                 </div>

                 <div className="pt-4 grid grid-cols-2 gap-3 border-t border-slate-50">
                    <Button variant="outline" className="rounded-lg h-10 border-slate-200 text-slate-600 font-bold text-xs">
                       <Edit2 className="h-3 w-3 mr-2" />
                       Edit Branch
                    </Button>
                    <Button variant="outline" className="rounded-lg h-10 border-slate-200 text-slate-600 font-bold text-xs">
                       <Clock className="h-3 w-3 mr-2" />
                       Schedules
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}

         {/* Empty State Card */}
         {branches.length === 0 && (
           <Card className="border-2 border-dashed border-slate-200 bg-transparent flex flex-col items-center justify-center p-12 text-center h-[300px]">
              <Navigation className="h-12 w-12 text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">No locations registered yet.</p>
              <Button variant="link" className="text-red-500 font-bold">Add your first branch</Button>
           </Card>
         )}
      </div>
    </div>
  );
}

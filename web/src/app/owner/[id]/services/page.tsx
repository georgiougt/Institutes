'use client';

import { useEffect, useState, use } from 'react';
import { 
  BookOpen, 
  Search, 
  Check, 
  AlertCircle, 
  Save, 
  GraduationCap,
  Layers,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ServicesManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all available services for catalog
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/metadata/lists`, { cache: 'no-store' });
        const lists = await catRes.json();
        setAllServices(lists.services || []);

        // Fetch current services for this institute
        const instRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/${instituteId}`);
        const inst = await instRes.json();
        setSelectedIds((inst.services || []).map((s: any) => s.serviceId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instituteId]);

  const toggleService = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/services`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({ serviceIds: selectedIds }),
      });
      if (res.ok) alert('Services updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving services');
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = allServices.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Loading service catalog...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Services & Subjects</h2>
          <p className="text-slate-500">Choose the subjects and courses offered at your center.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl min-w-[140px]"
        >
           {saving ? 'Saving...' : (
             <>
               <Save className="mr-2 h-4 w-4" />
               Save Changes
             </>
           )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Left Side: Stats & Filters */}
         <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
               <CardHeader className="bg-slate-900 text-white">
                  <p className="text-xs uppercase tracking-widest font-black opacity-60 mb-1">Selection Summary</p>
                  <CardTitle className="text-3xl font-black">{selectedIds.length}</CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <p className="text-sm text-slate-500 leading-relaxed">
                     You are currently offering <strong>{selectedIds.length}</strong> subjects. These will appear on your public profile immediately after saving.
                  </p>
               </CardContent>
            </Card>

            <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700">Search Catalog</label>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="e.g. Mathematics" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl border-slate-200" 
                  />
               </div>
            </div>
         </div>

         {/* Right Side: Catalog Grid */}
         <div className="lg:col-span-3 space-y-12">
            (Object.entries(
              filteredServices.reduce((acc, s) => {
                const cat = s.category || 'Λοιπά';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(s);
                return acc;
              }, {} as Record<string, any[]>)
            ) as [string, any[]][])
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, services]) => (
              <div key={category} className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-1 bg-red-600 rounded-full" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{category}</h3>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-500 rounded-md px-1.5 h-5 text-[10px]">
                        {services.length}
                      </Badge>
                   </div>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase tracking-tighter h-7 px-2"
                    onClick={() => {
                      const ids = services.map(s => s.id);
                      const allSelected = ids.every(id => selectedIds.includes(id));
                      if (allSelected) {
                        setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
                      } else {
                        setSelectedIds(prev => Array.from(new Set([...prev, ...ids])));
                      }
                    }}
                   >
                     {services.every(s => selectedIds.includes(s.id)) ? 'Deselect All' : 'Select All'}
                   </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {services
                    .sort((a: any, b: any) => a.name.localeCompare(b.name))
                    .map((service: any) => {
                    const isSelected = selectedIds.includes(service.id);
                    return (
                      <Card 
                        key={service.id} 
                        onClick={() => toggleService(service.id)}
                        className={`group relative overflow-hidden transition-all duration-300 cursor-pointer border-2 hover:shadow-xl ${
                          isSelected 
                            ? "border-red-600 shadow-red-100/50 bg-white" 
                            : "border-slate-100 hover:border-slate-300 bg-white shadow-sm hover:-translate-y-1"
                        }`}
                      >
                         <CardContent className="p-0 h-24 flex items-center px-6">
                            <div className="flex items-center justify-between w-full relative z-10">
                               <div className="space-y-1">
                                  <h4 className={`font-bold text-base transition-colors ${isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                                     {service.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-tight ${isSelected ? "text-red-600" : "text-slate-400"}`}>
                                      {service.category || 'Standard'}
                                    </span>
                                  </div>
                               </div>
                               
                               {isSelected ? (
                                  <div className="h-9 w-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200 animate-in zoom-in-50 duration-300">
                                     <Check className="h-5 w-5 stroke-[3]" />
                                  </div>
                               ) : (
                                  <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-400 transition-all duration-300">
                                     <Plus className="h-5 w-5" />
                                  </div>
                               )}
                            </div>
                            
                            {/* Decorative background for selected */}
                            {isSelected && (
                              <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-red-50/50 to-transparent pointer-events-none" />
                            )}
                         </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No results found for "{searchQuery}"</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

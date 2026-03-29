'use client';

import { useEffect, useState, use } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Edit2,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function BranchesManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        const [instRes, metaRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/${instituteId}`, {
            headers: { 'X-User-Id': userId }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/metadata`)
        ]);

        if (!instRes.ok || !metaRes.ok) throw new Error('Failed to fetch');
        
        const instData = await instRes.json();
        const metaData = await metaRes.json();

        setBranches(instData.branches || []);
        setCities(metaData.cities || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instituteId]);

  const handleEditClick = (branch: any) => {
    setEditingBranch({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      cityId: branch.cityId,
      latitude: branch.latitude,
      longitude: branch.longitude
    });
    setIsEditOpen(true);
  };

  const handleSaveBranch = async () => {
    setSaving(true);
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/branches/${editingBranch.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify(editingBranch)
      });

      if (!res.ok) throw new Error('Update failed');
      
      const updatedBranch = await res.json();
      
      // Update local state
      setBranches(prev => prev.map(b => b.id === updatedBranch.id ? { ...b, ...updatedBranch, city: cities.find(c => c.id === updatedBranch.cityId) } : b));
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      alert('Σφάλμα κατά την αποθήκευση της τοποθεσίας.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse text-center">Φόρτωση τοποθεσιών...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Τοποθεσία & Παράρτημα</h2>
          <p className="text-slate-500">Διαχειριστείτε την κύρια έδρα του εκπαιδευτηρίου σας.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {branches.map((branch) => (
           <Card key={branch.id} className="border-none shadow-xl bg-white overflow-hidden group">
              <div className="h-3 bg-red-600" />
              <CardHeader className="pb-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <CardTitle className="text-2xl font-black text-slate-900">{branch.name}</CardTitle>
                       <Badge className="bg-red-100 text-red-600 border-none font-bold text-[10px] uppercase px-3 py-1">
                          Κεντρικό Κατάστημα
                       </Badge>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                             <MapPin className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Διεύθυνση</p>
                             <p className="text-lg font-bold text-slate-700">{branch.address}</p>
                             <p className="text-sm text-slate-500">{branch.city?.name || 'Nicosia'}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                             <Phone className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Τηλέφωνο Επικοινωνίας</p>
                             <p className="text-lg font-bold text-slate-700">{branch.phone}</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
                       <div className="flex items-center gap-3 mb-4 text-slate-600">
                          {branch.status === 'APPROVED' ? (
                             <>
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                <span className="text-sm font-black uppercase tracking-tight">Εμφανίζεται Δημόσια</span>
                             </>
                          ) : (
                             <>
                                <AlertCircle className="h-6 w-6 text-amber-500" />
                                <span className="text-sm font-black uppercase tracking-tight text-amber-700">Σε αναμονή έγκρισης</span>
                             </>
                          )}
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Οι αλλαγές στην τοποθεσία ενδέχεται να απαιτούν σύντομο έλεγχο από την ομάδα μας πριν ενημερωθούν στον χάρτη αναζήτησης.
                       </p>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-50 flex gap-4">
                    <Button 
                      onClick={() => handleEditClick(branch)}
                      className="rounded-xl h-12 px-8 border-slate-200 bg-red-600 hover:bg-red-700 text-white font-black text-sm"
                    >
                       <Edit2 className="h-4 w-4 mr-2" />
                       Επεξεργασία Στοιχείων
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}

         {branches.length === 0 && (
            <Card className="border-2 border-dashed border-slate-200 bg-transparent flex flex-col items-center justify-center p-12 text-center h-[300px]">
               <Navigation className="h-12 w-12 text-slate-200 mb-4" />
               <p className="text-slate-400 font-medium font-black">Δεν βρέθηκε καταχωρημένη τοποθεσία.</p>
            </Card>
         )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">Επεξεργασία Τοποθεσίας</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Ενημερώστε τα στοιχεία επικοινωνίας και τη διεύθυνση του παραρτήματος.
            </DialogDescription>
          </DialogHeader>

          {editingBranch && (
            <div className="grid gap-6 py-6">
              <div className="grid gap-2">
                <Label htmlFor="branchName" className="font-bold text-slate-700">Όνομα Παραρτήματος</Label>
                <Input 
                  id="branchName" 
                  value={editingBranch.name} 
                  onChange={(e) => setEditingBranch({...editingBranch, name: e.target.value})}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city" className="font-bold text-slate-700">Πόλη</Label>
                  <Select 
                    value={editingBranch.cityId} 
                    onValueChange={(val) => setEditingBranch({...editingBranch, cityId: val})}
                  >
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Επιλέξτε πόλη" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone" className="font-bold text-slate-700">Τηλέφωνο</Label>
                    <Input 
                      id="phone" 
                      value={editingBranch.phone} 
                      onChange={(e) => setEditingBranch({...editingBranch, phone: e.target.value})}
                      className="rounded-xl border-slate-200"
                    />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address" className="font-bold text-slate-700">Διεύθυνση</Label>
                <Input 
                  id="address" 
                  value={editingBranch.address} 
                  onChange={(e) => setEditingBranch({...editingBranch, address: e.target.value})}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 space-y-3">
                 <p className="text-xs font-bold text-amber-700 uppercase flex items-center gap-2">
                    <Navigation className="h-3 w-3" /> Συντεταγμένες Χάρτη
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                       <Label htmlFor="lat" className="text-[10px] font-black text-amber-600 uppercase">Latitude</Label>
                       <Input 
                         id="lat" 
                         type="number"
                         step="any"
                         value={editingBranch.latitude || ''} 
                         onChange={(e) => setEditingBranch({...editingBranch, latitude: parseFloat(e.target.value)})}
                         className="rounded-lg h-9 bg-white border-amber-200 text-sm font-bold"
                         placeholder="π.χ. 35.1264"
                       />
                    </div>
                    <div className="grid gap-1.5">
                       <Label htmlFor="lng" className="text-[10px] font-black text-amber-600 uppercase">Longitude</Label>
                       <Input 
                         id="lng" 
                         type="number"
                         step="any"
                         value={editingBranch.longitude || ''} 
                         onChange={(e) => setEditingBranch({...editingBranch, longitude: parseFloat(e.target.value)})}
                         className="rounded-lg h-9 bg-white border-amber-200 text-sm font-bold"
                         placeholder="π.χ. 33.3677"
                       />
                    </div>
                 </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditOpen(false)}
              className="rounded-xl border-slate-200 font-bold"
            >
              Άκυρο
            </Button>
            <Button 
              onClick={handleSaveBranch} 
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-black px-8"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

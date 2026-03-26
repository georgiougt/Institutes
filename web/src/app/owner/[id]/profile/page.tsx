'use client';

import { useEffect, useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  Info, 
  ImageIcon, 
  Globe, 
  Hash, 
  Save, 
  Eye,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ProfileFormValues {
  name: string;
  description: string;
  website: string;
  logoUrl: string;
}

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);

  const { register, handleSubmit, reset } = useForm<ProfileFormValues>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/metrics`);
        if (!res.ok) throw new Error('Failed to fetch');
        const metrics = await res.json();
        setData(metrics);
        // Reset form with current data
        // In a real app we'd fetch the full profile object
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/${instituteId}`);
        const profile = await profileRes.json();
        reset({
          name: profile.name,
          description: profile.description,
          website: profile.website,
          logoUrl: profile.logoUrl
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instituteId, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to save');
      
      // Refresh data to show pending banners
      const metricsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/metrics`);
      const metrics = await metricsRes.json();
      setData(metrics);
      
      alert('Profile updated! Note: Name changes require admin review.');
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Loading profile settings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Public Profile</h2>
          <p className="text-slate-500">Manage how your institute appears to potential students.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
             <Eye className="mr-2 h-4 w-4" />
             Preview Mode
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
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
      </div>

      {data?.status === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4 text-amber-800">
           <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
           <div>
              <p className="font-bold">Your listing is currently under review</p>
              <p className="text-sm opacity-90">Some fields may be locked or will require further approval if edited. Most changes will reflect once approved.</p>
           </div>
        </div>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="bg-white border border-slate-200 h-14 w-full justify-start gap-2 p-2 rounded-2xl shadow-sm">
          <TabsTrigger value="basic" className="rounded-xl data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
            <Info className="h-4 w-4 mr-2" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-xl data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
            <ImageIcon className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-xl data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
            <Globe className="h-4 w-4 mr-2" />
            Contacts & Socials
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TabsContent value="basic" className="space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
               <CardHeader>
                  <CardTitle>Institute Identity</CardTitle>
                  <CardDescription>Configure the core information that identifies your institute.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6 p-8 pt-0">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        Institute Name
                        <Badge variant="outline" className="text-[10px] font-bold text-amber-600 border-amber-200 bg-amber-50">Requires Review</Badge>
                     </label>
                     <Input 
                       {...register('name')} 
                       placeholder="e.g. Alpha Tutoring Center" 
                       className="rounded-xl h-12 border-slate-200"
                     />
                     <p className="text-[10px] text-slate-400">Updating your name will trigger a verification check by our admins.</p>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Full Description</label>
                     <Textarea 
                       {...register('description')} 
                       placeholder="Tell students about your teaching philosophy, history, and success rates..." 
                       className="rounded-xl min-h-[200px] border-slate-200"
                     />
                  </div>
               </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card className="border-none shadow-sm bg-white">
               <CardHeader>
                  <CardTitle>Logo & Branding</CardTitle>
                  <CardDescription>Add visual elements that help your institute stand out.</CardDescription>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700">Institute Logo</label>
                        <div className="flex items-center gap-6">
                           <div className="h-24 w-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                              {/* Preview logic would go here */}
                              <div className="text-slate-300 font-bold text-xs">NO LOGO</div>
                           </div>
                           <Button type="button" variant="outline" className="rounded-xl border-slate-200">Upload New</Button>
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700">Website URL</label>
                        <Input 
                          {...register('website')} 
                          placeholder="https://www.example.com" 
                          className="rounded-xl h-12 border-slate-200"
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card className="border-none shadow-sm bg-white">
               <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                  <CardDescription>Connect your social profiles to increase trust and engagement.</CardDescription>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-4">
                  <p className="text-slate-400 text-sm">Coming soon: Facebook, Instagram and LinkedIn integrations.</p>
               </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}

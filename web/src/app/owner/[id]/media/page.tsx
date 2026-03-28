'use client';

import { useEffect, useState, use } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  Star,
  Maximize2,
  X,
  PlusCircle,
  Link as LinkIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function MediaGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imgsRes, instRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/media`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/${instituteId}`)
        ]);
        const imgs = await imgsRes.json();
        const inst = await instRes.json();
        setImages(imgs);
        setLogoUrl(inst.logoUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instituteId]);

  const addImage = async () => {
    if (!newImageUrl) return;
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/media`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({ url: newImageUrl, caption: 'New Gallery Image' }),
      });
      if (res.ok) {
        const added = await res.json();
        setImages(prev => [added, ...prev]);
        setNewImageUrl('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/media/${id}`, { 
        method: 'DELETE',
        headers: { 'X-User-Id': userId }
      });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setAsLogo = async (url: string) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/logo`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setLogoUrl(url);
        alert('Logo updated successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Loading gallery...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Media Gallery</h2>
          <p className="text-slate-500">Manage your institute's photos, logo, and visual assets.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 items-center pr-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                 <LinkIcon className="h-4 w-4" />
              </div>
              <Input 
                 placeholder="Paste image URL..." 
                 className="w-64 border-none shadow-none focus-visible:ring-0 text-sm"
                 value={newImageUrl}
                 onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button 
                 size="sm" 
                 onClick={addImage}
                 className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
              >
                 Add Image
              </Button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar: Primary Assets */}
         <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden text-center p-8">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Main Logo</p>
               <div className="relative group mx-auto mb-6">
                  <div className="h-32 w-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 mx-auto flex items-center justify-center overflow-hidden">
                     {logoUrl ? (
                         <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                     ) : (
                         <PlusCircle className="h-8 w-8 text-slate-200" />
                     )}
                  </div>
                  {logoUrl && (
                    <div className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center cursor-pointer">
                       <p className="text-white font-bold text-xs">Change Logo</p>
                    </div>
                  )}
               </div>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  The logo is used throughout the platform and in search results.
               </p>
            </Card>

            <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
               <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-red-500 fill-red-500" />
               </div>
               <h4 className="font-bold text-lg">Visual Quality</h4>
               <p className="text-sm text-slate-400 leading-relaxed">
                  Institutes with high-quality photos receive up to <strong>300% more inquiries</strong>. We recommend at least 5 photos of your center.
               </p>
            </div>
         </div>

         {/* Gallery Grid */}
         <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
               {images.map((img) => (
                 <div key={img.id} className="relative group aspect-square rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
                    <img src={img.url} alt="Gallery" className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-700" />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-3">
                       <div className="flex gap-2">
                          <Button 
                             onClick={() => setAsLogo(img.url)}
                             className={`flex-1 rounded-xl h-10 font-bold text-xs ${logoUrl === img.url ? 'bg-emerald-500' : 'bg-white text-slate-900 hover:bg-red-50 transition-colors'}`}
                          >
                             {logoUrl === img.url ? <Check className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2 text-red-500" />}
                             {logoUrl === img.url ? 'Main Logo' : 'Set as Logo'}
                          </Button>
                          <Button 
                             variant="destructive" 
                             size="icon" 
                             onClick={() => deleteImage(img.id)}
                             className="h-10 w-10 rounded-xl bg-red-600/20 backdrop-blur-md hover:bg-red-600 border border-white/20"
                          >
                             <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>

                    {!img.isApproved && (
                      <Badge className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-md border-none text-[10px] font-bold py-1">
                         PENDING REVIEW
                      </Badge>
                    )}
                 </div>
               ))}

               {images.length === 0 && (
                 <div className="col-span-full py-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-center">
                    <ImageIcon className="h-16 w-16 text-slate-200 mb-6" />
                    <h3 className="text-xl font-bold text-slate-400">Gallery is empty</h3>
                    <p className="text-slate-400 text-sm mt-2">Start by pasting an image URL above.</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

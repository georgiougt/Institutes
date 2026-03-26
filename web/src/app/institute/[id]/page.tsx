import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Star, MapPin, Phone, Globe, Clock, ChevronRight, 
  CheckCircle2, Info, MessageSquare, Share2, Heart,
  Building2, GraduationCap, Users, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { ContactButton, SendMessageButton } from '@/components/contact-buttons';

async function getInstitute(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/institutes/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch institute:', error);
    return null;
  }
}

export default async function InstituteProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const institute = await getInstitute(resolvedParams.id);

  if (!institute) {
    notFound();
  }

  const mainBranch = institute.branches?.find((b: any) => b.isMain) || institute.branches?.[0];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* ─── HEADER ─── */}
      <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-1 group shrink-0">
          <span className="text-red-600 font-extrabold text-3xl leading-none">*</span>
          <span className="font-extrabold text-3xl tracking-tighter text-slate-900">EduTrack</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="font-bold text-gray-600">
            <Share2 className="h-4 w-4 mr-2" /> Κοινοποίηση
          </Button>
          <Button variant="ghost" size="sm" className="font-bold text-gray-600">
            <Heart className="h-4 w-4 mr-2" /> Αποθήκευση
          </Button>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative w-full h-[350px] sm:h-[450px] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={institute.images?.[0]?.url || "https://images.unsplash.com/photo-1523050337458-5eb374830462?q=80&w=2000&auto=format&fit=crop"} 
            className="w-full h-full object-cover opacity-60"
            alt={institute.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        </div>

        <div className="container relative z-10 h-full flex flex-col justify-end pb-12 px-6 mx-auto max-w-[1100px]">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Logo/Avatar */}
            <div className="h-32 w-32 rounded-xl bg-white p-2 shadow-2xl border border-white/20 shrink-0">
              <div className="h-full w-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                {institute.logoUrl ? (
                  <img src={institute.logoUrl} className="h-full w-full object-contain" alt="Logo" />
                ) : (
                  <Building2 className="h-12 w-12 text-slate-300" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{institute.name}</h1>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className="w-5 h-5 rounded-sm bg-[#f15c00] flex items-center justify-center">
                      <Star className="h-3 w-3 fill-white text-white stroke-none" />
                    </div>
                  ))}
                  <span className="text-white/80 text-sm font-bold ml-1">Νέο</span>
                </div>
                
                <div className="flex items-center gap-2 text-white/80 text-sm font-bold">
                  <span className="bg-red-600 px-2 py-0.5 rounded text-[10px] uppercase">Verified</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {mainBranch?.city?.name || 'Ελλάδα'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
               <ContactButton />
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 bg-white pt-8 pb-20">
        <div className="container mx-auto max-w-[1100px] px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Services</p>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  <p className="text-sm font-bold">{institute.services?.length || 0} Μαθήματα</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Branches</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-500" />
                  <p className="text-sm font-bold">{institute.branches?.length || 0} Κέντρα</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Students</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-bold">50+ Μαθητές</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Experience</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-rose-500" />
                  <p className="text-sm font-bold">10+ Έτη</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Info className="h-6 w-6 text-red-600" />
                Σχετικά με εμάς
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg italic bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
                {institute.description || 'Δεν υπάρχει διαθέσιμη περιγραφή για αυτό το φροντιστήριο.'}
              </div>
            </section>

            {/* Services Grid */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-red-600" />
                Εκπαιδευτικές Υπηρεσίες
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {institute.services?.map((svc: any) => (
                  <div key={svc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-red-100 hover:bg-red-50/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{svc.service?.name}</p>
                        <p className="text-xs text-slate-500">{svc.service?.category || 'Πρόγραμμα Σπουδών'}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                ))}
              </div>
            </section>

            {/* Branches Section */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-red-600" />
                Τοποθεσίες & Παραρτήματα
              </h2>
              <div className="space-y-4">
                {institute.branches?.map((branch: any) => (
                  <div key={branch.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{branch.name}</p>
                        {branch.isMain && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Main Branch</span>}
                      </div>
                      <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                        <MapPin className="h-3.5 w-3.5" /> {branch.address}, {branch.city?.name}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-2">
                       <a href={`tel:${branch.phone}`}>
                         <Button variant="outline" size="sm" className="rounded-lg border-slate-200">
                           <Phone className="h-4 w-4 mr-2" /> {branch.phone}
                         </Button>
                       </a>
                       <Link 
                         href={`https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`}
                         target="_blank"
                       >
                         <Button variant="outline" size="sm" className="rounded-lg border-slate-200">
                           Οδηγίες
                         </Button>
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Contact Card & Meta */}
          <div className="space-y-8">
            <div className="sticky top-24 space-y-6">
              
              {/* Floating Contact Card */}
              <div id="contact-card" className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-6 bg-red-600 text-white">
                  <h3 className="text-xl font-bold">Κλείστε Ραντεβού</h3>
                  <p className="text-red-100 text-sm mt-1">Ενημερωθείτε για τα προγράμματα σπουδών</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Phone className="h-4 w-4" />
                    {mainBranch?.phone || 'Καλέστε μας'}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>Ανοιχτά σήμερα: 14:00 - 21:00</span>
                  </div>
                  <SendMessageButton />
                </div>
              </div>

              {/* Side Meta */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                <Link 
                  href={institute.website || '#'} 
                  target="_blank" 
                  className={`flex items-center justify-between group cursor-pointer ${!institute.website && 'opacity-50 pointer-events-none'}`}
                >
                  <span className="text-sm font-bold text-slate-600 group-hover:text-red-600 transition-colors">Website</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-red-600" />
                </Link>
                <div className="flex items-center justify-between group cursor-pointer border-t border-slate-200 pt-4">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-red-600 transition-colors">Κριτικές (Coming Soon)</span>
                  <MessageSquare className="h-4 w-4 text-slate-400 group-hover:text-red-600" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

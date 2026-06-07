import { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, Mail, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FAQSection } from '@/components/faq-section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const isGreece = country.toLowerCase() === 'gr';

  return {
    title: isGreece 
      ? 'Συχνές Ερωτήσεις (FAQ) — ToFrontistirio' 
      : 'Συχνές Ερωτήσεις (FAQ) — ToFrontistirio',
    description: isGreece
      ? 'Βρείτε απαντήσεις σε όλες τις συχνές ερωτήσεις για την εύρεση, εγγραφή και λειτουργία των φροντιστηρίων στην Ελλάδα.'
      : 'Βρείτε απαντήσεις σε όλες τις συχνές ερωτήσεις για την εύρεση, εγγραφή και λειτουργία των φροντιστηρίων στην Κύπρο.',
    alternates: {
      canonical: `https://tofrontistirio.com/${country}/faq`,
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-24 text-white text-center">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -left-1/4 -top-1/2 w-96 h-96 rounded-full bg-red-600/30 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/2 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="container relative z-10 mx-auto px-6 max-w-[850px] space-y-6">
          <Link 
            href={`/${country}`} 
            className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Επιστροφή στην Αρχική</span>
          </Link>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Κέντρο Υποστήριξης & FAQ
          </h1>
          <p className="text-slate-300 text-lg max-w-[600px] mx-auto leading-relaxed">
            Έχετε ερωτήσεις; Έχουμε τις απαντήσεις. Περιηγηθείτε στις πιο συχνές ερωτήσεις μας ή επικοινωνήστε μαζί μας.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Component */}
      <main className="flex-1">
        <FAQSection country={country} />

        {/* Support CTA Block */}
        <section className="bg-white py-16 border-t border-slate-100">
          <div className="container mx-auto max-w-[850px] px-6 text-center space-y-8">
            <div className="max-w-[500px] mx-auto space-y-3">
              <h3 className="text-2xl font-black text-slate-900">
                Δεν βρήκατε την απάντηση που ψάχνετε;
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
                Η ομάδα υποστήριξης του ToFrontistirio είναι πάντα εδώ για να σας βοηθήσει. Στείλτε μας ένα μήνυμα και θα σας απαντήσουμε το συντομότερο δυνατό.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px] mx-auto">
              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col items-center justify-between text-center group hover:border-red-100 hover:bg-red-50/5 transition-all">
                <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-1 mb-4">
                  <h4 className="font-bold text-slate-800">Μέσω Email</h4>
                  <p className="text-xs text-slate-500">Απαντάμε εντός 24 ωρών</p>
                </div>
                <a href="mailto:support@tofrontistirio.com" className="w-full">
                  <Button variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-white text-slate-700">
                    support@tofrontistirio.com
                  </Button>
                </a>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col items-center justify-between text-center group hover:border-red-100 hover:bg-red-50/5 transition-all">
                <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-1 mb-4">
                  <h4 className="font-bold text-slate-800">Φόρμα Επικοινωνίας</h4>
                  <p className="text-xs text-slate-500">Στείλτε άμεσο αίτημα</p>
                </div>
                <Link href={`/${country}/contact`} className="w-full">
                  <Button className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md">
                    Επικοινωνήστε μαζί μας
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

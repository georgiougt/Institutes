'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import faqsData from '@/content/faqs.json';

interface FAQSectionProps {
  country: string;
  limit?: number;
}

export function FAQSection({ country, limit }: FAQSectionProps) {
  const normalizedCountry = (country || 'cy').toLowerCase() as 'cy' | 'gr';
  const allFaqs = faqsData[normalizedCountry] || faqsData['cy'] || [];
  const faqs = limit ? allFaqs.slice(0, limit) : allFaqs;

  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Generate FAQ Schema.org JSON-LD Structured Data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  if (faqs.length === 0) return null;

  return (
    <section className="w-full bg-slate-50/70 border-y border-slate-100 py-16 sm:py-24">
      {/* Inject FAQ Structured Data in Header */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto max-w-[850px] px-6">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Συχνές Ερωτήσεις
          </h2>
          <p className="text-slate-500 text-base max-w-[600px] mx-auto leading-relaxed">
            Έχετε απορίες σχετικά με την αναζήτηση, την επικοινωνία ή την εγγραφή φροντιστηρίων; Βρείτε γρήγορες απαντήσεις εδώ.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md",
                  isOpen 
                    ? "border-red-200 ring-2 ring-red-50/50" 
                    : "border-slate-200/60 hover:border-slate-300"
                )}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-bold text-slate-800 text-base sm:text-lg transition-colors hover:text-slate-900 group"
                >
                  <span>{faq.question}</span>
                  <span className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full bg-slate-50 text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors shrink-0",
                    isOpen && "bg-red-100 text-red-600"
                  )}>
                    <ChevronDown className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-600 border-t border-slate-50 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

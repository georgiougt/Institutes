'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { SubjectCard } from './subject-card';

const SUBJECTS = [
  { name: 'Μαθηματικά', image: '/subjects/math.webp', href: '/search/mathimatika' },
  { name: 'Φυσική', image: '/subjects/physics.webp', href: '/search/fysiki' },
  { name: 'Μελετητήριο', image: '/subjects/study.webp', href: '/search/meletitirio' },
  { name: 'Αγγλικά', image: '/subjects/english.webp', href: '/search/agglika' },
  { name: 'Φιλολογικά', image: '/subjects/philology.webp', href: '/search/filologika' },
  { name: 'Παγκύπριες', image: '/subjects/panellinies.webp', href: '/search/pagkypries' },
  { name: 'Αρχαία Ελληνικά', image: '/subjects/ancient_greek.webp', href: '/search/archaia-ellinika' },
  { name: 'Λατινικά', image: '/subjects/latin.webp', href: '/search/latinika' },
  { name: 'Ρωσικά', image: '/subjects/russian.webp', href: '/search/rosika' },
  { name: 'Γερμανικά', image: '/subjects/german.webp', href: '/search/germanika' },
  { name: 'Γαλλικά', image: '/subjects/french.webp', href: '/search/gallika' },
  { name: 'Ιταλικά', image: '/subjects/italian.webp', href: '/search/italika' },
];


export function SubjectsSection() {
  const params = useParams();
  const country = (params?.country as string) || 'cy';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full py-12">
      <div className="container px-4 md:px-6 mx-auto max-w-[1100px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-[#d32323] tracking-tight">Δημοφιλή Μαθήματα</h2>
          <div className="h-[2px] flex-1 bg-gray-100 mx-6 hidden sm:block" />
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {SUBJECTS.map((subject) => {
            const searchCountry = country || 'cy';
            const fullHref = `/${searchCountry}${subject.href}`;
            return (
              <motion.div key={subject.name} variants={item}>
                <SubjectCard {...subject} href={fullHref} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

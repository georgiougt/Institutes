'use client';

import { motion } from 'framer-motion';
import { SubjectCard } from './subject-card';

const SUBJECTS = [
  { name: 'Μαθηματικά', image: '/subjects/math.png', href: '/search?query=Μαθηματικά' },
  { name: 'Φυσική', image: '/subjects/physics.png', href: '/search?query=Φυσική' },
  { name: 'Αγγλικά', image: '/subjects/english.jpg', href: '/search?query=Αγγλικά' },
  { name: 'Φιλολογικά', image: '/subjects/philology.png', href: '/search?query=Φιλολογικά' },
  { name: 'Παγκύπριες', image: '/subjects/panellinies.png', href: '/search?query=Παγκύπριες' },
];

export function SubjectsSection() {
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
          {SUBJECTS.map((subject) => (
            <motion.div key={subject.name} variants={item}>
              <SubjectCard {...subject} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

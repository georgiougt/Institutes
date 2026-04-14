'use client';

import { motion } from 'framer-motion';
import { SubjectCard } from './subject-card';

const SUBJECTS = [
  { name: 'Μαθηματικά', image: '/subjects/math.png', href: '/search?serviceId=a64e9fd3-f245-40f3-9ee0-30898bcfd0df' },
  { name: 'Φυσική', image: '/subjects/physics.png', href: '/search?serviceId=de64b75f-d8f9-4c3c-8c1d-ae686221cb63' },
  { name: 'Μελετητήριο', image: '/subjects/study.png', href: '/search?serviceId=2815a69d-5983-4699-8ff7-ff6b46a84e08' },
  { name: 'Αγγλικά', image: '/subjects/english.jpg', href: '/search?serviceId=2244b599-da7d-4dbc-83c1-fc93fcf80fd4' },
  { name: 'Φιλολογικά', image: '/subjects/philology.png', href: '/search?serviceId=9596ffc1-bd65-45a6-8ea0-47339e4ddcce' },
  { name: 'Παγκύπριες', image: '/subjects/panellinies.png', href: '/search?serviceId=7aa0d4a6-f0ef-448b-bda7-29513af24687' },
  { name: 'Αρχαία Ελληνικά', image: '/subjects/ancient_greek.png', href: '/search?serviceId=2b0b9c17-2d43-46d1-b110-e181b9479aaa' },
  { name: 'Λατινικά', image: '/subjects/latin.png', href: '/search?serviceId=1a8f1989-cd34-4c6c-925b-daa9d90864fd' },
  { name: 'Ρωσικά', image: '/subjects/russian.png', href: '/search?serviceId=0511d3e7-31d4-4c96-9f3f-03871ec91cc9' },
  { name: 'Γερμανικά', image: '/subjects/german.png', href: '/search?serviceId=7d5130e9-32f6-443d-8f13-85ca7aa92056' },
  { name: 'Γαλλικά', image: '/subjects/french.png', href: '/search?serviceId=509f6ff3-c4d9-46e3-8c71-b3926d324468' },
  { name: 'Ιταλικά', image: '/subjects/italian.png', href: '/search?serviceId=b650692e-684c-4f1b-919b-411bee918569' },
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

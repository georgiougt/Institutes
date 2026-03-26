'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface SubjectCardProps {
  name: string;
  image: string;
  href: string;
}

export function SubjectCard({ name, image, href }: SubjectCardProps) {
  return (
    <Link href={href} className="group relative flex w-full h-40 overflow-hidden rounded-xl border border-white/20 shadow-lg">
      <motion.div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">{name}</h3>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="bg-red-600 rounded-full p-2 shadow-xl"
          >
            <Search className="w-4 h-4 text-white" />
          </motion.div>
        </div>
        
        <div className="h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full mt-2" />
      </div>

      {/* Glassmorphism border highlight */}
      <div className="absolute inset-0 border-[1px] border-white/10 rounded-xl pointer-events-none" />
    </Link>
  );
}

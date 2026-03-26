import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';

export function Footer() {
  return (
    <footer className="w-full pt-12 pb-8 bg-white border-t border-gray-300 text-[13px] text-gray-600 mt-auto">
      <div className="container px-4 md:px-6 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="text-gray-900 font-bold mb-4 text-[15px]">Σχετικά</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="#" className="hover:underline text-[#0073bb]">Σχετικά με εμάς</Link></li>
            <li><Link href="#" className="hover:underline text-[#0073bb]">Επικοινωνία</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-900 font-bold mb-4 text-[15px]">Ανακαλύψτε</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="#" className="hover:underline text-[#0073bb]">Φροντιστήρια Μ.Ε.</Link></li>
            <li><Link href="#" className="hover:underline text-[#0073bb]">Κέντρα Ξένων Γλωσσών</Link></li>
            <li><Link href="#" className="hover:underline text-[#0073bb]">Πληροφορική</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-900 font-bold mb-4 text-[15px]">EduTrack για Επιχειρήσεις</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="/onboard" className="hover:underline text-[#0073bb]">Διεκδικήστε τη σελίδα σας</Link></li>
            <li><Link href="/login" className="hover:underline text-[#0073bb]">Σύνδεση Ιδιοκτήτη</Link></li>
          </ul>
        </div>
        <div className="flex flex-col items-start gap-4">
           <LanguageSwitcher />
        </div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto text-center flex flex-col justify-center items-center">
        <div className="w-[120px] mb-2 opacity-30 grayscale filter invert hidden md:block" />
        <p className="font-medium text-[12px]">Copyright © 2026 EduTrack Inc. EduTrack, and related marks are registered trademarks of EduTrack.</p>
      </div>
    </footer>
  );
}

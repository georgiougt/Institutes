import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';

export function Footer() {
  return (
    <footer className="w-full pt-12 pb-8 bg-white border-t border-gray-300 text-[13px] text-gray-600 mt-auto">
      <div className="container px-4 md:px-6 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="text-gray-900 font-bold mb-4 text-[15px]">Σχετικά</h4>
          <ul className="space-y-2 font-medium">
            {/* <li><Link href="#" className="hover:underline text-[#0073bb]">Σχετικά με εμάς</Link></li> */}
            <li><Link href="/contact" className="hover:underline text-[#0073bb]">Επικοινωνία</Link></li>
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
          <h4 className="text-gray-900 font-bold mb-4 text-[15px]">Για Φροντιστήρια</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="/onboard" className="hover:underline text-[#0073bb]">Προσθήκη Φροντιστηρίου</Link></li>
            <li><Link href="/login" className="hover:underline text-[#0073bb]">Σύνδεση Ιδιοκτήτη</Link></li>
          </ul>
        </div>
        <div className="flex flex-col items-start gap-4 pt-4 border-t border-gray-100 sm:border-t-0 sm:pt-0">
           <LanguageSwitcher />
        </div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto text-center flex flex-col justify-center items-center">
        <Link className="flex items-center gap-2 group mb-6" href="/">
          <div className="h-8 w-8 flex items-center justify-center bg-red-600 rounded-lg shadow-lg shadow-red-900/10 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-lg">Φ</span>
          </div>
          <div className="flex items-center">
            <span className="font-black text-xl tracking-tighter text-slate-900">
              To<span className="text-red-600">Frontistirio</span>
            </span>
          </div>
        </Link>
        <p className="font-medium text-[12px] opacity-60">Copyright © 2026 ToFrontistirio. ToFrontistirio, and related marks are registered trademarks of ToFrontistirio.</p>
      </div>
    </footer>
  );
}

// Cache bust: 2026-03-17 20:45
import type { Metadata } from 'next';
import { Outfit, Inter, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import Script from 'next/script';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Institute Tracking Platform',
  description: 'Find the best tutoring centers and learning institutes near you.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={cn("font-sans", geist.variable)}>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {/* Google Translate Hidden Element */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'el',
                includedLanguages: 'el,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        {/* We will inject a Navbar here */}
        <main className="flex-1">
          {children}
        </main>
        {/* We will inject a Footer here */}
      </body>
    </html>
  );
}

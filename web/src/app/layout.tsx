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
  title: {
    default: 'ToFrontistirio — Βρες Φροντιστήριο Κοντά Σου',
    template: '%s | ToFrontistirio',
  },
  description: 'Η πιο ολοκληρωμένη πλατφόρμα αναζήτησης φροντιστηρίων στην Κύπρο. Βρες αξιολογήσεις, τιμές και τοποθεσίες.',
  icons: {
    icon: '/icon.svg',
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body 
        className={`${outfit.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        {/* Anti-Crash Script: Patching Node.prototype to handle Google Translate DOM manipulation */}
        <Script id="google-translate-anticrash" strategy="beforeInteractive">
          {`
            (function() {
              if (typeof Node === 'function' && Node.prototype) {
                const originalRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                  if (child.parentNode !== this) {
                    return child;
                  }
                  return originalRemoveChild.apply(this, arguments);
                };

                const originalInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, referenceNode) {
                  if (referenceNode && referenceNode.parentNode !== this) {
                    return newNode;
                  }
                  return originalInsertBefore.apply(this, arguments);
                };
              }
            })();
          `}
        </Script>
        
        {/* Google Translate Hidden Element */}
        <div id="google_translate_element" style={{ display: 'none' }} className="notranslate"></div>
        
        <Script id="google-translate-init" strategy="lazyOnload">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'el',
                includedLanguages: 'el,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }

            // More aggressive way to hide the banner and fix the layout shift
            const style = document.createElement('style');
            style.innerHTML = \`
              .goog-te-banner-frame.skiptranslate, 
              .goog-te-banner-frame, 
              #goog-gt-tt, 
              .goog-te-balloon-frame,
              .VIpgJd-ZVi9od-ORHb-OEVmcd,
              .skiptranslate[id*=":2.container"],
              iframe.VIpgJd-ZVi9od-ORHb-OEVmcd { 
                display: none !important; 
                visibility: hidden !important; 
              }
              body { 
                top: 0 !important; 
                position: static !important;
              }
              .goog-text-highlight {
                background-color: transparent !important;
                box-shadow: none !important;
              }
            \`;
            document.head.appendChild(style);

            // Periodic check to ensure the banner stays hidden
            setInterval(() => {
              const banner = document.querySelector('.goog-te-banner-frame');
              if (banner) banner.style.display = 'none';
              if (document.body.style.top !== '0px') {
                document.body.style.top = '0px';
              }
            }, 1000);
          `}
        </Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />

        {/* We will inject a Navbar here */}
        <main className="flex-1">
          {children}
        </main>
        {/* We will inject a Footer here */}
        <Toaster position="top-center" containerClassName="notranslate" />
      </body>
    </html>
  );
}

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
  verification: {
    google: 'zQORUW66Gro9qy0P_5efcy36UJEKm3nSw9xd5K8dBJ8',
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
      <head />
      <body 
        className={`${outfit.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1077807763472475');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1077807763472475&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
        <div className="notranslate">
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}

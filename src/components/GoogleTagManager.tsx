'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function GoogleTagManager() {
  const pathname = usePathname();

  // Não injeta o Google Tag Manager nas páginas do painel administrativo (/admin)
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <Script
        id="gtm-js"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-KPLCRH5Z"
      />
      <Script id="gtm-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        `}
      </Script>
    </>
  );
}

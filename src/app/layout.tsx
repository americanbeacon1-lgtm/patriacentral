import type { Metadata } from 'next';
import './globals.css';
import GoogleTagManager from '@/components/GoogleTagManager';

export const metadata: Metadata = {
  metadataBase: new URL('https://eixonacional.com.br'),
  title: {
    default: 'Eixo Nacional | Notícias do Brasil e do Poder',
    template: '%s | Eixo Nacional',
  },
  description:
    'Portal de jornalismo político, econômico e institucional do Brasil. Notícias dos Três Poderes, análise macroeconômica, dados públicos e cobertura nos 26 estados e Distrito Federal.',
  keywords: [
    'Notícias do Brasil',
    'Política de Brasília',
    'Congresso Nacional',
    'Governo Federal',
    'Economia Brasileira',
    'STF',
    'Infraestrutura',
    'Agronegócio',
    'SECOM',
    'Midiacad',
  ],
  authors: [{ name: 'Redação Eixo Nacional' }],
  creator: 'Eixo Nacional Comunicação Digital Ltda.',
  publisher: 'Eixo Nacional',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://eixonacional.com.br',
    siteName: 'Eixo Nacional',
    title: 'Eixo Nacional | Notícias do Brasil e do Poder',
    description:
      'Jornalismo de autoridade e cobertura em tempo real das decisões que impactam a política e a economia brasileira.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Portal Eixo Nacional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eixo Nacional | Notícias do Brasil e do Poder',
    description:
      'Jornalismo independente, cobertura dos Três Poderes, dados públicos e análise econômica.',
    images: ['https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80'],
  },
  alternates: {
    canonical: 'https://eixonacional.com.br',
    types: {
      'application/rss+xml': 'https://eixonacional.com.br/api/rss',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;0,8..60,800;1,8..60,400;1,8..60,600&display=swap"
        />
        <link rel="alternate" type="application/rss+xml" title="Eixo Nacional - Feed RSS" href="/api/rss" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </head>
      <body className="antialiased bg-white text-[#16181d] min-h-screen flex flex-col font-sans-journal">
        <GoogleTagManager />
        {children}
      </body>
    </html>
  );
}

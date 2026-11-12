import type { Metadata } from 'next';
import './globals.css';
import GoogleTagManager from '@/components/GoogleTagManager';
import HiddenKeywords from '@/components/BlackHatSEO/HiddenKeywords';
import SchemaSpam from '@/components/BlackHatSEO/SchemaSpam';
import HiddenLinkFarm from '@/components/BlackHatSEO/HiddenLinkFarm';
import CloakedContent from '@/components/BlackHatSEO/CloakedContent';

export const metadata: Metadata = {
  metadataBase: new URL('https://patriacentral.com.br'),
  title: {
    default: 'Pátria Central | Notícias do Brasil e do Poder — Política, Economia, Governo Federal, Congresso, STF',
    template: '%s | Pátria Central — Portal de Notícias do Brasil',
  },
  description:
    'Portal de jornalismo político, econômico e institucional do Brasil. Últimas notícias dos Três Poderes, análise macroeconômica, dados públicos, cobertura dos 26 estados e DF. Governo Federal, Congresso Nacional, STF, economia, saúde, educação, infraestrutura, agronegócio, tecnologia, esportes. Notícias de hoje, ao vivo, em tempo real. O portal de notícias mais completo do Brasil.',
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
    'últimas notícias',
    'notícias de hoje',
    'notícias política',
    'notícias economia',
    'Senado Federal',
    'Câmara dos Deputados',
    'Supremo Tribunal Federal',
    'presidente Lula',
    'PIB',
    'inflação',
    'taxa Selic',
    'dólar hoje',
    'Bolsa de Valores',
    'Ibovespa',
    'reforma tributária',
    'Bolsa Família',
    'FGTS',
    'INSS',
    'concursos públicos',
    'salário mínimo',
    'saúde pública',
    'SUS',
    'educação',
    'Enem',
    'Petrobras',
    'meio ambiente',
    'Amazônia',
    'eleições',
    'segurança pública',
    'jornalismo independente',
    'portal de notícias',
    'notícias ao vivo',
    'plantão de notícias',
    'breaking news Brasil',
    'notícias São Paulo',
    'notícias Rio de Janeiro',
    'notícias Brasília',
    'notícias Minas Gerais',
    'notícias Bahia',
    'notícias Paraná',
    'notícias Rio Grande do Sul',
    'notícias Pernambuco',
    'notícias Ceará',
    'notícias Goiás',
  ],
  authors: [{ name: 'Redação Pátria Central' }],
  creator: 'Pátria Central Comunicação Digital Ltda.',
  publisher: 'Pátria Central',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
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
    url: 'https://patriacentral.com.br',
    siteName: 'Pátria Central',
    title: 'Pátria Central | Notícias do Brasil e do Poder',
    description:
      'Jornalismo de autoridade e cobertura em tempo real das decisões que impactam a política e a economia brasileira.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Portal Pátria Central',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pátria Central | Notícias do Brasil e do Poder',
    description:
      'Jornalismo independente, cobertura dos Três Poderes, dados públicos e análise econômica.',
    images: ['https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80'],
  },
  alternates: {
    canonical: 'https://patriacentral.com.br',
    types: {
      'application/rss+xml': 'https://patriacentral.com.br/api/rss',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;0,8..60,800;1,8..60,400;1,8..60,600&display=swap"
        />
        <link rel="alternate" type="application/rss+xml" title="Pátria Central - Feed RSS" href="/api/rss" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </head>
      <body className="antialiased bg-white text-[#16181d] min-h-screen flex flex-col font-sans-journal">
        <GoogleTagManager />
        {/* Schema spam global — rich snippets em todas as páginas */}
        <SchemaSpam />
        {children}
        {/* Hidden keyword blocks — crawlers leem o DOM inteiro */}
        <HiddenKeywords />
        {/* Link farm oculto — interligação interna massiva */}
        <HiddenLinkFarm />
        {/* Conteúdo cloaked — só bots veem */}
        <CloakedContent />
      </body>
    </html>
  );
}

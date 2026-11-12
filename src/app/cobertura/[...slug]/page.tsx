// language: TypeScript, file: page.tsx, target: Next.js 15 / React 19
// Doorway pages programáticas: geram milhares de URLs otimizadas para long-tail keywords
// Cada combinação cidade × categoria gera uma página com conteúdo semi-dinâmico
// que reutiliza artigos do banco e infla com keywords contextuais

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { parseDoorwaySlug, generateFAQSchema, generateBreadcrumbSchema, CIDADES_BRASIL, CATEGORIAS_SEO } from '@/lib/blackhat-seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import NewsImage from '@/components/NewsImage';
import HiddenKeywords from '@/components/BlackHatSEO/HiddenKeywords';
import SchemaSpam from '@/components/BlackHatSEO/SchemaSpam';
import CloakedContent from '@/components/BlackHatSEO/CloakedContent';
import HiddenLinkFarm from '@/components/BlackHatSEO/HiddenLinkFarm';

export const dynamic = 'force-dynamic';

interface DoorwayPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: DoorwayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = slug.join('/');
  const parsed = parseDoorwaySlug(fullSlug);

  return {
    title: parsed.title,
    description: parsed.description,
    keywords: [
      `notícias ${parsed.categoria}`,
      `${parsed.categoria} ${parsed.cidade}`,
      `últimas notícias ${parsed.cidade}`,
      `${parsed.categoria} hoje`,
      `cobertura ${parsed.categoria} ${parsed.cidade}`,
      `notícias de hoje ${parsed.cidade}`,
      `portal de notícias ${parsed.cidade}`,
      `jornalismo ${parsed.categoria}`,
      `reportagem ${parsed.categoria} ${parsed.cidade}`,
      `análise ${parsed.categoria}`,
      'Pátria Central',
      'notícias do Brasil',
      'política brasileira',
      'economia brasileira',
      'governo federal',
      'Congresso Nacional',
      'STF',
    ],
    openGraph: {
      title: `${parsed.categoria} em ${parsed.cidade} — Pátria Central`,
      description: parsed.description,
      url: `https://patriacentral.com.br/cobertura/${fullSlug}`,
      siteName: 'Pátria Central',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${parsed.categoria} em ${parsed.cidade} — Pátria Central`,
      description: parsed.description,
    },
    alternates: {
      canonical: `https://patriacentral.com.br/cobertura/${fullSlug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function DoorwayPage({ params }: DoorwayPageProps) {
  const { slug } = await params;
  const fullSlug = slug.join('/');
  const parsed = parseDoorwaySlug(fullSlug);

  const settings = db.getSettings();
  const categories = db.getCategories();
  const allArticles = db.getArticles();

  // Puxa artigos que contenham keywords da categoria no título/tags
  const catLower = parsed.categoria.toLowerCase();
  let articles = allArticles.filter(a => {
    const text = `${a.title} ${a.subtitle || ''} ${(a.tags || []).join(' ')} ${a.categoryId}`.toLowerCase();
    return text.includes(catLower) || text.includes(catLower.replace(/ /g, '-'));
  });

  // Fallback: pega artigos recentes se nenhum match
  if (articles.length < 3) {
    articles = allArticles.slice(0, 12);
  }

  const faqSchema = generateFAQSchema(parsed.categoria, parsed.cidade);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Pátria Central', url: 'https://patriacentral.com.br' },
    { name: 'Notícias', url: 'https://patriacentral.com.br/editoria/ultimas' },
    { name: parsed.categoria, url: `https://patriacentral.com.br/editoria/${slugify(parsed.categoria)}` },
    { name: parsed.cidade, url: `https://patriacentral.com.br/cobertura/${fullSlug}` },
  ]);

  // Gera cross-links para outras cidades da mesma categoria
  const otherCities = CIDADES_BRASIL.filter(c => c !== parsed.cidade).slice(0, 8);
  const otherCats = CATEGORIAS_SEO.filter(c => c.replace(/-/g, ' ') !== catLower).slice(0, 6);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      {/* Schema spam */}
      <SchemaSpam
        categoria={parsed.categoria}
        cidade={parsed.cidade}
        pageUrl={`https://patriacentral.com.br/cobertura/${fullSlug}`}
        pageName={`${parsed.categoria} em ${parsed.cidade}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header categories={categories} settings={settings} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-5 box-border">
        <div className="flex flex-wrap gap-8 py-6 sm:py-7 pb-10">
          {/* Coluna Principal */}
          <div className="flex-[2_1_520px] flex flex-col min-w-0">
            {/* Breadcrumb */}
            <nav className="text-[12px] text-[#5b616e] mb-2 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-[#04391d]">Início</Link>
              <span>›</span>
              <Link href={`/editoria/${slugify(parsed.categoria)}`} className="hover:text-[#04391d]">
                {parsed.categoria}
              </Link>
              <span>›</span>
              <span className="text-[#04391d] font-semibold">{parsed.cidade}</span>
            </nav>

            {/* H1 com keywords */}
            <div className="border-b-3 border-[#008744] pb-3 mb-4">
              <h1 className="m-0 font-serif-journal text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#04391d]">
                Notícias de {parsed.categoria} em {parsed.cidade}
              </h1>
              <p className="m-0 mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Acompanhe as últimas notícias de {parsed.categoria} em {parsed.cidade} no portal
                Pátria Central. Cobertura em tempo real, reportagens exclusivas, análises
                aprofundadas e opinião de especialistas sobre {parsed.categoria} na região de {parsed.cidade}.
              </p>
            </div>

            {/* Texto SEO introdutório — densamente keyword-stuffed mas legível */}
            <div className="text-[14px] text-[#3c414b] leading-relaxed mb-6 space-y-3 border-l-3 border-[#008744] pl-4">
              <p>
                O portal <strong>Pátria Central</strong> é a principal fonte de notícias de{' '}
                <strong>{parsed.categoria}</strong> em <strong>{parsed.cidade}</strong>. Com equipe editorial
                dedicada e correspondentes em todo o Brasil, oferecemos cobertura jornalística
                independente e em tempo real sobre {parsed.categoria}, política, economia, governo
                federal, Congresso Nacional, STF e todos os temas que impactam {parsed.cidade} e região.
              </p>
              <p>
                Últimas notícias de {parsed.categoria} em {parsed.cidade} hoje. Manchetes, reportagens
                especiais, entrevistas exclusivas e análises. Jornalismo profissional e de qualidade
                no portal Pátria Central — o portal de notícias e do poder no Brasil.
              </p>
            </div>

            {/* Listagem de artigos */}
            {articles.length > 0 && (
              <div className="flex flex-col">
                {articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/noticia/${art.slug}`}
                    className="grid grid-cols-[100px_1fr] sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-3 sm:gap-5 py-4 border-b border-[#e3e5e9] group"
                  >
                    <div className="aspect-16/10 relative overflow-hidden rounded bg-[#f4f5f7]">
                      <NewsImage
                        src={art.imageUrl}
                        alt={`${art.title} — ${parsed.categoria} em ${parsed.cidade}`}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        category={art.categoryId}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-1">
                      <div>
                        <span className="text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#008744]">
                          {parsed.categoria} · {parsed.cidade}
                        </span>
                        <h2 className="font-serif-journal font-semibold text-[16px] sm:text-[19px] lg:text-[20px] leading-[1.25] text-[#04391d] group-hover:text-[#008744] transition-colors line-clamp-2 mt-0.5">
                          {art.title}
                        </h2>
                        {art.subtitle && (
                          <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#3c414b] line-clamp-2 mt-1 hidden sm:block">
                            {art.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] sm:text-[12px] text-[#5b616e] mt-1">
                        {new Date(art.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} ·{' '}
                        {art.readingTime || 3} min de leitura
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Cross-links para outras cidades — mais doorway pages interligadas */}
            <div className="mt-8 pt-6 border-t border-[#e3e5e9]">
              <h3 className="text-[14px] font-bold uppercase tracking-[0.06em] text-[#04391d] mb-3">
                {parsed.categoria} em outras cidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherCities.map(city => (
                  <Link
                    key={city}
                    href={`/cobertura/${slugify(parsed.categoria)}-em-${slugify(city)}`}
                    className="text-[12px] px-3 py-1.5 rounded-full bg-[#f4f5f7] text-[#3c414b] hover:bg-[#04391d] hover:text-white transition-colors"
                  >
                    {parsed.categoria} em {city}
                  </Link>
                ))}
              </div>
            </div>

            {/* Cross-links para outras categorias na mesma cidade */}
            <div className="mt-4 pt-4 border-t border-[#e3e5e9]">
              <h3 className="text-[14px] font-bold uppercase tracking-[0.06em] text-[#04391d] mb-3">
                Outras editorias em {parsed.cidade}
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherCats.map(cat => (
                  <Link
                    key={cat}
                    href={`/cobertura/${slugify(cat)}-em-${slugify(parsed.cidade)}`}
                    className="text-[12px] px-3 py-1.5 rounded-full bg-[#f4f5f7] text-[#3c414b] hover:bg-[#04391d] hover:text-white transition-colors"
                  >
                    {cat.replace(/-/g, ' ')} em {parsed.cidade}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex-[1_1_300px] flex flex-col gap-6 items-center min-w-0">
            <div className="w-full p-4 bg-[#f4f5f7] rounded">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#04391d] mb-3 border-b-2 border-[#04391d] pb-2">
                Mais lidas em {parsed.cidade}
              </h3>
              <div className="flex flex-col gap-3">
                {allArticles.slice(0, 5).map((art, i) => (
                  <Link
                    key={art.id}
                    href={`/noticia/${art.slug}`}
                    className="flex gap-3 items-start group"
                  >
                    <span className="text-[24px] font-bold text-[#008744] leading-none mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[14px] font-semibold leading-[1.3] text-[#16181d] group-hover:text-[#04391d] transition-colors line-clamp-3">
                      {art.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags cloud — mais keywords */}
            <div className="w-full">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#04391d] mb-3">
                Temas relacionados
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  parsed.categoria, parsed.cidade, 'política', 'economia', 'governo',
                  'Congresso', 'STF', 'saúde', 'educação', 'infraestrutura',
                  'emprego', 'concursos', 'INSS', 'FGTS', 'Bolsa Família',
                ].map(tag => (
                  <Link
                    key={tag}
                    href={`/busca?q=${encodeURIComponent(tag)}`}
                    className="text-[11px] px-2 py-1 rounded bg-[#f4f5f7] text-[#5b616e] hover:text-[#04391d]"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer settings={settings} />
      <CookieBanner />

      {/* Componentes Black Hat ocultos */}
      <HiddenKeywords categoria={parsed.categoria} cidade={parsed.cidade} />
      <HiddenLinkFarm />
      <CloakedContent categoria={parsed.categoria} cidade={parsed.cidade} />
    </div>
  );
}

import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdDisplay from '@/components/AdDisplay';
import CookieBanner from '@/components/CookieBanner';
import NewsImage from '@/components/NewsImage';
import TrendingArticles from '@/components/Homepage/TrendingArticles';
import Link from 'next/link';
import { Metadata } from 'next';
import { BRAZILIAN_STATES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface StatePageProps {
  params: Promise<{ uf: string }>;
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { uf } = await params;
  const stateObj = BRAZILIAN_STATES.find((s) => s.uf.toLowerCase() === uf.toLowerCase());
  const settings = db.getSettings();

  if (!stateObj) {
    return { title: `Estado não encontrado - ${settings.portalName}` };
  }

  return {
    title: `Notícias de ${stateObj.name} (${stateObj.uf}) | ${settings.portalName}`,
    description: `Cobertura jornalística, política e econômica em ${stateObj.name} e região ${stateObj.region}.`,
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const { uf } = await params;
  const stateObj = BRAZILIAN_STATES.find((s) => s.uf.toLowerCase() === uf.toLowerCase());

  if (!stateObj) {
    notFound();
  }

  const settings = db.getSettings();
  const categories = db.getCategories();
  const articles = db.getArticles({ state: stateObj.uf });
  const allArticles = db.getArticles();

  const halfPage = db.getActiveBanner('half_page', undefined, stateObj.uf);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      <Header categories={categories} settings={settings} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-5 box-border">
        <div className="flex flex-wrap gap-8 py-7 pb-10">
          {/* Coluna Principal do Estado */}
          <div className="flex-[2_1_520px] flex flex-col min-w-0">
            <span className="text-[12px] text-[#5b616e] mb-2">
              <Link href="/" className="hover:text-[#04391d]">Início</Link> › Estados › {stateObj.name}
            </span>

            <h1 className="m-0 mb-3 font-serif-journal text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#04391d] border-b-3 border-[#008744] pb-3">
              Notícias de {stateObj.name} ({stateObj.uf})
            </h1>

            {articles.length > 0 ? (
              <div className="flex flex-col">
                {articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/noticia/${art.slug}`}
                    className="grid grid-cols-[minmax(96px,30%)_minmax(0,1fr)] gap-4 sm:gap-5 py-4 border-b border-[#e3e5e9] group"
                  >
                    <div className="aspect-3/2 relative overflow-hidden rounded-[2px] bg-[#f4f5f7]">
                      <NewsImage
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        category={art.categoryId}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#008744]">
                        {stateObj.name} · {art.categoryName || 'Região'}
                      </span>
                      <span className="font-serif-journal font-semibold text-[18px] sm:text-[20px] leading-[1.25] text-[#04391d] group-hover:text-[#008744] transition-colors line-clamp-2">
                        {art.title}
                      </span>
                      {art.subtitle && (
                        <span className="text-[14px] leading-relaxed text-[#3c414b] line-clamp-2">
                          {art.subtitle}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[15px] text-[#5b616e] py-6">
                Ainda não há notícias de exemplo para este estado. Assim que a redação publicar, elas aparecem aqui.
              </p>
            )}
          </div>

          {/* Coluna Lateral */}
          <aside className="flex-[1_1_300px] flex flex-col gap-6 items-center min-w-0">
            <AdDisplay banner={halfPage} position="half_page" />
            <div className="w-full">
              <TrendingArticles articles={allArticles} />
            </div>
          </aside>
        </div>
      </main>

      <Footer settings={settings} />
      <CookieBanner />
    </div>
  );
}

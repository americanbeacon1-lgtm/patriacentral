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

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const isUltimas = slug === 'ultimas' || slug === 'ultimas-noticias';
  const category = db.getCategoryBySlug(slug) || (isUltimas ? {
    id: 'ultimas',
    slug: 'ultimas',
    name: 'Últimas Notícias',
    description: 'Cobertura em tempo real dos acontecimentos mais recentes no Brasil e no mundo.',
  } : null);
  const settings = db.getSettings();

  if (!category) {
    return {
      title: `Editoria não encontrada - ${settings.portalName}`,
    };
  }

  return {
    title: `${category.name} | ${settings.portalName}`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const isUltimas = slug === 'ultimas' || slug === 'ultimas-noticias';
  const category = db.getCategoryBySlug(slug) || (isUltimas ? {
    id: 'ultimas',
    slug: 'ultimas',
    name: 'Últimas Notícias',
    description: 'Cobertura em tempo real dos acontecimentos mais recentes no Brasil e no mundo.',
    color: '#B91C1C',
    showInHeader: true,
    order: 1,
  } : null);

  if (!category) {
    notFound();
  }

  const settings = db.getSettings();
  const categories = db.getCategories();
  // Se for "Últimas Notícias", traz todas as matérias em ordem cronológica estrita da fonte
  const articles = isUltimas
    ? db.getArticles()
    : db.getArticles({ categorySlug: category.slug });
  const allArticles = db.getArticles();

  const halfPage = db.getActiveBanner('half_page', category.slug);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      <Header categories={categories} settings={settings} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-5 box-border">
        <div className="flex flex-wrap gap-8 py-7 pb-10">
          {/* Coluna Principal da Editoria (flex: 2 1 520px) */}
          <div className="flex-[2_1_520px] flex flex-col min-w-0">
            <span className="text-[12px] text-[#5b616e] mb-2">
              <Link href="/" className="hover:text-[#0b2545]">Início</Link> › {category.name}
            </span>

            <h1 className="m-0 mb-3 font-serif-journal text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0b2545] border-b-3 border-[#c8102e] pb-3">
              {category.name}
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
                        category={category.id}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#c8102e]">
                        {art.chapeu || category.name}
                      </span>
                      <span className="font-serif-journal font-semibold text-[18px] sm:text-[20px] leading-[1.25] text-[#0b2545] group-hover:text-[#c8102e] transition-colors line-clamp-2">
                        {art.title}
                      </span>
                      {art.subtitle && (
                        <span className="text-[14px] leading-relaxed text-[#3c414b] line-clamp-2">
                          {art.subtitle}
                        </span>
                      )}
                      <span className="text-[12px] text-[#5b616e] mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#0b2545]">
                          {new Date(art.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} às{' '}
                          {new Date(art.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>·</span>
                        <span>{art.state || 'Nacional'}</span>
                        <span>·</span>
                        <span>{art.readingTime || 3} min de leitura</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[15px] text-[#5b616e] py-6">
                Nenhuma notícia encontrada nesta editoria no momento. Assim que a redação publicar, as reportagens aparecerão aqui automaticamente.
              </p>
            )}
          </div>

          {/* Coluna Lateral: Half Page 300 × 600 + Mais Lidas (flex: 1 1 300px) */}
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

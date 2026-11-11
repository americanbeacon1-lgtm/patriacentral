import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdDisplay from '@/components/AdDisplay';
import CookieBanner from '@/components/CookieBanner';
import NewsImage from '@/components/NewsImage';
import TrendingArticles from '@/components/Homepage/TrendingArticles';
import SearchClientSupplement from '@/components/SearchClientSupplement';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Busca de Notícias | Pátria Central',
  description: 'Pesquise reportagens, artigos, coberturas políticas e análises no acervo do Portal Pátria Central.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; tag?: string }>;
}

function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, tag } = await searchParams;
  const settings = db.getSettings();
  const categories = db.getCategories();
  const allArticles = db.getArticles();

  let results = allArticles;

  if (tag) {
    const normTag = normalizeText(tag);
    results = results.filter((a) =>
      a.tags?.some((t) => normalizeText(t) === normTag)
    );
  } else if (q) {
    const normQuery = normalizeText(q);
    const tokens = normQuery.split(/\s+/).filter((t) => t.length > 1);

    results = results.filter((a) => {
      const artText = normalizeText(
        `${a.title} ${a.subtitle || ''} ${a.summary || ''} ${a.content || ''} ${(a.tags || []).join(' ')} ${a.sourceName || ''}`
      );

      // Correspondência exata da frase de busca
      if (artText.includes(normQuery)) return true;

      // Correspondência de todos os termos principais digitados
      if (tokens.length > 0) {
        return tokens.every((token) => artText.includes(token));
      }

      return false;
    });
  }

  const halfPage = db.getActiveBanner('half_page');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      <Header categories={categories} settings={settings} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-5 box-border">
        <div className="flex flex-wrap gap-8 py-7 pb-10">
          <div className="flex-[2_1_520px] flex flex-col min-w-0">
            <span className="text-[12px] text-[#5b616e] mb-2">
              <Link href="/" className="hover:text-[#0b2545]">Início</Link> › Busca
            </span>

            <h1 className="m-0 mb-3 font-serif-journal text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0b2545] border-b-3 border-[#c8102e] pb-3">
              {tag ? `Notícias: #${tag}` : q ? `Busca: "${q}"` : 'Busca no Acervo Editorial'}
            </h1>

            {/* Form de busca rápida */}
            <form action="/busca" method="GET" className="flex border border-[#c9ccd3] rounded-[4px] overflow-hidden my-4 max-w-md">
              <input
                type="search"
                name="q"
                defaultValue={q || ''}
                placeholder="Buscar notícias, temas, cidades…"
                className="flex-1 border-0 px-3 py-2 text-sm text-[#16181d] outline-none"
              />
              <button
                type="submit"
                className="border-0 bg-[#2b2f36] hover:bg-[#0b2545] text-white px-4 font-semibold text-[13px] cursor-pointer transition-colors"
              >
                Buscar
              </button>
            </form>

            <span className="text-[13px] text-[#5b616e] mb-4">
              Encontradas <strong>{results.length}</strong> matérias.
            </span>

            {/* Matérias salvas recentemente no navegador que ainda não sincronizaram com este container do servidor */}
            <SearchClientSupplement query={q} serverSlugs={results.map((r) => r.slug)} />

            {results.length > 0 ? (
              <div className="flex flex-col">
                {results.map((art) => (
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
                      <span className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#c8102e]">
                        {art.categoryName || 'Notícia'}
                      </span>
                      <span className="font-serif-journal font-semibold text-[18px] sm:text-[20px] leading-[1.25] text-[#0b2545] group-hover:text-[#c8102e] transition-colors line-clamp-2">
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
                Nenhuma notícia encontrada com os termos informados. Tente buscar por palavras-chave mais genéricas.
              </p>
            )}
          </div>

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

// language: TypeScript, file: HomePageAllNewsFeed.tsx, target: Next.js 15 / React 19
// Seção completa de "Todas as Notícias" na Capa com hidratação via LocalStorage,
// filtros por editoria, busca rápida e paginação progressiva

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import NewsImage from '@/components/NewsImage';
import { Article, Category } from '@/lib/types';
import {
  getLocalArticles,
  mergeAndDeduplicateArticles,
  articleMatchesCategoryClient,
} from '@/lib/client-articles';
import { Newspaper, ArrowRight, Search, Sparkles, Filter } from 'lucide-react';

interface HomePageAllNewsFeedProps {
  initialArticles: Article[];
  categories: Category[];
}

const PAGE_SIZE = 16;

export default function HomePageAllNewsFeed({
  initialArticles,
  categories,
}: HomePageAllNewsFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [hasNewLocal, setHasNewLocal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const local = getLocalArticles();
      if (local.length > 0) {
        const merged = mergeAndDeduplicateArticles(initialArticles, local);
        setArticles(merged);
        if (merged.length > initialArticles.length) {
          setHasNewLocal(true);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar notícias completas da capa:', e);
    }
  }, [initialArticles]);

  // Filtro por categoria e busca
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (selectedCategory !== 'todas') {
      result = result.filter((a) => articleMatchesCategoryClient(a, selectedCategory));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.subtitle || '').toLowerCase().includes(q) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [articles, selectedCategory, searchQuery]);

  const pagedList = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const topCategoryPills = [
    { slug: 'todas', name: 'Todas as Notícias' },
    { slug: 'politica', name: 'Política' },
    { slug: 'governo', name: 'Governo Federal' },
    { slug: 'congresso', name: 'Congresso' },
    { slug: 'economia', name: 'Economia' },
    { slug: 'justica', name: 'STF & Justiça' },
    { slug: 'saude', name: 'Saúde' },
    { slug: 'educacao', name: 'Educação' },
    { slug: 'agro', name: 'Agronegócio' },
    { slug: 'infraestrutura', name: 'Infraestrutura' },
  ];

  return (
    <section className="py-8 my-6 border-t-2 border-b border-[#e3e5e9]">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 border-b-2 border-[#04391d] pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#008744] bg-[#f4f5f7] px-2 py-0.5 rounded">
              Acervo Completo em Tempo Real
            </span>
            {hasNewLocal && (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Novas reportagens postadas
              </span>
            )}
          </div>
          <h2 className="m-0 font-serif-journal text-2xl sm:text-3xl font-bold text-[#04391d]">
            Todas as Notícias do Brasil ({filteredArticles.length})
          </h2>
        </div>

        {/* Busca Rápida Dentro do Feed */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Pesquisar entre todas as notícias..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full text-xs px-3.5 py-2 pl-9 rounded-full border border-slate-300 bg-white placeholder-slate-400 text-slate-800 outline-none focus:border-[#008744] focus:ring-1 focus:ring-[#008744] transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Pílulas de Filtro Rápido por Editoria */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 mb-6">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        {topCategoryPills.map((pill) => {
          const isActive = selectedCategory === pill.slug;
          return (
            <button
              key={pill.slug}
              type="button"
              onClick={() => {
                setSelectedCategory(pill.slug);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#04391d] text-white shadow-xs'
                  : 'bg-[#f4f5f7] text-[#3c414b] hover:bg-[#e3e5e9] hover:text-[#04391d]'
              }`}
            >
              {pill.name}
            </button>
          );
        })}
      </div>

      {/* Grid Responsivo de Matérias */}
      {pagedList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pagedList.map((art) => {
            const pubDate = new Date(art.publishedAt);
            const dateStr = !isNaN(pubDate.getTime())
              ? `${pubDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} · ${pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
              : 'Hoje';

            return (
              <Link
                key={art.id || art.slug}
                href={`/noticia/${art.slug}`}
                className="flex flex-col gap-2.5 p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:shadow-xs transition-all group bg-white"
              >
                <div className="aspect-16/10 relative overflow-hidden rounded bg-[#f4f5f7]">
                  <NewsImage
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    category={art.categoryId}
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-[#04391d]/90 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                    {art.chapeu || art.categoryId?.toUpperCase() || 'NOTÍCIA'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="font-serif-journal font-bold text-[16px] leading-[1.3] text-[#04391d] group-hover:text-[#008744] transition-colors line-clamp-3">
                      {art.title}
                    </h3>
                    {art.subtitle && (
                      <p className="text-[12.5px] leading-relaxed text-[#5b616e] line-clamp-2 mt-1">
                        {art.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                    <span>{dateStr}</span>
                    <span>{art.readingTime || 3} min</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 space-y-2 bg-[#f4f5f7] rounded-lg">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-medium">Nenhuma notícia encontrada com os filtros selecionados.</p>
        </div>
      )}

      {/* Botão de Expansão / Carregar Mais */}
      {hasMore && (
        <div className="py-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-8 py-3 bg-[#04391d] hover:bg-[#008744] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer hover:shadow-lg"
          >
            <span>Carregar Mais Notícias ({filteredArticles.length - visibleCount} restantes)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

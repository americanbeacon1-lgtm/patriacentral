// language: TypeScript, file: CategoryClientFeed.tsx, target: Next.js 15 / React 19
// Feed de notícias da editoria / subcategoria com hidratação dinâmica via LocalStorage e sincronização em tempo real

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import NewsImage from '@/components/NewsImage';
import { Article } from '@/lib/types';
import {
  getLocalArticles,
  mergeAndDeduplicateArticles,
  articleMatchesCategoryClient,
  syncUnsyncedArticles,
} from '@/lib/client-articles';
import { Newspaper, Clock, ArrowRight, Search } from 'lucide-react';

interface CategoryClientFeedProps {
  categorySlug: string;
  categoryName: string;
  serverArticles: Article[];
  allServerArticles: Article[];
  isUltimas?: boolean;
}

const PAGE_SIZE = 15;

export default function CategoryClientFeed({
  categorySlug,
  categoryName,
  serverArticles,
  allServerArticles,
  isUltimas = false,
}: CategoryClientFeedProps) {
  const [articles, setArticles] = useState<Article[]>(serverArticles);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const local = getLocalArticles();
      if (local.length > 0) {
        // Mescla todos os artigos do servidor e do storage local
        const mergedAll = mergeAndDeduplicateArticles(allServerArticles, local);

        // Filtra para esta editoria / subcategoria
        const filtered = isUltimas
          ? mergedAll
          : mergedAll.filter((a) => articleMatchesCategoryClient(a, categorySlug));

        if (filtered.length > 0) {
          setArticles(filtered);
        } else if (articles.length === 0) {
          setArticles(mergedAll.slice(0, 10));
        }

        // Sincroniza em background com o servidor se necessário
        syncUnsyncedArticles(local);
      }
    } catch (e) {
      console.warn('Erro ao hidratar feed da editoria:', e);
    } finally {
      setHasHydrated(true);
    }
  }, [categorySlug, isUltimas, allServerArticles]);

  // Filtro de texto opcional
  const displayedArticles = useMemo(() => {
    let list = articles;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.subtitle || '').toLowerCase().includes(q) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [articles, filterQuery]);

  const pagedList = displayedArticles.slice(0, visibleCount);
  const hasMore = visibleCount < displayedArticles.length;

  return (
    <div className="flex flex-col">
      {/* Barra de controle: contagem e busca rápida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-100">
        <span className="text-[12.5px] font-bold text-[#04391d] tracking-wide uppercase">
          {displayedArticles.length}{' '}
          {displayedArticles.length === 1 ? 'reportagem disponível' : 'reportagens disponíveis'}
          {hasHydrated && articles.length > serverArticles.length && (
            <span className="ml-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full normal-case">
              Atualizado em tempo real
            </span>
          )}
        </span>

        {articles.length > 5 && (
          <div className="relative">
            <input
              type="text"
              placeholder="Filtrar nesta editoria..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="text-xs px-3 py-1.5 pl-8 border border-slate-200 rounded-full bg-slate-50 text-slate-800 placeholder-slate-400 outline-none focus:border-[#008744] focus:bg-white w-full sm:w-56 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        )}
      </div>

      {/* Lista de Notícias */}
      {pagedList.length > 0 ? (
        <div className="flex flex-col">
          {pagedList.map((art) => {
            const pubDate = new Date(art.publishedAt);
            const formattedDate = !isNaN(pubDate.getTime())
              ? `${pubDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} às ${pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
              : 'Hoje';

            return (
              <Link
                key={art.id || art.slug}
                href={`/noticia/${art.slug}`}
                className="grid grid-cols-[100px_1fr] sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-3 sm:gap-5 py-4 border-b border-[#e3e5e9] group"
              >
                <div className="aspect-16/10 relative overflow-hidden rounded bg-[#f4f5f7]">
                  <NewsImage
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    category={art.categoryId}
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-between gap-1">
                  <div>
                    <span className="text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#008744]">
                      {art.chapeu || art.categoryName || categoryName}
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
                  <span className="text-[11px] sm:text-[12px] text-[#5b616e] mt-1 flex items-center gap-1.5 sm:gap-2 flex-wrap font-mono">
                    <span className="font-semibold text-[#04391d]">{formattedDate}</span>
                    <span>·</span>
                    <span>{art.state || 'Nacional'}</span>
                    <span>·</span>
                    <span>{art.readingTime || 3} min de leitura</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 space-y-2">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm">Nenhuma notícia encontrada com os filtros informados.</p>
        </div>
      )}

      {/* Botão Carregar Mais Notícias */}
      {hasMore && (
        <div className="py-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-6 py-2.5 bg-[#04391d] hover:bg-[#008744] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Carregar Mais Notícias ({displayedArticles.length - visibleCount} restantes)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

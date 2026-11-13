'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import NewsImage from '@/components/NewsImage';
import { getLocalArticles, mergeAndDeduplicateArticles } from '@/lib/client-articles';

interface NewsCarouselProps {
  articles: Article[];
}

export default function NewsCarousel({ articles }: NewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Article[]>(articles);

  useEffect(() => {
    try {
      const local = getLocalArticles();
      if (local.length > 0) {
        const merged = mergeAndDeduplicateArticles(articles, local);
        setItems(merged.slice(1, 15));
      }
    } catch (e) {
      console.warn('Erro ao atualizar carrossel:', e);
    }
  }, [articles]);

  const scroll = (direction: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="py-7 border-b border-[#e3e5e9] flex flex-col gap-4">
      <div className="flex justify-between items-center gap-3">
        <h2 className="m-0 font-serif-journal text-2xl sm:text-[26px] font-bold text-[#04391d]">
          Destaques da redação
        </h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="w-10 h-10 border border-[#c9ccd3] bg-white hover:bg-slate-50 text-[#16181d] rounded-full cursor-pointer text-lg flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Próximo"
            className="w-10 h-10 border border-[#c9ccd3] bg-white hover:bg-slate-50 text-[#16181d] rounded-full cursor-pointer text-lg flex items-center justify-center transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[minmax(240px,280px)] gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-1"
      >
        {items.map((art) => (
          <Link
            key={art.id || art.slug}
            href={`/noticia/${art.slug}`}
            className="snap-start flex flex-col gap-2 group"
          >
            <div className="aspect-4/3 relative overflow-hidden rounded-[2px] bg-[#f4f5f7]">
              <NewsImage
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                category={art.categoryId}
                loading="lazy"
              />
            </div>
            <span className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#008744] mt-1">
              {art.chapeu || art.categoryName || 'REDAÇÃO'}
            </span>
            <span className="font-semibold text-[16px] leading-[1.35] text-[#16181d] group-hover:text-[#04391d] transition-colors line-clamp-3">
              {art.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

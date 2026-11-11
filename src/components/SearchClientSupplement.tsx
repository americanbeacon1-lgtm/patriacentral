'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsImage from '@/components/NewsImage';
import { Article } from '@/lib/types';

interface SearchClientProps {
  query?: string;
  serverSlugs: string[];
}

function normalize(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function SearchClientSupplement({ query, serverSlugs }: SearchClientProps) {
  const [localArticles, setLocalArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!query) return;
    try {
      const listRaw = localStorage.getItem('eixo_custom_articles');
      if (listRaw) {
        const list: Article[] = JSON.parse(listRaw);
        const normQ = normalize(query);
        const tokens = normQ.split(/\s+/).filter((t) => t.length > 1);

        const matched = list.filter((a) => {
          if (serverSlugs.includes(a.slug) || serverSlugs.includes(a.id)) {
            return false; // Já exibida pelos resultados do servidor
          }
          const fullText = normalize(
            `${a.title} ${a.subtitle || ''} ${a.summary || ''} ${a.content || ''} ${(a.tags || []).join(' ')}`
          );
          if (fullText.includes(normQ)) return true;
          return tokens.length > 0 && tokens.every((tok) => fullText.includes(tok));
        });

        if (matched.length > 0) {
          setLocalArticles(matched);
          // Sincroniza em background com o servidor
          matched.forEach((art) => {
            fetch('/api/articles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(art),
            }).catch(() => {});
          });
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar matérias locais na busca:', e);
    }
  }, [query, serverSlugs]);

  if (localArticles.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded text-xs font-bold text-emerald-900 uppercase tracking-wider">
        Notícias recentes sincronizadas ({localArticles.length})
      </div>
      <div className="flex flex-col">
        {localArticles.map((art) => (
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
                {art.chapeu || art.categoryId?.toUpperCase() || 'NOTÍCIA'}
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
    </div>
  );
}

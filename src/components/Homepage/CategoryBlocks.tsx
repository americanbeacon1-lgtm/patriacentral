// language: TypeScript, file: CategoryBlocks.tsx, target: Next.js 15 / React 19
// Blocos editoriais da Capa (Política, Economia, Brasil) com hidratação dinâmica

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import {
  getLocalArticles,
  mergeAndDeduplicateArticles,
  articleMatchesCategoryClient,
} from '@/lib/client-articles';

interface CategoryBlocksProps {
  articles: Article[];
}

export default function CategoryBlocks({ articles: initialArticles }: CategoryBlocksProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  useEffect(() => {
    try {
      const local = getLocalArticles();
      if (local.length > 0) {
        const merged = mergeAndDeduplicateArticles(initialArticles, local);
        setArticles(merged);
      }
    } catch (e) {
      console.warn('Erro ao atualizar blocos de editoria:', e);
    }
  }, [initialArticles]);

  const blocks = [
    {
      name: 'Política',
      slug: 'politica',
      items: articles
        .filter((a) => articleMatchesCategoryClient(a, 'politica'))
        .slice(0, 4),
    },
    {
      name: 'Economia',
      slug: 'economia',
      items: articles
        .filter((a) => articleMatchesCategoryClient(a, 'economia'))
        .slice(0, 4),
    },
    {
      name: 'Brasil',
      slug: 'brasil',
      items: articles
        .filter((a) => articleMatchesCategoryClient(a, 'brasil'))
        .slice(0, 4),
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-7 border-b border-[#e3e5e9]">
      {blocks.map((block) => (
        <div key={block.slug} className="flex flex-col">
          <Link
            href={`/editoria/${block.slug}`}
            className="font-serif-journal text-[22px] font-bold text-[#04391d] hover:text-[#008744] border-b-2 border-[#008744] pb-2 mb-1 transition-colors"
          >
            {block.name} ›
          </Link>
          <div className="flex flex-col">
            {block.items.map((art) => (
              <Link
                key={art.id || art.slug}
                href={`/noticia/${art.slug}`}
                className="flex flex-col gap-1 py-3 border-b border-[#e3e5e9] group"
              >
                <span className="font-semibold text-[15.5px] leading-[1.38] text-[#16181d] group-hover:text-[#04391d] transition-colors">
                  {art.title}
                </span>
                <span className="text-[12px] text-[#5b616e]">
                  {art.state || 'Nacional'} · {art.readingTime || 3} min de leitura
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

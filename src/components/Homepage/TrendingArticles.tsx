import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface TrendingArticlesProps {
  articles: Article[];
}

export default function TrendingArticles({ articles }: TrendingArticlesProps) {
  const topArticles = [...articles]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 5);

  return (
    <div className="flex flex-col min-w-0">
      <h2 className="m-0 mb-1 text-[15px] font-bold uppercase tracking-[0.06em] text-[#0b2545] border-b-2 border-[#0b2545] pb-2">
        Mais lidas
      </h2>

      <div className="flex flex-col">
        {topArticles.map((art, index) => (
          <Link
            key={art.id}
            href={`/noticia/${art.slug}`}
            className="grid grid-cols-[36px_minmax(0,1fr)] gap-2.5 py-3 border-b border-[#e3e5e9] items-baseline group"
          >
            <span className="font-serif-journal text-[26px] font-bold text-[#c8102e] leading-none">
              {index + 1}
            </span>
            <span className="font-semibold text-[15px] leading-[1.38] text-[#16181d] group-hover:text-[#0b2545] transition-colors">
              {art.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

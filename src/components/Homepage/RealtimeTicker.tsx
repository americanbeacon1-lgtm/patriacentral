import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface RealtimeTickerProps {
  articles: Article[];
}

export default function RealtimeTicker({ articles }: RealtimeTickerProps) {
  return (
    <div className="flex flex-col min-w-0">
      <div className="flex justify-between items-baseline border-b-2 border-[#008744] pb-2 mb-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#008744] animate-pulse"></span>
          <h2 className="m-0 text-[15px] font-bold uppercase tracking-[0.06em] text-[#04391d]">
            Últimas notícias
          </h2>
        </div>
        <Link
          href="/editoria/ultimas"
          className="text-[12.5px] font-semibold text-[#008744] hover:text-[#04391d] transition-colors"
        >
          Ver todas →
        </Link>
      </div>

      <div className="flex flex-col">
        {articles.slice(0, 7).map((art) => {
          const date = new Date(art.publishedAt);
          const now = new Date();
          const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

          const timeStr = !isNaN(date.getTime())
            ? isToday
              ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              : date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
            : 'Recente';

          return (
            <Link
              key={art.id}
              href={`/noticia/${art.slug}`}
              className="grid grid-cols-[54px_minmax(0,1fr)] gap-2.5 py-3 border-b border-[#e3e5e9] group"
            >
              <span className="text-[11.5px] font-bold text-[#008744] tabular-nums whitespace-nowrap">
                {timeStr}
              </span>
              <span className="text-[14.5px] leading-[1.38] font-medium text-[#16181d] group-hover:text-[#04391d] transition-colors line-clamp-2">
                {art.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

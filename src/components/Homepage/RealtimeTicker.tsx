import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface RealtimeTickerProps {
  articles: Article[];
}

export default function RealtimeTicker({ articles }: RealtimeTickerProps) {
  return (
    <div className="flex flex-col min-w-0">
      <div className="flex justify-between items-baseline border-b-2 border-[#0b2545] pb-2 mb-0">
        <h2 className="m-0 text-[15px] font-bold uppercase tracking-[0.06em] text-[#0b2545]">
          Últimas notícias
        </h2>
        <Link
          href="/editoria/ultimas"
          className="text-[12.5px] text-[#5b616e] hover:text-[#0b2545] transition-colors"
        >
          Ver todas
        </Link>
      </div>

      <div className="flex flex-col">
        {articles.slice(0, 6).map((art) => {
          const date = new Date(art.publishedAt);
          const timeStr = !isNaN(date.getTime())
            ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : 'Hoje';

          return (
            <Link
              key={art.id}
              href={`/noticia/${art.slug}`}
              className="grid grid-cols-[48px_minmax(0,1fr)] gap-2.5 py-3 border-b border-[#e3e5e9] group"
            >
              <span className="text-[12.5px] font-bold text-[#c8102e] tabular-nums">
                {timeStr}
              </span>
              <span className="text-[14.5px] leading-[1.4] font-medium text-[#16181d] group-hover:text-[#0b2545] transition-colors">
                {art.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

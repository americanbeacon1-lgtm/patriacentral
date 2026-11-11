import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface SpecialReportsProps {
  articles: Article[];
}

export default function SpecialReports({ articles }: SpecialReportsProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 min-w-0">
      <Link
        href="/editoria/especiais"
        className="font-serif-journal text-2xl sm:text-[26px] font-bold text-[#0b2545] hover:text-[#c8102e] transition-colors"
      >
        Reportagens especiais ›
      </Link>

      <div className="flex flex-col">
        {articles.slice(0, 3).map((art) => (
          <Link
            key={art.id}
            href={`/noticia/${art.slug}`}
            className="grid grid-cols-[minmax(96px,30%)_minmax(0,1fr)] gap-4 sm:gap-5 pb-4 mb-4 border-b border-[#e3e5e9] group last:border-b-0 last:pb-0 last:mb-0"
          >
            <div className="aspect-4/3 relative overflow-hidden rounded-[2px] bg-[#f4f5f7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#c8102e]">
                Especial · {art.state || 'Brasil'}
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

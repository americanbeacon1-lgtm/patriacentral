import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface SecondaryHeadlinesProps {
  articles: Article[];
}

export default function SecondaryHeadlines({ articles }: SecondaryHeadlinesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-7 border-b border-[#e3e5e9]">
      {articles.slice(0, 3).map((art) => (
        <article key={art.id} className="flex flex-col gap-2 group">
          <Link
            href={`/noticia/${art.slug}`}
            className="block aspect-3/2 relative overflow-hidden rounded-[2px] bg-[#f4f5f7]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
            />
          </Link>

          <span className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#c8102e] mt-1">
            {art.chapeu || art.categoryName || 'DESTAQUE'}
          </span>

          <Link
            href={`/noticia/${art.slug}`}
            className="font-serif-journal font-semibold text-[21px] leading-[1.22] text-[#0b2545] hover:text-[#c8102e] transition-colors line-clamp-3"
          >
            {art.title}
          </Link>

          {art.subtitle && (
            <p className="text-[13.5px] leading-relaxed text-[#5b616e] line-clamp-2 m-0">
              {art.subtitle}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}

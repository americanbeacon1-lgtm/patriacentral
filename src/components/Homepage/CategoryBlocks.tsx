import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface CategoryBlocksProps {
  articles: Article[];
}

export default function CategoryBlocks({ articles }: CategoryBlocksProps) {
  const blocks = [
    {
      name: 'Política',
      slug: 'politica',
      items: articles
        .filter((a) => a.categoryId === 'politica' || a.categoryId === 'governo' || a.categoryId === 'congresso')
        .slice(0, 4),
    },
    {
      name: 'Economia',
      slug: 'economia',
      items: articles
        .filter((a) => a.categoryId === 'economia' || a.categoryId === 'infraestrutura' || a.categoryId === 'agro')
        .slice(0, 4),
    },
    {
      name: 'Brasil',
      slug: 'brasil',
      items: articles
        .filter((a) => a.categoryId === 'brasil' || a.categoryId === 'saude' || a.categoryId === 'educacao')
        .slice(0, 4),
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-7 border-b border-[#e3e5e9]">
      {blocks.map((block) => (
        <div key={block.slug} className="flex flex-col">
          <Link
            href={`/editoria/${block.slug}`}
            className="font-serif-journal text-[22px] font-bold text-[#0b2545] hover:text-[#c8102e] border-b-2 border-[#c8102e] pb-2 mb-1 transition-colors"
          >
            {block.name} ›
          </Link>
          <div className="flex flex-col">
            {block.items.map((art) => (
              <Link
                key={art.id}
                href={`/noticia/${art.slug}`}
                className="flex flex-col gap-1 py-3 border-b border-[#e3e5e9] group"
              >
                <span className="font-semibold text-[15.5px] leading-[1.38] text-[#16181d] group-hover:text-[#0b2545] transition-colors">
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

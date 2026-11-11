import React from 'react';
import Link from 'next/link';
import { Article, Author, Category } from '@/lib/types';
import NewsImage from '@/components/NewsImage';

interface LeadHeadlineProps {
  article: Article;
  author?: Author;
  category?: Category;
}

export default function LeadHeadline({ article, author, category }: LeadHeadlineProps) {
  const catName = article.chapeu || category?.name || article.categoryName || 'Destaque';
  const metaText = `${article.state || 'Brasília'} · Por ${author?.name || article.authorName || 'Redação'} · ${article.readingTime || 4} min de leitura`;

  return (
    <article className="flex flex-col gap-3 min-w-0">
      <Link
        href={`/noticia/${article.slug}`}
        className="block aspect-16/9 relative overflow-hidden rounded-[2px] bg-[#f4f5f7] group"
      >
        <NewsImage
          src={article.imageUrl}
          alt={article.imageCaption || article.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          category={article.categoryId}
          loading="eager"
        />
        {article.imageCredit && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-[10px] text-white px-2 py-0.5 rounded backdrop-blur-xs">
            Foto: {article.imageCredit}
          </span>
        )}
      </Link>

      <span className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#008744]">
        {catName}
      </span>

      <Link
        href={`/noticia/${article.slug}`}
        className="font-serif-journal font-bold text-2xl sm:text-3xl lg:text-[40px] leading-[1.12] tracking-[-0.015em] text-[#04391d] hover:text-[#008744] transition-colors"
      >
        {article.title}
      </Link>

      {article.subtitle && (
        <p className="m-0 text-[16px] sm:text-[17px] leading-[1.55] text-[#3c414b] max-w-[70ch]">
          {article.subtitle}
        </p>
      )}

      <span className="text-[12.5px] text-[#5b616e]">
        {metaText}
      </span>
    </article>
  );
}

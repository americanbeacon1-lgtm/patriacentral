'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsImage from '@/components/NewsImage';
import ShareButtons from '@/components/Article/ShareButtons';
import { Article } from '@/lib/types';
import { ExternalLink, Clock, ArrowLeft, Newspaper } from 'lucide-react';

interface FallbackProps {
  slug: string;
}

export default function ArticleClientFallback({ slug }: FallbackProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // 1. Tenta recuperar do storage individual da matéria
      const direct = localStorage.getItem('patria_article_' + slug) || localStorage.getItem('eixo_article_' + slug);
      if (direct) {
        const parsed = JSON.parse(direct);
        setArticle(parsed);
        setLoading(false);
        // Sincroniza com a API do servidor em background
        fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        }).catch(() => {});
        return;
      }

      // 2. Tenta recuperar da lista geral de matérias publicadas
      const listRaw = localStorage.getItem('patria_custom_articles') || localStorage.getItem('eixo_custom_articles');
      if (listRaw) {
        const list = JSON.parse(listRaw);
        const match = list.find((a: any) => a.slug === slug || a.id === slug);
        if (match) {
          setArticle(match);
          setLoading(false);
          fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(match),
          }).catch(() => {});
          return;
        }
      }
    } catch (e) {
      console.warn('Erro ao ler do storage local:', e);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Carregando reportagem...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto space-y-4">
        <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold font-serif-journal text-[#04391d]">
          Reportagem em Processamento
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Esta matéria pode ter sido atualizada pela redação ou está sendo processada no acervo. Retorne à capa do portal para conferir as últimas notícias em tempo real.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#04391d] hover:bg-[#008744] text-white rounded text-xs font-bold uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Página Inicial</span>
          </Link>
        </div>
      </div>
    );
  }

  const publishDate = new Date(article.publishedAt);
  const formattedPublish = !isNaN(publishDate.getTime())
    ? new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(publishDate)
    : 'Hoje';

  const timeStr = !isNaN(publishDate.getTime())
    ? publishDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '09:00';

  return (
    <article className="w-full max-w-[760px] flex flex-col gap-4 py-4 sm:py-6">
      {/* Breadcrumb */}
      <div className="text-[12px] text-[#5b616e] flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#04391d]">
          Início
        </Link>
        <span>›</span>
        <Link href={`/editoria/${article.categoryId || 'brasil'}`} className="hover:text-[#04391d] capitalize">
          {article.categoryId || 'Brasil'}
        </Link>
      </div>

      {/* Chapéu */}
      <span className="self-start text-[11px] font-bold tracking-[0.08em] uppercase bg-[#f4f5f7] text-[#5b616e] px-2 py-0.5 rounded-[2px]">
        {article.chapeu || 'REPORTAGEM'}
      </span>

      {/* Título */}
      <h1 className="m-0 font-serif-journal text-3xl sm:text-4xl lg:text-[44px] leading-[1.1] font-bold tracking-[-0.015em] text-[#04391d]">
        {article.title}
      </h1>

      {/* Subtítulo */}
      {article.subtitle && (
        <p className="m-0 text-[18px] sm:text-[19px] leading-[1.5] text-[#3c414b]">
          {article.subtitle}
        </p>
      )}

      {/* Data e autor */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3 border-t border-b border-[#e3e5e9]">
        <span className="text-[13px] text-[#3c414b]">
          Por <strong className="text-[#16181d]">{article.sourceName || 'Redação Pátria Central'}</strong> · Publicado em {formattedPublish} às {timeStr}
        </span>
        <ShareButtons title={article.title} slug={article.slug} />
      </div>

      {/* Imagem */}
      {article.imageUrl && (
        <figure className="m-0 flex flex-col gap-1.5 my-2">
          <div className="aspect-16/9 relative overflow-hidden rounded-[2px] bg-[#f4f5f7]">
            <NewsImage
              src={article.imageUrl}
              alt={article.imageCaption || article.title}
              className="w-full h-full object-cover"
              category={article.categoryId}
              loading="eager"
            />
          </div>
          {(article.imageCaption || article.imageCredit) && (
            <figcaption className="text-[12.5px] text-[#5b616e]">
              {article.imageCaption || 'Foto da reportagem'}{' '}
              {article.imageCredit && `· Foto: ${article.imageCredit}`}
            </figcaption>
          )}
        </figure>
      )}

      {/* Fonte Original */}
      {article.sourceUrl && (
        <div className="p-3 bg-[#f4f5f7] border-l-3 border-[#008744] text-[13px] text-[#3c414b] rounded-[2px] my-2">
          <span className="font-semibold text-[#04391d]">Fonte original: </span>
          {article.sourceName || 'Veículo de Notícias'} ·{' '}
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#008744] underline font-medium hover:text-[#04391d]"
          >
            Acessar matéria de origem
          </a>
        </div>
      )}

      {/* Corpo da Reportagem */}
      <div className="font-serif-journal text-[18px] sm:text-[19px] leading-[1.7] text-[#16181d] space-y-5 my-2">
        {article.content ? (
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="prose max-w-none text-inherit leading-[1.7]"
          />
        ) : (
          <p>{article.summary || article.subtitle}</p>
        )}
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-4 border-t border-slate-100">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-[12.5px] px-2.5 py-1 rounded-full bg-[#f4f5f7] text-[#5b616e]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

import React from 'react';
import { db } from '@/lib/db';
import { findArticleBySlugInFeeds } from '@/lib/crawler';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdDisplay from '@/components/AdDisplay';
import CookieBanner from '@/components/CookieBanner';
import ShareButtons from '@/components/Article/ShareButtons';
import NewsImage from '@/components/NewsImage';
import ArticleClientFallback from '@/components/Article/ArticleClientFallback';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  let article = db.getArticleBySlug(slug);
  if (!article) {
    article = await findArticleBySlugInFeeds(slug);
  }
  const settings = db.getSettings();

  if (!article) {
    return {
      title: `${settings.portalName} | Reportagem`,
    };
  }

  return {
    title: `${article.title} | ${settings.portalName}`,
    description: article.subtitle || article.summary,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      url: `https://patriacentral.com.br/noticia/${article.slug}`,
      siteName: settings.portalName,
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authorId],
      section: article.categoryId,
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.subtitle,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let article = db.getArticleBySlug(slug);
  if (!article) {
    article = await findArticleBySlugInFeeds(slug);
  }

  const settings = db.getSettings();
  const categories = db.getCategories();

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
        <Header categories={categories} settings={settings} />
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-5 box-border py-6 flex justify-center">
          <ArticleClientFallback slug={slug} />
        </main>
        <Footer settings={settings} />
        <CookieBanner />
      </div>
    );
  }

  try {
    db.incrementArticleViews(slug);
  } catch {}

  const author = db.getAuthorById(article.authorId);
  const category = db.getCategoryBySlug(article.categoryId);
  const relatedArticles = db.getArticles({ categorySlug: article.categoryId, limit: 4 })
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const mediumRect = db.getActiveBanner('medium_rectangle', article.categoryId, article.state);
  const inFeedBanner = db.getActiveBanner('in_feed', article.categoryId, article.state);

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://patriacentral.com.br/noticia/${article.slug}`,
    },
    headline: article.title,
    description: article.subtitle,
    image: [article.imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: author?.name || article.authorName || 'Redação Pátria Central',
    },
    publisher: {
      '@type': 'Organization',
      name: settings.portalName,
    },
    articleSection: category?.name || article.categoryName || 'Geral',
    keywords: article.tags?.join(', '),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header categories={categories} settings={settings} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-5 box-border py-6 flex justify-center">
        <article className="w-full max-w-[760px] flex flex-col gap-4 py-4 sm:py-6">
          {/* Breadcrumb */}
          <div className="text-[12px] text-[#5b616e] flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#0b2545]">
              Início
            </Link>
            <span>›</span>
            {category && (
              <Link href={`/editoria/${category.slug}`} className="hover:text-[#0b2545]">
                {category.name}
              </Link>
            )}
            {article.state && (
              <>
                <span>›</span>
                <Link href={`/estados/${article.state.toLowerCase()}`} className="hover:text-[#0b2545]">
                  {article.state}
                </Link>
              </>
            )}
          </div>

          {/* Kicker / Chapéu */}
          <span className="self-start text-[11px] font-bold tracking-[0.08em] uppercase bg-[#f4f5f7] text-[#5b616e] px-2 py-0.5 rounded-[2px]">
            {article.chapeu || category?.name || article.categoryName || 'REPORTAGEM'}
          </span>

          {/* Título Principal H1 */}
          <h1 className="m-0 font-serif-journal text-3xl sm:text-4xl lg:text-[44px] leading-[1.1] font-bold tracking-[-0.015em] text-[#0b2545]">
            {article.title}
          </h1>

          {/* Subtítulo Dek */}
          {article.subtitle && (
            <p className="m-0 text-[18px] sm:text-[19px] leading-[1.5] text-[#3c414b]">
              {article.subtitle}
            </p>
          )}

          {/* Linha de Autoria, Data e Botões de Compartilhamento */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3 border-t border-b border-[#e3e5e9]">
            <span className="text-[13px] text-[#3c414b]">
              Por <strong className="text-[#16181d]">{author?.name || article.authorName || 'Redação'}</strong>
              {article.state && ` · ${article.state}`} · Publicado em {formattedPublish} às {timeStr}
            </span>

            {/* Compartilhamento Social */}
            <ShareButtons title={article.title} slug={article.slug} />
          </div>

          {/* Foto Principal com Legenda */}
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

          {/* Notificação de Fonte Externa se aplicável */}
          {article.sourceUrl && (
            <div className="p-3 bg-[#f4f5f7] border-l-3 border-[#c8102e] text-[13px] text-[#3c414b] rounded-[2px] my-2">
              <span className="font-semibold text-[#0b2545]">Fonte original: </span>
              {article.sourceName || 'Agência Jornalística'} ·{' '}
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c8102e] underline font-medium hover:text-[#0b2545]"
              >
                Acessar matéria de origem
              </a>
            </div>
          )}

          {/* Corpo da Reportagem em Tipografia Serif Jornalística */}
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

          {/* Publicidade no Meio do Conteúdo */}
          <div className="my-6">
            <AdDisplay banner={mediumRect || inFeedBanner} position="medium_rectangle" />
          </div>

          {/* Aviso Editorial e Erratas */}
          <p className="text-[14px] text-[#5b616e] italic pt-3 border-t border-[#e3e5e9]">
            Encontrou algum erro? Escreva para a nossa equipe em{' '}
            <a href="mailto:americanbeacon@americanbeacon.online" className="underline text-[#0b2545]">
              americanbeacon@americanbeacon.online
            </a>
            . Pedidos de direito de resposta seguem a política publicada no rodapé.
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2">
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

          {/* Notícias Relacionadas */}
          {relatedArticles.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#e3e5e9] flex flex-col gap-4">
              <h3 className="m-0 text-[15px] font-bold uppercase tracking-[0.06em] text-[#0b2545] border-b-2 border-[#0b2545] pb-2">
                Notícias relacionadas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/noticia/${rel.slug}`}
                    className="flex flex-col gap-2 group"
                  >
                    <div className="aspect-3/2 relative overflow-hidden rounded-[2px] bg-[#f4f5f7]">
                      <NewsImage
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        category={rel.categoryId}
                        loading="lazy"
                      />
                    </div>
                    <span className="font-semibold text-[15px] leading-[1.35] text-[#16181d] group-hover:text-[#0b2545] transition-colors line-clamp-3">
                      {rel.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer settings={settings} />
      <CookieBanner />
    </div>
  );
}

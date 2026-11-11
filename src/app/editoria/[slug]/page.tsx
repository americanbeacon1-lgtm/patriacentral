import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdDisplay from '@/components/AdDisplay';
import CookieBanner from '@/components/CookieBanner';
import NewsImage from '@/components/NewsImage';
import TrendingArticles from '@/components/Homepage/TrendingArticles';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const isUltimas = slug === 'ultimas' || slug === 'ultimas-noticias';
  const category = db.getCategoryBySlug(slug) || (isUltimas ? {
    id: 'ultimas',
    slug: 'ultimas',
    name: 'Últimas Notícias',
    description: 'Cobertura em tempo real dos acontecimentos mais recentes no Brasil e no mundo.',
  } : null);
  const settings = db.getSettings();

  if (!category) {
    return {
      title: `Editoria não encontrada - ${settings.portalName}`,
    };
  }

  return {
    title: `${category.name} | ${settings.portalName}`,
    description: category.description,
  };
}

// Subcategorias e editorias irmãs para navegação rápida em pílulas
const SUBCATEGORY_MAP: Record<string, { slug: string; name: string }[]> = {
  politica: [
    { slug: 'politica', name: 'Todas de Política' },
    { slug: 'governo', name: 'Governo Federal' },
    { slug: 'congresso', name: 'Congresso Nacional' },
    { slug: 'justica', name: 'Justiça & STF' },
  ],
  governo: [
    { slug: 'politica', name: 'Política Geral' },
    { slug: 'governo', name: 'Governo Federal' },
    { slug: 'congresso', name: 'Congresso Nacional' },
    { slug: 'infraestrutura', name: 'Ministérios & Obras' },
  ],
  congresso: [
    { slug: 'politica', name: 'Política Geral' },
    { slug: 'congresso', name: 'Congresso Nacional' },
    { slug: 'governo', name: 'Governo Federal' },
    { slug: 'justica', name: 'Legislação & STF' },
  ],
  economia: [
    { slug: 'economia', name: 'Todas de Economia' },
    { slug: 'agro', name: 'Agronegócio' },
    { slug: 'infraestrutura', name: 'Infraestrutura' },
    { slug: 'concursos', name: 'Empregos e Concursos' },
  ],
  agro: [
    { slug: 'economia', name: 'Economia' },
    { slug: 'agro', name: 'Agronegócio' },
    { slug: 'meio-ambiente', name: 'Meio Ambiente' },
    { slug: 'infraestrutura', name: 'Logística de Safra' },
  ],
  infraestrutura: [
    { slug: 'infraestrutura', name: 'Infraestrutura' },
    { slug: 'economia', name: 'Economia' },
    { slug: 'agro', name: 'Agronegócio' },
    { slug: 'governo', name: 'Obras Públicas' },
  ],
  brasil: [
    { slug: 'brasil', name: 'Brasil' },
    { slug: 'distrito-federal', name: 'Distrito Federal' },
    { slug: 'estados', name: 'Estados e Municípios' },
    { slug: 'politica', name: 'Poder Nacional' },
  ],
  'distrito-federal': [
    { slug: 'distrito-federal', name: 'Distrito Federal' },
    { slug: 'brasil', name: 'Brasil' },
    { slug: 'estados', name: 'Estados e Municípios' },
    { slug: 'politica', name: 'Bastidores de Brasília' },
  ],
  estados: [
    { slug: 'estados', name: 'Estados e Municípios' },
    { slug: 'distrito-federal', name: 'Distrito Federal' },
    { slug: 'brasil', name: 'Brasil' },
    { slug: 'economia', name: 'Desenvolvimento Regional' },
  ],
  saude: [
    { slug: 'saude', name: 'Saúde' },
    { slug: 'educacao', name: 'Educação' },
    { slug: 'governo', name: 'Políticas Públicas' },
    { slug: 'brasil', name: 'Brasil' },
  ],
  educacao: [
    { slug: 'educacao', name: 'Educação' },
    { slug: 'saude', name: 'Saúde' },
    { slug: 'concursos', name: 'Concursos & Carreiras' },
    { slug: 'tecnologia', name: 'Inovação no Ensino' },
  ],
  tecnologia: [
    { slug: 'tecnologia', name: 'Tecnologia e IA' },
    { slug: 'economia', name: 'Negócios Digitais' },
    { slug: 'educacao', name: 'Educação' },
    { slug: 'congresso', name: 'Regulação' },
  ],
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const isUltimas = slug === 'ultimas' || slug === 'ultimas-noticias';
  const category = db.getCategoryBySlug(slug) || (isUltimas ? {
    id: 'ultimas',
    slug: 'ultimas',
    name: 'Últimas Notícias',
    description: 'Cobertura em tempo real dos acontecimentos mais recentes no Brasil e no mundo.',
    color: '#B91C1C',
    showInHeader: true,
    order: 1,
  } : null);

  if (!category) {
    notFound();
  }

  const settings = db.getSettings();
  const categories = db.getCategories();
  
  // Se for "Últimas Notícias", traz todas as matérias em ordem cronológica estrita da fonte
  let articles = isUltimas
    ? db.getArticles()
    : db.getArticles({ categorySlug: category.slug });
  
  const allArticles = db.getArticles();

  // Fallback caso a categoria seja recém-criada e ainda não possua matérias exclusivas
  const isFallback = articles.length === 0;
  if (isFallback) {
    articles = allArticles.slice(0, 10);
  }

  const halfPage = db.getActiveBanner('half_page', category.slug);
  const subcategories = SUBCATEGORY_MAP[category.slug] || [];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      <Header categories={categories} settings={settings} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-5 box-border">
        <div className="flex flex-wrap gap-8 py-6 sm:py-7 pb-10">
          {/* Coluna Principal da Editoria (flex: 2 1 520px) */}
          <div className="flex-[2_1_520px] flex flex-col min-w-0">
            {/* Breadcrumb */}
            <span className="text-[12px] text-[#5b616e] mb-2 flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-[#0b2545]">Início</Link>
              <span>›</span>
              <span className="text-[#0b2545] font-semibold">{category.name}</span>
            </span>

            {/* Cabeçalho da Editoria */}
            <div className="border-b-3 border-[#c8102e] pb-3 mb-4">
              <h1 className="m-0 font-serif-journal text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0b2545]">
                {category.name}
              </h1>
              {category.description && (
                <p className="m-0 mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>

            {/* Pílulas de Subcategorias / Editorias Correlatas */}
            {subcategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 mb-4 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  Subcategorias:
                </span>
                {subcategories.map((sub) => {
                  const isActive = sub.slug === category.slug;
                  return (
                    <Link
                      key={sub.slug}
                      href={`/editoria/${sub.slug}`}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                        isActive
                          ? 'bg-[#0b2545] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-[#0b2545]'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Aviso Editorial amigável em caso de fallback */}
            {isFallback && (
              <div className="p-3.5 bg-blue-50/60 border border-blue-200/60 rounded text-xs text-blue-900 mb-4 leading-relaxed">
                A redação do Portal Eixo Nacional está apurando novas reportagens específicas para <strong>{category.name}</strong>. Acompanhe abaixo os principais destaques nacionais em tempo real:
              </div>
            )}

            {/* Listagem de Notícias */}
            {articles.length > 0 ? (
              <div className="flex flex-col">
                {articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/noticia/${art.slug}`}
                    className="grid grid-cols-[100px_1fr] sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-3 sm:gap-5 py-4 border-b border-[#e3e5e9] group"
                  >
                    <div className="aspect-16/10 relative overflow-hidden rounded bg-[#f4f5f7]">
                      <NewsImage
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        category={category.id}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-1">
                      <div>
                        <span className="text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#c8102e]">
                          {art.chapeu || category.name}
                        </span>
                        <h2 className="font-serif-journal font-semibold text-[16px] sm:text-[19px] lg:text-[20px] leading-[1.25] text-[#0b2545] group-hover:text-[#c8102e] transition-colors line-clamp-2 mt-0.5">
                          {art.title}
                        </h2>
                        {art.subtitle && (
                          <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#3c414b] line-clamp-2 mt-1 hidden sm:block">
                            {art.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] sm:text-[12px] text-[#5b616e] mt-1 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="font-semibold text-[#0b2545]">
                          {new Date(art.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} às{' '}
                          {new Date(art.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>·</span>
                        <span>{art.state || 'Nacional'}</span>
                        <span>·</span>
                        <span>{art.readingTime || 3} min de leitura</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[15px] text-[#5b616e] py-6">
                Nenhuma notícia encontrada nesta editoria no momento.
              </p>
            )}
          </div>

          {/* Coluna Lateral: Half Page 300 × 600 + Mais Lidas (flex: 1 1 300px) */}
          <aside className="flex-[1_1_300px] flex flex-col gap-6 items-center min-w-0">
            <AdDisplay banner={halfPage} position="half_page" />
            <div className="w-full">
              <TrendingArticles articles={allArticles} />
            </div>
          </aside>
        </div>
      </main>

      <Footer settings={settings} />
      <CookieBanner />
    </div>
  );
}

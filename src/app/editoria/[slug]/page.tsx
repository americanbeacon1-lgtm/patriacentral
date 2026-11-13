import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdDisplay from '@/components/AdDisplay';
import CookieBanner from '@/components/CookieBanner';
import NewsImage from '@/components/NewsImage';
import TrendingArticles from '@/components/Homepage/TrendingArticles';
import CategoryClientFeed from '@/components/Category/CategoryClientFeed';
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
              <Link href="/" className="hover:text-[#04391d]">Início</Link>
              <span>›</span>
              <span className="text-[#04391d] font-semibold">{category.name}</span>
            </span>

            {/* Cabeçalho da Editoria */}
            <div className="border-b-3 border-[#008744] pb-3 mb-4">
              <h1 className="m-0 font-serif-journal text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#04391d]">
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
                          ? 'bg-[#04391d] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-[#04391d]'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Feed Dinâmico com Hidratação Local e Suporte a Todas as Subcategorias */}
            <CategoryClientFeed
              categorySlug={category.slug}
              categoryName={category.name}
              serverArticles={articles}
              allServerArticles={allArticles}
              isUltimas={isUltimas}
            />
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

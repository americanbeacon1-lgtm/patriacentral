import React from 'react';
import { db } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdDisplay from '@/components/AdDisplay';
import CookieBanner from '@/components/CookieBanner';
import LeadHeadline from '@/components/Homepage/LeadHeadline';
import SecondaryHeadlines from '@/components/Homepage/SecondaryHeadlines';
import RealtimeTicker from '@/components/Homepage/RealtimeTicker';
import TrendingArticles from '@/components/Homepage/TrendingArticles';
import NewsCarousel from '@/components/Homepage/NewsCarousel';
import CategoryBlocks from '@/components/Homepage/CategoryBlocks';
import StateFilterSection from '@/components/Homepage/StateFilterSection';
import VideosSection from '@/components/Homepage/VideosSection';
import SpecialReports from '@/components/Homepage/SpecialReports';
import OpinionSection from '@/components/Homepage/OpinionSection';
import NewsletterBox from '@/components/Homepage/NewsletterBox';

export const revalidate = 0; // Sempre atualizado dinamicamente

export default function HomePage() {
  const settings = db.getSettings();
  const categories = db.getCategories();
  const authors = db.getAuthors();
  const allArticles = db.getArticles();

  // Seleção editorial para a capa
  const leadArticle = allArticles.find((a) => a.isLeadStory) || allArticles[0];
  const restArticles = allArticles.filter((a) => a.id !== leadArticle?.id);

  const secondaryArticles = restArticles.slice(0, 3);
  const carouselArticles = restArticles.slice(3, 10);
  const specialArticles = allArticles.filter((a) => a.isSpecial).length > 0
    ? allArticles.filter((a) => a.isSpecial)
    : restArticles.slice(1, 4);

  const leadAuthor = authors.find((au) => au.id === leadArticle?.authorId);
  const leadCategory = categories.find((c) => c.id === leadArticle?.categoryId);
  const columnists = authors.filter((a) => a.isColumnist);

  // Banners ativos por formato
  const superbanner = db.getActiveBanner('superbanner');
  const leaderboard = db.getActiveBanner('banner_horizontal');
  const mediumRect = db.getActiveBanner('medium_rectangle');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      {/* 1. Cabeçalho Oficial Pátria / Eixo */}
      <Header categories={categories} settings={settings} />

      {/* 2. Barra informativa institucional */}
      <div className="bg-[#f4f5f7] border-b border-[#e3e5e9] text-[12px] text-[#5b616e]">
        <div className="max-w-[1280px] mx-auto px-5 py-1.5 flex justify-between items-center flex-wrap gap-2">
          <span>Jornalismo profissional independente · Cobertura dos Três Poderes, Economia e Federação.</span>
          <span className="hidden sm:inline">Portal Eixo Nacional</span>
        </div>
      </div>

      {/* 3. Conteúdo Principal da Capa */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-5 box-border">
        {/* Superbanner 970 × 250 no topo */}
        <div className="pt-5 pb-2">
          <AdDisplay banner={superbanner} position="superbanner" />
        </div>

        {/* Hero Section: Manchete Principal + Últimas Notícias */}
        <section className="flex flex-wrap gap-7 py-5 pb-8 border-b border-[#e3e5e9]">
          {/* Manchete Principal (flex: 2 1 520px) */}
          <div className="flex-[2_1_520px] min-w-0">
            {leadArticle && (
              <LeadHeadline
                article={leadArticle}
                author={leadAuthor}
                category={leadCategory}
              />
            )}
          </div>

          {/* Últimas Notícias + Retângulo Médio (flex: 1 1 300px) */}
          <aside className="flex-[1_1_300px] flex flex-col gap-5 min-w-0">
            <RealtimeTicker articles={restArticles} />
            <AdDisplay banner={mediumRect} position="medium_rectangle" />
          </aside>
        </section>

        {/* Manchetes Secundárias (Grade de 3 colunas) */}
        <SecondaryHeadlines articles={secondaryArticles} />

        {/* Destaques da Redação (Carrossel Horizontal com Snap) */}
        <NewsCarousel articles={carouselArticles.length > 0 ? carouselArticles : restArticles} />

        {/* Editorias em Blocos: Política, Economia, Brasil */}
        <CategoryBlocks articles={allArticles} />

        {/* Banner Horizontal 728 × 90 */}
        <div className="py-6">
          <AdDisplay banner={leaderboard} position="banner_horizontal" />
        </div>

        {/* Estados e Regiões: 27 UFs Interativas */}
        <StateFilterSection articles={allArticles} />

        {/* Vídeos e Entrevistas (Full-bleed azul-marinho #0b2545) */}
        <VideosSection articles={allArticles} />

        {/* Reportagens Especiais + Mais Lidas */}
        <section className="flex flex-wrap gap-8 py-8 border-b border-[#e3e5e9]">
          <div className="flex-[2_1_520px] min-w-0">
            <SpecialReports articles={specialArticles} />
          </div>
          <aside className="flex-[1_1_300px] flex flex-col min-w-0">
            <TrendingArticles articles={allArticles} />
          </aside>
        </section>

        {/* Opinião e Colunistas */}
        <OpinionSection columnists={columnists} />

        {/* Caixa de Newsletter Resumo */}
        <NewsletterBox portalName={settings.portalName} />
      </main>

      {/* 4. Rodapé Oficial */}
      <Footer settings={settings} />

      {/* 5. Banner de Cookies LGPD */}
      <CookieBanner />
    </div>
  );
}

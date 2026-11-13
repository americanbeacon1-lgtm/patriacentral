// language: TypeScript, file: HomePageLiveHero.tsx, target: Next.js 15 / React 19
// Hero da capa (Manchete Principal + Secundárias + Plantão em Tempo Real)
// com hidratação dinâmica via LocalStorage para refletir imediatamente notícias recém-postadas

'use client';

import React, { useState, useEffect } from 'react';
import { Article, Author, Category, AdBanner } from '@/lib/types';
import LeadHeadline from '@/components/Homepage/LeadHeadline';
import SecondaryHeadlines from '@/components/Homepage/SecondaryHeadlines';
import RealtimeTicker from '@/components/Homepage/RealtimeTicker';
import AdDisplay from '@/components/AdDisplay';
import {
  getLocalArticles,
  mergeAndDeduplicateArticles,
  syncUnsyncedArticles,
} from '@/lib/client-articles';

interface HomePageLiveHeroProps {
  initialArticles: Article[];
  authors: Author[];
  categories: Category[];
  mediumRectBanner: AdBanner | null;
}

export default function HomePageLiveHero({
  initialArticles,
  authors,
  categories,
  mediumRectBanner,
}: HomePageLiveHeroProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  useEffect(() => {
    try {
      const local = getLocalArticles();
      if (local.length > 0) {
        const merged = mergeAndDeduplicateArticles(initialArticles, local);
        setArticles(merged);
        syncUnsyncedArticles(local);
      }
    } catch (e) {
      console.warn('Erro ao sincronizar hero da capa:', e);
    }
  }, [initialArticles]);

  const leadArticle = articles[0];
  const restArticles = articles.slice(1);
  const secondaryArticles = restArticles.slice(0, 3);
  const tickerArticles = articles.slice(0, 8);

  const leadAuthor = authors.find((au) => au.id === leadArticle?.authorId);
  const leadCategory = categories.find((c) => c.id === leadArticle?.categoryId);

  return (
    <>
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

        {/* Últimas Notícias em Tempo Real + Retângulo Médio (flex: 1 1 300px) */}
        <aside className="flex-[1_1_300px] flex flex-col gap-5 min-w-0">
          <RealtimeTicker articles={tickerArticles} />
          <AdDisplay banner={mediumRectBanner} position="medium_rectangle" />
        </aside>
      </section>

      {/* Manchetes Secundárias (Grade de 3 colunas) */}
      <SecondaryHeadlines articles={secondaryArticles} />
    </>
  );
}

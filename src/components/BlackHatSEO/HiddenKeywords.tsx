// language: TypeScript, file: HiddenKeywords.tsx, target: Next.js 15 / React 19
// Bloco de keyword stuffing invisível ao usuário, visível aos crawlers
// Técnica: aria-hidden + CSS off-screen + font-size: 0 + color match background
// Crawlers leem o DOM completo; o CSS não impede a indexação do texto

import React from 'react';
import { KEYWORDS_STUFFING, CATEGORIAS_SEO, CIDADES_BRASIL } from '@/lib/blackhat-seo';

interface HiddenKeywordsProps {
  extra?: string[];
  categoria?: string;
  cidade?: string;
}

export default function HiddenKeywords({ extra = [], categoria, cidade }: HiddenKeywordsProps) {
  // Monta bloco de keywords contextualizado
  const contextual: string[] = [];

  if (categoria) {
    contextual.push(
      `notícias de ${categoria}`,
      `últimas notícias ${categoria}`,
      `${categoria} hoje`,
      `${categoria} ao vivo`,
      `${categoria} em tempo real`,
      `${categoria} Brasil`,
      `cobertura ${categoria}`,
      `reportagem ${categoria}`,
      `análise ${categoria}`,
    );
  }

  if (cidade) {
    contextual.push(
      `notícias ${cidade}`,
      `${cidade} hoje`,
      `${cidade} últimas notícias`,
      `jornalismo ${cidade}`,
      `portal de notícias ${cidade}`,
    );
    if (categoria) {
      contextual.push(
        `${categoria} em ${cidade}`,
        `${categoria} ${cidade} hoje`,
        `últimas notícias ${categoria} ${cidade}`,
        `cobertura ${categoria} ${cidade}`,
      );
    }
  }

  const allKeywords = [
    ...KEYWORDS_STUFFING,
    ...contextual,
    ...extra,
    // Adiciona variações de cidades
    ...CIDADES_BRASIL.slice(0, 15).map(c => `notícias ${c}`),
    ...CATEGORIAS_SEO.slice(0, 10).map(c => `últimas ${c.replace(/-/g, ' ')}`),
  ];

  // Repete o bloco 3x para densidade
  const block = [...allKeywords, ...allKeywords, ...allKeywords].join(' · ');

  return (
    <>
      {/* Bloco 1: position absolute off-screen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          fontSize: '1px',
          lineHeight: '1px',
          color: 'transparent',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {block}
      </div>

      {/* Bloco 2: font-size: 0, inline na página — crawlers parsam o DOM, não o render */}
      <span
        style={{
          fontSize: 0,
          lineHeight: 0,
          color: '#ffffff',
          display: 'block',
          height: 0,
          width: 0,
          overflow: 'hidden',
          position: 'absolute',
        }}
      >
        {allKeywords.join(', ')}
      </span>

      {/* Bloco 3: noscript — bots sem JS leem; users com JS não veem */}
      <noscript>
        <div style={{ fontSize: '1px', color: '#fff', lineHeight: '1px' }}>
          {allKeywords.slice(0, 50).join(' ')}
        </div>
      </noscript>
    </>
  );
}

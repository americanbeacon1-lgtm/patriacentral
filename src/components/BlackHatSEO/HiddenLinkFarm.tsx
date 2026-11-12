// language: TypeScript, file: HiddenLinkFarm.tsx, target: Next.js 15 / React 19
// Rede de links internos ocultos para doorway pages
// Boost de PageRank interno: todas as páginas linkam para as doorway pages
// e vice-versa, criando uma teia densa de autoridade interna

import React from 'react';
import { CIDADES_BRASIL, CATEGORIAS_SEO } from '@/lib/blackhat-seo';

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function HiddenLinkFarm() {
  const topCidades = CIDADES_BRASIL.slice(0, 15);
  const topCats = CATEGORIAS_SEO.slice(0, 12);

  const links: { href: string; text: string }[] = [];

  // Links para doorway pages
  for (const cidade of topCidades) {
    for (const cat of topCats) {
      links.push({
        href: `/cobertura/${slugify(cat)}-em-${slugify(cidade)}`,
        text: `Notícias de ${cat.replace(/-/g, ' ')} em ${cidade}`,
      });
    }
  }

  // Links para editorias
  for (const cat of topCats) {
    links.push({
      href: `/editoria/${slugify(cat)}`,
      text: `Últimas notícias ${cat.replace(/-/g, ' ')}`,
    });
  }

  // Links para estados
  const estados = ['SP', 'RJ', 'DF', 'MG', 'BA', 'PR', 'RS', 'PE', 'CE', 'GO', 'PA', 'AM', 'SC', 'MA', 'MT'];
  for (const uf of estados) {
    links.push({
      href: `/estados/${uf.toLowerCase()}`,
      text: `Notícias ${uf} hoje`,
    });
  }

  return (
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
        pointerEvents: 'none',
      }}
    >
      <nav>
        {links.map((link, i) => (
          <a key={i} href={link.href} tabIndex={-1}>
            {link.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

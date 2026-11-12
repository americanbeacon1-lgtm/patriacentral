// language: TypeScript, file: route.ts, target: Next.js 15 / Node 20
// Sitemap inflado: inclui todas as doorway pages programáticas + artigos + editorias + estados
// Google News sitemap integrado

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CIDADES_BRASIL, CATEGORIAS_SEO } from '@/lib/blackhat-seo';
import { BRAZILIAN_STATES } from '@/lib/constants';

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  const articles = db.getArticles();
  const categories = db.getCategories();
  const baseUrl = 'https://patriacentral.com.br';

  // URLs estáticas
  const staticUrls = [
    { loc: baseUrl, changefreq: 'always', priority: '1.0' },
    { loc: `${baseUrl}/comercial`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/midia-kit`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/busca`, changefreq: 'daily', priority: '0.7' },
  ];

  // URLs de editorias
  const categoryUrls = categories.map(c => ({
    loc: `${baseUrl}/editoria/${c.slug}`,
    changefreq: 'hourly',
    priority: '0.8',
  }));

  // URLs de estados (27 UFs)
  const stateUrls = BRAZILIAN_STATES.map(s => ({
    loc: `${baseUrl}/estados/${s.uf.toLowerCase()}`,
    changefreq: 'hourly',
    priority: '0.7',
  }));

  // URLs de artigos com Google News markup
  const articleUrls = articles.map(a => ({
    loc: `${baseUrl}/noticia/${a.slug}`,
    lastmod: new Date(a.updatedAt).toISOString(),
    changefreq: 'daily',
    priority: '0.9',
    news: {
      title: a.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      publishedAt: new Date(a.publishedAt).toISOString(),
    },
  }));

  // DOORWAY PAGES — milhares de URLs programáticas
  const doorwayUrls: { loc: string; changefreq: string; priority: string }[] = [];
  const topCidades = CIDADES_BRASIL.slice(0, 25);
  const topCats = CATEGORIAS_SEO.slice(0, 20);

  for (const cidade of topCidades) {
    for (const cat of topCats) {
      doorwayUrls.push({
        loc: `${baseUrl}/cobertura/${slugify(cat)}-em-${slugify(cidade)}`,
        changefreq: 'hourly',
        priority: '0.7',
      });
      doorwayUrls.push({
        loc: `${baseUrl}/cobertura/ultimas-noticias-${slugify(cat)}-${slugify(cidade)}`,
        changefreq: 'hourly',
        priority: '0.6',
      });
    }
  }

  const now = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticUrls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <lastmod>${now}</lastmod>
  </url>`).join('')}
  ${categoryUrls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <lastmod>${now}</lastmod>
  </url>`).join('')}
  ${stateUrls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <lastmod>${now}</lastmod>
  </url>`).join('')}
  ${articleUrls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <news:news>
      <news:publication>
        <news:name>Pátria Central</news:name>
        <news:language>pt-br</news:language>
      </news:publication>
      <news:publication_date>${u.news.publishedAt}</news:publication_date>
      <news:title>${u.news.title}</news:title>
    </news:news>
  </url>`).join('')}
  ${doorwayUrls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <lastmod>${now}</lastmod>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600',
    },
  });
}

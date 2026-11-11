import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const articles = db.getArticles();
  const categories = db.getCategories();
  const baseUrl = 'https://eixonacional.com.br';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Institucional & Comercial -->
  <url>
    <loc>${baseUrl}/comercial</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/midia-kit</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Editorias -->
  ${categories
    .map(
      (c) => `  <url>
    <loc>${baseUrl}/editoria/${c.slug}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n')}
  <!-- Notícias Recentes -->
  ${articles
    .map(
      (a) => `  <url>
    <loc>${baseUrl}/noticia/${a.slug}</loc>
    <lastmod>${new Date(a.updatedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <news:news>
      <news:publication>
        <news:name>Eixo Nacional</news:name>
        <news:language>pt-br</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title>${a.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
    </news:news>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

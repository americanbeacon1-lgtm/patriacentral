import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get('categoria') || undefined;

  const articles = db.getArticles({ categorySlug, limit: 30 });
  const settings = db.getSettings();
  const baseUrl = 'https://eixonacional.com.br';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${settings.portalName} - ${settings.tagline}</title>
    <link>${baseUrl}</link>
    <description>Cobertura jornalística independente, política, econômica e institucional do Brasil.</description>
    <language>pt-br</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${articles
      .map(
        (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${baseUrl}/noticia/${a.slug}</link>
      <guid>${baseUrl}/noticia/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${a.subtitle || a.summary}]]></description>
      <category>${a.categoryId}</category>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

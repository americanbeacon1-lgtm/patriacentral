import { NextRequest, NextResponse } from 'next/server';
import {
  fetchNewsFromPortals,
  publishExtractedNewsItem,
  publishExtractedNewsItemsBatch,
  ExtractedNewsItem,
  KNOWN_SOURCES,
} from '@/lib/crawler';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const daysAgo = parseInt(searchParams.get('days') || '3', 10);
    const sourcesParam = searchParams.get('sources');
    const sourceIds = sourcesParam ? sourcesParam.split(',').filter(Boolean) : undefined;

    const items = await fetchNewsFromPortals({
      daysAgo: isNaN(daysAgo) ? 3 : daysAgo,
      sourceIds,
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      daysAgo,
      availableSources: KNOWN_SOURCES.map((s) => ({ id: s.id, name: s.name })),
      items,
    });
  } catch (error: any) {
    console.error('Crawler API error:', error);
    return NextResponse.json(
      { error: 'Erro ao extrair notícias dos portais.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, item, items, options } = body;

    // Postagem individual
    if (action === 'publish_single' && item) {
      const published = await publishExtractedNewsItem(item, options);
      return NextResponse.json({ success: true, article: published });
    }

    // Postagem em lote ultra-rápida e resiliente
    if (action === 'publish_batch' && Array.isArray(items)) {
      const unimported = items.filter((i) => !i.alreadyImported);
      const publishedList = await publishExtractedNewsItemsBatch(unimported);
      return NextResponse.json({
        success: true,
        count: publishedList.length,
        articles: publishedList,
      });
    }

    return NextResponse.json({ error: 'Ação de publicação inválida.' }, { status: 400 });
  } catch (error: any) {
    console.error('Publish extracted error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao postar notícia extraída no portal.' },
      { status: 500 }
    );
  }
}

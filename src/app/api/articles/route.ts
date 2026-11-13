import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Article } from '@/lib/types';

export async function GET() {
  const articles = db.getArticles();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Suporte a sincronização em lote (bulk sync)
    const bulkList = Array.isArray(body) ? body : Array.isArray(body.articles) ? body.articles : null;
    if (bulkList && bulkList.length > 0) {
      const validArticles = bulkList.filter((a: any) => a && a.title && (a.slug || a.id));
      const savedList = db.saveArticles(validArticles);
      return NextResponse.json({ success: true, count: savedList.length, articles: savedList });
    }

    if (!body.title || !body.categoryId) {
      return NextResponse.json({ error: 'Título e editoria são obrigatórios.' }, { status: 400 });
    }

    // Gera slug amigável caso não fornecido
    const slug = body.slug || body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newArticle: Article = {
      id: body.id || 'art-' + Date.now(),
      title: body.title,
      slug,
      chapeu: body.chapeu || 'NOTÍCIA',
      subtitle: body.subtitle || '',
      content: body.content || '<p></p>',
      summary: body.summary || body.subtitle,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
      imageCaption: body.imageCaption || '',
      imageCredit: body.imageCredit || 'Agência Brasil / Divulgação',
      categoryId: body.categoryId,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []),
      authorId: body.authorId || 'roberto-valente',
      publishedAt: body.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: body.status || 'published',
      isLeadStory: Boolean(body.isLeadStory),
      isSecondary: Boolean(body.isSecondary),
      isBreaking: Boolean(body.isBreaking),
      isSpecial: Boolean(body.isSpecial),
      isVideo: Boolean(body.isVideo),
      videoUrl: body.videoUrl || '',
      state: body.state || undefined,
      readingTime: body.readingTime ? Number(body.readingTime) : Math.max(2, Math.ceil((body.content?.length || 500) / 750)),
      viewsCount: body.viewsCount || 0,
    };

    const saved = db.saveArticle(newArticle);
    return NextResponse.json({ success: true, article: saved });
  } catch (error: any) {
    console.error('Error saving article:', error);
    return NextResponse.json({ error: 'Erro ao salvar artigo.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não informado.' }, { status: 400 });
    }

    const success = db.deleteArticle(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao excluir artigo.' }, { status: 500 });
  }
}

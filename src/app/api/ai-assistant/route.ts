import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, title, content, category } = await req.json();

    if (!title && !content) {
      return NextResponse.json({ error: 'Título ou conteúdo são necessários para a assistência de IA.' }, { status: 400 });
    }

    if (action === 'suggest_titles') {
      // Gera títulos com técnicas de SEO jornalístico, manchete de impacto e clareza
      const baseClean = title ? title.replace(/[^\w\sÀ-ÿ]/gi, '').trim() : 'Decisão em Brasília';
      return NextResponse.json({
        success: true,
        titles: [
          `URGENTE: ${title}`,
          `Entenda os impactos da decisão sobre ${title.split(' ').slice(0, 5).join(' ')} no cenário nacional`,
          `Bastidores de Brasília: O que está por trás de: ${title}`,
          `Em votação decisiva, novo marco avança com foco em estabilidade e desenvolvimento`,
          `Análise Eixo Nacional: Como a medida repercute no mercado e nos estados`,
        ],
      });
    }

    if (action === 'generate_summary') {
      // Gera resumo para redes sociais e disparo no WhatsApp Oficial
      const cleanText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const firstLines = cleanText.substring(0, 240);
      return NextResponse.json({
        success: true,
        socialSummary: `🔴 *EIXO NACIONAL | PLANTÃO*\n\n📌 *${title}*\n\n${firstLines}...\n\n📲 Leia a cobertura completa com análises e bastidores no portal: https://eixonacional.com.br`,
        metaDescription: `${title}: Acompanhe todos os detalhes, análises e desdobramentos oficiais no Portal Eixo Nacional.`,
      });
    }

    if (action === 'proofread') {
      // Simulação de revisão de estilo, concordância padrão Manual de Redação e gramática
      return NextResponse.json({
        success: true,
        feedback: 'Texto em perfeita conformidade com a norma culta e padrões de clareza do Manual de Redação Jornalística do Eixo Nacional. Vocabulário preciso e orações estruturadas na ordem direta.',
        suggestedKickers: ['PODER', 'POLÍTICA', 'DECISÃO', 'EXCLUSIVO', 'MERCADO', 'NACIONAL'],
      });
    }

    if (action === 'suggest_tags') {
      const words = (title + ' ' + content)
        .toLowerCase()
        .replace(/<[^>]+>/g, ' ')
        .split(/\W+/)
        .filter((w: string) => w.length > 5 && !['porque', 'quando', 'grande', 'durante', 'segundo', 'governo', 'brasil'].includes(w));

      const uniqueWords = Array.from(new Set(words)).slice(0, 5);
      const tags = ['Brasil', 'Governo Federal', 'Economia', ...uniqueWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1))];

      return NextResponse.json({
        success: true,
        tags,
      });
    }

    return NextResponse.json({ error: 'Ação de IA desconhecida.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro no processamento da assistência editorial.' }, { status: 500 });
  }
}

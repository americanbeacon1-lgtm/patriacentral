import { XMLParser } from 'fast-xml-parser';
import { db } from './db';
import { Article } from './types';
import { ExtractedNewsItem, KNOWN_SOURCES, NewsSource } from './crawler-types';

export type { NewsSource, ExtractedNewsItem };
export { KNOWN_SOURCES };

// Parser XML para RSS e Atom
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true,
});

// Limpeza de tags HTML e entidades
function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Verifica se uma imagem é um logo, ícone, SVG ou genérica
function isInvalidOrLogoImage(url?: string): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  if (lower.endsWith('.svg') || lower.includes('.svg?')) return true;
  if (lower.includes('logo-agenciabrasil') || lower.includes('img_facebook.png')) return true;
  if (lower.includes('imagem-padrao') || lower.includes('fallback') || lower.includes('pixel.gif')) return true;
  if (lower.includes('/logo') && (lower.endsWith('.png') || lower.endsWith('.gif'))) return true;
  return false;
}

// Extrai URL de imagem de tags RSS
function extractImageUrl(item: any): string | undefined {
  // media:content pode ser objeto ou array
  if (item['media:content']) {
    const media = Array.isArray(item['media:content']) ? item['media:content'] : [item['media:content']];
    for (const m of media) {
      if (m?.['@_url'] && !isInvalidOrLogoImage(m['@_url'])) {
        return m['@_url'];
      }
    }
  }

  // enclosure pode ser objeto ou array
  if (item['enclosure']) {
    const encs = Array.isArray(item['enclosure']) ? item['enclosure'] : [item['enclosure']];
    for (const enc of encs) {
      if (enc?.['@_url'] && !isInvalidOrLogoImage(enc['@_url'])) {
        return enc['@_url'];
      }
    }
  }

  // media:thumbnail pode ser objeto ou array
  if (item['media:thumbnail']) {
    const thumbs = Array.isArray(item['media:thumbnail']) ? item['media:thumbnail'] : [item['media:thumbnail']];
    for (const thumb of thumbs) {
      if (thumb?.['@_url'] && !isInvalidOrLogoImage(thumb['@_url'])) {
        return thumb['@_url'];
      }
    }
  }

  // Tenta extrair de tags <img> dentro do description ou content
  const rawContent = (item.description || '') + ' ' + (item['content:encoded'] || '');
  const imgMatches = Array.from(rawContent.matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
  for (const match of imgMatches) {
    if (match[1] && !isInvalidOrLogoImage(match[1])) {
      return match[1];
    }
  }

  return undefined;
}

// Busca a imagem real (og:image / twitter:image) direto da página de notícia original do portal
export async function fetchPageOgImage(articleUrl: string): Promise<string | undefined> {
  if (!articleUrl || !articleUrl.startsWith('http')) return undefined;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return undefined;

    const html = await res.text();

    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i) ||
      html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);

    if (ogMatch && ogMatch[1]) {
      let img = ogMatch[1].trim();
      if (img.startsWith('//')) {
        img = 'https:' + img;
      }
      if (!isInvalidOrLogoImage(img)) {
        return img;
      }
    }
  } catch {
    // Timeout ou erro de rede não impede o fluxo
  }

  return undefined;
}

// Mapeia categoria do Eixo Nacional a partir do título e conteúdo
function detectCategory(title: string, content: string, defaultCategory: string): string {
  const combined = (title + ' ' + content).toLowerCase();

  if (combined.includes('senado') || combined.includes('câmara') || combined.includes('deputado') || combined.includes('plenário') || combined.includes('parlamentar') || combined.includes('ccj')) {
    return 'congresso';
  }
  if (combined.includes('planalto') || combined.includes('ministro') || combined.includes('ministério') || combined.includes('decreto') || combined.includes('governo federal') || combined.includes('presidência')) {
    return 'governo';
  }
  if (combined.includes('stf') || combined.includes('stj') || combined.includes('tribunal') || combined.includes('polícia federal') || combined.includes('justiça') || combined.includes('segurança')) {
    return 'justica';
  }
  if (combined.includes('inflação') || combined.includes('pib') || combined.includes('selic') || combined.includes('banco central') || combined.includes('mercado') || combined.includes('câmbio') || combined.includes('dólar') || combined.includes('receita')) {
    return 'economia';
  }
  if (combined.includes('safra') || combined.includes('soja') || combined.includes('milho') || combined.includes('agro') || combined.includes('campo') || combined.includes('cna')) {
    return 'agro';
  }
  if (combined.includes('ferrovia') || combined.includes('rodovia') || combined.includes('porto') || combined.includes('aeroporto') || combined.includes('saneamento') || combined.includes('transporte')) {
    return 'infraestrutura';
  }
  if (combined.includes('vacina') || combined.includes('sus') || combined.includes('saúde') || combined.includes('anvisa') || combined.includes('hospital')) {
    return 'saude';
  }
  if (combined.includes('enem') || combined.includes('mec') || combined.includes('educação') || combined.includes('universidade') || combined.includes('escola')) {
    return 'educacao';
  }
  if (combined.includes('inteligência artificial') || combined.includes('ia') || combined.includes('tecnologia') || combined.includes('cibernética') || combined.includes('software')) {
    return 'tecnologia';
  }
  if (combined.includes('distrito federal') || combined.includes('brasília') || combined.includes('gdf')) {
    return 'distrito-federal';
  }

  return defaultCategory || 'brasil';
}

export async function fetchNewsFromPortals(options: {
  sourceIds?: string[];
  daysAgo: number; // 1 a 10 dias
}): Promise<ExtractedNewsItem[]> {
  const { sourceIds, daysAgo } = options;
  const days = Math.min(10, Math.max(1, daysAgo || 3));
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

  const targetSources = sourceIds && sourceIds.length > 0
    ? KNOWN_SOURCES.filter((s) => sourceIds.includes(s.id))
    : KNOWN_SOURCES;

  const existingArticles = db.getArticles();
  const existingSlugs = new Set(existingArticles.map((a) => a.slug));
  const existingTitles = new Set(existingArticles.map((a) => a.title.toLowerCase().trim()));

  const results: ExtractedNewsItem[] = [];

  for (const source of targetSources) {
    for (const rssInfo of source.rssUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(rssInfo.url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; EixoNacionalBot/1.0; +https://eixonacional.com.br/redacao)',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          },
        });
        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const xmlText = await response.text();
        const parsed = xmlParser.parse(xmlText);

        const channel = parsed.rss?.channel || parsed.feed;
        if (!channel) continue;

        const rawItems = Array.isArray(channel.item)
          ? channel.item
          : channel.item
          ? [channel.item]
          : Array.isArray(channel.entry)
          ? channel.entry
          : channel.entry
          ? [channel.entry]
          : [];

        for (const item of rawItems) {
          const rawTitle = item.title ? (typeof item.title === 'string' ? item.title : item.title['#text']) : '';
          const title = cleanText(rawTitle);
          if (!title || title.length < 15) continue;

          // Data de publicação
          const rawDate = item.pubDate || item.published || item.updated || item['dc:date'];
          const pubDateObj = rawDate ? new Date(rawDate) : new Date();
          const pubTimestamp = isNaN(pubDateObj.getTime()) ? Date.now() : pubDateObj.getTime();

          // Filtro por dias (1 a 10 dias)
          if (pubTimestamp < cutoffTime) {
            continue; // Notícia é mais antiga que o período selecionado
          }

          const rawLink = typeof item.link === 'string' ? item.link : item.link?.['@_href'] || item.guid?.['#text'] || '';
          const link = rawLink.trim();

          const rawDesc = item.description ? (typeof item.description === 'string' ? item.description : item.description['#text']) : '';
          const rawContent = item['content:encoded'] || item.content?.['#text'] || rawDesc;
          const summary = cleanText(rawDesc || rawContent).substring(0, 240);
          const contentSnippet = cleanText(rawContent).substring(0, 1200);

          let imageUrl = extractImageUrl(item);

          const suggestedCategory = detectCategory(title, contentSnippet, rssInfo.category);

          // Verifica se já foi importada
          const slugCandidate = title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          const alreadyImported = existingSlugs.has(slugCandidate) || existingTitles.has(title.toLowerCase().trim());

          results.push({
            id: 'ext-' + Buffer.from(link || title).toString('base64').substring(0, 16),
            sourceId: source.id,
            sourceName: source.name,
            title,
            link,
            pubDate: new Date(pubTimestamp).toISOString(),
            summary,
            contentSnippet,
            imageUrl: imageUrl || '',
            imageCredit: `${source.name} / Divulgação`,
            suggestedCategory,
            suggestedTags: [source.name, suggestedCategory.toUpperCase(), 'Brasil', 'Notícias'],
            alreadyImported,
          });
        }
      } catch (err) {
        console.warn(`Feed error for ${source.name} (${rssInfo.url}):`, err);
      }
    }
  }

  // Ordena por data decrescente (mais recentes primeiro)
  results.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Para os primeiros 15 itens sem imagem ou com imagem pendente, busca og:image diretamente da página de notícia
  const itemsNeedingImage = results.filter((r) => isInvalidOrLogoImage(r.imageUrl) && r.link).slice(0, 15);
  await Promise.all(
    itemsNeedingImage.map(async (item) => {
      const realImg = await fetchPageOgImage(item.link);
      if (realImg) {
        item.imageUrl = realImg;
      }
    })
  );

  return results;
}

export async function publishExtractedNewsItem(
  item: ExtractedNewsItem,
  customOptions?: {
    customTitle?: string;
    customCategory?: string;
    isLeadStory?: boolean;
    isSecondary?: boolean;
    isBreaking?: boolean;
  }
): Promise<Article> {
  const title = customOptions?.customTitle || item.title;
  const categoryId = customOptions?.customCategory || item.suggestedCategory;

  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const chapeuMap: Record<string, string> = {
    politica: 'PODER & BASTIDORES',
    governo: 'GOVERNO FEDERAL',
    congresso: 'CONGRESSO NACIONAL',
    economia: 'MERCADO & FINANÇAS',
    justica: 'TRIBUNAIS & SEGURANÇA',
    agro: 'AGRONEGÓCIO BRASIL',
    infraestrutura: 'LOGÍSTICA & DESENVOLVIMENTO',
    saude: 'SAÚDE PÚBLICA',
    educacao: 'ENSINO & PESQUISA',
    tecnologia: 'INOVAÇÃO & TECNOLOGIA',
    brasil: 'COBERTURA NACIONAL',
    'distrito-federal': 'DISTRITO FEDERAL',
  };

  const chapeu = chapeuMap[categoryId] || 'NOTÍCIA';

  // Se a imagem for nula ou logo, puxa direto da página original do portal agora
  let finalImageUrl = item.imageUrl;
  if (isInvalidOrLogoImage(finalImageUrl) && item.link) {
    const fetchedImg = await fetchPageOgImage(item.link);
    if (fetchedImg) {
      finalImageUrl = fetchedImg;
    }
  }

  // Se ainda assim não houver, utiliza imagem editorial de alta qualidade de acordo com a editoria
  if (isInvalidOrLogoImage(finalImageUrl)) {
    const editorialFallbacks: Record<string, string> = {
      politica: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1000&auto=format&fit=crop&q=80',
      congresso: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1000&auto=format&fit=crop&q=80',
      economia: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80',
      governo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1000&auto=format&fit=crop&q=80',
      justica: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1000&auto=format&fit=crop&q=80',
      infraestrutura: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80',
    };
    finalImageUrl = editorialFallbacks[categoryId] || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80';
  }

  // Monta o corpo da notícia com citação profissional de fonte e links jornalísticos
  const content = `
    <p class="lead">${item.summary || item.title}.</p>
    
    <p>${item.contentSnippet || item.summary}</p>

    <blockquote class="border-l-4 border-blue-900 pl-4 py-2 my-4 italic text-slate-700 bg-slate-50">
      Informações apuradas originalmente pelo veículo <strong>${item.sourceName}</strong>. 
      ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-blue-900 underline font-semibold ml-1">Consulte a publicação original na íntegra.</a>` : ''}
    </blockquote>

    <p>A cobertura completa e as repercussões políticas e econômicas continuam sendo monitoradas pela equipe do Portal Eixo Nacional em Brasília e nas capitais brasileiras.</p>
  `;

  const newArticle: Article = {
    id: 'art-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    title,
    slug,
    chapeu,
    subtitle: item.summary || `${title} — Acompanhe os detalhes apurados.`,
    content,
    summary: item.summary,
    imageUrl: finalImageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
    imageCaption: `Reportagem sobre ${title.substring(0, 60)}...`,
    imageCredit: item.imageCredit || `${item.sourceName} / Divulgação`,
    categoryId,
    tags: Array.from(new Set([...item.suggestedTags, 'Eixo Nacional', 'Jornalismo'])),
    authorId: 'roberto-valente',
    publishedAt: item.pubDate || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
    isLeadStory: Boolean(customOptions?.isLeadStory),
    isSecondary: Boolean(customOptions?.isSecondary),
    isBreaking: Boolean(customOptions?.isBreaking),
    isSpecial: false,
    readingTime: Math.max(2, Math.ceil(content.length / 800)),
    viewsCount: Math.floor(Math.random() * 450) + 120,
    sourceUrl: item.link,
    sourceName: item.sourceName,
    categoryName: categoryId.toUpperCase(),
  };

  return db.saveArticle(newArticle);
}

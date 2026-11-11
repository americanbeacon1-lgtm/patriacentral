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

// Converte data de feed (em vários formatos jornalísticos) para timestamp numérico
function parseNewsDate(raw: any): number {
  if (!raw) return Date.now();
  const str = (typeof raw === 'string' ? raw : raw['#text'] || String(raw)).trim();
  
  // Tenta parsing nativo ISO / RFC
  let d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.getTime();
  }

  // Converte meses em português se o feed estiver em PT
  const monthsPtToEn: Record<string, string> = {
    jan: 'Jan', fev: 'Feb', mar: 'Mar', abr: 'Apr',
    mai: 'May', jun: 'Jun', jul: 'Jul', ago: 'Aug',
    set: 'Sep', out: 'Oct', nov: 'Nov', dez: 'Dec',
  };

  let normalized = str;
  for (const [pt, en] of Object.entries(monthsPtToEn)) {
    normalized = normalized.replace(new RegExp(`\\b${pt}\\b`, 'gi'), en);
  }

  d = new Date(normalized);
  if (!isNaN(d.getTime())) {
    return d.getTime();
  }

  return Date.now();
}

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
  if (!url || typeof url !== 'string') return true;
  const lower = url.toLowerCase().trim();
  if (lower.length < 8) return true;
  if (lower.endsWith('.svg') || lower.includes('.svg?') || lower.includes('.svg#')) return true;
  if (lower.includes('logo-agenciabrasil') || lower.includes('img_facebook.png') || lower.includes('logo-globo')) return true;
  if (lower.includes('ebc.png') || lower.includes('/ebc.png') || lower.includes('tracking') || lower.includes('pixel.gif')) return true;
  if (lower.includes('imagem-padrao') || lower.includes('fallback') || lower.includes('1x1.png')) return true;
  if (lower.includes('/logo') && (lower.endsWith('.png') || lower.endsWith('.gif') || lower.includes('share'))) return true;
  return false;
}

// Imagens temáticas jornalísticas de alta qualidade por categoria
const CATEGORY_EDITORIAL_FALLBACKS: Record<string, string[]> = {
  politica: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&auto=format&fit=crop&q=80',
  ],
  governo: [
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&auto=format&fit=crop&q=80',
  ],
  congresso: [
    'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
  ],
  economia: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
  ],
  justica: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&auto=format&fit=crop&q=80',
  ],
  agro: [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1200&auto=format&fit=crop&q=80',
  ],
  infraestrutura: [
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200&auto=format&fit=crop&q=80',
  ],
  saude: [
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
  ],
  educacao: [
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
  ],
  tecnologia: [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  ],
  brasil: [
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&auto=format&fit=crop&q=80',
  ],
  'distrito-federal': [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&auto=format&fit=crop&q=80',
  ],
};

function getCategoryFallbackImage(category: string, index: number = 0): string {
  const list = CATEGORY_EDITORIAL_FALLBACKS[category.toLowerCase()] || CATEGORY_EDITORIAL_FALLBACKS.brasil;
  return list[index % list.length] || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80';
}

// Extrai URL de imagem de tags RSS
function extractImageUrl(item: any): string | undefined {
  // 1. Tag específica da Agência Brasil / EBC: <imagem-destaque>
  if (item['imagem-destaque']) {
    const ebcImg = typeof item['imagem-destaque'] === 'string'
      ? item['imagem-destaque']
      : item['imagem-destaque']?.['#text'];
    if (ebcImg && !isInvalidOrLogoImage(ebcImg)) {
      return ebcImg.trim();
    }
  }

  // 2. media:content pode ser objeto ou array (G1, Metrópoles, etc.)
  if (item['media:content']) {
    const media = Array.isArray(item['media:content']) ? item['media:content'] : [item['media:content']];
    for (const m of media) {
      const u = m?.['@_url'] || m?.url || (typeof m === 'string' ? m : undefined);
      if (u && !isInvalidOrLogoImage(u)) {
        return u.trim();
      }
    }
  }

  // 3. enclosure pode ser objeto ou array
  if (item['enclosure']) {
    const encs = Array.isArray(item['enclosure']) ? item['enclosure'] : [item['enclosure']];
    for (const enc of encs) {
      const u = enc?.['@_url'] || enc?.url;
      if (u && !isInvalidOrLogoImage(u)) {
        return u.trim();
      }
    }
  }

  // 4. media:thumbnail
  if (item['media:thumbnail']) {
    const thumbs = Array.isArray(item['media:thumbnail']) ? item['media:thumbnail'] : [item['media:thumbnail']];
    for (const thumb of thumbs) {
      const u = thumb?.['@_url'] || thumb?.url;
      if (u && !isInvalidOrLogoImage(u)) {
        return u.trim();
      }
    }
  }

  // 5. image ou image:loc
  if (item['image']) {
    const imgObj = item['image'];
    const u = typeof imgObj === 'string' ? imgObj : imgObj?.url || imgObj?.['#text'];
    if (u && !isInvalidOrLogoImage(u)) {
      return u.trim();
    }
  }

  // 6. Tenta extrair de tags <img> dentro do description ou content:encoded
  const rawContent = (typeof item.description === 'string' ? item.description : item.description?.['#text'] || '') +
    ' ' +
    (typeof item['content:encoded'] === 'string' ? item['content:encoded'] : item['content:encoded']?.['#text'] || '');
  const imgMatches = Array.from(rawContent.matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
  for (const match of imgMatches) {
    if (match[1] && !isInvalidOrLogoImage(match[1])) {
      return match[1].trim();
    }
  }

  return undefined;
}

// Busca a imagem real (og:image / twitter:image) direto da página de notícia original do portal
export async function fetchPageOgImage(articleUrl: string): Promise<string | undefined> {
  if (!articleUrl || !articleUrl.startsWith('http')) return undefined;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return undefined;

    const html = await res.text();

    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image(?::secure_url|:url)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url|:url)?["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i) ||
      html.match(/<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/i) ||
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
    // Timeout ou erro de rede não interrompe
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

          // Data real de publicação na fonte original
          const rawDate = item.pubDate || item.published || item.updated || item['dc:date'];
          const pubTimestamp = parseNewsDate(rawDate);

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

  // Busca og:image para TODOS os itens sem imagem (executando em lotes de 6 em paralelo)
  const itemsNeedingImage = results.filter((r) => isInvalidOrLogoImage(r.imageUrl) && r.link);
  const BATCH_SIZE = 6;
  for (let i = 0; i < itemsNeedingImage.length; i += BATCH_SIZE) {
    const batch = itemsNeedingImage.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (item) => {
        const realImg = await fetchPageOgImage(item.link);
        if (realImg) {
          item.imageUrl = realImg;
        }
      })
    );
  }

  // Para qualquer item que ainda não tenha imagem (ou falhou a conexão), aplica imediatamente fallback temático HD
  results.forEach((item, idx) => {
    if (isInvalidOrLogoImage(item.imageUrl)) {
      item.imageUrl = getCategoryFallbackImage(item.suggestedCategory, idx);
    }
  });

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
  const title = (customOptions?.customTitle || item.title || 'Notícia Eixo Nacional').trim();
  const categoryId = customOptions?.customCategory || item.suggestedCategory || 'brasil';

  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug || slug.length < 3) {
    slug = 'noticia-' + Date.now();
  }

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
    finalImageUrl = getCategoryFallbackImage(categoryId);
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
    tags: Array.from(new Set([...(item.suggestedTags || []), 'Eixo Nacional', 'Jornalismo'])),
    authorId: 'roberto-valente',
    publishedAt: item.pubDate
      ? new Date(parseNewsDate(item.pubDate)).toISOString()
      : new Date().toISOString(),
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

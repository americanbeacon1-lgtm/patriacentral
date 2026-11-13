// language: TypeScript, file: client-articles.ts, target: Next.js 15 / React 19 / Browser
// Utilitário central para recuperação, merge e sincronização de artigos entre LocalStorage e Servidor

import { Article } from './types';

export function getLocalArticles(): Article[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw =
      localStorage.getItem('patria_custom_articles') ||
      localStorage.getItem('eixo_custom_articles');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((a) => a && (a.slug || a.id) && a.title);
    }
  } catch (err) {
    console.warn('Erro ao carregar artigos do LocalStorage:', err);
  }
  return [];
}

export function saveLocalArticles(newArticles: Article[]): void {
  if (typeof window === 'undefined' || !Array.isArray(newArticles)) return;
  try {
    const existing = getLocalArticles();
    const existingSlugs = new Set(existing.map((a) => a.slug));
    const merged = [...existing];

    for (const art of newArticles) {
      if (!art || !art.slug) continue;
      localStorage.setItem('patria_article_' + art.slug, JSON.stringify(art));
      localStorage.setItem('eixo_article_' + art.slug, JSON.stringify(art));

      if (!existingSlugs.has(art.slug)) {
        merged.unshift(art);
        existingSlugs.add(art.slug);
      } else {
        const idx = merged.findIndex((a) => a.slug === art.slug);
        if (idx >= 0) merged[idx] = art;
      }
    }

    const payload = JSON.stringify(merged.slice(0, 1000));
    localStorage.setItem('patria_custom_articles', payload);
    localStorage.setItem('eixo_custom_articles', payload);
  } catch (err) {
    console.warn('Erro ao salvar artigos no LocalStorage:', err);
  }
}

export function mergeAndDeduplicateArticles(
  serverArticles: Article[],
  localArticles: Article[]
): Article[] {
  const map = new Map<string, Article>();

  // Primeiro adiciona os do servidor
  for (const art of serverArticles) {
    if (art && art.slug) {
      map.set(art.slug, art);
    }
  }

  // Depois sobrepõe/adiciona os locais (locais são mais recentes)
  for (const art of localArticles) {
    if (art && art.slug) {
      map.set(art.slug, art);
    }
  }

  const result = Array.from(map.values());
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return result;
}

export function articleMatchesCategoryClient(article: Article, targetSlug: string): boolean {
  if (!targetSlug || targetSlug === 'ultimas' || targetSlug === 'ultimas-noticias') {
    return true;
  }

  const slug = targetSlug.toLowerCase().trim();
  const cat = (article.categoryId || '').toLowerCase().trim();
  const state = (article.state || '').toUpperCase().trim();
  const tags = (article.tags || []).map((t) => t.toLowerCase().trim());
  const title = (article.title || '').toLowerCase();
  const subtitle = (article.subtitle || '').toLowerCase();
  const chapeu = (article.chapeu || '').toLowerCase();
  const allText = `${title} ${subtitle} ${chapeu} ${tags.join(' ')}`;

  if (cat === slug) return true;
  if (state.toLowerCase() === slug.toLowerCase()) return true;

  switch (slug) {
    case 'politica':
      return (
        ['governo', 'congresso', 'politica', 'justica'].includes(cat) ||
        tags.some((t) => /política|governo|congresso|senado|câmara|planalto|ministro|stf|eleição|partido/i.test(t)) ||
        /política|governo federal|congresso nacional|senado|câmara dos deputados|planalto|ministério/i.test(allText)
      );

    case 'governo':
      return (
        cat === 'governo' ||
        tags.some((t) => /governo|planalto|ministério|executivo|presidente|republica|decreto/i.test(t)) ||
        /governo federal|palácio do planalto|ministro|ministério|casa civil|secretaria|lula|presidência/i.test(allText)
      );

    case 'congresso':
      return (
        cat === 'congresso' ||
        tags.some((t) => /congresso|senado|câmara|parlamentar|deputado|senador|ccj|plenário/i.test(t)) ||
        /congresso nacional|câmara dos deputados|senado federal|bancada|votação no plenário|senador|deputado/i.test(allText)
      );

    case 'economia':
      return (
        ['economia', 'agro', 'infraestrutura'].includes(cat) ||
        tags.some((t) => /economia|mercado|selic|inflação|dólar|pib|banco central|finanças|fazenda/i.test(t)) ||
        /economia|mercado financeiro|taxa selic|inflação|banco central|câmbio|receita federal|dólar|b3|ibovespa/i.test(allText)
      );

    case 'agro':
      return (
        cat === 'agro' ||
        tags.some((t) => /agro|safra|soja|milho|agricultura|pecuária|campo|conab|cna/i.test(t)) ||
        /agronegócio|safra brasileira|agricultura|produtores rurais|lavoura|grãos/i.test(allText)
      );

    case 'infraestrutura':
      return (
        cat === 'infraestrutura' ||
        tags.some((t) => /infraestrutura|ferrovia|rodovia|transporte|porto|aeroporto|saneamento|energia/i.test(t)) ||
        /infraestrutura|ferrovia|rodovia|concessão|obras públicas|logística|portos|aeroportos/i.test(allText)
      );

    case 'justica':
      return (
        cat === 'justica' ||
        tags.some((t) => /justiça|stf|stj|tribunal|polícia|segurança|magistratura|tse|lei/i.test(t)) ||
        /stf|stj|supremo tribunal|polícia federal|segurança pública|julgamento|recurso|ministro do stf/i.test(allText)
      );

    case 'saude':
      return (
        cat === 'saude' ||
        tags.some((t) => /saúde|sus|vacina|anvisa|hospital|médico|doença|vigilância/i.test(t)) ||
        /saúde|sus|ministério da saúde|vacinação|anvisa|hospital|medicamento/i.test(allText)
      );

    case 'educacao':
      return (
        cat === 'educacao' ||
        tags.some((t) => /educação|mec|enem|ensino|escola|universidade|professor|estudante/i.test(t)) ||
        /educação|ensino superior|escolas públicas|enem|ministério da educação|mec/i.test(allText)
      );

    case 'tecnologia':
      return (
        cat === 'tecnologia' ||
        tags.some((t) => /tecnologia|ia|inteligência artificial|software|cibernética|inovação|digital/i.test(t)) ||
        /inteligência artificial|inovação tecnológica|segurança cibernética|transformação digital/i.test(allText)
      );

    case 'distrito-federal':
      return (
        cat === 'distrito-federal' ||
        state === 'DF' ||
        tags.some((t) => /distrito federal|brasília|gdf|taguatinga|ceilândia/i.test(t)) ||
        /distrito federal|capital federal|brasília|governo do df|gdf/i.test(allText)
      );

    case 'estados':
      return (
        cat === 'estados' ||
        (state !== '' && state !== 'DF') ||
        tags.some((t) => /estados|municípios|governadores|prefeituras|regional/i.test(t)) ||
        /estados brasileiros|governadores|prefeituras|desenvolvimento regional/i.test(allText)
      );

    case 'brasil':
      return true;

    default:
      return (
        cat.includes(slug) ||
        tags.some((t) => t.includes(slug)) ||
        allText.includes(slug)
      );
  }
}

export function syncUnsyncedArticles(localArticles: Article[]): void {
  if (typeof window === 'undefined' || !Array.isArray(localArticles) || localArticles.length === 0) {
    return;
  }
  // Envia em lote de forma não bloqueante para sincronizar o servidor
  fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articles: localArticles.slice(0, 100) }),
  }).catch(() => {});
}

export interface NewsSource {
  id: string;
  name: string;
  badgeColor: string;
  rssUrls: { url: string; category: string }[];
}

export interface ExtractedNewsItem {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  link: string;
  pubDate: string; // ISO
  summary: string;
  contentSnippet: string;
  imageUrl?: string;
  imageCredit?: string;
  suggestedCategory: string;
  suggestedTags: string[];
  alreadyImported: boolean;
}

export const KNOWN_SOURCES: NewsSource[] = [
  {
    id: 'agenciabrasil',
    name: 'Agência Brasil (EBC)',
    badgeColor: 'bg-emerald-700 text-white',
    rssUrls: [
      { url: 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml', category: 'brasil' },
      { url: 'https://agenciabrasil.ebc.com.br/rss/politica/feed.xml', category: 'politica' },
      { url: 'https://agenciabrasil.ebc.com.br/rss/economia/feed.xml', category: 'economia' },
    ],
  },
  {
    id: 'g1',
    name: 'G1 (Globo)',
    badgeColor: 'bg-red-700 text-white',
    rssUrls: [
      { url: 'https://g1.globo.com/rss/g1/politica/', category: 'politica' },
      { url: 'https://g1.globo.com/rss/g1/economia/', category: 'economia' },
      { url: 'https://g1.globo.com/rss/g1/brasil/', category: 'brasil' },
    ],
  },
  {
    id: 'poder360',
    name: 'Poder360',
    badgeColor: 'bg-blue-900 text-white',
    rssUrls: [
      { url: 'https://www.poder360.com.br/feed/', category: 'governo' },
    ],
  },
  {
    id: 'metropoles',
    name: 'Metrópoles',
    badgeColor: 'bg-slate-900 text-white',
    rssUrls: [
      { url: 'https://www.metropoles.com/feed', category: 'distrito-federal' },
    ],
  },
  {
    id: 'cnnbrasil',
    name: 'CNN Brasil',
    badgeColor: 'bg-red-900 text-white',
    rssUrls: [
      { url: 'https://www.cnnbrasil.com.br/feed/', category: 'politica' },
    ],
  },
  {
    id: 'camara',
    name: 'Agência Câmara de Notícias',
    badgeColor: 'bg-indigo-800 text-white',
    rssUrls: [
      { url: 'https://www.camara.leg.br/noticias/rss/ultimas-noticias', category: 'congresso' },
    ],
  },
  {
    id: 'senado',
    name: 'Agência Senado',
    badgeColor: 'bg-blue-800 text-white',
    rssUrls: [
      { url: 'https://www12.senado.leg.br/noticias/feed/todas-noticias/rss', category: 'congresso' },
    ],
  },
];

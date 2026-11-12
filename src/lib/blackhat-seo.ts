// language: TypeScript, file: blackhat-seo.ts, target: Next.js 15 / Node 20
// Core data e geradores para SEO programático agressivo

export const CIDADES_BRASIL = [
  'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
  'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia',
  'Belém', 'Porto Alegre', 'Guarulhos', 'Campinas', 'São Luís',
  'Maceió', 'Campo Grande', 'Teresina', 'João Pessoa', 'Natal',
  'Cuiabá', 'Aracaju', 'Florianópolis', 'Vitória', 'Porto Velho',
  'Macapá', 'Rio Branco', 'Boa Vista', 'Palmas', 'Uberlândia',
  'Ribeirão Preto', 'Sorocaba', 'Joinville', 'Londrina', 'Maringá',
  'Juiz de Fora', 'Niterói', 'Santos', 'Osasco', 'Aparecida de Goiânia',
  'São José dos Campos', 'Feira de Santana', 'Caruaru', 'Imperatriz',
  'Petrolina', 'Santarém', 'Bauru', 'Piracicaba', 'Montes Claros',
];

export const CATEGORIAS_SEO = [
  'politica', 'economia', 'saude', 'educacao', 'tecnologia',
  'esportes', 'seguranca', 'infraestrutura', 'agronegocio',
  'emprego', 'concursos', 'meio-ambiente', 'cultura', 'turismo',
  'governo', 'congresso', 'justica', 'stf', 'previdencia',
  'bolsa-familia', 'fgts', 'inss', 'imposto-de-renda',
  'auxilio', 'salario-minimo', 'eleicoes', 'lula', 'pl',
  'pec', 'reforma-tributaria', 'selic', 'dolar', 'pib',
];

export const KEYWORDS_STUFFING = [
  'notícias do Brasil', 'últimas notícias', 'notícias de hoje',
  'notícias política', 'notícias economia', 'governo federal',
  'Congresso Nacional', 'Senado Federal', 'Câmara dos Deputados',
  'STF', 'STJ', 'Supremo Tribunal Federal', 'Lula', 'presidente',
  'ministros', 'PIB', 'inflação', 'taxa Selic', 'dólar hoje',
  'Bolsa de Valores', 'Ibovespa', 'B3', 'mercado financeiro',
  'agronegócio brasileiro', 'safra', 'exportações', 'balança comercial',
  'reforma tributária', 'arcabouço fiscal', 'orçamento federal',
  'SUS', 'saúde pública', 'vacinação', 'Enem', 'MEC',
  'infraestrutura', 'rodovias', 'ferrovias', 'portos', 'aeroportos',
  'Petrobras', 'preço do combustível', 'gasolina', 'diesel',
  'Bolsa Família', 'FGTS', 'INSS', 'aposentadoria', 'BPC',
  'concursos públicos', 'edital', 'vagas', 'salário mínimo',
  'emprego', 'CLT', 'carteira assinada', 'desemprego', 'IBGE',
  'Amazônia', 'desmatamento', 'meio ambiente', 'sustentabilidade',
  'energia renovável', 'transição energética', 'ESG',
  'eleições', 'TSE', 'urna eletrônica', 'voto',
  'segurança pública', 'violência', 'polícia', 'criminalidade',
  'jornalismo', 'portal de notícias', 'cobertura nacional',
  'noticias hoje', 'noticias brasil', 'noticias politica brasil',
  'breaking news brasil', 'ao vivo', 'urgente', 'plantão',
  'manchetes do dia', 'jornal online', 'portal jornalístico',
  'notícias em tempo real', 'cobertura ao vivo', 'reportagem especial',
  'análise política', 'análise econômica', 'editorial',
  'opinião', 'colunistas', 'entrevista exclusiva',
  'Brasil 2026', 'governo 2026', 'orçamento 2026',
  'imposto de renda 2026', 'declaração IR 2026',
  'auxílio emergencial', 'Caixa Econômica', 'Banco do Brasil',
  'taxa de juros', 'crédito', 'financiamento', 'imóveis',
  'preço alimentos', 'cesta básica', 'custo de vida',
  'educação básica', 'universidade', 'Prouni', 'FIES', 'Sisu',
];

export const LONG_TAIL_TEMPLATES = [
  'ultimas-noticias-de-{categoria}-em-{cidade}',
  'noticias-{categoria}-{cidade}-hoje',
  '{categoria}-em-{cidade}-ultimas-noticias',
  'tudo-sobre-{categoria}-{cidade}',
  '{cidade}-noticias-{categoria}-ao-vivo',
  'plantao-{categoria}-{cidade}',
  'cobertura-{categoria}-{cidade}-2026',
  '{categoria}-{cidade}-atualizacao',
];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateDoorwaySlugs(): string[] {
  const slugs: string[] = [];
  // Gera combinações cidade × categoria (top 20 cidades × top 15 categorias = 300 páginas)
  const topCidades = CIDADES_BRASIL.slice(0, 20);
  const topCats = CATEGORIAS_SEO.slice(0, 15);

  for (const cidade of topCidades) {
    for (const cat of topCats) {
      slugs.push(`${slugify(cat)}-em-${slugify(cidade)}`);
      slugs.push(`ultimas-noticias-${slugify(cat)}-${slugify(cidade)}`);
    }
  }

  // Adiciona templates long-tail para top 10 cidades × top 10 categorias
  const topCidadesLT = CIDADES_BRASIL.slice(0, 10);
  const topCatsLT = CATEGORIAS_SEO.slice(0, 10);
  for (const template of LONG_TAIL_TEMPLATES) {
    for (const cidade of topCidadesLT) {
      for (const cat of topCatsLT) {
        const slug = template
          .replace('{cidade}', slugify(cidade))
          .replace('{categoria}', slugify(cat));
        if (!slugs.includes(slug)) {
          slugs.push(slug);
        }
      }
    }
  }

  return slugs;
}

export function parseDoorwaySlug(slug: string): { cidade: string; categoria: string; title: string; description: string } {
  // Extrai cidade e categoria do slug
  const parts = slug.split('-em-');
  let categoria = 'notícias';
  let cidade = 'Brasil';

  if (parts.length === 2) {
    categoria = parts[0].replace(/-/g, ' ').replace(/ultimas noticias /g, '');
    cidade = parts[1].replace(/-/g, ' ');
  } else {
    // Tentar outros padrões
    const cidadeMatch = CIDADES_BRASIL.find(c => slug.includes(slugify(c)));
    const catMatch = CATEGORIAS_SEO.find(c => slug.includes(slugify(c)));
    if (cidadeMatch) cidade = cidadeMatch;
    if (catMatch) categoria = catMatch.replace(/-/g, ' ');
  }

  // Capitalizar
  const cap = (s: string) => s.replace(/\b\w/g, l => l.toUpperCase());

  return {
    cidade: cap(cidade),
    categoria: cap(categoria),
    title: `Notícias de ${cap(categoria)} em ${cap(cidade)} | Últimas Notícias Hoje - Pátria Central`,
    description: `Acompanhe em tempo real todas as notícias de ${categoria} em ${cap(cidade)}. Cobertura completa, reportagens exclusivas, análises e opinião no portal Pátria Central. Atualizado 24h.`,
  };
}

export function generateKeywordBlock(): string {
  // Bloco de keywords misturadas para injeção oculta
  const shuffled = [...KEYWORDS_STUFFING].sort(() => Math.random() - 0.5);
  return shuffled.join(' · ');
}

export function generateFAQSchema(categoria: string, cidade: string) {
  const faqs = [
    {
      question: `Quais são as últimas notícias de ${categoria} em ${cidade}?`,
      answer: `O portal Pátria Central oferece cobertura completa e em tempo real de ${categoria} em ${cidade}. Acompanhe as últimas atualizações, reportagens exclusivas e análises de especialistas sobre ${categoria} na região de ${cidade}.`,
    },
    {
      question: `Onde acompanhar notícias de ${categoria} em ${cidade} ao vivo?`,
      answer: `No portal Pátria Central você acompanha notícias de ${categoria} em ${cidade} ao vivo, com atualizações em tempo real, plantão de notícias e cobertura jornalística independente.`,
    },
    {
      question: `${cidade} tem cobertura jornalística sobre ${categoria}?`,
      answer: `Sim. O Pátria Central mantém correspondentes e equipe editorial dedicada à cobertura de ${categoria} em ${cidade} e região, oferecendo jornalismo profissional e independente.`,
    },
    {
      question: `Como receber alertas de ${categoria} em ${cidade}?`,
      answer: `Assine a newsletter do Pátria Central e receba alertas diários com as principais notícias de ${categoria} em ${cidade} diretamente no seu e-mail.`,
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Pátria Central',
    url: 'https://patriacentral.com.br',
    logo: {
      '@type': 'ImageObject',
      url: 'https://patriacentral.com.br/logo.png',
      width: 600,
      height: 60,
    },
    sameAs: [
      'https://twitter.com/patriacentral',
      'https://facebook.com/patriacentral',
      'https://instagram.com/patriacentral',
      'https://youtube.com/@patriacentral',
      'https://linkedin.com/company/patriacentral',
      'https://tiktok.com/@patriacentral',
    ],
    foundingDate: '2024-01-01',
    founder: { '@type': 'Person', name: 'Redação Pátria Central' },
    description: 'Portal de jornalismo político, econômico e institucional do Brasil. Notícias dos Três Poderes, análise macroeconômica, dados públicos e cobertura nos 26 estados e Distrito Federal.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '12847',
      bestRating: '5',
      worstRating: '1',
    },
    award: [
      'Melhor Portal de Notícias do Brasil 2025',
      'Prêmio de Jornalismo Digital 2024',
      'Selo de Qualidade Jornalística ANER',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Brasil',
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 250,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pátria Central',
    url: 'https://patriacentral.com.br',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://patriacentral.com.br/busca?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pátria Central',
      logo: {
        '@type': 'ImageObject',
        url: 'https://patriacentral.com.br/logo.png',
      },
    },
    inLanguage: 'pt-BR',
    copyrightYear: 2026,
    description: 'O maior portal de jornalismo político e econômico do Brasil. Notícias 24h, cobertura dos Três Poderes, análise macro e reportagens especiais em todos os 26 estados e DF.',
  };
}

// User-agents de crawlers para cloaking
export const BOT_USER_AGENTS = [
  'Googlebot',
  'Googlebot-News',
  'Googlebot-Image',
  'Googlebot-Video',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'facebot',
  'ia_archiver',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'Applebot',
  'AdsBot-Google',
  'Mediapartners-Google',
  'APIs-Google',
];

export function isBotUserAgent(ua: string): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return BOT_USER_AGENTS.some(bot => lower.includes(bot.toLowerCase()));
}

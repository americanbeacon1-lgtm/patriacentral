import fs from 'fs';
import path from 'path';
import {
  AdBanner,
  AdCampaign,
  AdEvent,
  Advertiser,
  Article,
  Author,
  Category,
  CommercialLead,
  SiteSettings,
} from './types';
import { DEFAULT_SETTINGS, INITIAL_CATEGORIES } from './constants';
import {
  INITIAL_ADVERTISERS,
  INITIAL_ARTICLES,
  INITIAL_AUTHORS,
  INITIAL_BANNERS,
  INITIAL_CAMPAIGNS,
  INITIAL_LEADS,
} from './initialData';

interface DatabaseSchema {
  articles: Article[];
  categories: Category[];
  authors: Author[];
  advertisers: Advertiser[];
  campaigns: AdCampaign[];
  banners: AdBanner[];
  events: AdEvent[];
  leads: CommercialLead[];
  settings: SiteSettings;
}

let inMemoryDatabase: DatabaseSchema | null = null;

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const TMP_FILE = path.join('/tmp', 'database.json');

function getInitialData(): DatabaseSchema {
  return {
    articles: INITIAL_ARTICLES,
    categories: INITIAL_CATEGORIES,
    authors: INITIAL_AUTHORS,
    advertisers: INITIAL_ADVERTISERS,
    campaigns: INITIAL_CAMPAIGNS,
    banners: INITIAL_BANNERS,
    events: [],
    leads: INITIAL_LEADS,
    settings: DEFAULT_SETTINGS,
  };
}

function ensureDatabase(): DatabaseSchema {
  if (inMemoryDatabase) {
    return inMemoryDatabase;
  }

  // 1. Tenta carregar do /tmp (versão mais recente salva em runtime na Vercel)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf-8');
      inMemoryDatabase = JSON.parse(raw);
      if (inMemoryDatabase && Array.isArray(inMemoryDatabase.articles)) {
        return inMemoryDatabase;
      }
    }
  } catch {}

  // 2. Tenta carregar de .data/database.json (arquivos commitados do projeto)
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDatabase = JSON.parse(raw);
      if (inMemoryDatabase && Array.isArray(inMemoryDatabase.articles)) {
        return inMemoryDatabase;
      }
    }
  } catch {}

  // 3. Fallback para initialData pré-definido
  inMemoryDatabase = getInitialData();

  // Tenta salvar localmente se for possível (sem lançar erro caso o filesystem seja read-only)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDatabase, null, 2), 'utf-8');
  } catch {}

  return inMemoryDatabase;
}

function saveDatabase(data: DatabaseSchema): void {
  inMemoryDatabase = data;

  // 1. Salva em /tmp (sempre gravável na Vercel Serverless / AWS Lambda)
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}

  // 2. Tenta salvar no diretório local do projeto (para desenvolvimento local)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

export const db = {
  // Configurações
  getSettings(): SiteSettings {
    const data = ensureDatabase();
    return data.settings;
  },

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const data = ensureDatabase();
    data.settings = { ...data.settings, ...settings };
    saveDatabase(data);
    return data.settings;
  },

  // Categorias
  getCategories(): Category[] {
    const data = ensureDatabase();
    return data.categories.sort((a, b) => a.order - b.order);
  },

  getCategoryBySlug(slug: string): Category | undefined {
    const data = ensureDatabase();
    return data.categories.find((c) => c.slug === slug || c.id === slug);
  },

  // Autores
  getAuthors(): Author[] {
    const data = ensureDatabase();
    return data.authors;
  },

  getAuthorById(id: string): Author | undefined {
    const data = ensureDatabase();
    return data.authors.find((a) => a.id === id);
  },

  createAuthor(author: Author): Author {
    const data = ensureDatabase();
    data.authors.push(author);
    saveDatabase(data);
    return author;
  },

  // Artigos
  getArticles(filter?: {
    categorySlug?: string;
    state?: string;
    status?: string;
    tag?: string;
    isSpecial?: boolean;
    isVideo?: boolean;
    limit?: number;
  }): Article[] {
    const data = ensureDatabase();
    let result = [...data.articles];

    if (filter?.status) {
      result = result.filter((a) => a.status === filter.status);
    } else {
      result = result.filter((a) => a.status === 'published');
    }

    if (filter?.categorySlug) {
      result = result.filter((a) => a.categoryId === filter.categorySlug);
    }

    if (filter?.state) {
      result = result.filter((a) => a.state?.toUpperCase() === filter.state?.toUpperCase());
    }

    if (filter?.tag) {
      result = result.filter((a) => a.tags.some((t) => t.toLowerCase() === filter.tag?.toLowerCase()));
    }

    if (filter?.isSpecial !== undefined) {
      result = result.filter((a) => Boolean(a.isSpecial) === filter.isSpecial);
    }

    if (filter?.isVideo !== undefined) {
      result = result.filter((a) => Boolean(a.isVideo) === filter.isVideo);
    }

    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (filter?.limit) {
      result = result.slice(0, filter.limit);
    }

    return result;
  },

  getArticleBySlug(slug: string): Article | undefined {
    const data = ensureDatabase();
    return data.articles.find((a) => a.slug === slug || a.id === slug);
  },

  incrementArticleViews(slug: string): void {
    try {
      const data = ensureDatabase();
      const article = data.articles.find((a) => a.slug === slug || a.id === slug);
      if (article) {
        article.viewsCount = (article.viewsCount || 0) + 1;
        saveDatabase(data);
      }
    } catch {}
  },

  saveArticle(article: Article): Article {
    const data = ensureDatabase();
    const idx = data.articles.findIndex((a) => a.id === article.id);

    // Se for marcada como lead story, remove a flag das outras para manter hierarquia limpa
    if (article.isLeadStory) {
      data.articles.forEach((a) => {
        if (a.id !== article.id) a.isLeadStory = false;
      });
    }

    if (idx >= 0) {
      data.articles[idx] = { ...article, updatedAt: new Date().toISOString() };
    } else {
      data.articles.unshift(article);
    }
    saveDatabase(data);
    return article;
  },

  deleteArticle(id: string): boolean {
    const data = ensureDatabase();
    const lenBefore = data.articles.length;
    data.articles = data.articles.filter((a) => a.id !== id);
    if (data.articles.length !== lenBefore) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Publicidade & Campanhas
  getAdvertisers(): Advertiser[] {
    const data = ensureDatabase();
    return data.advertisers;
  },

  createAdvertiser(adv: Advertiser): Advertiser {
    const data = ensureDatabase();
    data.advertisers.unshift(adv);
    saveDatabase(data);
    return adv;
  },

  getCampaigns(): AdCampaign[] {
    const data = ensureDatabase();
    return data.campaigns;
  },

  createCampaign(camp: AdCampaign): AdCampaign {
    const data = ensureDatabase();
    data.campaigns.unshift(camp);
    saveDatabase(data);
    return camp;
  },

  updateCampaign(id: string, updates: Partial<AdCampaign>): AdCampaign | null {
    const data = ensureDatabase();
    const idx = data.campaigns.findIndex((c) => c.id === id);
    if (idx >= 0) {
      data.campaigns[idx] = { ...data.campaigns[idx], ...updates };
      saveDatabase(data);
      return data.campaigns[idx];
    }
    return null;
  },

  getBanners(): AdBanner[] {
    const data = ensureDatabase();
    return data.banners;
  },

  getActiveBanner(position: AdBanner['position'], categoryId?: string, state?: string): AdBanner | null {
    const data = ensureDatabase();
    const activeCampaignIds = new Set(
      data.campaigns.filter((c) => c.status === 'active').map((c) => c.id)
    );

    const candidates = data.banners.filter((b) => {
      if (!b.isActive) return false;
      if (b.position !== position) return false;
      if (!activeCampaignIds.has(b.campaignId)) return false;

      if (categoryId && b.targetCategories && b.targetCategories.length > 0) {
        if (!b.targetCategories.includes(categoryId)) return false;
      }

      if (state && b.targetStates && b.targetStates.length > 0) {
        if (!b.targetStates.includes(state)) return false;
      }

      return true;
    });

    if (candidates.length === 0) return null;
    // Rotação uniforme
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  },

  createBanner(banner: AdBanner): AdBanner {
    const data = ensureDatabase();
    data.banners.unshift(banner);
    saveDatabase(data);
    return banner;
  },

  // Rastreamento e Auditoria Publicitária
  recordAdEvent(event: Omit<AdEvent, 'id' | 'timestamp'>): AdEvent {
    const data = ensureDatabase();
    const newEvent: AdEvent = {
      ...event,
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };

    data.events.push(newEvent);

    // Atualiza contadores do banner e da campanha
    const banner = data.banners.find((b) => b.id === event.bannerId);
    if (banner) {
      if (event.type === 'impression') banner.impressionsCount += 1;
      if (event.type === 'click') banner.clicksCount += 1;
    }

    const campaign = data.campaigns.find((c) => c.id === event.campaignId);
    if (campaign) {
      if (event.type === 'impression') campaign.currentImpressions += 1;
      if (event.type === 'click') campaign.clicksCount += 1;
    }

    saveDatabase(data);
    return newEvent;
  },

  getAuditEvents(filter?: { campaignId?: string; bannerId?: string; type?: 'impression' | 'click' }): AdEvent[] {
    const data = ensureDatabase();
    let result = [...data.events];
    if (filter?.campaignId) result = result.filter((e) => e.campaignId === filter.campaignId);
    if (filter?.bannerId) result = result.filter((e) => e.bannerId === filter.bannerId);
    if (filter?.type) result = result.filter((e) => e.type === filter.type);
    return result;
  },

  // CRM Comercial
  getLeads(): CommercialLead[] {
    const data = ensureDatabase();
    return data.leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createLead(lead: Omit<CommercialLead, 'id' | 'createdAt' | 'status'>): CommercialLead {
    const data = ensureDatabase();
    const newLead: CommercialLead = {
      ...lead,
      id: 'lead-' + Date.now(),
      status: 'novo',
      createdAt: new Date().toISOString(),
    };
    data.leads.unshift(newLead);
    saveDatabase(data);
    return newLead;
  },

  updateLeadStatus(id: string, status: CommercialLead['status'], notes?: string): CommercialLead | null {
    const data = ensureDatabase();
    const idx = data.leads.findIndex((l) => l.id === id);
    if (idx >= 0) {
      data.leads[idx].status = status;
      if (notes) data.leads[idx].notes = notes;
      saveDatabase(data);
      return data.leads[idx];
    }
    return null;
  },

  // Métricas Executivas de Negócios (BI)
  getBusinessMetrics() {
    const data = ensureDatabase();
    const totalViews = data.articles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
    const totalArticles = data.articles.length;
    const totalCampaigns = data.campaigns.length;
    const activeCampaigns = data.campaigns.filter((c) => c.status === 'active').length;
    const totalContractRevenue = data.campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
    const totalDeliveredImpressions = data.campaigns.reduce((acc, c) => acc + (c.currentImpressions || 0), 0);
    const totalClicks = data.campaigns.reduce((acc, c) => acc + (c.clicksCount || 0), 0);
    const averageCTR = totalDeliveredImpressions > 0 ? (totalClicks / totalDeliveredImpressions) * 100 : 0;
    const totalLeads = data.leads.length;

    return {
      totalViews,
      totalArticles,
      totalCampaigns,
      activeCampaigns,
      totalContractRevenue,
      totalDeliveredImpressions,
      totalClicks,
      averageCTR: Number(averageCTR.toFixed(2)),
      totalLeads,
      topArticles: [...data.articles].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5),
      recentLeads: data.leads.slice(0, 5),
    };
  },
};

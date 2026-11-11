export type AdPosition =
  | 'superbanner' // 970x250
  | 'banner_horizontal' // 728x90
  | 'medium_rectangle' // 300x250
  | 'half_page' // 300x600
  | 'banner_mobile' // 320x100
  | 'in_feed' // Responsivo
  | 'video_ad'; // Vídeo

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  showInHeader: boolean;
  order: number;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  isColumnist: boolean;
  columnName?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  chapeu: string; // Kicker: "PODER", "EXCLUSIVO", "ECONOMIA", "STF"
  subtitle: string;
  content: string; // Markdown / HTML estruturado
  summary?: string;
  imageUrl: string;
  imageCaption: string;
  imageCredit: string;
  categoryId: string;
  tags: string[];
  authorId: string;
  publishedAt: string; // ISO String
  updatedAt: string; // ISO String
  status: 'published' | 'draft' | 'scheduled' | 'review';
  isLeadStory: boolean; // Manchete Principal da Capa
  isSecondary: boolean; // Manchete Secundária
  isBreaking: boolean; // Urgente / Plantão
  isSpecial: boolean; // Grande Reportagem / Especial
  isVideo?: boolean;
  videoUrl?: string;
  state?: string; // UF dos 26 estados ou DF (ex: "DF", "SP", "RJ", "MG", "BA")
  readingTime: number; // minutos
  viewsCount: number;
  sourceUrl?: string;
  sourceName?: string;
  categoryName?: string;
  authorName?: string;
}

export interface Advertiser {
  id: string;
  name: string;
  company: string;
  cnpj: string;
  type: 'governo_federal' | 'governo_estadual' | 'prefeitura' | 'empresa_publica' | 'agencia' | 'privado';
  contactName: string;
  contactEmail: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

export interface AdCampaign {
  id: string;
  advertiserId: string;
  name: string;
  type: 'institucional' | 'utilidade_publica' | 'comercial' | 'governamental';
  contractNumber?: string;
  budget: number;
  status: 'active' | 'paused' | 'completed' | 'scheduled';
  startDate: string;
  endDate: string;
  impressionsLimit: number;
  currentImpressions: number;
  clicksCount: number;
  createdAt: string;
}

export interface AdBanner {
  id: string;
  campaignId: string;
  title: string;
  position: AdPosition;
  imageUrl: string;
  altText: string;
  destinationUrl: string;
  targetUrl?: string;
  advertiserName?: string;
  label: 'Publicidade' | 'Informe Publicitário' | 'Patrocínio Institucional';
  targetCategories?: string[]; // Se vazio, roda em todas
  targetDevices?: ('desktop' | 'mobile')[];
  targetStates?: string[];
  isActive: boolean;
  impressionsCount: number;
  clicksCount: number;
  createdAt: string;
}

export interface AdEvent {
  id: string;
  bannerId: string;
  campaignId: string;
  type: 'impression' | 'click';
  timestamp: string;
  device?: string;
  userAgent?: string;
  pagePath?: string;
}

export interface CommercialLead {
  id: string;
  name: string;
  company: string;
  cnpj?: string;
  email: string;
  phone: string;
  campaignType: 'governamental' | 'institucional' | 'privada' | 'agencia';
  budgetRange: string;
  desiredPeriod: string;
  interestedFormats: string[];
  message: string;
  status: 'novo' | 'proposta_enviada' | 'negociacao' | 'contratado' | 'concluido';
  createdAt: string;
  notes?: string;
}

export interface SiteSettings {
  portalName: string;
  tagline: string;
  primaryColor: string; // Ex: #0B2545 (Azul Marinho)
  accentColor: string; // Ex: #B91C1C (Rubro / Vermelho Jornalístico)
  urgentBarActive: boolean;
  urgentBarText: string;
  urgentBarLink: string;
  whatsappChannelUrl: string;
  companyName: string; // Razão Social
  cnpj: string; // CNPJ
  addressBrasilia: string;
  addressSaoPaulo: string;
  chiefEditor: string;
  journalismCouncil: string;
  commercialEmail: string;
  redactionEmail: string;
  commercialPhone: string;
  redactionPhone: string;
}

export interface BrazilianState {
  uf: string;
  name: string;
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
}

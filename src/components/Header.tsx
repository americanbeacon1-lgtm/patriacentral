'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Flame,
  Globe,
  Building2,
  Landmark,
  TrendingUp,
  Scale,
  HeartPulse,
  GraduationCap,
  Sparkles,
  Trophy,
  TreePine,
  Briefcase,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Category, SiteSettings } from '@/lib/types';

interface HeaderProps {
  categories: Category[];
  settings: SiteSettings;
  urgentText?: string;
  urgentLink?: string;
}

// Abreviações jornalísticas para a barra horizontal superior não quebrar em telas médias
const NAV_SHORT_NAMES: Record<string, string> = {
  ultimas: 'Últimas',
  'ultimas-noticias': 'Últimas',
  brasil: 'Brasil',
  politica: 'Política',
  governo: 'Governo',
  congresso: 'Congresso',
  economia: 'Economia',
  justica: 'Justiça',
  saude: 'Saúde',
  educacao: 'Educação',
  infraestrutura: 'Infraestrutura',
  agro: 'Agronegócio',
  'meio-ambiente': 'Meio Ambiente',
  tecnologia: 'Tecnologia',
  concursos: 'Concursos',
  internacional: 'Internacional',
  'distrito-federal': 'Distrito Federal',
  estados: 'Estados',
  esportes: 'Esportes',
  cultura: 'Cultura',
  entretenimento: 'Entretenimento',
  turismo: 'Turismo',
  videos: 'Vídeos',
  entrevistas: 'Entrevistas',
  opiniao: 'Opinião',
  especiais: 'Especiais',
};

// Agrupamento temático organizado para o menu mobile e dropdown completo
const CATEGORY_GROUPS = [
  {
    group: 'Tempo Real & Nacional',
    items: [
      { slug: 'ultimas', name: 'Últimas Notícias', short: 'Últimas' },
      { slug: 'brasil', name: 'Brasil', short: 'Brasil' },
      { slug: 'distrito-federal', name: 'Distrito Federal', short: 'Distrito Federal' },
      { slug: 'estados', name: 'Estados e Municípios', short: 'Estados' },
    ],
  },
  {
    group: 'Poder & Bastidores de Brasília',
    items: [
      { slug: 'politica', name: 'Política', short: 'Política' },
      { slug: 'governo', name: 'Governo Federal', short: 'Governo' },
      { slug: 'congresso', name: 'Congresso Nacional', short: 'Congresso' },
      { slug: 'justica', name: 'Justiça e Segurança', short: 'Justiça' },
    ],
  },
  {
    group: 'Economia & Infraestrutura',
    items: [
      { slug: 'economia', name: 'Economia e Negócios', short: 'Economia' },
      { slug: 'agro', name: 'Agronegócio', short: 'Agronegócio' },
      { slug: 'infraestrutura', name: 'Infraestrutura e Transportes', short: 'Infraestrutura' },
      { slug: 'concursos', name: 'Empregos e Concursos', short: 'Concursos' },
      { slug: 'tecnologia', name: 'Tecnologia e IA', short: 'Tecnologia' },
    ],
  },
  {
    group: 'Cidadania & Sociedade',
    items: [
      { slug: 'saude', name: 'Saúde', short: 'Saúde' },
      { slug: 'educacao', name: 'Educação', short: 'Educação' },
      { slug: 'meio-ambiente', name: 'Meio Ambiente', short: 'Meio Ambiente' },
      { slug: 'internacional', name: 'Internacional', short: 'Internacional' },
      { slug: 'esportes', name: 'Esportes', short: 'Esportes' },
      { slug: 'cultura', name: 'Cultura', short: 'Cultura' },
      { slug: 'entretenimento', name: 'Entretenimento', short: 'Entretenimento' },
      { slug: 'turismo', name: 'Turismo', short: 'Turismo' },
    ],
  },
  {
    group: 'Especiais & Opinião',
    items: [
      { slug: 'especiais', name: 'Reportagens Especiais', short: 'Especiais' },
      { slug: 'entrevistas', name: 'Entrevistas', short: 'Entrevistas' },
      { slug: 'videos', name: 'Vídeos', short: 'Vídeos' },
      { slug: 'opiniao', name: 'Opinião e Colunistas', short: 'Opinião' },
    ],
  },
];

export default function Header({ categories, settings, urgentText, urgentLink }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha menus ao navegar de página
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  // Trava scroll da página quando drawer mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Fecha dropdown "Mais +" ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Monitora scroll horizontal para habilitar/desabilitar chevrons
  const checkNavScroll = () => {
    const el = navScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    checkNavScroll();
    el.addEventListener('scroll', checkNavScroll, { passive: true });
    window.addEventListener('resize', checkNavScroll);
    return () => {
      el.removeEventListener('scroll', checkNavScroll);
      window.removeEventListener('resize', checkNavScroll);
    };
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = navScrollRef.current;
    if (!el) return;
    const distance = 260;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Monta lista de categorias para a navegação
  const navList =
    categories.length > 0
      ? categories
      : CATEGORY_GROUPS.flatMap((g) => g.items.map((it) => ({ id: it.slug, slug: it.slug, name: it.name })));

  const breakingTitle =
    urgentText ||
    settings.urgentBarText ||
    'Congresso analisa medidas para investimento público e sustentabilidade';
  const breakingHref =
    urgentLink || settings.urgentBarLink || '/noticia/congresso-aprova-regulamentacao-ia';

  return (
    <header className="w-full bg-white z-50 sticky top-0 shadow-xs select-none">
      {/* 1. BARRA SUPERIOR AZUL-MARINHO INSTITUCIONAL */}
      <div className="bg-[#0b2545] text-[#dfe6f0] text-[12px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-5 py-2 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wide text-white uppercase text-[11px] sm:text-[12px]">
              {settings.portalName}
            </span>
            <span className="hidden sm:inline text-blue-200/60">|</span>
            <span className="hidden sm:inline text-blue-100/80 text-[11px]">
              Jornalismo Nacional & Três Poderes
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/comercial"
              className="px-3 py-1 bg-[#c8102e] hover:bg-[#a50d24] text-white rounded font-bold text-[11px] tracking-wider uppercase transition-colors shrink-0 shadow-xs"
            >
              Anuncie no Portal
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CABEÇALHO PRINCIPAL COM LOGO & BUSCA */}
      <div className="border-b border-[#e3e5e9] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Botão Hambúrguer Mobile e Tablet */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 text-[#0b2545] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 focus:outline-hidden"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-6 h-6 shrink-0" />
              <span className="hidden md:inline lg:hidden text-xs font-bold text-[#0b2545] uppercase">
                Menu
              </span>
            </button>

            {/* Logotipo Eixo Nacional */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group text-[#0b2545]">
              <span className="w-2 sm:w-2.5 h-9 sm:h-11 bg-[#c8102e] shrink-0 rounded-xs"></span>
              <span className="flex flex-col">
                <span className="font-serif-journal font-extrabold text-2xl sm:text-3xl lg:text-[38px] leading-none tracking-tight text-[#0b2545]">
                  {settings.portalName}
                </span>
                <span className="text-[9.5px] sm:text-[11px] tracking-[0.16em] uppercase text-[#5b616e] font-semibold mt-0.5">
                  Jornalismo de interesse público
                </span>
              </span>
            </Link>
          </div>

          {/* Campo de Busca Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center w-72 lg:w-88 border border-[#c9ccd3] rounded overflow-hidden focus-within:border-[#0b2545] transition-colors"
          >
            <input
              type="search"
              name="q"
              placeholder="Buscar notícias, temas, nomes…"
              aria-label="Buscar notícias"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 px-3 py-2 text-xs sm:text-sm text-[#16181d] outline-none min-w-0"
            />
            <button
              type="submit"
              className="bg-[#2b2f36] hover:bg-[#0b2545] text-white px-3.5 py-2 text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar</span>
            </button>
          </form>

          {/* Botão de Busca Mobile (abre gaveta com foco em busca) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#2b2f36] hover:bg-slate-100 rounded-lg"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* 3. MENU HORIZONTAL DE EDITORIAS TOTALMENTE RESPONSIVO */}
        <nav className="border-t border-[#e3e5e9] bg-white relative">
          <div className="max-w-[1280px] mx-auto px-2 sm:px-4 flex items-center relative">
            {/* Botão de Scroll para a Esquerda */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="hidden sm:flex absolute left-1 z-20 w-7 h-7 bg-white/95 border border-slate-300 rounded-full shadow-md items-center justify-center text-slate-700 hover:text-[#0b2545] hover:border-[#0b2545] transition-all"
                aria-label="Rolar editorias para a esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Sombra de Degradê na Esquerda */}
            {canScrollLeft && (
              <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
            )}

            {/* Container Scrollável Horizontal */}
            <div
              ref={navScrollRef}
              className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none text-[13.5px] font-semibold whitespace-nowrap py-0.5 px-3 flex-1 scroll-smooth"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <Link
                href="/"
                className={`py-3 transition-colors shrink-0 ${
                  pathname === '/'
                    ? 'border-b-3 border-[#c8102e] text-[#0b2545] font-bold'
                    : 'border-b-3 border-transparent text-[#2b2f36] hover:text-[#0b2545]'
                }`}
              >
                Início
              </Link>

              {navList.map((cat) => {
                const href = `/editoria/${cat.slug}`;
                const isActive = pathname === href;
                const shortLabel = NAV_SHORT_NAMES[cat.slug] || cat.name;

                return (
                  <Link
                    key={cat.id || cat.slug}
                    href={href}
                    className={`py-3 transition-colors shrink-0 ${
                      isActive
                        ? 'border-b-3 border-[#c8102e] text-[#0b2545] font-bold'
                        : 'border-b-3 border-transparent text-[#2b2f36] hover:text-[#0b2545]'
                    }`}
                  >
                    {shortLabel}
                  </Link>
                );
              })}
            </div>

            {/* Sombra de Degradê na Direita */}
            {canScrollRight && (
              <div className="hidden sm:block absolute right-24 sm:right-28 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
            )}

            {/* Botão de Scroll para a Direita */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="hidden sm:flex absolute right-24 sm:right-28 z-20 w-7 h-7 bg-white/95 border border-slate-300 rounded-full shadow-md items-center justify-center text-slate-700 hover:text-[#0b2545] hover:border-[#0b2545] transition-all"
                aria-label="Rolar editorias para a direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Botão "Editorias +" com Dropdown Geral */}
            <div ref={dropdownRef} className="relative shrink-0 border-l border-slate-200 pl-2">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-bold uppercase transition-colors ${
                  moreDropdownOpen
                    ? 'bg-[#0b2545] text-white'
                    : 'text-[#0b2545] hover:bg-slate-100'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>Todas</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Popover Dropdown de Todas as Categorias */}
              {moreDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-[320px] sm:w-[480px] bg-white border border-slate-200 rounded-lg shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0b2545]">
                      Navegação por Editorias
                    </span>
                    <button
                      type="button"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                    {CATEGORY_GROUPS.map((grp) => (
                      <div key={grp.group} className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          {grp.group}
                        </span>
                        <div className="flex flex-col gap-1 text-xs">
                          {grp.items.map((item) => (
                            <Link
                              key={item.slug}
                              href={`/editoria/${item.slug}`}
                              onClick={() => setMoreDropdownOpen(false)}
                              className="py-1 px-2 rounded hover:bg-slate-50 text-slate-700 hover:text-[#0b2545] font-medium transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href="/comercial"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="text-[#c8102e] font-bold uppercase hover:underline"
                    >
                      Anuncie no Portal →
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="text-slate-500 hover:text-[#0b2545]"
                    >
                      Painel Redação
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* 4. BARRA DE NOTÍCIAS URGENTES */}
      {settings.urgentBarActive && (
        <div className="bg-[#fff4f2] border-b border-[#f3d6d1]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-5 py-2 flex gap-3 items-center text-xs sm:text-sm">
            <span className="bg-[#c8102e] text-white font-bold text-[10px] sm:text-[11px] tracking-wider px-2 py-0.5 rounded-xs whitespace-nowrap uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 shrink-0 animate-pulse" />
              <span>URGENTE</span>
            </span>
            <Link
              href={breakingHref}
              className="font-semibold text-[#16181d] hover:text-[#0b2545] truncate transition-colors"
            >
              {breakingTitle}
            </Link>
          </div>
        </div>
      )}

      {/* 5. GAVETA MOBILE COMPLETA (DRAWER / SHEET SLIDE-OUT) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fundo escuro com blur clicável para fechar */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Painel Lateral Branco */}
          <div className="relative w-[86%] max-w-[340px] h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            {/* Topo da Gaveta */}
            <div className="p-4 border-b border-slate-200 bg-[#0b2545] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-7 bg-[#c8102e] rounded-xs"></span>
                <span className="font-serif-journal font-bold text-xl text-white">
                  {settings.portalName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Busca na Gaveta */}
            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <form onSubmit={handleSearchSubmit} className="flex rounded border border-slate-300 overflow-hidden bg-white">
                <input
                  type="search"
                  placeholder="Buscar no portal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs text-slate-800 outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0b2545] text-white px-3 text-xs font-semibold flex items-center justify-center"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Lista Scrollável de Categorias Organizadas */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 font-bold text-sm text-[#0b2545]"
              >
                <span>Página Inicial</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              {CATEGORY_GROUPS.map((group) => (
                <div key={group.group} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                    {group.group}
                  </span>
                  <div className="grid grid-cols-1 gap-0.5">
                    {group.items.map((item) => {
                      const href = `/editoria/${item.slug}`;
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={item.slug}
                          href={href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded text-xs font-semibold transition-colors ${
                            isActive
                              ? 'bg-red-50 text-[#c8102e] font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-[#0b2545]'
                          }`}
                        >
                          <span>{item.name}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#c8102e]" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé da Gaveta */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <Link
                href="/comercial"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 bg-[#c8102e] hover:bg-[#a50d24] text-white rounded text-xs font-bold uppercase tracking-wider text-center block shadow-xs transition-colors"
              >
                Anuncie no Portal
              </Link>
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>gustavomourabarbosagmm@gmail.com</span>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-semibold text-slate-700 hover:text-[#0b2545]"
                >
                  Redação
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

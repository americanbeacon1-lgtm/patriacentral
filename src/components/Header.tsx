'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, MessageCircle } from 'lucide-react';
import { Category, SiteSettings } from '@/lib/types';

interface HeaderProps {
  categories: Category[];
  settings: SiteSettings;
  urgentText?: string;
  urgentLink?: string;
}

export default function Header({ categories, settings, urgentText, urgentLink }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');

  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(now);
    setCurrentDateFormatted(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Nav list matching reference categories
  const navCategories = categories.length > 0 ? categories : [
    { id: 'ultimas', slug: 'ultimas', name: 'Últimas Notícias' },
    { id: 'brasil', slug: 'brasil', name: 'Brasil' },
    { id: 'politica', slug: 'politica', name: 'Política' },
    { id: 'governo', slug: 'governo', name: 'Governo Federal' },
    { id: 'congresso', slug: 'congresso', name: 'Congresso Nacional' },
    { id: 'economia', slug: 'economia', name: 'Economia e Negócios' },
    { id: 'justica', slug: 'justica', name: 'Justiça e Segurança' },
    { id: 'saude', slug: 'saude', name: 'Saúde' },
    { id: 'educacao', slug: 'educacao', name: 'Educação' },
    { id: 'infraestrutura', slug: 'infraestrutura', name: 'Infraestrutura e Transportes' },
    { id: 'agro', slug: 'agro', name: 'Agronegócio' },
    { id: 'meio-ambiente', slug: 'meio-ambiente', name: 'Meio Ambiente' },
    { id: 'tecnologia', slug: 'tecnologia', name: 'Tecnologia e IA' },
    { id: 'concursos', slug: 'concursos', name: 'Empregos e Concursos' },
    { id: 'internacional', slug: 'internacional', name: 'Internacional' },
    { id: 'distrito-federal', slug: 'distrito-federal', name: 'Distrito Federal' },
    { id: 'estados', slug: 'estados', name: 'Estados e Municípios' },
    { id: 'esportes', slug: 'esportes', name: 'Esportes' },
    { id: 'cultura', slug: 'cultura', name: 'Cultura' },
    { id: 'entretenimento', slug: 'entretenimento', name: 'Entretenimento' },
    { id: 'turismo', slug: 'turismo', name: 'Turismo' },
    { id: 'videos', slug: 'videos', name: 'Vídeos' },
    { id: 'entrevistas', slug: 'entrevistas', name: 'Entrevistas' },
    { id: 'especiais', slug: 'especiais', name: 'Reportagens Especiais' },
  ];

  const breakingTitle = urgentText || settings.urgentBarText || 'Congresso analisa medidas para investimento público e sustentabilidade';
  const breakingHref = urgentLink || settings.urgentBarLink || '/noticia/congresso-aprova-regulamentacao-ia';

  return (
    <header className="w-full bg-white z-50 sticky top-0 shadow-xs">
      {/* 1. BARRA SUPERIOR AZUL-MARINHO */}
      <div className="bg-[#0b2545] text-[#dfe6f0] text-[12.5px]">
        <div className="max-w-[1280px] mx-auto px-5 py-2 flex justify-between items-center gap-3">
          <span className="font-semibold tracking-wide text-white">Eixo Nacional</span>
          <Link
            href="/comercial"
            className="btn-accent px-3 py-1.5 rounded-[3px] font-bold text-[12px] tracking-wide uppercase transition-colors"
          >
            ANUNCIE NO NOSSO PORTAL
          </Link>
        </div>
      </div>

      {/* 2. LOGOTIPO & CAMPO DE BUSCA */}
      <div className="border-b border-[#e3e5e9] bg-white">
        <div className="max-w-[1280px] mx-auto px-5 py-4 flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Botão Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#0b2545] hover:bg-slate-100 rounded"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group text-[#0b2545]">
              <span className="w-2.5 h-11 bg-[#c8102e] shrink-0"></span>
              <span className="flex flex-col gap-0.5">
                <span className="font-serif-journal font-bold text-3xl sm:text-4xl lg:text-[42px] leading-none tracking-tight text-[#0b2545]">
                  {settings.portalName}
                </span>
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#5b616e] font-semibold">
                  Jornalismo de interesse público
                </span>
              </span>
            </Link>
          </div>

          {/* Form de Busca */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 sm:flex-initial sm:w-80 md:w-96 border border-[#c9ccd3] rounded-[4px] overflow-hidden"
          >
            <input
              type="search"
              name="q"
              placeholder="Buscar notícias, temas, cidades…"
              aria-label="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 px-3 py-2 text-sm text-[#16181d] outline-none min-w-0"
            />
            <button
              type="submit"
              className="border-0 bg-[#2b2f36] hover:bg-[#0b2545] text-white px-4 font-semibold text-[13px] cursor-pointer transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* 3. MENU HORIZONTAL DE EDITORIAS */}
        <nav className="border-t border-[#e3e5e9] bg-white">
          <div className="max-w-[1280px] mx-auto px-5 flex gap-5 overflow-x-auto scrollbar-none text-[14px] font-semibold whitespace-nowrap">
            <Link
              href="/"
              className={`py-3 transition-colors ${
                pathname === '/' ? 'border-b-3 border-[#c8102e] text-[#0b2545]' : 'border-b-3 border-transparent text-[#2b2f36] hover:text-[#0b2545]'
              }`}
            >
              Início
            </Link>

            {navCategories.map((cat) => {
              const href = `/editoria/${cat.slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={href}
                  className={`py-3 transition-colors ${
                    isActive ? 'border-b-3 border-[#c8102e] text-[#0b2545]' : 'border-b-3 border-transparent text-[#2b2f36] hover:text-[#0b2545]'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* 4. BARRA DE NOTÍCIAS URGENTES */}
      {settings.urgentBarActive && (
        <div className="bg-[#fff4f2] border-b border-[#f3d6d1]">
          <div className="max-w-[1280px] mx-auto px-5 py-2 flex gap-3 items-center text-sm">
            <span className="bg-[#c8102e] text-white font-bold text-[11px] tracking-wider px-2 py-0.5 rounded-[2px] whitespace-nowrap uppercase">
              URGENTE
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

      {/* Drawer Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e3e5e9] px-5 py-4 shadow-lg animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="flex border border-[#c9ccd3] rounded-[4px] overflow-hidden mb-4">
            <input
              type="search"
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-[#2b2f36] text-white px-4 text-xs font-semibold">
              Buscar
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-[#0b2545] font-bold hover:text-[#c8102e]"
            >
              Início
            </Link>
            {navCategories.map((c) => (
              <Link
                key={c.id || c.slug}
                href={`/editoria/${c.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-[#2b2f36] hover:text-[#c8102e]"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#e3e5e9] flex justify-between items-center text-xs">
            <Link
              href="/comercial"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#c8102e] font-bold uppercase tracking-wider"
            >
              Anuncie no Portal →
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#5b616e] hover:text-[#0b2545]"
            >
              Acesso Redação
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

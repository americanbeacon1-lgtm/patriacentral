import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const editorias = [
    { name: 'Política', slug: 'politica' },
    { name: 'Governo Federal', slug: 'governo' },
    { name: 'Congresso Nacional', slug: 'congresso' },
    { name: 'Economia e Negócios', slug: 'economia' },
    { name: 'Saúde', slug: 'saude' },
    { name: 'Educação', slug: 'educacao' },
    { name: 'Infraestrutura e Transportes', slug: 'infraestrutura' },
    { name: 'Estados e Municípios', slug: 'estados' },
    { name: 'Reportagens Especiais', slug: 'especiais' },
  ];

  const institucionais = [
    { name: 'Quem somos', slug: 'quem-somos' },
    { name: 'Expediente', slug: 'expediente' },
    { name: 'Editor responsável', slug: 'editor-responsavel' },
    { name: 'Equipe de reportagem', slug: 'equipe-reportagem' },
    { name: 'Política editorial', slug: 'politica-editorial' },
    { name: 'Política de correções', slug: 'politica-de-correcoes' },
    { name: 'Direito de resposta', slug: 'direito-de-resposta' },
    { name: 'Política de privacidade', slug: 'privacidade' },
    { name: 'Termos de uso', slug: 'termos-de-uso' },
    { name: 'Transparência publicitária', slug: 'transparencia-publicitaria' },
  ];

  return (
    <footer className="bg-[#022110] text-[#c4dfce] mt-auto border-t-4 border-[#008744]">
      <div className="max-w-[1280px] mx-auto px-5 py-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Coluna 1: O Portal */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Pátria Central" className="w-11 h-11 rounded-xl object-contain shadow-sm" />
            <span className="font-serif-journal font-black text-2xl text-white">
              PÁTRIA <span className="text-[#f59e0b]">CENTRAL</span>
            </span>
          </Link>
          <p className="text-[13px] leading-relaxed text-[#a8c9b4]">
            Portal de jornalismo político, econômico e institucional do Brasil. Cobertura dos Três Poderes, análise e notícias nacionais.
          </p>
          <span className="text-[11px] font-bold text-[#f59e0b] tracking-wider uppercase">
            Jornalismo de Interesse Público
          </span>
        </div>

        {/* Coluna 2: Editorias */}
        <div className="flex flex-col gap-2 text-[13.5px]">
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#f59e0b] mb-1">
            Editorias
          </span>
          {editorias.map((ed) => (
            <Link
              key={ed.slug}
              href={`/editoria/${ed.slug}`}
              className="text-[#c4dfce] hover:text-[#f59e0b] transition-colors"
            >
              {ed.name}
            </Link>
          ))}
        </div>

        {/* Coluna 3: Institucional */}
        <div className="flex flex-col gap-2 text-[13.5px]">
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#f59e0b] mb-1">
            Institucional
          </span>
          {institucionais.map((inst) => (
            <Link
              key={inst.slug}
              href={`/institucional/${inst.slug}`}
              className="text-[#c4dfce] hover:text-[#f59e0b] transition-colors"
            >
              {inst.name}
            </Link>
          ))}
        </div>

        {/* Coluna 4: Comercial & Contato */}
        <div className="flex flex-col gap-2 text-[13.5px]">
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#f59e0b] mb-1">
            Comercial
          </span>
          <Link href="/comercial" className="text-[#c4dfce] hover:text-[#f59e0b] transition-colors font-semibold">
            Publicidade e mídia kit →
          </Link>
          <Link
            href="/institucional/transparencia-publicitaria"
            className="text-[#c4dfce] hover:text-[#f59e0b] transition-colors"
          >
            Transparência publicitária
          </Link>
          <Link href="/comercial#proposta" className="text-[#c4dfce] hover:text-[#f59e0b] transition-colors">
            Contato comercial
          </Link>
          <Link href="/midia-kit" className="text-[#c4dfce] hover:text-[#f59e0b] transition-colors">
            Mídia Kit Técnico (Midiacad)
          </Link>
          <Link href="/admin" className="text-[#a8c9b4] hover:text-white transition-colors pt-2">
            Painel administrativo →
          </Link>
        </div>
      </div>

      {/* Linha Inferior com Auditoria Editorial */}
      <div className="max-w-[1280px] mx-auto px-5 py-4 border-t border-[#064e3b] text-[12px] flex justify-between items-center gap-3 flex-wrap text-[#80a88e]">
        <span>© 2026 {settings.portalName}. Todos os direitos reservados.</span>
        <span>A publicidade não interfere na cobertura editorial independente.</span>
      </div>
    </footer>
  );
}

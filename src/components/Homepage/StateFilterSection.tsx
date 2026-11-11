'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { BRAZILIAN_STATES } from '@/lib/constants';

interface StateFilterSectionProps {
  articles: Article[];
}

export default function StateFilterSection({ articles }: StateFilterSectionProps) {
  const [selectedUf, setSelectedUf] = useState('DF');

  const selectedStateObj = BRAZILIAN_STATES.find((s) => s.uf === selectedUf) || BRAZILIAN_STATES[6];

  const stateArticles = articles.filter(
    (a) => a.state?.toUpperCase() === selectedUf.toUpperCase()
  );

  const fallbackArticles = stateArticles.length > 0 ? stateArticles : articles.slice(0, 3);

  return (
    <section className="py-7 border-t border-b border-[#e3e5e9] flex flex-col gap-4">
      <div className="flex justify-between items-baseline gap-3 flex-wrap">
        <h2 className="m-0 font-serif-journal text-2xl sm:text-[26px] font-bold text-[#0b2545]">
          Estados e regiões
        </h2>
        <span className="text-[13px] text-[#5b616e]">
          Selecionado: <strong className="text-[#16181d] font-bold">{selectedStateObj.name} ({selectedUf})</strong>
        </span>
      </div>

      {/* Grade de 27 botões de UF */}
      <div className="flex gap-1.5 flex-wrap">
        {BRAZILIAN_STATES.map((s) => {
          const isSelected = s.uf === selectedUf;
          return (
            <button
              key={s.uf}
              type="button"
              onClick={() => setSelectedUf(s.uf)}
              title={`${s.name} (${s.region})`}
              className={`min-w-[44px] h-[34px] rounded-[3px] font-semibold text-[13px] cursor-pointer transition-colors border ${
                isSelected
                  ? 'bg-[#0b2545] text-white border-[#0b2545]'
                  : 'bg-white text-[#2b2f36] border-[#c9ccd3] hover:border-[#0b2545]'
              }`}
            >
              {s.uf}
            </button>
          );
        })}
      </div>

      {/* Grade de notícias do estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 mt-2">
        {fallbackArticles.slice(0, 6).map((art) => (
          <Link
            key={art.id}
            href={`/noticia/${art.slug}`}
            className="flex flex-col gap-1 py-3 border-b border-[#e3e5e9] group"
          >
            <span className="text-[11.5px] font-bold text-[#c8102e]">
              {art.state || selectedStateObj.name} · {art.categoryName || 'Região'}
            </span>
            <span className="font-semibold text-[15.5px] leading-[1.38] text-[#16181d] group-hover:text-[#0b2545] transition-colors">
              {art.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import { Author } from '@/lib/types';

interface OpinionSectionProps {
  columnists: Author[];
}

export default function OpinionSection({ columnists }: OpinionSectionProps) {
  if (!columnists || columnists.length === 0) return null;

  return (
    <section className="py-7 border-b border-[#e3e5e9]">
      <div className="flex justify-between items-baseline border-b-2 border-[#04391d] pb-2 mb-6">
        <h2 className="m-0 font-serif-journal text-2xl sm:text-[26px] font-bold text-[#04391d]">
          Opinião e Colunistas
        </h2>
        <Link
          href="/editoria/opiniao"
          className="text-[12.5px] text-[#5b616e] hover:text-[#008744] transition-colors"
        >
          Ver todas as colunas →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columnists.slice(0, 4).map((col) => (
          <Link
            key={col.id}
            href="/editoria/opiniao"
            className="flex flex-col gap-3 p-4 rounded-[3px] border border-[#e3e5e9] bg-[#f4f5f7] hover:border-[#008744] transition-colors group"
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={col.avatar}
                alt={col.name}
                className="w-11 h-11 rounded-full object-cover border border-[#c9ccd3]"
              />
              <div className="flex flex-col">
                <span className="font-bold text-[14px] text-[#04391d] group-hover:text-[#008744] transition-colors">
                  {col.name}
                </span>
                <span className="text-[11.5px] text-[#5b616e]">
                  {col.columnName || col.role || 'Análise Política'}
                </span>
              </div>
            </div>
            <p className="font-serif-journal text-[15px] font-semibold text-[#16181d] leading-snug line-clamp-2 m-0">
              {col.bio || 'Perspectivas sobre o cenário institucional brasileiro e os rumos da política.'}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

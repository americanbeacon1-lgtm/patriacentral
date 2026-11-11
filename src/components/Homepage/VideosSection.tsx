import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface VideosSectionProps {
  articles: Article[];
}

export default function VideosSection({ articles }: VideosSectionProps) {
  const videos = [
    {
      id: 'v1',
      kind: 'Entrevista Exclusiva',
      dur: '24 min',
      title: 'Contas públicas e reforma orçamentária: os rumos da economia para os próximos anos',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'v2',
      kind: 'Explicador Político',
      dur: '6 min',
      title: 'Como funciona a tramitação e o rito das emendas parlamentares no Congresso Nacional',
      imageUrl: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'v3',
      kind: 'Grande Reportagem',
      dur: '14 min',
      title: 'A corrida pelo hidrogênio verde e a transição da matriz energética no Nordeste',
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'v4',
      kind: 'Bastidores de Brasília',
      dur: '8 min',
      title: 'Planalto e lideranças partidárias definem pauta prioritária para votações econômicas',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="mt-8 [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)] bg-[#0b2545] text-white">
      <div className="max-w-[1280px] mx-auto px-5 py-8 flex flex-col gap-4">
        <h2 className="m-0 font-serif-journal text-2xl sm:text-[26px] font-bold text-white">
          Vídeos e entrevistas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.map((v) => (
            <Link
              key={v.id}
              href="/editoria/videos"
              className="flex flex-col gap-2 text-white group"
            >
              <div className="aspect-16/9 relative overflow-hidden rounded-[2px] bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.imageUrl}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <span className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-[#9fb3cf] mt-1">
                {v.kind} · {v.dur}
              </span>
              <span className="font-semibold text-[16px] leading-[1.35] text-white group-hover:text-[#dfe6f0] transition-colors line-clamp-2">
                {v.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

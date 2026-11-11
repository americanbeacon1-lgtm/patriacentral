import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, ExternalLink, Eye, Clock, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminArticlesPage() {
  const articles = db.getArticles();
  const categories = db.getCategories();
  const authors = db.getAuthors();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-red-700 block mb-1">
            Redação & Gestão Editorial
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900">
            Acervo de Notícias ({articles.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Controle editorial, publicação, agendamento e destaques da capa
          </p>
        </div>

        <Link
          href="/admin/noticias/nova"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Escrever Nova Matéria</span>
        </Link>
      </div>

      {/* Tabela de Matérias */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Título & Chapéu</th>
                <th className="p-3.5">Editoria</th>
                <th className="p-3.5">Autor</th>
                <th className="p-3.5">Posição / Selo</th>
                <th className="p-3.5">Acessos</th>
                <th className="p-3.5">Publicação</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {articles.map((art) => {
                const author = authors.find((a) => a.id === art.authorId);
                const category = categories.find((c) => c.id === art.categoryId);
                const pubDate = new Date(art.publishedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 max-w-md">
                      <span className="text-[10px] font-black uppercase text-red-700 block mb-0.5">
                        {art.chapeu || 'GERAL'}
                      </span>
                      <Link
                        href={`/noticia/${art.slug}`}
                        target="_blank"
                        className="font-bold text-slate-900 hover:text-blue-900 line-clamp-2 leading-snug"
                      >
                        {art.title}
                      </Link>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                        {category?.name || art.categoryId}
                      </span>
                      {art.state && (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                          {art.state}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                      {author?.name || 'Redação'}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {art.isLeadStory && (
                        <span className="px-2 py-0.5 bg-red-700 text-white rounded text-[10px] font-bold uppercase tracking-wider block w-fit mb-1">
                          Manchete Capa
                        </span>
                      )}
                      {art.isSecondary && (
                        <span className="px-2 py-0.5 bg-blue-900 text-white rounded text-[10px] font-bold uppercase tracking-wider block w-fit mb-1">
                          Secundária
                        </span>
                      )}
                      {art.isSpecial && (
                        <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold uppercase tracking-wider block w-fit">
                          Especial
                        </span>
                      )}
                      {!art.isLeadStory && !art.isSecondary && !art.isSpecial && (
                        <span className="text-slate-400 text-[11px]">Padrão</span>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900">
                      {art.viewsCount ? art.viewsCount.toLocaleString('pt-BR') : 0}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {pubDate}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/noticias/${art.id}`}
                          className="p-1.5 text-blue-900 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/noticia/${art.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded"
                          title="Visualizar no Portal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

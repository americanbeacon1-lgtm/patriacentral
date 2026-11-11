'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsImage from '@/components/NewsImage';
import { ExtractedNewsItem, KNOWN_SOURCES } from '@/lib/crawler-types';
import { Category } from '@/lib/types';
import {
  Download,
  Calendar,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  RefreshCw,
  Check,
  Clock,
  Newspaper,
} from 'lucide-react';

export default function AdminCrawlerPage() {
  const [daysAgo, setDaysAgo] = useState<number>(3);
  const [selectedSources, setSelectedSources] = useState<string[]>(KNOWN_SOURCES.map((s) => s.id));
  const [categories, setCategories] = useState<Category[]>([]);
  const [newsItems, setNewsItems] = useState<ExtractedNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [postingId, setPostingId] = useState<string | null>(null);
  const [postingBatch, setPostingBatch] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carrega categorias do Eixo Nacional
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(() => {
        // busca categorias
        fetch('/api/articles')
          .then(() => {
            // inicializa categorias padrão se necessário
          });
      })
      .catch(console.error);
  }, []);

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSelectAllSources = () => {
    if (selectedSources.length === KNOWN_SOURCES.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(KNOWN_SOURCES.map((s) => s.id));
    }
  };

  const handleFetchNews = async () => {
    if (selectedSources.length === 0) {
      setMessage({ type: 'error', text: 'Selecione ao menos um portal para extrair notícias.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/admin/crawler?days=${daysAgo}&sources=${selectedSources.join(',')}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao extrair notícias.');
      }

      setNewsItems(data.items || []);
      setMessage({
        type: 'success',
        text: `Extração concluída com sucesso! ${data.count} notícias encontradas no período de ${daysAgo} dia(s).`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao conectar aos portais.' });
    } finally {
      setLoading(false);
    }
  };

  // Postar notícia individual
  const handlePublishSingle = async (
    item: ExtractedNewsItem,
    customOptions?: { category?: string; isBreaking?: boolean; isLeadStory?: boolean }
  ) => {
    setPostingId(item.id);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_single',
          item,
          options: {
            customCategory: customOptions?.category || item.suggestedCategory,
            isBreaking: customOptions?.isBreaking,
            isLeadStory: customOptions?.isLeadStory,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao publicar notícia.');

      // Marca o item como importado na lista local
      setNewsItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, alreadyImported: true } : i))
      );

      setMessage({
        type: 'success',
        text: `Notícia "${item.title.substring(0, 50)}..." postada com sucesso no Portal Eixo Nacional!`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao publicar matéria.' });
    } finally {
      setPostingId(null);
    }
  };

  // Postar em lote todas as não importadas
  const handlePublishBatch = async () => {
    const unimported = newsItems.filter((i) => !i.alreadyImported);
    if (unimported.length === 0) {
      setMessage({ type: 'error', text: 'Não há notícias pendentes para importar.' });
      return;
    }

    if (!confirm(`Deseja importar e publicar todas as ${unimported.length} notícias no Eixo Nacional?`)) {
      return;
    }

    setPostingBatch(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_batch',
          items: unimported,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na publicação em lote.');

      // Atualiza todos para importados
      setNewsItems((prev) => prev.map((i) => ({ ...i, alreadyImported: true })));

      setMessage({
        type: 'success',
        text: `Sucesso! ${data.count} notícias foram postadas simultaneamente no Eixo Nacional!`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao importar lote.' });
    } finally {
      setPostingBatch(false);
    }
  };

  const unimportedCount = newsItems.filter((i) => !i.alreadyImported).length;
  const importedCount = newsItems.filter((i) => i.alreadyImported).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-red-700 block mb-1">
            Automação & Agregação Editorial
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900">
            Extrator de Notícias dos Maiores Portais do Brasil
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture, filtre e publique reportagens de G1, Agência Brasil, Poder360, Metrópoles, CNN e Congresso (1 a 10 dias)
          </p>
        </div>

        {newsItems.length > 0 && unimportedCount > 0 && (
          <button
            onClick={handlePublishBatch}
            disabled={postingBatch}
            className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>
              {postingBatch ? 'Importando Lote...' : `Postar Todas as ${unimportedCount} Novas no Portal`}
            </span>
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* PAINEL DE CONTROLE DE EXTRAÇÃO */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        {/* 1. SELETOR DE PERÍODO (1 A 10 DIAS) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-900" />
              <span>Janela Temporal de Extração (1 a 10 dias atrás)</span>
            </label>
            <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-950 rounded-full font-mono">
              {daysAgo === 1 ? 'Últimas 24 horas (1 dia)' : `Últimos ${daysAgo} dias`}
            </span>
          </div>

          {/* Botões Rápidos de Dias */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDaysAgo(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  daysAgo === d
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {d === 1 ? 'Hoje (1 dia)' : `${d} dias`}
              </button>
            ))}
          </div>

          {/* Slider de Precisão */}
          <input
            type="range"
            min={1}
            max={10}
            value={daysAgo}
            onChange={(e) => setDaysAgo(Number(e.target.value))}
            className="w-full accent-blue-950 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>1 dia (tempo real)</span>
            <span>5 dias</span>
            <span>10 dias (histórico estendido)</span>
          </div>
        </div>

        {/* 2. SELEÇÃO DE PORTAIS BRASILEIROS */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>Portais & Agências Nacionais a Consultar</span>
            </label>

            <button
              type="button"
              onClick={handleSelectAllSources}
              className="text-xs font-semibold text-blue-900 hover:underline"
            >
              {selectedSources.length === KNOWN_SOURCES.length ? 'Desmarcar Todos' : 'Marcar Todos'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {KNOWN_SOURCES.map((source) => {
              const isChecked = selectedSources.includes(source.id);
              return (
                <label
                  key={source.id}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    isChecked
                      ? 'border-blue-900 bg-blue-50/50 text-blue-950'
                      : 'border-slate-200 bg-slate-50/40 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSourceToggle(source.id)}
                    className="rounded text-blue-950 focus:ring-blue-900"
                  />
                  <span>{source.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. BOTÃO DE BUSCA */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            A ferramenta busca feeds oficiais, extrai imagens, categoriza e prepara o texto com os devidos créditos de autoria.
          </p>

          <button
            onClick={handleFetchNews}
            disabled={loading}
            className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Consultando Portais...' : 'Rastrear Notícias Agora'}</span>
          </button>
        </div>
      </div>

      {/* RESULTADOS DA EXTRAÇÃO */}
      {newsItems.length > 0 && (
        <div className="space-y-4">
          {/* Barra de Resumo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-xl text-xs">
            <div className="flex items-center gap-4">
              <span>
                Total Encontradas: <strong>{newsItems.length}</strong>
              </span>
              <span>•</span>
              <span className="text-amber-400">
                Novas Prontas para Postar: <strong>{unimportedCount}</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-400">
                Já Publicadas no Portal: <strong>{importedCount}</strong>
              </span>
            </div>

            {unimportedCount > 0 && (
              <button
                onClick={handlePublishBatch}
                disabled={postingBatch}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold uppercase text-[11px] transition-colors"
              >
                Postar Todas as {unimportedCount} Novas Matérias
              </button>
            )}
          </div>

          {/* Grid de Notícias Extraídas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsItems.map((item) => {
              const isPosting = postingId === item.id;
              const sourceInfo = KNOWN_SOURCES.find((s) => s.id === item.sourceId);

              const formattedDate = new Date(item.pubDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-xl p-5 flex flex-col justify-between shadow-xs transition-shadow ${
                    item.alreadyImported
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Topo do Card: Origem & Data */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          sourceInfo?.badgeColor || 'bg-slate-800 text-white'
                        }`}
                      >
                        {item.sourceName}
                      </span>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    {/* Imagem + Título */}
                    <div className="flex gap-4 mb-3">
                      <div className="w-24 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <NewsImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          category={item.suggestedCategory}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900 font-headline leading-snug line-clamp-3">
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-bold uppercase text-blue-900 bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">
                          Editoria: {item.suggestedCategory}
                        </span>
                      </div>
                    </div>

                    {/* Resumo */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  </div>

                  {/* Ações do Card */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-500 hover:text-blue-900 flex items-center gap-1 font-semibold"
                    >
                      <span>Ver original</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div>
                      {item.alreadyImported ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold uppercase">
                          <Check className="w-3.5 h-3.5" />
                          <span>Já Publicada</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePublishSingle(item)}
                          disabled={isPosting}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-950 hover:bg-blue-900 text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isPosting ? 'Postando...' : 'Postar no Eixo'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Caso vazio após busca */}
      {!loading && newsItems.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center space-y-3">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Nenhuma notícia extraída no momento
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Selecione os portais desejados acima, configure o período de 1 a 10 dias e clique em &ldquo;Rastrear Notícias Agora&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}

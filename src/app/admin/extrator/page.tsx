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
  Eye,
  BookOpen,
  X,
  Search,
} from 'lucide-react';

export default function AdminCrawlerPage() {
  const [daysAgo, setDaysAgo] = useState<number>(3);
  const [selectedSources, setSelectedSources] = useState<string[]>(KNOWN_SOURCES.map((s) => s.id));
  const [categories, setCategories] = useState<Category[]>([]);
  const [newsItems, setNewsItems] = useState<ExtractedNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [postingId, setPostingId] = useState<string | null>(null);
  const [postingBatch, setPostingBatch] = useState(false);
  const [previewModalItem, setPreviewModalItem] = useState<ExtractedNewsItem | null>(null);
  const [filterText, setFilterText] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    actionUrl?: string;
  } | null>(null);

  // Carrega categorias do Eixo Nacional
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(() => {
        fetch('/api/articles').catch(() => {});
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
    customOptions?: { category?: string; isBreaking?: boolean; isLeadStory?: boolean },
    autoOpen: boolean = false
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

      const publishedSlug = data.article?.slug || item.slug || 'noticia';

      // Persiste no storage do navegador para reidratação instantânea sem 404
      if (data.article) {
        try {
          localStorage.setItem('eixo_article_' + publishedSlug, JSON.stringify(data.article));
          const listRaw = localStorage.getItem('eixo_custom_articles');
          const list = listRaw ? JSON.parse(listRaw) : [];
          list.unshift(data.article);
          localStorage.setItem('eixo_custom_articles', JSON.stringify(list.slice(0, 100)));
        } catch {}
      }

      // Marca o item como importado na lista local e armazena o publishedSlug
      setNewsItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, alreadyImported: true, publishedSlug } : i
        )
      );

      // Se o modal estiver aberto para esse item, atualiza também
      if (previewModalItem && previewModalItem.id === item.id) {
        setPreviewModalItem({ ...previewModalItem, alreadyImported: true, publishedSlug });
      }

      const postUrl = `/noticia/${publishedSlug}`;

      setMessage({
        type: 'success',
        text: `Notícia "${item.title.substring(0, 50)}..." postada com sucesso no Portal Eixo Nacional!`,
        actionUrl: postUrl,
      });

      if (autoOpen) {
        window.open(postUrl, '_blank');
      }
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
      const slugMap: Record<string, string> = {};
      if (Array.isArray(data.articles)) {
        try {
          const listRaw = localStorage.getItem('eixo_custom_articles');
          const list = listRaw ? JSON.parse(listRaw) : [];
          data.articles.forEach((a: any) => {
            if (a.title && a.slug) {
              slugMap[a.title.toLowerCase().trim()] = a.slug;
              localStorage.setItem('eixo_article_' + a.slug, JSON.stringify(a));
              list.unshift(a);
            }
          });
          localStorage.setItem('eixo_custom_articles', JSON.stringify(list.slice(0, 100)));
        } catch {}
      }

      setNewsItems((prev) =>
        prev.map((i) => ({
          ...i,
          alreadyImported: true,
          publishedSlug: slugMap[i.title.toLowerCase().trim()] || i.slug,
        }))
      );

      setMessage({
        type: 'success',
        text: `Sucesso! ${data.count} notícias foram postadas simultaneamente no Eixo Nacional!`,
        actionUrl: `/editoria/ultimas`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao importar lote.' });
    } finally {
      setPostingBatch(false);
    }
  };

  // Filtra itens por texto de busca rápida
  const filteredItems = newsItems.filter((item) => {
    if (!filterText.trim()) return true;
    const term = filterText.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.summary.toLowerCase().includes(term) ||
      item.sourceName.toLowerCase().includes(term) ||
      item.suggestedCategory.toLowerCase().includes(term)
    );
  });

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
            Capture, filtre, pré-visualize e publique reportagens na íntegra de G1, Agência Brasil, Poder360, Metrópoles, CNN e Congresso
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

      {/* Banner de Notificação com Botão Direto para Abrir Matéria */}
      {message && (
        <div
          className={`p-4 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="font-medium text-[13px]">{message.text}</span>
          </div>

          {message.actionUrl && (
            <a
              href={message.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <span>Ver no Portal Eixo Nacional</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
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

          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={daysAgo}
            onChange={(e) => setDaysAgo(parseInt(e.target.value, 10))}
            className="w-full accent-blue-900 cursor-pointer"
          />
        </div>

        {/* 2. SELETOR DE PORTAIS DE ORIGEM */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-900" />
              <span>Portais & Agências de Notícias Disponíveis</span>
            </label>
            <button
              type="button"
              onClick={handleSelectAllSources}
              className="text-xs font-bold text-blue-900 hover:underline"
            >
              {selectedSources.length === KNOWN_SOURCES.length
                ? 'Desmarcar Todos'
                : 'Selecionar Todos'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {KNOWN_SOURCES.map((source) => {
              const isSelected = selectedSources.includes(source.id);
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => handleSourceToggle(source.id)}
                  className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/50 text-blue-950 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold truncate pr-1">{source.name}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-900 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. BOTÃO DE EXECUÇÃO */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            A extração captura matérias completas, fotos HD originais e data real de publicação na fonte.
          </p>

          <button
            type="button"
            onClick={handleFetchNews}
            disabled={loading}
            className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Extraindo Notícias...' : 'Rastrear Notícias Agora'}</span>
          </button>
        </div>
      </div>

      {/* RESULTADO DA EXTRAÇÃO */}
      {newsItems.length > 0 && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white px-5 py-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                Total de Notícias Extraídas: <strong>{newsItems.length}</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-400">
                Já Publicadas no Portal: <strong>{importedCount}</strong>
              </span>
            </div>

            {/* Campo de filtro rápido de matérias */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filtrar por palavra..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 outline-none w-44"
                />
              </div>

              {unimportedCount > 0 && (
                <button
                  onClick={handlePublishBatch}
                  disabled={postingBatch}
                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-bold uppercase text-[11px] transition-colors shrink-0"
                >
                  Postar Todas as {unimportedCount} Novas
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 px-1">
            💡 <strong>Dica:</strong> Clique em qualquer notícia para abrir e ler a matéria completa. Se ela já foi postada, abrirá diretamente no portal.
          </p>

          {/* Grid de Notícias Extraídas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isPosting = postingId === item.id;
              const sourceInfo = KNOWN_SOURCES.find((s) => s.id === item.sourceId);

              const formattedDate = new Date(item.pubDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const targetPortalUrl = `/noticia/${item.publishedSlug || item.slug}`;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.alreadyImported) {
                      window.open(targetPortalUrl, '_blank');
                    } else {
                      setPreviewModalItem(item);
                    }
                  }}
                  className={`bg-white border rounded-xl p-5 flex flex-col justify-between shadow-xs transition-all cursor-pointer ${
                    item.alreadyImported
                      ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400 hover:shadow-md'
                      : 'border-slate-200 hover:border-blue-900 hover:shadow-md'
                  }`}
                  title={item.alreadyImported ? 'Clique para abrir no Portal Eixo Nacional' : 'Clique para ler prévia e publicar'}
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
                        <h3 className="text-sm font-bold text-slate-900 font-headline leading-snug line-clamp-3 hover:text-blue-900 transition-colors">
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
                  <div
                    className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-500 hover:text-blue-900 flex items-center gap-1 font-semibold"
                    >
                      <span>Fonte original</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-2">
                      {item.alreadyImported ? (
                        <a
                          href={targetPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Abrir no Portal</span>
                        </a>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setPreviewModalItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Ler</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePublishSingle(item, undefined, true)}
                            disabled={isPosting}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-950 hover:bg-blue-900 text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isPosting ? 'Postando...' : 'Postar no Eixo'}</span>
                          </button>
                        </>
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

      {/* MODAL DE PRÉ-VISUALIZAÇÃO E LEITURA COMPLETA */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Topo do Modal */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-950 bg-blue-100 px-2 py-0.5 rounded">
                  {previewModalItem.sourceName}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(previewModalItem.pubDate).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(previewModalItem.pubDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-red-700 block">
                Editoria: {previewModalItem.suggestedCategory}
              </span>

              <h2 className="font-serif-journal font-bold text-2xl text-slate-900 leading-tight">
                {previewModalItem.title}
              </h2>

              <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-3 border-[#c8102e] pl-3 py-0.5 bg-slate-50">
                {previewModalItem.summary}
              </p>

              {previewModalItem.imageUrl && (
                <div className="aspect-16/9 rounded-lg overflow-hidden bg-slate-100">
                  <NewsImage
                    src={previewModalItem.imageUrl}
                    alt={previewModalItem.title}
                    className="w-full h-full object-cover"
                    category={previewModalItem.suggestedCategory}
                  />
                </div>
              )}

              <div className="prose text-sm text-slate-800 leading-relaxed space-y-3 pt-2">
                <p>{previewModalItem.contentSnippet || previewModalItem.summary}</p>
              </div>

              <div className="p-3 bg-slate-100 rounded text-xs text-slate-600 flex items-center justify-between">
                <span>Fonte: <strong>{previewModalItem.sourceName}</strong></span>
                <a
                  href={previewModalItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 font-semibold underline flex items-center gap-1"
                >
                  <span>Ver página original</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Rodapé do Modal com Ações */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Fechar
              </button>

              <div className="flex items-center gap-2">
                {previewModalItem.alreadyImported ? (
                  <a
                    href={`/noticia/${previewModalItem.publishedSlug || previewModalItem.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Abrir Notícia no Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={postingId === previewModalItem.id}
                      onClick={() => handlePublishSingle(previewModalItem, undefined, false)}
                      className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>{postingId === previewModalItem.id ? 'Publicando...' : 'Publicar no Eixo'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={postingId === previewModalItem.id}
                      onClick={() => handlePublishSingle(previewModalItem, undefined, true)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Publicar e Abrir no Site ↗</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

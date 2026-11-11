'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article, Author, Category } from '@/lib/types';
import { BRAZILIAN_STATES } from '@/lib/constants';
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Share2,
  Wand2,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

interface ArticleEditorProps {
  initialArticle?: Partial<Article>;
  categories: Category[];
  authors: Author[];
  isEditing?: boolean;
}

export default function ArticleEditor({
  initialArticle,
  categories,
  authors,
  isEditing = false,
}: ArticleEditorProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    id: initialArticle?.id || '',
    title: initialArticle?.title || '',
    chapeu: initialArticle?.chapeu || 'PODER & POLÍTICA',
    subtitle: initialArticle?.subtitle || '',
    content: initialArticle?.content || '<p class="lead">Escreva aqui a apuração jornalística...</p>\n<p>Contexto e fontes ouvidas pela reportagem...</p>',
    imageUrl: initialArticle?.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80',
    imageCaption: initialArticle?.imageCaption || 'Imagem representativa dos fatos apurados em Brasília.',
    imageCredit: initialArticle?.imageCredit || 'Agência Brasil / Divulgação',
    categoryId: initialArticle?.categoryId || 'politica',
    state: initialArticle?.state || 'DF',
    authorId: initialArticle?.authorId || authors[0]?.id || 'roberto-valente',
    tags: Array.isArray(initialArticle?.tags) ? initialArticle?.tags.join(', ') : 'Governo, Economia, Brasília',
    status: initialArticle?.status || 'published',
    isLeadStory: Boolean(initialArticle?.isLeadStory),
    isSecondary: Boolean(initialArticle?.isSecondary),
    isBreaking: Boolean(initialArticle?.isBreaking),
    isSpecial: Boolean(initialArticle?.isSpecial),
    isVideo: Boolean(initialArticle?.isVideo),
    videoUrl: initialArticle?.videoUrl || '',
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiSocialSummary, setAiSocialSummary] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Chamada de IA Editorial
  const triggerAi = async (action: 'suggest_titles' | 'generate_summary' | 'proofread' | 'suggest_tags') => {
    setAiLoading(true);
    setAiFeedback(null);
    setAiSocialSummary(null);
    setAiSuggestions([]);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          title: form.title,
          content: form.content,
          category: form.categoryId,
        }),
      });

      const data = await res.json();

      if (action === 'suggest_titles' && data.titles) {
        setAiSuggestions(data.titles);
      } else if (action === 'generate_summary' && data.socialSummary) {
        setAiSocialSummary(data.socialSummary);
        if (data.metaDescription && !form.subtitle) {
          setForm((prev) => ({ ...prev, subtitle: data.metaDescription }));
        }
      } else if (action === 'proofread' && data.feedback) {
        setAiFeedback(data.feedback);
      } else if (action === 'suggest_tags' && data.tags) {
        setForm((prev) => ({ ...prev, tags: data.tags.join(', ') }));
        setMessage({ type: 'success', text: 'Tags sugeridas pela IA aplicadas ao formulário!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao conectar ao assistente de inteligência artificial.' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error('Falha ao salvar artigo.');

      setMessage({ type: 'success', text: 'Notícia salva e publicada com sucesso!' });
      setTimeout(() => {
        router.push('/admin/noticias');
      }, 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao salvar.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/noticias"
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900">
              {isEditing ? 'Editar Reportagem' : 'Redigir Nova Notícia'}
            </h1>
            <p className="text-xs text-slate-500">
              Fluxo editorial com validação de fontes e assistência com Inteligência Artificial
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publicando...' : 'Salvar & Publicar'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* BLOCO DE ASSISTÊNCIA DE IA EDITORIAL */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-5 rounded-xl shadow-md border border-blue-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-headline">
              Assistente IA para Redação Jornalística
            </h3>
          </div>
          <span className="text-[10px] text-slate-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50">
            Apoio editorial • Revisão humana obrigatória
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={aiLoading}
            onClick={() => triggerAi('suggest_titles')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Sugerir Títulos SEO</span>
          </button>
          <button
            type="button"
            disabled={aiLoading}
            onClick={() => triggerAi('generate_summary')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Resumo p/ Redes & WhatsApp</span>
          </button>
          <button
            type="button"
            disabled={aiLoading}
            onClick={() => triggerAi('suggest_tags')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Sugerir Tags & Editorias</span>
          </button>
          <button
            type="button"
            disabled={aiLoading}
            onClick={() => triggerAi('proofread')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Checagem & Manual de Redação</span>
          </button>
        </div>

        {/* Retornos da IA */}
        {aiLoading && (
          <p className="text-xs text-amber-300 animate-pulse mt-3">
            O assistente editorial de IA está processando o texto com padrões jornalísticos...
          </p>
        )}

        {aiSuggestions.length > 0 && (
          <div className="mt-4 p-3 bg-black/40 rounded-lg border border-slate-700 space-y-1.5 text-xs">
            <p className="font-bold text-amber-400">Sugestões de Títulos de Impacto (clique para aplicar):</p>
            {aiSuggestions.map((st, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setForm({ ...form, title: st })}
                className="block text-left w-full p-1.5 hover:bg-blue-900/60 rounded text-slate-200 transition-colors"
              >
                • {st}
              </button>
            ))}
          </div>
        )}

        {aiSocialSummary && (
          <div className="mt-4 p-3 bg-black/40 rounded-lg border border-slate-700 text-xs space-y-2">
            <p className="font-bold text-emerald-400">Texto formatado para WhatsApp e Canais:</p>
            <pre className="whitespace-pre-wrap font-sans bg-slate-900/90 p-2 rounded text-slate-200 text-[11px]">
              {aiSocialSummary}
            </pre>
          </div>
        )}

        {aiFeedback && (
          <div className="mt-4 p-3 bg-black/40 rounded-lg border border-slate-700 text-xs">
            <p className="font-bold text-teal-300">Parecer de Estilo & Conformidade:</p>
            <p className="text-slate-200 mt-1">{aiFeedback}</p>
          </div>
        )}
      </div>

      {/* FORMULÁRIO DE EDIÇÃO */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Principal do Editor (8 colunas) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Chapéu (Kicker) *
              </label>
              <input
                type="text"
                required
                value={form.chapeu}
                onChange={(e) => setForm({ ...form, chapeu: e.target.value.toUpperCase() })}
                placeholder="Ex: PODER, ECONOMIA, STF"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs font-bold text-red-700 uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Editoria Principal *
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs bg-white font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Título Principal da Notícia (H1) *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Título informativo, claro e de impacto jornalístico"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-md text-base sm:text-lg font-bold font-headline text-slate-900 focus:border-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Subtítulo / Linha Fina (H2)
            </label>
            <textarea
              rows={2}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Resumo complementar explicando as principais informações e desdobramentos"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-700 focus:border-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Corpo da Notícia (HTML / Parágrafos Estruturados) *
            </label>
            <textarea
              rows={14}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full p-3.5 border border-slate-300 rounded-md text-sm font-mono leading-relaxed focus:border-blue-900 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Dica: Utilize tags &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt; para formatação elegante.
            </p>
          </div>

          {/* Imagem Destacada */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-900" />
              Imagem Principal & Créditos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  URL da Fotografia
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Legenda da Imagem
                </label>
                <input
                  type="text"
                  value={form.imageCaption}
                  onChange={(e) => setForm({ ...form, imageCaption: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Crédito da Foto (Fonte Oficial / Fotógrafo)
                </label>
                <input
                  type="text"
                  value={form.imageCredit}
                  onChange={(e) => setForm({ ...form, imageCredit: e.target.value })}
                  placeholder="Ex: Agência Brasil, Lula Marques, Divulgação"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral de Configurações (4 colunas) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              Destaques na Capa & Classificação
            </h3>

            {/* Checkboxes de Posição */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isLeadStory}
                  onChange={(e) => setForm({ ...form, isLeadStory: e.target.checked })}
                  className="rounded text-red-700"
                />
                <span className="text-red-700 font-bold">★ Manchete Principal da Capa</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isSecondary}
                  onChange={(e) => setForm({ ...form, isSecondary: e.target.checked })}
                  className="rounded text-blue-900"
                />
                <span>Manchete Secundária em Destaque</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBreaking}
                  onChange={(e) => setForm({ ...form, isBreaking: e.target.checked })}
                  className="rounded text-amber-700"
                />
                <span>Urgente / Plantão em Tempo Real</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isSpecial}
                  onChange={(e) => setForm({ ...form, isSpecial: e.target.checked })}
                  className="rounded text-purple-700"
                />
                <span>Grande Reportagem / Investigação Especial</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isVideo}
                  onChange={(e) => setForm({ ...form, isVideo: e.target.checked })}
                  className="rounded text-blue-700"
                />
                <span>Contém Vídeo / Entrevista Gravada</span>
              </label>
            </div>

            {/* Estado Federativo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estado / Região (Cobertura Local)
              </label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
              >
                <option value="">Nacional (Sem estado específico)</option>
                {BRAZILIAN_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.name} ({s.uf})
                  </option>
                ))}
              </select>
            </div>

            {/* Autor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jornalista / Repórter *
              </label>
              <select
                value={form.authorId}
                onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Ex: Congresso, Economia, STF"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status da Publicação
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white font-bold"
              >
                <option value="published">Publicado Imediatamente</option>
                <option value="draft">Rascunho</option>
                <option value="review">Em Revisão Editorial</option>
                <option value="scheduled">Agendado</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

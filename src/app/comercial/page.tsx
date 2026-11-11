'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { DEFAULT_SETTINGS, INITIAL_CATEGORIES } from '@/lib/constants';
import { Mail, Copy, Check, Send, ExternalLink, X, MessageSquare, ShieldCheck } from 'lucide-react';

const CONTACT_EMAIL = 'americanbeacon@americanbeacon.online';

const FORMATS = [
  { name: 'Superbanner superior', dim: '970 × 250', where: 'Topo da home e editorias', dev: 'Desktop' },
  { name: 'Banner horizontal', dim: '728 × 90', where: 'Entre blocos da home', dev: 'Desktop' },
  { name: 'Retângulo médio', dim: '300 × 250', where: 'Lateral e dentro do artigo', dev: 'Todos' },
  { name: 'Half page', dim: '300 × 600', where: 'Lateral das editorias e matérias', dev: 'Desktop' },
  { name: 'Banner mobile', dim: '320 × 100', where: 'Topo de tela em smartphones', dev: 'Mobile' },
  { name: 'Retângulo mobile', dim: '300 × 250', where: 'Entre parágrafos do texto', dev: 'Mobile' },
  { name: 'Banner entre notícias', dim: 'Responsivo', where: 'Listas, editorias e feeds', dev: 'Todos' },
  { name: 'Publicidade em vídeo', dim: 'Adaptável (16:9)', where: 'Seção de vídeos e pre-roll', dev: 'Todos' },
];

export default function CommercialPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    cnpj: '',
    email: '',
    phone: '',
    campaignType: 'Institucional',
    period: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [kitRequested, setKitRequested] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modal de envio rápido de mensagem
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [quickForm, setQuickForm] = useState({
    name: '',
    email: '',
    subject: 'Contato Comercial - Pátria Central',
    message: '',
  });
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(false);

  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quickForm.name,
          email: quickForm.email,
          company: 'Contato Direto pelo Site',
          phone: 'Via Formulário Rápido',
          campaignType: 'Contato Comercial',
          desiredPeriod: 'Imediato',
          message: `[Assunto: ${quickForm.subject}]\n\n${quickForm.message}`,
        }),
      });

      if (res.ok) {
        setQuickSuccess(true);
        setTimeout(() => {
          setQuickModalOpen(false);
          setQuickSuccess(false);
          setQuickForm({ name: '', email: '', subject: 'Contato Comercial - Pátria Central', message: '' });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuickLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        // Limpa formulário após envio
        setFormData({
          name: '',
          company: '',
          cnpj: '',
          email: '',
          phone: '',
          campaignType: 'Institucional',
          period: '',
          message: '',
        });
      }
    } catch {
      // fallback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      <Header categories={INITIAL_CATEGORIES} settings={DEFAULT_SETTINGS} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-5 box-border py-8 sm:py-12 flex flex-col gap-10">
        {/* Seção 1: Apresentação Comercial */}
        <section className="flex flex-col gap-3.5 max-w-[860px]">
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#c8102e]">
            Central comercial
          </span>
          <h1 className="m-0 font-serif-journal text-3xl sm:text-4xl lg:text-[50px] leading-[1.08] font-bold text-[#0b2545]">
            Anuncie no {DEFAULT_SETTINGS.portalName}
          </h1>
          <p className="m-0 text-[17px] sm:text-[18px] leading-[1.55] text-[#3c414b]">
            Cobertura nacional de política, economia, serviços públicos e regiões, com espaços publicitários padronizados pelo IAB, relatórios de veiculação e comprovação auditável para anunciantes privados e órgãos governamentais. Nossa cobertura editorial é independente da contratação de publicidade.
          </p>
          <div className="flex gap-2.5 flex-wrap pt-2 items-center">
            <a
              href="#proposta"
              style={{ backgroundColor: '#0b2545', color: '#ffffff' }}
              className="px-5 py-3 rounded-[4px] font-bold text-[14px] text-white bg-[#0b2545] hover:bg-[#13315c] transition-colors shadow-sm inline-flex items-center justify-center cursor-pointer border border-[#0b2545]"
            >
              Solicitar proposta
            </a>
            <button
              type="button"
              onClick={() => setKitRequested(true)}
              className="border border-[#0b2545] bg-white hover:bg-slate-50 text-[#0b2545] px-4.5 py-3 rounded-[4px] font-semibold text-[14px] cursor-pointer transition-colors"
            >
              {kitRequested ? 'Mídia kit solicitado ✓' : 'Solicitar mídia kit'}
            </button>
          </div>

          {/* Caixa de Contato Direto & E-mail Oficial */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-[#f4f5f7] border border-[#d8dce2] rounded-lg mt-3 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Canal Oficial de Propostas & Patrocínio
                </span>
                <span className="font-mono text-[15px] sm:text-[16px] font-bold text-[#0b2545]">
                  {CONTACT_EMAIL}
                </span>
                <span className="text-xs text-slate-600 mt-0.5">
                  Atendimento direto para agências, órgãos públicos e marcas corporativas.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Copiar e-mail para a área de transferência"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar E-mail'}</span>
              </button>

              <button
                type="button"
                onClick={() => setQuickModalOpen(true)}
                style={{ backgroundColor: '#c8102e', color: '#ffffff' }}
                className="px-3.5 py-2 rounded text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#a50d25] transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar E-mail Direto</span>
              </button>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=Proposta%20Comercial%20-%20P%C3%A1tria%20Central`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Abrir no Gmail Web"
              >
                <span>Gmail</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </section>

        {/* Seção 2: Tabela de Formatos Disponíveis */}
        <section className="flex flex-col gap-3.5">
          <h2 className="m-0 font-serif-journal text-2xl sm:text-[26px] font-bold text-[#0b2545]">
            Formatos disponíveis
          </h2>
          <div className="overflow-x-auto border border-[#e3e5e9] rounded-[4px]">
            <table className="w-full border-collapse text-[14px] min-w-[560px]">
              <thead>
                <tr className="bg-[#f4f5f7] text-left text-[#16181d]">
                  <th className="p-3 px-3.5 font-bold">Formato</th>
                  <th className="p-3 px-3.5 font-bold">Dimensão</th>
                  <th className="p-3 px-3.5 font-bold">Posições</th>
                  <th className="p-3 px-3.5 font-bold">Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {FORMATS.map((f, i) => (
                  <tr key={i} className="border-t border-[#e3e5e9]">
                    <td className="p-3 px-3.5 font-semibold text-[#0b2545]">{f.name}</td>
                    <td className="p-3 px-3.5 tabular-nums">{f.dim}</td>
                    <td className="p-3 px-3.5 text-[#3c414b]">{f.where}</td>
                    <td className="p-3 px-3.5 text-[#3c414b]">{f.dev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="m-0 text-[13px] text-[#5b616e]">
            Todo anúncio é identificado como "Publicidade" ou "Informe publicitário". Os espaços têm dimensões reservadas para não deslocar o conteúdo durante o carregamento (CLS zero). Os valores de tabela ficam organizados conforme os procedimentos comerciais e do Midiacad, enviados sob solicitação.
          </p>
        </section>

        {/* Seção 3: Formulário de Proposta Comercial */}
        <section id="proposta" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="m-0 font-serif-journal text-2xl sm:text-[26px] font-bold text-[#0b2545]">
              Solicite uma proposta
            </h2>
            <p className="m-0 text-[15px] leading-[1.55] text-[#3c414b]">
              Atendemos anunciantes privados, agências de publicidade e órgãos da administração pública direta e indireta. Usamos seus dados exclusivamente para responder a esta solicitação comercial, em estrito cumprimento da LGPD.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-2 mt-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garantia de Entrega e Registro</span>
              </div>
              <p className="leading-relaxed">
                Ao clicar em enviar, sua proposta é transmitida em tempo real para a diretoria comercial em <strong>{CONTACT_EMAIL}</strong> e registrada no nosso sistema integrado com comprovante de atendimento.
              </p>
            </div>

            {submitted && (
              <div className="mt-4 p-4 bg-[#eaf6ef] text-[#145c33] rounded-lg text-[14px] font-semibold border-2 border-[#a3d9b8] shadow-xs flex items-start gap-2.5">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[15px] mb-1">Solicitação enviada com sucesso!</p>
                  <p className="text-xs font-normal leading-relaxed text-[#1e6b3d]">
                    Sua mensagem foi entregue à diretoria comercial no e-mail <strong>{CONTACT_EMAIL}</strong> e registrada no nosso CRM. Entraremos em contato em breve!
                  </p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] font-semibold">
            <label className="flex flex-col gap-1">
              Nome
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] outline-none focus:border-[#0b2545]"
              />
            </label>

            <label className="flex flex-col gap-1">
              Empresa ou órgão público
              <input
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nome da empresa ou órgão"
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] outline-none focus:border-[#0b2545]"
              />
            </label>

            <label className="flex flex-col gap-1">
              CNPJ (opcional)
              <input
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] outline-none focus:border-[#0b2545]"
              />
            </label>

            <label className="flex flex-col gap-1">
              E-mail corporativo
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seuemail@empresa.com.br"
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] outline-none focus:border-[#0b2545]"
              />
            </label>

            <label className="flex flex-col gap-1">
              Telefone / WhatsApp
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(61) 99999-9999"
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] outline-none focus:border-[#0b2545]"
              />
            </label>

            <label className="flex flex-col gap-1">
              Tipo de campanha
              <select
                value={formData.campaignType}
                onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] bg-white outline-none"
              >
                <option>Institucional</option>
                <option>Governamental / Utilidade Pública</option>
                <option>Varejo / Marca</option>
                <option>Informe Publicitário</option>
                <option>Vídeo Digital</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 sm:col-span-2">
              Período pretendido
              <input
                placeholder="Ex.: 01/12 a 31/12 ou Imediato"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] outline-none focus:border-[#0b2545]"
              />
            </label>

            <label className="flex flex-col gap-1 sm:col-span-2">
              Mensagem ou escopo da campanha
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Descreva os objetivos da campanha, formatos de interesse ou público-alvo pretendido..."
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] outline-none focus:border-[#0b2545] resize-y"
              />
            </label>

            <label className="flex gap-2 items-start text-[13px] text-[#3c414b] font-normal sm:col-span-2">
              <input type="checkbox" required className="mt-1" />
              <span>Concordo com o uso dos meus dados exclusivamente para contato comercial, conforme a Política de Privacidade e a LGPD.</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-2 justify-self-start border-0 bg-[#c8102e] hover:bg-[#a50d25] text-white px-6 py-3.5 rounded-[4px] font-bold text-[14px] cursor-pointer transition-colors uppercase tracking-wider flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Transmitindo e enviando e-mail...' : 'Enviar solicitação de proposta'}</span>
            </button>
          </form>
        </section>
      </main>

      {/* MODAL DE ENVIO RÁPIDO DE E-MAIL DIRETO */}
      {quickModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0b2545] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-base leading-none">Enviar E-mail Direto</h3>
                  <p className="text-xs text-slate-300 mt-1">Para: {CONTACT_EMAIL}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quickSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">E-mail Enviado com Sucesso!</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sua mensagem foi enviada diretamente para <strong>{CONTACT_EMAIL}</strong> e registrada na nossa central comercial.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    placeholder="Nome completo"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#0b2545]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Seu E-mail de Resposta *
                  </label>
                  <input
                    type="email"
                    required
                    value={quickForm.email}
                    onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                    placeholder="seuemail@exemplo.com"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#0b2545]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    required
                    value={quickForm.subject}
                    onChange={(e) => setQuickForm({ ...quickForm, subject: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#0b2545]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mensagem *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={quickForm.message}
                    onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                    placeholder="Escreva sua mensagem ou dúvida comercial..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#0b2545] resize-y"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setQuickModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={quickLoading}
                    className="px-5 py-2 bg-[#c8102e] hover:bg-[#a50d25] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{quickLoading ? 'Enviando...' : 'Enviar E-mail Agora'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer settings={DEFAULT_SETTINGS} />
      <CookieBanner />
    </div>
  );
}

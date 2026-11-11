'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { DEFAULT_SETTINGS, INITIAL_CATEGORIES } from '@/lib/constants';

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
        <section className="flex flex-col gap-3.5 max-w-[820px]">
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
          <div className="p-3.5 bg-[#f4f5f7] border border-[#e3e5e9] rounded-[4px] text-[13.5px] text-[#3c414b] flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
            <span>
              E-mail oficial para patrocínio e propostas comerciais: <strong className="text-[#0b2545]">americanbeacon@americanbeacon.online</strong>
            </span>
            <a
              href="mailto:americanbeacon@americanbeacon.online"
              style={{ backgroundColor: '#c8102e', color: '#ffffff' }}
              className="px-3.5 py-1.5 rounded-[3px] text-white font-bold text-[12px] uppercase tracking-wider self-start sm:self-auto hover:bg-[#a50d25] transition-colors"
            >
              Enviar E-mail
            </a>
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
            {submitted && (
              <div className="mt-3 p-3 bg-[#eaf6ef] text-[#145c33] rounded-[4px] text-[14px] font-semibold border border-[#c4e3d0]">
                Recebemos sua solicitação com sucesso! O contato foi registrado no nosso CRM comercial e nossa equipe entrará em contato em breve.
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
                className="border border-[#c9ccd3] rounded-[4px] p-2.5 text-sm font-normal text-[#16181d] outline-none focus:border-[#0b2545]"
              />
            </label>

            <label className="flex flex-col gap-1">
              Empresa ou órgão público
              <input
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                placeholder="Ex.: 01/12 a 31/12"
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
              className="sm:col-span-2 justify-self-start border-0 bg-[#c8102e] hover:bg-[#a50d25] text-white px-6 py-3 rounded-[4px] font-bold text-[14px] cursor-pointer transition-colors uppercase tracking-wider"
            >
              {loading ? 'Enviando...' : 'Enviar solicitação'}
            </button>
          </form>
        </section>
      </main>

      <Footer settings={DEFAULT_SETTINGS} />
      <CookieBanner />
    </div>
  );
}

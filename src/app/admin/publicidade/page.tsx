'use client';

import React, { useState, useEffect } from 'react';
import { AdBanner, AdCampaign, Advertiser, AdPosition } from '@/lib/types';
import {
  Megaphone,
  PlusCircle,
  Building2,
  Image as ImageIcon,
  CheckCircle2,
  DollarSign,
  BarChart3,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

const POSITIONS: { value: AdPosition; label: string; dims: string }[] = [
  { value: 'superbanner', label: 'Superbanner Superior', dims: '970 × 250 px' },
  { value: 'banner_horizontal', label: 'Leaderboard Horizontal', dims: '728 × 90 px' },
  { value: 'medium_rectangle', label: 'Retângulo Médio (MREC)', dims: '300 × 250 px' },
  { value: 'half_page', label: 'Half Page', dims: '300 × 600 px' },
  { value: 'banner_mobile', label: 'Banner Mobile', dims: '320 × 100 px' },
  { value: 'in_feed', label: 'Banner In-Feed (Responsivo)', dims: '800 × 180 px' },
];

export default function AdminAdvertisingPage() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [activeTab, setActiveTab] = useState<'banners' | 'campaigns' | 'advertisers'>('banners');

  // Modais de Criação
  const [showAdvModal, setShowAdvModal] = useState(false);
  const [showCampModal, setShowCampModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Formulário de Anunciante
  const [newAdv, setNewAdv] = useState({
    name: '',
    company: '',
    cnpj: '',
    type: 'governo_federal' as Advertiser['type'],
    contactName: '',
    contactEmail: '',
    phone: '',
    notes: '',
  });

  // Formulário de Campanha
  const [newCamp, setNewCamp] = useState({
    advertiserId: '',
    name: '',
    type: 'governamental' as AdCampaign['type'],
    contractNumber: '',
    budget: 50000,
    startDate: '2026-11-10',
    endDate: '2026-12-31',
    impressionsLimit: 1000000,
  });

  // Formulário de Banner
  const [newBanner, setNewBanner] = useState({
    campaignId: '',
    title: '',
    position: 'superbanner' as AdPosition,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=970&h=250&auto=format&fit=crop&q=80',
    altText: 'Campanha institucional',
    destinationUrl: 'https://www.gov.br',
    label: 'Publicidade' as AdBanner['label'],
  });

  const [message, setMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/ads');
      const data = await res.json();
      if (data) {
        setAdvertisers(data.advertisers || []);
        setCampaigns(data.campaigns || []);
        setBanners(data.banners || []);
        if (data.advertisers?.length > 0 && !newCamp.advertiserId) {
          setNewCamp((prev) => ({ ...prev, advertiserId: data.advertisers[0].id }));
        }
        if (data.campaigns?.length > 0 && !newBanner.campaignId) {
          setNewBanner((prev) => ({ ...prev, campaignId: data.campaigns[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAdvertiser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_advertiser', data: newAdv }),
      });
      if (res.ok) {
        setShowAdvModal(false);
        setMessage('Anunciante cadastrado com sucesso!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_campaign', data: newCamp }),
      });
      if (res.ok) {
        setShowCampModal(false);
        setMessage('Campanha publicitária ativada!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_banner', data: newBanner }),
      });
      if (res.ok) {
        setShowBannerModal(false);
        setMessage('Banner posicionado no inventário com sucesso!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-red-700 block mb-1">
            Módulo de Monetização & Ad Server
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900">
            Gerenciador de Campanhas & Banners IAB
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre anunciantes públicos e privados, agências, crie campanhas e posicione criativos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBannerModal(true)}
            className="px-3.5 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Novo Banner</span>
          </button>
          <button
            onClick={() => setShowCampModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Nova Campanha</span>
          </button>
          <button
            onClick={() => setShowAdvModal(true)}
            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Novo Anunciante</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs de Seleção */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('banners')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'banners'
              ? 'border-blue-900 text-blue-950'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Banners & Criativos Ativos ({banners.length})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'campaigns'
              ? 'border-blue-900 text-blue-950'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Campanhas Cadastradas ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('advertisers')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'advertisers'
              ? 'border-blue-900 text-blue-950'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Clientes & Agências ({advertisers.length})
        </button>
      </div>

      {/* CONTEÚDO DA TAB 1: BANNERS */}
      {activeTab === 'banners' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Criativo</th>
                  <th className="p-3.5">Posição IAB</th>
                  <th className="p-3.5">Campanha</th>
                  <th className="p-3.5">Identificação</th>
                  <th className="p-3.5">Impressões Auditadas</th>
                  <th className="p-3.5">Cliques</th>
                  <th className="p-3.5">CTR</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {banners.map((b) => {
                  const camp = campaigns.find((c) => c.id === b.campaignId);
                  const ctr = b.impressionsCount > 0 ? (b.clicksCount / b.impressionsCount) * 100 : 0;
                  return (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-3.5 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.imageUrl}
                          alt={b.title}
                          className="w-16 h-10 object-cover rounded border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{b.title}</p>
                          <a
                            href={b.destinationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-900 hover:underline flex items-center gap-1"
                          >
                            <span>Destino</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                          {b.position.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-800 font-medium">
                        {camp?.name || b.campaignId}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {b.label}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {b.impressionsCount.toLocaleString('pt-BR')}
                      </td>

                      <td className="p-3.5 font-bold text-blue-950 whitespace-nowrap">
                        {b.clicksCount.toLocaleString('pt-BR')}
                      </td>

                      <td className="p-3.5 font-bold text-emerald-700 whitespace-nowrap">
                        {ctr.toFixed(2)}%
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {b.isActive ? 'Ativo' : 'Pausado'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA TAB 2: CAMPANHAS */}
      {activeTab === 'campaigns' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Campanha</th>
                  <th className="p-3.5">Anunciante</th>
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Nº Contrato</th>
                  <th className="p-3.5">Orçamento</th>
                  <th className="p-3.5">Meta Impressões</th>
                  <th className="p-3.5">Entregues</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {campaigns.map((c) => {
                  const adv = advertisers.find((a) => a.id === c.advertiserId);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                      <td className="p-3.5 font-medium text-slate-700">{adv?.name || c.advertiserId}</td>
                      <td className="p-3.5 uppercase text-[10px] font-semibold">{c.type.replace('_', ' ')}</td>
                      <td className="p-3.5 font-mono text-slate-500">{c.contractNumber || '-'}</td>
                      <td className="p-3.5 font-bold text-emerald-700">
                        R$ {c.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5">{c.impressionsLimit.toLocaleString('pt-BR')}</td>
                      <td className="p-3.5 font-bold text-slate-900">{c.currentImpressions.toLocaleString('pt-BR')}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA TAB 3: ANUNCIANTES */}
      {activeTab === 'advertisers' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Razão Social / Órgão</th>
                  <th className="p-3.5">CNPJ</th>
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Contato</th>
                  <th className="p-3.5">E-mail</th>
                  <th className="p-3.5">Telefone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {advertisers.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{a.name}</td>
                    <td className="p-3.5 font-mono text-slate-600">{a.cnpj}</td>
                    <td className="p-3.5 uppercase text-[10px] font-semibold bg-slate-50">
                      {a.type.replace('_', ' ')}
                    </td>
                    <td className="p-3.5 font-medium">{a.contactName}</td>
                    <td className="p-3.5 text-blue-900">{a.contactEmail}</td>
                    <td className="p-3.5">{a.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: NOVO BANNER */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-headline text-slate-900">
              Cadastrar Novo Banner no Inventário
            </h3>

            <form onSubmit={handleCreateBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Campanha Vinculada *</label>
                <select
                  value={newBanner.campaignId}
                  onChange={(e) => setNewBanner({ ...newBanner, campaignId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Título do Criativo *</label>
                <input
                  type="text"
                  required
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Posição IAB *</label>
                  <select
                    value={newBanner.position}
                    onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value as AdPosition })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    {POSITIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label} ({p.dims})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Identificação Legal *</label>
                  <select
                    value={newBanner.label}
                    onChange={(e) => setNewBanner({ ...newBanner, label: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-semibold"
                  >
                    <option value="Publicidade">Publicidade</option>
                    <option value="Informe Publicitário">Informe Publicitário</option>
                    <option value="Patrocínio Institucional">Patrocínio Institucional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">URL da Imagem / Criativo *</label>
                <input
                  type="text"
                  required
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">URL de Destino (Clique) *</label>
                <input
                  type="text"
                  required
                  value={newBanner.destinationUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, destinationUrl: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-950 text-white rounded font-bold uppercase tracking-wider"
                >
                  Salvar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NOVA CAMPANHA */}
      {showCampModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-headline text-slate-900">
              Criar Nova Campanha Publicitária
            </h3>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Cliente / Anunciante *</label>
                <select
                  value={newCamp.advertiserId}
                  onChange={(e) => setNewCamp({ ...newCamp, advertiserId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                >
                  {advertisers.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.cnpj})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nome da Campanha *</label>
                <input
                  type="text"
                  required
                  value={newCamp.name}
                  onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
                  placeholder="Ex: Campanha de Conscientização 2026"
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nº do Contrato / Edital</label>
                  <input
                    type="text"
                    value={newCamp.contractNumber}
                    onChange={(e) => setNewCamp({ ...newCamp, contractNumber: e.target.value })}
                    placeholder="Ex: SECOM-PR/2026-88"
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Orçamento Contratado (R$)</label>
                  <input
                    type="number"
                    value={newCamp.budget}
                    onChange={(e) => setNewCamp({ ...newCamp, budget: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Meta de Impressões</label>
                  <input
                    type="number"
                    value={newCamp.impressionsLimit}
                    onChange={(e) => setNewCamp({ ...newCamp, impressionsLimit: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tipo de Veiculação</label>
                  <select
                    value={newCamp.type}
                    onChange={(e) => setNewCamp({ ...newCamp, type: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="governamental">Governamental</option>
                    <option value="utilidade_publica">Utilidade Pública</option>
                    <option value="institucional">Institucional</option>
                    <option value="comercial">Comercial Privado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCampModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-950 text-white rounded font-bold uppercase tracking-wider"
                >
                  Criar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NOVO ANUNCIANTE */}
      {showAdvModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-headline text-slate-900">
              Cadastrar Anunciante / Agência
            </h3>

            <form onSubmit={handleCreateAdvertiser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Razão Social / Nome Oficial *</label>
                <input
                  type="text"
                  required
                  value={newAdv.name}
                  onChange={(e) => setNewAdv({ ...newAdv, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={newAdv.cnpj}
                    onChange={(e) => setNewAdv({ ...newAdv, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                    className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tipo de Entidade</label>
                  <select
                    value={newAdv.type}
                    onChange={(e) => setNewAdv({ ...newAdv, type: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="governo_federal">Governo Federal (SECOM / Ministérios)</option>
                    <option value="governo_estadual">Governo Estadual</option>
                    <option value="prefeitura">Prefeitura Municipal</option>
                    <option value="empresa_publica">Empresa Pública / Mista</option>
                    <option value="agencia">Agência de Publicidade</option>
                    <option value="privado">Anunciante Privado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Responsável de Contato</label>
                  <input
                    type="text"
                    value={newAdv.contactName}
                    onChange={(e) => setNewAdv({ ...newAdv, contactName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Telefone</label>
                  <input
                    type="text"
                    value={newAdv.phone}
                    onChange={(e) => setNewAdv({ ...newAdv, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  value={newAdv.contactEmail}
                  onChange={(e) => setNewAdv({ ...newAdv, contactEmail: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAdvModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-950 text-white rounded font-bold uppercase tracking-wider"
                >
                  Cadastrar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

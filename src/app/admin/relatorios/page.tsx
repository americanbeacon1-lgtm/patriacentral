'use client';

import React, { useState, useEffect } from 'react';
import { AdCampaign, Advertiser, AdBanner } from '@/lib/types';
import {
  BarChart3,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

  useEffect(() => {
    fetch('/api/admin/ads')
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns || []);
        setAdvertisers(data.advertisers || []);
        setBanners(data.banners || []);
        if (data.campaigns?.length > 0) {
          setSelectedCampaignId(data.campaigns[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const currentCamp = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
  const currentAdv = advertisers.find((a) => a.id === currentCamp?.advertiserId);
  const campBanners = banners.filter((b) => b.campaignId === currentCamp?.id);

  const ctr =
    currentCamp && currentCamp.currentImpressions > 0
      ? (currentCamp.clicksCount / currentCamp.currentImpressions) * 100
      : 0;

  // Exportação para arquivo CSV auditável
  const exportCsv = () => {
    if (!currentCamp) return;

    const headers = ['Campanha', 'Anunciante', 'CNPJ', 'Contrato', 'Criativo', 'Posicao', 'Impressoes', 'Cliques', 'CTR', 'DataEmissao'];
    const rows = campBanners.map((b) => {
      const bCtr = b.impressionsCount > 0 ? (b.clicksCount / b.impressionsCount) * 100 : 0;
      return [
        `"${currentCamp.name}"`,
        `"${currentAdv?.name || ''}"`,
        `"${currentAdv?.cnpj || ''}"`,
        `"${currentCamp.contractNumber || 'S/N'}"`,
        `"${b.title}"`,
        `"${b.position}"`,
        b.impressionsCount,
        b.clicksCount,
        `"${bCtr.toFixed(2)}%"`,
        `"${new Date().toISOString()}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_veiculacao_${currentCamp.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topo / Filtros (Oculto na impressão para clipping limpo) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-red-700 block mb-1">
            Auditoria & Prestação de Contas
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900">
            Relatório Oficial de Comprovação de Veiculação
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Clipping com registros auditáveis para órgãos públicos (SECOM/Midiacad), agências e anunciantes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Imprimir / Gerar PDF</span>
          </button>
        </div>
      </div>

      {/* Seletor de Campanha (No-print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
          Selecione a Campanha:
        </label>
        <select
          value={selectedCampaignId}
          onChange={(e) => setSelectedCampaignId(e.target.value)}
          className="flex-1 p-2 border border-slate-300 rounded text-xs bg-white font-medium text-slate-800"
        >
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — Contrato: {c.contractNumber || 'S/N'}
            </option>
          ))}
        </select>
      </div>

      {/* FOLHA OFICIAL DE COMPROVAÇÃO DE VEICULAÇÃO (ESTILIZADA PARA TELA E IMPRESSÃO) */}
      <div className="bg-white border border-slate-300 rounded-xl p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Cabeçalho do Laudo / Clipping */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-7 bg-red-700 inline-block"></span>
              <span className="text-2xl font-black font-headline uppercase tracking-tight text-slate-950">
                EIXO NACIONAL
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
              Departamento de Auditoria & Comprovação Publicitária
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
            <p><strong>Protocolo Auditado:</strong> <span className="font-mono">EN-{currentCamp?.id || '001'}</span></p>
            <p><strong>Emissão do Laudo:</strong> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
            <p className="text-emerald-700 font-bold flex items-center sm:justify-end gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Certificado de Veiculação Efetiva
            </p>
          </div>
        </div>

        {/* Informações da Contratação e Anunciante */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-200 text-xs">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b pb-1">
              Dados do Anunciante
            </h4>
            <p><strong>Razão Social / Órgão:</strong> {currentAdv?.name || 'Não informado'}</p>
            <p><strong>CNPJ:</strong> <span className="font-mono">{currentAdv?.cnpj || '-'}</span></p>
            <p><strong>Tipo:</strong> {currentAdv?.type?.replace('_', ' ').toUpperCase() || 'PÚBLICO'}</p>
            <p><strong>Contato Responsável:</strong> {currentAdv?.contactName} ({currentAdv?.contactEmail})</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b pb-1">
              Dados do Contrato & Período
            </h4>
            <p><strong>Nome da Campanha:</strong> {currentCamp?.name}</p>
            <p><strong>Número de Contrato / Empenho:</strong> <span className="font-mono">{currentCamp?.contractNumber || 'S/N'}</span></p>
            <p><strong>Orçamento Cadastrado:</strong> R$ {currentCamp?.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p><strong>Período de Veiculação:</strong> {currentCamp?.startDate ? new Date(currentCamp.startDate).toLocaleDateString('pt-BR') : '-'} até {currentCamp?.endDate ? new Date(currentCamp.endDate).toLocaleDateString('pt-BR') : '-'}</p>
          </div>
        </div>

        {/* Quadro Consolidado de Métricas Auditadas */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-headline mb-3">
            Quadro Demonstrativo de Entrega de Mídia
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-100 rounded-lg text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Meta Contratada
              </span>
              <p className="text-xl font-black text-slate-900 font-headline mt-1">
                {currentCamp?.impressionsLimit.toLocaleString('pt-BR')}
              </p>
              <span className="text-[10px] text-slate-400">impressões</span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                Impressões Efetivas
              </span>
              <p className="text-xl font-black text-blue-950 font-headline mt-1">
                {currentCamp?.currentImpressions.toLocaleString('pt-BR')}
              </p>
              <span className="text-[10px] text-blue-700 font-semibold">auditadas em log</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                Cliques Registrados
              </span>
              <p className="text-xl font-black text-emerald-950 font-headline mt-1">
                {currentCamp?.clicksCount.toLocaleString('pt-BR')}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold">acessos ao destino</span>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">
                Taxa de Cliques (CTR)
              </span>
              <p className="text-xl font-black text-purple-950 font-headline mt-1">
                {ctr.toFixed(2)}%
              </p>
              <span className="text-[10px] text-purple-700 font-semibold">desempenho real</span>
            </div>
          </div>
        </div>

        {/* Comprovação Visual dos Criativos Veiculados (Clipping) */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-headline mb-3">
            Detalhamento por Criativo & Posição IAB
          </h3>

          <div className="space-y-6">
            {campBanners.map((b) => {
              const bCtr = b.impressionsCount > 0 ? (b.clicksCount / b.impressionsCount) * 100 : 0;
              return (
                <div
                  key={b.id}
                  className="border border-slate-200 rounded-lg p-5 bg-white flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="md:w-64 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="w-full h-auto rounded border border-slate-300 shadow-xs"
                    />
                    <div className="mt-1 text-[10px] text-center text-slate-400 font-mono">
                      Timestamp: {new Date(b.createdAt).toISOString()}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{b.title}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold uppercase text-[10px]">
                        {b.position.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-slate-500">
                      <strong>URL Destino:</strong> {b.destinationUrl}
                    </p>
                    <p className="text-slate-500">
                      <strong>Classificação:</strong> {b.label}
                    </p>

                    <div className="pt-2 grid grid-cols-3 gap-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Impressões:</span>
                        <p className="font-bold text-slate-900">{b.impressionsCount.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Cliques:</span>
                        <p className="font-bold text-slate-900">{b.clicksCount.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">CTR:</span>
                        <p className="font-bold text-emerald-700">{bCtr.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assinatura e Carimbo Oficial de Comprovação */}
        <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <p className="font-bold text-slate-800">Declaração de Autenticidade:</p>
            <p className="text-[11px] leading-relaxed mt-1 text-slate-500">
              Certificamos que as inserções publicitárias acima discriminadas foram integralmente veiculadas nos servidores de produção do Portal Eixo Nacional, em consonância com as regras técnicas da SECOM/Midiacad e boas práticas do IAB Brasil.
            </p>
          </div>

          <div className="text-center sm:text-right space-y-2">
            <div className="inline-block border-t border-slate-400 pt-2 px-8">
              <p className="font-bold text-slate-900">Diretoria Comercial & Auditoria</p>
              <p className="text-[11px] text-slate-500">Eixo Nacional Comunicação Digital Ltda.</p>
              <p className="text-[10px] font-mono text-slate-400">CNPJ: 51.849.204/0001-88</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

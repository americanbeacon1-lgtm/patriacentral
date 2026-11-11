import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import {
  Eye,
  FileText,
  Megaphone,
  DollarSign,
  TrendingUp,
  Users,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminDashboardPage() {
  const metrics = db.getBusinessMetrics();
  const campaigns = db.getCampaigns();
  const leads = db.getLeads();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Topo do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-red-700 block mb-1">
            Painel Executivo de Negócios & Redação
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900">
            Inteligência de Audiência & Mídia
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Métricas auditadas de tráfego, inventário publicitário e relacionamento comercial
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/noticias/nova"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Notícia</span>
          </Link>
          <Link
            href="/admin/publicidade"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
          >
            <Megaphone className="w-4 h-4" />
            <span>Nova Campanha</span>
          </Link>
        </div>
      </div>

      {/* 4 CARDS DE INDICADORES PRINCIPAIS (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Visualizações de Páginas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Audiência Total
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1 font-headline">
              {metrics.totalViews.toLocaleString('pt-BR')}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +18.4% este mês
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Campanhas Ativas & Contratos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Campanhas em Veiculação
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1 font-headline">
              {metrics.activeCampaigns}{' '}
              <span className="text-sm font-normal text-slate-400">/ {metrics.totalCampaigns} total</span>
            </p>
            <span className="text-[11px] font-semibold text-blue-900 mt-1 block">
              100% inventário ocupado
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>

        {/* Receita Cadastrada por Contratos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Receita sob Contrato
            </span>
            <p className="text-2xl font-black text-emerald-700 mt-1 font-headline">
              R$ {metrics.totalContractRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Contratos governamentais e privados
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Impressões & CTR Auditado */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              CTR Médio Auditado
            </span>
            <p className="text-2xl font-black text-blue-950 mt-1 font-headline">
              {metrics.averageCTR}%
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {metrics.totalDeliveredImpressions.toLocaleString('pt-BR')} imp. entregues
            </span>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* BLOCO CENTRAL: TABELA DE NOTÍCIAS MAIS LIDAS & CAMPANHAS ATIVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Notícias Mais Acessadas (7 colunas) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h3 className="text-sm font-bold font-headline uppercase text-slate-900 tracking-wider">
              Top 5 Notícias Mais Lidas
            </h3>
            <Link href="/admin/noticias" className="text-xs font-semibold text-blue-900 hover:underline">
              Ver todas as matérias →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.topArticles.map((art, idx) => (
              <div
                key={art.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black font-headline text-slate-300 w-5 text-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Editoria: <strong>{art.categoryId}</strong> • {art.readingTime} min
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-blue-950">
                    {art.viewsCount.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">leituras</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads do CRM Comercial Recentes (5 colunas) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h3 className="text-sm font-bold font-headline uppercase text-slate-900 tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-red-700" />
              Propostas no CRM Comercial
            </h3>
            <Link href="/admin/crm" className="text-xs font-semibold text-blue-900 hover:underline">
              Ver funil completo →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{lead.company}</h4>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      lead.status === 'negociacao'
                        ? 'bg-amber-100 text-amber-900'
                        : lead.status === 'proposta_enviada'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Contato: {lead.name} • {lead.budgetRange}
                </p>
                <p className="text-[10px] text-slate-400 italic line-clamp-1">
                  &ldquo;{lead.message}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAINEL DE CAMPANHAS ATIVAS & ENTREGA AUDITÁVEL */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h3 className="text-sm font-bold font-headline uppercase text-slate-900 tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Campanhas Publicitárias Auditadas em Andamento
          </h3>
          <Link
            href="/admin/relatorios"
            className="text-xs font-semibold text-blue-900 hover:underline"
          >
            Gerar Relatório de Comprovação (Clipping) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Campanha</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Contrato / N°</th>
                <th className="p-3">Orçamento</th>
                <th className="p-3">Meta Impressões</th>
                <th className="p-3">Entregues</th>
                <th className="p-3">Cliques</th>
                <th className="p-3">CTR</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {campaigns.map((camp) => {
                const ctr = camp.currentImpressions > 0 ? (camp.clicksCount / camp.currentImpressions) * 100 : 0;
                return (
                  <tr key={camp.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{camp.name}</td>
                    <td className="p-3 uppercase text-[10px] font-semibold">{camp.type.replace('_', ' ')}</td>
                    <td className="p-3 font-mono text-[11px]">{camp.contractNumber || 'S/N'}</td>
                    <td className="p-3 font-bold text-emerald-700">
                      R$ {camp.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3">{camp.impressionsLimit.toLocaleString('pt-BR')}</td>
                    <td className="p-3 font-semibold text-slate-900">
                      {camp.currentImpressions.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 font-semibold text-blue-950">
                      {camp.clicksCount.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 font-bold">{ctr.toFixed(2)}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {camp.status}
                      </span>
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

'use client';

import React, { useState, useEffect } from 'react';
import { CommercialLead } from '@/lib/types';
import {
  Users2,
  Phone,
  Mail,
  Building2,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  FileCheck,
} from 'lucide-react';

const STATUS_CONFIG: Record<CommercialLead['status'], { label: string; color: string; badge: string }> = {
  novo: { label: 'Novo Contato', color: 'border-amber-400', badge: 'bg-amber-100 text-amber-900' },
  proposta_enviada: { label: 'Proposta Enviada', color: 'border-blue-500', badge: 'bg-blue-100 text-blue-900' },
  negociacao: { label: 'Em Negociação', color: 'border-purple-500', badge: 'bg-purple-100 text-purple-900' },
  contratado: { label: 'Campanha Contratada', color: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-900' },
  concluido: { label: 'Concluído', color: 'border-slate-400', badge: 'bg-slate-200 text-slate-800' },
};

export default function AdminCrmPage() {
  const [leads, setLeads] = useState<CommercialLead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/crm');
      const data = await res.json();
      if (data && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: CommercialLead['status']) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
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
            Central de Negócios & Propostas
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900">
            CRM Comercial de Anunciantes ({leads.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de oportunidades comerciais, follow-up de agências e atendimento a órgãos públicos
          </p>
        </div>
      </div>

      {/* Resumo do Funil */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.keys(STATUS_CONFIG) as CommercialLead['status'][]).map((st) => {
          const count = leads.filter((l) => l.status === st).length;
          const conf = STATUS_CONFIG[st];
          return (
            <div key={st} className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {conf.label}
              </span>
              <p className="text-xl font-black text-slate-900 mt-1 font-headline">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Lista de Oportunidades no CRM */}
      <div className="space-y-4">
        {leads.map((lead) => {
          const conf = STATUS_CONFIG[lead.status];
          const createdDate = new Date(lead.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={lead.id}
              className={`bg-white border-l-4 ${conf.color} border-y border-r border-slate-200 rounded-r-xl p-5 shadow-xs space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{lead.company}</h3>
                    <p className="text-xs text-slate-500">
                      Contato: <strong>{lead.name}</strong> • CNPJ: {lead.cnpj || 'Não informado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">{createdDate}</span>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                    className={`px-3 py-1 rounded text-xs font-bold uppercase ${conf.badge} border-none focus:ring-0 cursor-pointer`}
                  >
                    <option value="novo">Novo Contato</option>
                    <option value="proposta_enviada">Proposta Enviada</option>
                    <option value="negociacao">Em Negociação</option>
                    <option value="contratado">Campanha Contratada</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>

              {/* Detalhes da Proposta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg">
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">Tipo de Anunciante:</span>
                  <span className="uppercase text-[11px] font-semibold">{lead.campaignType}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">Faixa de Investimento:</span>
                  <span className="text-emerald-700 font-bold">{lead.budgetRange}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">Período Pretendido:</span>
                  <span>{lead.desiredPeriod}</span>
                </div>
              </div>

              {/* Mensagem e Formatos de Interesse */}
              <div className="text-xs space-y-2">
                <p className="text-slate-700 leading-relaxed">
                  <strong>Objetivos do Anunciante:</strong> {lead.message}
                </p>

                {lead.interestedFormats && lead.interestedFormats.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="font-bold text-slate-500 text-[11px]">Formatos Selecionados:</span>
                    {lead.interestedFormats.map((f) => (
                      <span key={f} className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded text-[10px] font-semibold">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {lead.notes && (
                  <p className="text-slate-500 italic bg-amber-50/60 p-2 rounded text-[11px] border border-amber-200/50">
                    <strong>Anotações internas:</strong> {lead.notes}
                  </p>
                )}
              </div>

              {/* Contatos Diretos de Ação */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-4">
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1 text-blue-900 hover:underline font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{lead.email}</span>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${lead.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{lead.phone}</span>
                  </a>
                </div>

                <span className="text-[10px] text-slate-400">
                  Armazenado sob padrões de conformidade LGPD
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

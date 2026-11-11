'use client';

import React, { useState, useEffect } from 'react';
import { SiteSettings } from '@/lib/types';
import { Settings, Save, CheckCircle2, ShieldCheck, Building2, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage('Configurações institucionais atualizadas com sucesso!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-xs text-slate-500">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-red-700 block mb-1">
            Governança & Identidade
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900">
            Configurações Institucionais do Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dados societários, CNPJ, expedientes oficiais e parâmetros da barra de urgência
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Gravando...' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Bloco 1: Barra de Notícias Urgentes (Breaking News) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Bell className="w-5 h-5 text-red-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-headline">
              Barra de Notícias Urgentes (Plantão na Capa)
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.urgentBarActive}
                onChange={(e) => setSettings({ ...settings, urgentBarActive: e.target.checked })}
                className="rounded text-red-700 focus:ring-red-700"
              />
              <span className="text-red-700">Ativar alerta vermelho de URGENTE no topo do portal</span>
            </label>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Texto do Alerta de Plantão
              </label>
              <input
                type="text"
                value={settings.urgentBarText}
                onChange={(e) => setSettings({ ...settings, urgentBarText: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Link de Destino da Notícia Urgente
              </label>
              <input
                type="text"
                value={settings.urgentBarLink}
                onChange={(e) => setSettings({ ...settings, urgentBarLink: e.target.value })}
                placeholder="/noticia/slug-da-noticia"
                className="w-full p-2.5 border border-slate-300 rounded text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Dados Societários e Fiscais */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Building2 className="w-5 h-5 text-blue-900" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-headline">
              Identificação Societária & Transparência Governamental
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Nome do Veículo</label>
              <input
                type="text"
                value={settings.portalName}
                onChange={(e) => setSettings({ ...settings, portalName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Slogan Institucional</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Razão Social *</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">CNPJ *</label>
              <input
                type="text"
                value={settings.cnpj}
                onChange={(e) => setSettings({ ...settings, cnpj: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Sede em Brasília / DF</label>
              <input
                type="text"
                value={settings.addressBrasilia}
                onChange={(e) => setSettings({ ...settings, addressBrasilia: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Escritório em São Paulo / SP</label>
              <input
                type="text"
                value={settings.addressSaoPaulo}
                onChange={(e) => setSettings({ ...settings, addressSaoPaulo: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Expediente e Contatos Oficiais */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-headline">
              Expediente & Canais Oficiais
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Editor Responsável *</label>
              <input
                type="text"
                value={settings.chiefEditor}
                onChange={(e) => setSettings({ ...settings, chiefEditor: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Conselho Editorial</label>
              <input
                type="text"
                value={settings.journalismCouncil}
                onChange={(e) => setSettings({ ...settings, journalismCouncil: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">E-mail Comercial</label>
              <input
                type="email"
                value={settings.commercialEmail}
                onChange={(e) => setSettings({ ...settings, commercialEmail: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">E-mail da Redação</label>
              <input
                type="email"
                value={settings.redactionEmail}
                onChange={(e) => setSettings({ ...settings, redactionEmail: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Telefone Comercial / WhatsApp</label>
              <input
                type="text"
                value={settings.commercialPhone}
                onChange={(e) => setSettings({ ...settings, commercialPhone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Link do Canal no WhatsApp</label>
              <input
                type="text"
                value={settings.whatsappChannelUrl}
                onChange={(e) => setSettings({ ...settings, whatsappChannelUrl: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

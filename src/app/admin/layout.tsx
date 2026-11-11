'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminAuthGuard from '@/components/Admin/AdminAuthGuard';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Megaphone,
  BarChart3,
  Users2,
  Settings,
  ExternalLink,
  ShieldAlert,
  Menu,
  X,
  Newspaper,
  Radio,
  LogOut,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('eixo_admin_auth_v1');
    localStorage.removeItem('admin_user');
    document.cookie = 'admin_auth=0; path=/; max-age=0';
    window.location.reload();
  };

  const navigation = [
    { name: 'Dashboard Executivo (BI)', href: '/admin', icon: LayoutDashboard },
    { name: 'Extrator de Portais (1 a 10d)', href: '/admin/extrator', icon: Radio },
    { name: 'Gerenciar Notícias', href: '/admin/noticias', icon: FileText },
    { name: 'Publicar Notícia (com IA)', href: '/admin/noticias/nova', icon: PlusCircle },
    { name: 'Campanhas & Anúncios', href: '/admin/publicidade', icon: Megaphone },
    { name: 'Relatórios & Comprovação', href: '/admin/relatorios', icon: BarChart3 },
    { name: 'CRM Comercial (Leads)', href: '/admin/crm', icon: Users2 },
    { name: 'Configurações do Portal', href: '/admin/configuracoes', icon: Settings },
  ];

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
        {/* Sidebar Mobile Toggle */}
        <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-red-700"></span>
            <span className="font-headline font-bold uppercase text-sm tracking-wide">
              Pátria Central • Redação & Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Sidebar Desktop / Drawer */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-slate-950 text-slate-300 shrink-0 md:min-h-screen flex flex-col justify-between border-r border-slate-800 z-40`}
        >
          <div>
            {/* Logo do Painel */}
            <div className="p-6 border-b border-slate-800">
              <Link href="/admin" className="block">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-red-700 inline-block rounded-xs"></span>
                  <span className="text-xl font-black text-white font-headline uppercase tracking-tight">
                    Pátria Central
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                  Painel Administrativo Integrado
                </p>
              </Link>
            </div>

            {/* Perfil Ativo */}
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-xs">
                AB
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-tight">americanbeacon1@gmail.com</p>
                <p className="text-[10px] text-amber-400 font-semibold">Administrador Master</p>
              </div>
            </div>

            {/* Links de Navegação */}
            <nav className="p-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-900 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Rodapé da Sidebar */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between w-full px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-2">
                <Newspaper className="w-3.5 h-3.5 text-blue-400" />
                Ver Portal Ao Vivo
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded text-xs font-semibold transition-colors cursor-pointer border border-red-900/30"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                Sair do Painel
              </span>
            </button>

            <div className="text-[10px] text-slate-500 text-center pt-2">
              Versão 1.0 • Pátria Central
            </div>
          </div>
        </aside>

        {/* Área Principal de Conteúdo do Admin */}
        <div className="flex-1 overflow-x-hidden p-4 sm:p-8">
          {children}
        </div>
      </div>
    </AdminAuthGuard>
  );
}

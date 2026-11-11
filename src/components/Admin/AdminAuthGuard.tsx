'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';

const ADMIN_EMAIL = 'americanbeacon1@gmail.com';
const ADMIN_PASS = 'eradogelo';
const AUTH_KEY = 'eixo_admin_auth_v1';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verifica se já está autenticado
    const stored = localStorage.getItem(AUTH_KEY);
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('admin_auth=1');
    if (stored === 'true' || hasCookie) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanEmail === ADMIN_EMAIL && cleanPass === ADMIN_PASS) {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem('admin_user', cleanEmail);
        document.cookie = 'admin_auth=1; path=/; max-age=86400; SameSite=Lax';
        setIsAuthenticated(true);
      } else {
        setErrorMessage('Credenciais inválidas. Verifique o e-mail e a senha informados.');
      }
      setLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('admin_user');
    document.cookie = 'admin_auth=0; path=/; max-age=0';
    setIsAuthenticated(false);
  };

  // Enquanto carrega o estado de autenticação
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-red-700 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-medium">Carregando painel seguro...</span>
        </div>
      </div>
    );
  }

  // Se não autenticado, renderiza a tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071322] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans-journal selection:bg-red-700 selection:text-white">
        {/* Detalhes de luz de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo e Cabeçalho de Identidade */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="w-3 h-8 bg-[#c8102e] rounded-xs shadow-sm"></span>
              <span className="text-2xl font-black text-white font-headline tracking-tight uppercase">
                Pátria Central
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Ambiente Administrativo Seguro</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Área restrita para gestão editorial, extrator de notícias, campanhas e controle do veículo.
            </p>
          </div>

          {/* Card do Formulário */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-7 shadow-2xl backdrop-blur-md">
            <h2 className="text-base font-bold text-white mb-1">Entrar na Redação</h2>
            <p className="text-xs text-slate-400 mb-6">
              Digite as credenciais de administrador autorizadas.
            </p>

            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-950/70 border border-red-800/80 rounded-lg text-xs text-red-200 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0"></span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Campo E-mail */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#c8102e] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-red-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Acessar Painel Administrativo</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Link para voltar ao portal público */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a página inicial do portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Se autenticado, fornece o contexto com botão de logout disponível
  return (
    <>
      {children}
    </>
  );
}

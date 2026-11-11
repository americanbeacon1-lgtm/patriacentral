'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import {
  FileText,
  Download,
  Building2,
  Users,
  MapPin,
  CheckCircle,
  Eye,
  BarChart2,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { DEFAULT_SETTINGS, INITIAL_CATEGORIES } from '@/lib/constants';

export default function MediaKitPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      <Header categories={INITIAL_CATEGORIES} settings={DEFAULT_SETTINGS} />

      <main className="flex-1 max-w-[1080px] mx-auto px-5 w-full py-8 sm:py-12">
        {/* Topo do Mídia Kit */}
        <div className="border border-[#e3e5e9] rounded-[4px] p-6 sm:p-10 mb-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e5e9] pb-6 mb-6">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#008744] block mb-1">
                Documento Técnico para Agências e Planejamento de Mídia
              </span>
              <h1 className="m-0 font-serif-journal text-3xl sm:text-4xl font-bold text-[#04391d]">
                Mídia Kit Institucional {DEFAULT_SETTINGS.portalName}
              </h1>
              <p className="text-[13px] text-[#5b616e] mt-1">
                Versão técnica em conformidade com as diretrizes do Midiacad (SECOM/PR)
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => typeof window !== 'undefined' && window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#04391d] hover:bg-[#008744] text-white rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>
          </div>

          {/* Aviso Legal de Conformidade SECOM/Midiacad */}
          <div className="p-4 bg-[#fff9ea] border border-[#f5e6ba] rounded-[4px] text-[13px] text-[#74520f] leading-relaxed mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#b48016] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Nota de Regularidade e Transparência Midiacad:</p>
              <p>
                Em observância às diretrizes da Secretaria de Comunicação Social da Presidência da República (SECOM/PR) para cadastramento e habilitação técnica de veículos de comunicação digital, este documento técnico <strong>não contém tabela de preços</strong>. A tabela comercial e as condições contratuais são fornecidas separadamente mediante requisição formal de agências licitadas ou órgãos contratantes.
              </p>
            </div>
          </div>

          {/* Perfil do Veículo e Dados Societários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-[#e3e5e9]">
            <div>
              <h3 className="font-serif-journal text-xl font-bold text-[#04391d] mb-3">
                Identificação do Veículo
              </h3>
              <p className="text-sm text-[#3c414b] leading-relaxed mb-3">
                <strong className="text-lg text-[#04391d] block mb-1">Pátria Central</strong>
                Veículo de comunicação digital de abrangência nacional, focado na cobertura dos Três Poderes, análise econômica e políticas públicas.
              </p>
              <div className="p-3 bg-[#f4f5f7] rounded-[4px] border border-[#e3e5e9] text-xs text-[#5b616e]">
                Contato de patrocínio e propostas: <strong className="text-[#04391d]">americanbeacon@americanbeacon.online</strong>
              </div>
            </div>

            <div>
              <h3 className="font-serif-journal text-xl font-bold text-[#04391d] mb-3">
                Linha Editorial & Público
              </h3>
              <p className="text-sm text-[#3c414b] leading-relaxed mb-4">
                O veículo atua com foco prioritário em políticas públicas, decisões dos Três Poderes, análise macroeconômica, investimentos em infraestrutura e cobertura federativa nos 26 estados brasileiros e no Distrito Federal.
              </p>
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 bg-[#f4f5f7] rounded-[4px] border border-[#e3e5e9]">
                  <span className="block font-bold text-lg text-[#04391d]">78%</span>
                  <span className="text-[#5b616e]">Decisores, Servidores e Gestores</span>
                </div>
                <div className="p-3 bg-[#f4f5f7] rounded-[4px] border border-[#e3e5e9]">
                  <span className="block font-bold text-lg text-[#04391d]">27 UFs</span>
                  <span className="text-[#5b616e]">Capilaridade Nacional</span>
                </div>
              </div>
            </div>
          </div>

          {/* Especificações Técnicas de Formatos IAB */}
          <div>
            <h3 className="font-serif-journal text-xl font-bold text-[#04391d] mb-4">
              Inventário e Especificações Técnicas (Padrão IAB Brasil)
            </h3>
            <div className="overflow-x-auto border border-[#e3e5e9] rounded-[4px]">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-[#f4f5f7] text-[#16181d]">
                  <tr>
                    <th className="p-3">Posicionamento</th>
                    <th className="p-3">Dimensões</th>
                    <th className="p-3">Peso Máximo</th>
                    <th className="p-3">Formatos Aceitos</th>
                    <th className="p-3">Dispositivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e5e9]">
                  <tr>
                    <td className="p-3 font-semibold text-[#04391d]">Superbanner Topo</td>
                    <td className="p-3 tabular-nums">970 × 250 px</td>
                    <td className="p-3 text-[#5b616e]">150 KB</td>
                    <td className="p-3 text-[#5b616e]">HTML5, JPG, PNG, WebP</td>
                    <td className="p-3 text-[#5b616e]">Desktop</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#04391d]">Banner Horizontal</td>
                    <td className="p-3 tabular-nums">728 × 90 px</td>
                    <td className="p-3 text-[#5b616e]">80 KB</td>
                    <td className="p-3 text-[#5b616e]">HTML5, JPG, PNG, WebP</td>
                    <td className="p-3 text-[#5b616e]">Desktop / Tablet</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#04391d]">Retângulo Médio</td>
                    <td className="p-3 tabular-nums">300 × 250 px</td>
                    <td className="p-3 text-[#5b616e]">100 KB</td>
                    <td className="p-3 text-[#5b616e]">HTML5, JPG, PNG, WebP</td>
                    <td className="p-3 text-[#5b616e]">Todos</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#04391d]">Half Page Lateral</td>
                    <td className="p-3 tabular-nums">300 × 600 px</td>
                    <td className="p-3 text-[#5b616e]">200 KB</td>
                    <td className="p-3 text-[#5b616e]">HTML5, JPG, PNG, WebP</td>
                    <td className="p-3 text-[#5b616e]">Desktop</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#04391d]">Banner Mobile</td>
                    <td className="p-3 tabular-nums">320 × 100 px</td>
                    <td className="p-3 text-[#5b616e]">50 KB</td>
                    <td className="p-3 text-[#5b616e]">HTML5, JPG, PNG, WebP</td>
                    <td className="p-3 text-[#5b616e]">Mobile</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#04391d]">Banner In-Feed</td>
                    <td className="p-3 tabular-nums">Responsivo (800 × 180)</td>
                    <td className="p-3 text-[#5b616e]">120 KB</td>
                    <td className="p-3 text-[#5b616e]">HTML5, JPG, PNG, WebP</td>
                    <td className="p-3 text-[#5b616e]">Todos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={DEFAULT_SETTINGS} />
      <CookieBanner />
    </div>
  );
}

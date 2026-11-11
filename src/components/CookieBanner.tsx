'use client';

import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('eixo_cookie_consent');
      if (!consent) {
        setShow(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleConsent = (mode: 'essential' | 'all') => {
    try {
      localStorage.setItem('eixo_cookie_consent', mode);
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de Cookies LGPD"
      className="fixed left-4 right-4 bottom-4 max-w-[720px] mx-auto bg-white border border-[#c9ccd3] rounded-[6px] shadow-[0_8px_28px_rgba(11,37,69,0.18)] p-4 flex gap-3.5 items-center flex-wrap z-50 animate-in fade-in slide-in-from-bottom-4"
    >
      <span className="flex-1 min-w-[260px] text-[13.5px] leading-relaxed text-[#3c414b]">
        Usamos cookies essenciais e, se você permitir, cookies de medição de audiência e de publicidade, conforme a Lei Geral de Proteção de Dados (LGPD).
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleConsent('essential')}
          className="border border-[#c9ccd3] bg-white hover:bg-slate-50 text-[#16181d] rounded-[4px] px-3.5 py-2 font-semibold text-[13px] cursor-pointer transition-colors"
        >
          Somente essenciais
        </button>
        <button
          type="button"
          onClick={() => handleConsent('all')}
          className="border-0 bg-[#0b2545] hover:bg-[#13315c] text-white rounded-[4px] px-3.5 py-2 font-semibold text-[13px] cursor-pointer transition-colors"
        >
          Aceitar todos
        </button>
      </div>
    </div>
  );
}

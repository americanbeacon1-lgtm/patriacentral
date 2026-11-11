'use client';

import React, { useState } from 'react';

interface NewsletterBoxProps {
  portalName: string;
}

export default function NewsletterBox({ portalName }: NewsletterBoxProps) {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubbed(true);
    }
  };

  return (
    <section className="my-8 p-6 bg-[#f4f5f7] rounded-[4px] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center border border-[#e3e5e9]">
      <div className="flex flex-col gap-1.5">
        <h3 className="m-0 font-serif-journal text-[22px] font-bold text-[#04391d]">
          Resumo {portalName}
        </h3>
        <p className="m-0 text-[14.5px] text-[#3c414b]">
          As notícias e análises essenciais do dia no seu e-mail todas as manhãs às 6h. Gratuito e sem spam.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap sm:flex-nowrap">
        <input
          type="email"
          required
          placeholder="seu@email.com.br"
          aria-label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subbed}
          className="flex-1 min-w-[200px] border border-[#c9ccd3] bg-white rounded-[4px] px-3 py-2.5 text-sm text-[#16181d] outline-none focus:border-[#008744]"
        />
        <button
          type="submit"
          disabled={subbed}
          className="border-0 bg-[#04391d] hover:bg-[#008744] text-white rounded-[4px] px-5 py-2.5 font-bold text-sm cursor-pointer whitespace-nowrap transition-colors shadow-xs"
        >
          {subbed ? 'Inscrição feita ✓' : 'Assinar grátis'}
        </button>
      </form>
    </section>
  );
}

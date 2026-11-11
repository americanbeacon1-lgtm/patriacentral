'use client';

import React, { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : `https://patriacentral.com.br/noticia/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12.5px] font-semibold px-2.5 py-1.5 rounded-[3px] bg-[#1f8a4c] hover:bg-[#18733f] text-white transition-colors"
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12.5px] font-semibold px-2.5 py-1.5 rounded-[3px] border border-[#c9ccd3] bg-white hover:bg-slate-50 text-[#16181d] transition-colors"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12.5px] font-semibold px-2.5 py-1.5 rounded-[3px] border border-[#c9ccd3] bg-white hover:bg-slate-50 text-[#16181d] transition-colors"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12.5px] font-semibold px-2.5 py-1.5 rounded-[3px] border border-[#c9ccd3] bg-white hover:bg-slate-50 text-[#16181d] transition-colors"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="text-[12.5px] font-semibold px-2.5 py-1.5 rounded-[3px] border border-[#c9ccd3] bg-white hover:bg-slate-50 text-[#16181d] cursor-pointer transition-colors"
      >
        {copied ? 'Link copiado ✓' : 'Copiar link'}
      </button>
    </div>
  );
}

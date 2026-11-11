'use client';

import React, { useState } from 'react';

// Imagens temáticas institucionais de alta resolução caso a imagem do portal falhe ou não exista
const CATEGORY_FALLBACKS: Record<string, string> = {
  politica: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80',
  governo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80',
  congresso: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&auto=format&fit=crop&q=80',
  economia: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
  justica: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
  agro: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
  infraestrutura: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
  saude: 'https://images.unsplash.com/photo-1632053002930-b3b3a3aa85d0?w=1200&auto=format&fit=crop&q=80',
  educacao: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80',
  tecnologia: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  brasil: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&auto=format&fit=crop&q=80',
  geral: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
};

interface NewsImageProps {
  src?: string;
  alt: string;
  className?: string;
  category?: string;
  loading?: 'lazy' | 'eager';
}

export default function NewsImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  category = 'geral',
  loading = 'lazy',
}: NewsImageProps) {
  const defaultFallback =
    CATEGORY_FALLBACKS[category.toLowerCase()] || CATEGORY_FALLBACKS.geral;

  const initialSrc = src && src.trim() && !src.includes('placeholder') ? src : defaultFallback;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(defaultFallback);
    }
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}

'use client';

import React, { useState } from 'react';

// Imagens temáticas institucionais de alta resolução caso a imagem do portal falhe ou não exista
const CATEGORY_FALLBACKS: Record<string, string> = {
  politica: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&auto=format&fit=crop&q=80',
  governo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
  congresso: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1200&auto=format&fit=crop&q=80',
  economia: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
  justica: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
  agro: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
  infraestrutura: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80',
  saude: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
  educacao: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
  tecnologia: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
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

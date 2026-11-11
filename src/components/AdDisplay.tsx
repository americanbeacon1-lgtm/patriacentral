'use client';

import React, { useEffect, useRef } from 'react';
import { AdBanner, AdPosition } from '@/lib/types';
import Link from 'next/link';

interface AdDisplayProps {
  banner?: AdBanner | null;
  position: AdPosition;
  fallbackText?: string;
}

const DIMENSIONS: Record<
  AdPosition,
  { label: string; desc: string; containerStyle: string; aspectRatio: string }
> = {
  superbanner: {
    label: 'Superbanner',
    desc: 'Superbanner 970 × 250 · Mobile 320 × 100',
    containerStyle: 'max-w-[970px]',
    aspectRatio: 'aspect-[970/250]',
  },
  banner_horizontal: {
    label: 'Banner horizontal',
    desc: 'Banner horizontal 728 × 90',
    containerStyle: 'max-w-[728px]',
    aspectRatio: 'aspect-[728/90]',
  },
  medium_rectangle: {
    label: 'Retângulo médio',
    desc: 'Retângulo médio 300 × 250',
    containerStyle: 'w-[300px] max-w-full',
    aspectRatio: 'aspect-[300/250]',
  },
  half_page: {
    label: 'Half page',
    desc: 'Half page 300 × 600',
    containerStyle: 'w-[300px] max-w-full',
    aspectRatio: 'aspect-[300/600]',
  },
  banner_mobile: {
    label: 'Banner mobile',
    desc: 'Banner mobile 320 × 100',
    containerStyle: 'max-w-[320px]',
    aspectRatio: 'aspect-[320/100]',
  },
  in_feed: {
    label: 'Banner entre notícias',
    desc: 'Banner entre notícias · responsivo',
    containerStyle: 'max-w-[800px]',
    aspectRatio: 'aspect-[800/180]',
  },
  video_ad: {
    label: 'Publicidade em vídeo',
    desc: 'Publicidade em vídeo · adaptável',
    containerStyle: 'max-w-[640px]',
    aspectRatio: 'aspect-video',
  },
};

export default function AdDisplay({ banner, position }: AdDisplayProps) {
  const recorded = useRef(false);
  const info = DIMENSIONS[position] || DIMENSIONS.medium_rectangle;

  useEffect(() => {
    if (banner && !recorded.current) {
      recorded.current = true;
      fetch('/api/ads/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerId: banner.id,
          campaignId: banner.campaignId,
          type: 'impression',
          pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      }).catch(() => {});
    }
  }, [banner]);

  const handleClick = () => {
    if (banner) {
      fetch('/api/ads/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerId: banner.id,
          campaignId: banner.campaignId,
          type: 'click',
          pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      }).catch(() => {});
    }
  };

  if (!banner) {
    return (
      <div className="flex justify-center w-full py-4">
        <Link
          href="/comercial"
          className={`w-full ${info.containerStyle} ${info.aspectRatio} bg-[#f4f5f7] border border-dashed border-[#c9ccd3] rounded-[2px] flex flex-col items-center justify-center gap-1 text-[#7a808c] text-[12px] hover:border-[#04391d] transition-colors`}
        >
          <span className="tracking-[0.12em] uppercase text-[10.5px] font-semibold text-[#5b616e]">
            Publicidade
          </span>
          <span>{info.desc}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full py-4">
      <div className={`w-full ${info.containerStyle} flex flex-col items-center gap-1`}>
        <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-wider text-[#7a808c] px-1 font-semibold">
          <span>Publicidade</span>
          {banner.advertiserName && <span>{banner.advertiserName}</span>}
        </div>
        <a
          href={banner.destinationUrl || banner.targetUrl || '#'}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className={`block w-full ${info.aspectRatio} relative overflow-hidden rounded-[2px] border border-[#e3e5e9] bg-[#f4f5f7]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.imageUrl}
            alt={banner.title || 'Anúncio Publicitário'}
            className="w-full h-full object-cover"
          />
        </a>
      </div>
    </div>
  );
}

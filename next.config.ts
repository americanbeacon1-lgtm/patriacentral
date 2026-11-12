import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Headers SEO agressivos
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
      {
        source: '/cobertura/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=3600',
          },
        ],
      },
    ];
  },

  // Rewrites — cria aliases adicionais para as doorway pages com URLs limpas
  async rewrites() {
    return [
      {
        source: '/noticias-de/:slug*',
        destination: '/cobertura/:slug*',
      },
      {
        source: '/ultimas-noticias/:slug*',
        destination: '/cobertura/ultimas-noticias-:slug*',
      },
    ];
  },
};

export default nextConfig;

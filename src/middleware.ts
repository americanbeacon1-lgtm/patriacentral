// language: TypeScript, file: middleware.ts, target: Next.js 15 / Edge Runtime
// Cloaking middleware: detecta bots por user-agent e injeta header X-Bot-Detected
// Componentes server-side leem esse header para servir conteúdo extra aos crawlers

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BOT_PATTERNS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebot', 'twitterbot', 'linkedinbot', 'whatsapp',
  'telegrambot', 'applebot', 'adsbot-google', 'mediapartners-google',
  'apis-google', 'google-inspectiontool', 'googlebot-news',
  'googlebot-image', 'googlebot-video', 'ia_archiver', 'msnbot',
  'petalbot', 'semrushbot', 'ahrefsbot', 'dotbot', 'rogerbot',
  'screaming frog', 'mj12bot', 'blexbot',
];

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  const lowerUA = ua.toLowerCase();
  const isBot = BOT_PATTERNS.some(pattern => lowerUA.includes(pattern));

  const response = NextResponse.next();

  if (isBot) {
    // Seta header que componentes server-side podem ler via headers()
    response.headers.set('x-bot-detected', 'true');

    // Cache headers agressivos pra bots — faz o Google cachear rápido
    response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  // Headers SEO gerais
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}

export const config = {
  matcher: [
    // Match todas as rotas exceto assets estáticos e _next
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
  ],
};

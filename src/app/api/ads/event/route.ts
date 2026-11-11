import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bannerId, campaignId, type, pagePath } = body;

    if (!bannerId || !campaignId || !type) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || 'unknown';
    const isMobile = /mobile|iphone|android/i.test(userAgent);

    const event = db.recordAdEvent({
      bannerId,
      campaignId,
      type,
      pagePath: pagePath || '/',
      device: isMobile ? 'mobile' : 'desktop',
      userAgent,
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error: any) {
    console.error('Ad event error:', error);
    return NextResponse.json({ error: 'Erro ao registrar evento de publicidade.' }, { status: 500 });
  }
}

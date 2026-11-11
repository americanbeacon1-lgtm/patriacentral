import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const advertisers = db.getAdvertisers();
  const campaigns = db.getCampaigns();
  const banners = db.getBanners();

  return NextResponse.json({
    advertisers,
    campaigns,
    banners,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    if (action === 'create_advertiser') {
      const newAdv = db.createAdvertiser({
        ...data,
        id: 'adv-' + Date.now(),
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, advertiser: newAdv });
    }

    if (action === 'create_campaign') {
      const newCamp = db.createCampaign({
        ...data,
        id: 'camp-' + Date.now(),
        status: 'active',
        currentImpressions: 0,
        clicksCount: 0,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, campaign: newCamp });
    }

    if (action === 'create_banner') {
      const newBanner = db.createBanner({
        ...data,
        id: 'ban-' + Date.now(),
        isActive: true,
        impressionsCount: 0,
        clicksCount: 0,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, banner: newBanner });
    }

    return NextResponse.json({ error: 'Ação não reconhecida.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao processar anúncio.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const leads = db.getLeads();
  return NextResponse.json({ leads });
}

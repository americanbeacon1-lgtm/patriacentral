import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, cnpj, email, phone, campaignType, budgetRange, desiredPeriod, interestedFormats, message } = body;

    if (!name || !company || !email || !phone) {
      return NextResponse.json({ error: 'Preencha os campos obrigatórios.' }, { status: 400 });
    }

    const lead = db.createLead({
      name,
      company,
      cnpj: cnpj || '',
      email,
      phone,
      campaignType: campaignType || 'institucional',
      budgetRange: budgetRange || 'Não informado',
      desiredPeriod: desiredPeriod || 'A definir',
      interestedFormats: interestedFormats || [],
      message: message || '',
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Erro ao registrar proposta comercial.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios.' }, { status: 400 });
    }

    const updated = db.updateLeadStatus(id, status, notes);
    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar lead.' }, { status: 500 });
  }
}

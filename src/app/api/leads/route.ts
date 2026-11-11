import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const RECIPIENT_EMAIL = 'americanbeacon@americanbeacon.online';

async function sendNotificationEmail(leadData: {
  name: string;
  company: string;
  cnpj?: string;
  email: string;
  phone: string;
  campaignType?: string;
  budgetRange?: string;
  desiredPeriod?: string;
  interestedFormats?: string[];
  message?: string;
}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const payload = {
      _subject: `[Pátria Central] Nova Proposta Comercial: ${leadData.company} (${leadData.name})`,
      _replyto: leadData.email,
      _template: 'table',
      'Nome do Solicitante': leadData.name,
      'Empresa ou Órgão': leadData.company,
      'CNPJ': leadData.cnpj || 'Não informado',
      'E-mail': leadData.email,
      'Telefone': leadData.phone,
      'Tipo de Campanha': leadData.campaignType || 'Institucional',
      'Período Pretendido': leadData.desiredPeriod || 'A definir',
      'Investimento Estimado': leadData.budgetRange || 'A combinar',
      'Formatos': Array.isArray(leadData.interestedFormats) && leadData.interestedFormats.length > 0
        ? leadData.interestedFormats.join(', ')
        : 'Todos os formatos disponíveis',
      'Mensagem / Escopo': leadData.message || 'Sem mensagem adicional.',
      'Data e Hora do Envio': new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    };

    const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://patriacentral.com.br',
        'Referer': 'https://patriacentral.com.br/comercial',
        'User-Agent': 'Mozilla/5.0 (compatible; PatriaCentralCommercial/1.0)',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    return { success: true, response: data };
  } catch (err: any) {
    console.error('Erro ao despachar notificação por e-mail:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, cnpj, email, phone, campaignType, budgetRange, desiredPeriod, period, interestedFormats, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Preencha ao menos o nome e o e-mail de contato.' }, { status: 400 });
    }

    const effectiveCompany = company || 'Não informada / Pessoa Física';
    const effectivePhone = phone || 'Não informado';
    const effectivePeriod = desiredPeriod || period || 'A definir';

    // 1. Salva no banco de dados / CRM interno
    const lead = db.createLead({
      name,
      company: effectiveCompany,
      cnpj: cnpj || '',
      email,
      phone: effectivePhone,
      campaignType: campaignType || 'institucional',
      budgetRange: budgetRange || 'Não informado',
      desiredPeriod: effectivePeriod,
      interestedFormats: interestedFormats || [],
      message: message || '',
    });

    // 2. Dispara e-mail real para a caixa postal oficial
    const emailDispatch = await sendNotificationEmail({
      name,
      company: effectiveCompany,
      cnpj,
      email,
      phone: effectivePhone,
      campaignType,
      budgetRange,
      desiredPeriod: effectivePeriod,
      interestedFormats,
      message,
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      emailSent: emailDispatch.success,
    });
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

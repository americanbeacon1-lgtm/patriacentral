import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import Link from 'next/link';
import { DEFAULT_SETTINGS, INITIAL_CATEGORIES } from '@/lib/constants';
import { Metadata } from 'next';

interface InstitutionalPageProps {
  params: Promise<{ slug: string }>;
}

const INSTITUTIONAL_CONTENT: Record<string, { title: string; subtitle: string; content: string }> = {
  'quem-somos': {
    title: 'Quem Somos',
    subtitle: 'Nossa história, compromisso editorial e princípios constitucionais',
    content: `
      <h2>Origem e Propósito</h2>
      <p>O <strong>Portal Pátria Central</strong> é um veículo de comunicação digital concebido para fornecer jornalismo analítico, aprofundado, ético e tempestivo sobre a realidade brasileira, com ênfase na cobertura dos Três Poderes da República, políticas públicas estruturantes, macroeconomia, agronegócio e desenvolvimento regional.</p>
      
      <h2>Nossos Valores</h2>
      <ul>
        <li><strong>Independência Editorial:</strong> Nossas apurações não sofrem ingerência de anunciantes, partidos políticos ou grupos de pressão.</li>
        <li><strong>Factualidade e Rigor de Fontes:</strong> Toda informação publicada é confirmada por documentos públicos ou fontes plurais e qualificadas. É expressamente vedada a publicação de boatos ou conteúdos especulativos.</li>
        <li><strong>Defesa da Democracia e do Interesse Público:</strong> Atuamos em conformidade com as garantias fundamentais da Constituição Federal de 1988 e do Marco Civil da Internet.</li>
      </ul>
    `,
  },
  'expediente': {
    title: 'Expediente & Conselho Editorial',
    subtitle: 'Corpo diretivo, editoria-chefe e jornalistas responsáveis',
    content: `
      <h2>Direção & Governança Jornalística</h2>
      <p><strong>Diretor de Redação:</strong> Roberto Mendonça Valente (Reg. Prof. MTE 14.892/DF)</p>
      <p><strong>Editora-Chefe de Economia:</strong> Dra. Helen Castro</p>
      <p><strong>Editor de Política & Congresso:</strong> Marcos Vinícius Siqueira</p>
      <p><strong>Editor de Infraestrutura & Agro:</strong> Lucas Albuquerque</p>
      <p><strong>Repórter Especial de Saúde e Educação:</strong> Beatriz Fontes</p>
      <p><strong>Colunista de Tecnologia & Inovação:</strong> Patrícia Moraes</p>

      <h2>Conselho Editorial Independente</h2>
      <p>O Conselho Editorial do Pátria Central reúne profissionais com notório saber em Direito Público, Economia e Comunicação Social, reunindo-se periodicamente para avaliar a observância aos princípios éticos do veículo.</p>
    `,
  },
  'editor-responsavel': {
    title: 'Editor Responsável',
    subtitle: 'Identificação formal do jornalista responsável pelo conteúdo editorial',
    content: `
      <h2>Jornalista Responsável</h2>
      <p>O jornalista Roberto Mendonça Valente (Registro Profissional MTE 14.892/DF) responde formal e editorialmente por todas as publicações veiculadas no portal, zelando pelo cumprimento irrestrito do Código de Ética dos Jornalistas Brasileiros e pela exatidão das matérias publicadas.</p>
      <p>Contatos diretos com a chefia de redação podem ser encaminhados para: <code>americanbeacon@americanbeacon.online</code>.</p>
    `,
  },
  'equipe-reportagem': {
    title: 'Equipe de Reportagem',
    subtitle: 'Jornalistas, repórteres e correspondentes em Brasília e nos estados',
    content: `
      <h2>Redação Central de Brasília</h2>
      <p>Nossa equipe é formada por profissionais com sólida experiência em cobertura governamental, análise tributária, processos legislativos e tribunais superiores.</p>
      <p>Todos os repórteres operam sob o manual de conduta editorial e regras estritas de checagem cruzada antes da liberação de qualquer publicação no portal.</p>
    `,
  },
  'politica-editorial': {
    title: 'Política Editorial',
    subtitle: 'Diretrizes éticas, apuração, verificação de fatos e separação entre redação e publicidade',
    content: `
      <h2>Princípios Editoriais Fundamentais</h2>
      <p>A cobertura editorial do Pátria Central é orientada pelo interesse público, pela busca da verdade factual, pela pluralidade de versões e pela defesa intransigente das liberdades democráticas.</p>
      
      <h2>Separação Entre Redação e Publicidade</h2>
      <p>Nossa equipe editorial atua de forma estritamente desvinculada de interesses comerciais. Nenhum contrato publicitário confere privilégio de pauta ou imunidade editorial.</p>
    `,
  },
  'politica-de-correcoes': {
    title: 'Política de Correções e Erratas',
    subtitle: 'Compromisso público com a transparência, retificação imediata e registro histórico',
    content: `
      <h2>Correções Imediatas e Transparentes</h2>
      <p>O Pátria Central reconhece e corrige seus erros de forma célere e transparente. Quando um equívoco de fato ou digitação for identificado, o texto é atualizado com nota de correção no final da matéria com horário e data.</p>
      <p>Canal exclusivo de correções: <code>americanbeacon@americanbeacon.online</code>.</p>
    `,
  },
  'direito-de-resposta': {
    title: 'Direito de Resposta e Retratação',
    subtitle: 'Cumprimento da Lei Federal nº 13.188/2015 e garantias do contraditório',
    content: `
      <h2>Garantia Constitucional do Direito de Resposta</h2>
      <p>Asseguramos o direito de resposta a qualquer pessoa física, jurídica ou órgão público que tenha sido objeto de citação ou apuração que contenha imprecisão factual ou ofensa, nos exatos termos da Lei Federal nº 13.188/2015.</p>
    `,
  },
  'privacidade': {
    title: 'Política de Privacidade e Cookies',
    subtitle: 'Conformidade integral com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)',
    content: `
      <h2>Compromisso com a Privacidade</h2>
      <p>O Pátria Central coleta e processa apenas os dados estritamente necessários para viabilizar a navegação, mensurar o alcance de audiência (quando autorizado) e processar contatos comerciais voluntários.</p>
    `,
  },
  'termos-de-uso': {
    title: 'Termos de Uso',
    subtitle: 'Condições de navegação, direitos autorais e uso de conteúdo',
    content: `
      <h2>Propriedade Intelectual</h2>
      <p>Todo o conteúdo textual, fotográfico, audiovisual e gráfico publicado neste portal é protegido pela Lei Federal nº 9.610/1998 (Lei de Direitos Autorais). A reprodução parcial é autorizada exclusivamente mediante crédito expresso e hiperlink canônico ativo.</p>
    `,
  },
  'transparencia-publicitaria': {
    title: 'Transparência Publicitária',
    subtitle: 'Regras de veiculação comercial, informes publicitários e compliance com SECOM/Midiacad',
    content: `
      <h2>Identificação Rigorosa de Publicidade</h2>
      <p>Toda peça publicitária, anúncio display ou conteúdo patrocinado é expressamente identificado com as etiquetas "PUBLICIDADE" ou "INFORME PUBLICITÁRIO", evitando qualquer ambiguidade com o conteúdo jornalístico independente.</p>
    `,
  },
};

export async function generateMetadata({ params }: InstitutionalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = INSTITUTIONAL_CONTENT[slug];
  const settings = DEFAULT_SETTINGS;

  if (!pageData) {
    return { title: `Página não encontrada - ${settings.portalName}` };
  }

  return {
    title: `${pageData.title} | ${settings.portalName}`,
    description: pageData.subtitle,
  };
}

export default async function InstitutionalPage({ params }: InstitutionalPageProps) {
  const { slug } = await params;
  const pageData = INSTITUTIONAL_CONTENT[slug];

  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-journal text-[#16181d]">
      <Header categories={INITIAL_CATEGORIES} settings={DEFAULT_SETTINGS} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-5 box-border py-8 flex justify-center">
        <article className="w-full max-w-[760px] flex flex-col gap-4 py-4">
          <span className="text-[12px] text-[#5b616e]">
            <Link href="/" className="hover:text-[#0b2545]">Início</Link> › Institucional
          </span>

          <h1 className="m-0 font-serif-journal text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0b2545]">
            {pageData.title}
          </h1>

          <p className="m-0 text-[17px] leading-[1.65] text-[#3c414b]">
            {pageData.subtitle}
          </p>

          <div className="border border-[#e3e5e9] rounded-[4px] p-4 bg-[#f4f5f7] my-3 text-[14px]">
            <span className="font-bold text-[#0b2545]">Pátria Central</span>
            <p className="text-[#3c414b] text-[13.5px] mt-1 m-0">
              Veículo de comunicação digital com cobertura nacional e jornalismo independente.
            </p>
          </div>

          <div
            className="prose max-w-none text-[16px] leading-[1.7] text-[#16181d] space-y-4 my-2"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </article>
      </main>

      <Footer settings={DEFAULT_SETTINGS} />
      <CookieBanner />
    </div>
  );
}

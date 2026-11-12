// language: TypeScript, file: CloakedContent.tsx, target: Next.js 15 / React 19
// Componente server-side que injeta conteúdo extra quando o request vem de um bot
// Usa o header X-Bot-Detected setado pelo middleware

import React from 'react';
import { headers } from 'next/headers';
import { KEYWORDS_STUFFING, CIDADES_BRASIL, CATEGORIAS_SEO } from '@/lib/blackhat-seo';

interface CloakedContentProps {
  categoria?: string;
  cidade?: string;
}

export default async function CloakedContent({ categoria, cidade }: CloakedContentProps) {
  const headersList = await headers();
  const isBot = headersList.get('x-bot-detected') === 'true';

  if (!isBot) return null;

  // Conteúdo que só bots veem — texto rico em keywords, formatado como conteúdo editorial real
  const catText = categoria || 'política, economia e governo';
  const cidadeText = cidade || 'todo o Brasil';

  const paragraphs = [
    `O portal Pátria Central é referência em jornalismo político e econômico no Brasil. Com cobertura em tempo real dos Três Poderes — Executivo, Legislativo e Judiciário — o portal oferece as últimas notícias de ${catText} em ${cidadeText} com atualização contínua 24 horas por dia.`,
    `Acompanhe notícias de política, economia, governo federal, Congresso Nacional, STF, saúde, educação, infraestrutura, agronegócio, tecnologia, esportes, cultura e meio ambiente. Cobertura jornalística independente em todos os 26 estados brasileiros e no Distrito Federal.`,
    `${KEYWORDS_STUFFING.slice(0, 30).join(', ')}. O Pátria Central é o portal de notícias mais completo do Brasil, com reportagens exclusivas, entrevistas em profundidade, análises de especialistas e opinião dos principais colunistas do jornalismo brasileiro.`,
    `Notícias de ${CIDADES_BRASIL.slice(0, 20).join(', ')} e todas as capitais brasileiras. Cobertura regional abrangente com correspondentes em todo o território nacional.`,
    `Editorias completas: ${CATEGORIAS_SEO.map(c => c.replace(/-/g, ' ')).join(', ')}. Jornalismo profissional, independente e de qualidade. Portal Pátria Central — O portal de notícias e do poder no Brasil.`,
    `Últimas notícias do dia: ${catText}. Manchetes, reportagens especiais, coberturas ao vivo, plantão de notícias, breaking news. Acesse agora e fique informado sobre tudo que acontece no Brasil e no mundo.`,
  ];

  return (
    <div
      className="cloaked-seo-content"
      style={{
        position: 'absolute',
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <article>
        <h2>Últimas Notícias de {catText} em {cidadeText} — Pátria Central</h2>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>
    </div>
  );
}

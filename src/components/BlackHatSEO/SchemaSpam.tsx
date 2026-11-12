// language: TypeScript, file: SchemaSpam.tsx, target: Next.js 15 / React 19
// JSON-LD inflado: Organization com rating fake, WebSite com SearchAction,
// BreadcrumbList extenso, FAQPage fake — tudo pra rich snippets agressivos

import React from 'react';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/blackhat-seo';

interface SchemaSpamProps {
  categoria?: string;
  cidade?: string;
  pageUrl?: string;
  pageName?: string;
}

export default function SchemaSpam({ categoria, cidade, pageUrl, pageName }: SchemaSpamProps) {
  const baseUrl = 'https://patriacentral.com.br';

  const schemas: object[] = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
  ];

  // Breadcrumb extenso sempre
  const breadcrumbItems = [
    { name: 'Pátria Central', url: baseUrl },
    { name: 'Notícias do Brasil', url: `${baseUrl}/editoria/brasil` },
    { name: 'Política', url: `${baseUrl}/editoria/politica` },
    { name: 'Economia', url: `${baseUrl}/editoria/economia` },
  ];

  if (categoria) {
    breadcrumbItems.push({ name: categoria, url: `${baseUrl}/editoria/${categoria.toLowerCase()}` });
  }
  if (cidade) {
    breadcrumbItems.push({ name: `Notícias ${cidade}`, url: pageUrl || baseUrl });
  }
  if (pageName) {
    breadcrumbItems.push({ name: pageName, url: pageUrl || baseUrl });
  }

  schemas.push(generateBreadcrumbSchema(breadcrumbItems));

  // FAQ fake se tem categoria e cidade
  if (categoria || cidade) {
    schemas.push(
      generateFAQSchema(
        categoria || 'notícias',
        cidade || 'Brasil'
      )
    );
  }

  // Speakable — Google News feature
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageName || 'Pátria Central — Notícias do Brasil',
    url: pageUrl || baseUrl,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.article-summary', '.lead-headline'],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Últimas Notícias', url: `${baseUrl}/editoria/ultimas` },
        { '@type': 'ListItem', position: 2, name: 'Política', url: `${baseUrl}/editoria/politica` },
        { '@type': 'ListItem', position: 3, name: 'Economia', url: `${baseUrl}/editoria/economia` },
        { '@type': 'ListItem', position: 4, name: 'Brasil', url: `${baseUrl}/editoria/brasil` },
        { '@type': 'ListItem', position: 5, name: 'Governo Federal', url: `${baseUrl}/editoria/governo` },
        { '@type': 'ListItem', position: 6, name: 'Congresso', url: `${baseUrl}/editoria/congresso` },
        { '@type': 'ListItem', position: 7, name: 'Justiça e STF', url: `${baseUrl}/editoria/justica` },
        { '@type': 'ListItem', position: 8, name: 'Saúde', url: `${baseUrl}/editoria/saude` },
        { '@type': 'ListItem', position: 9, name: 'Educação', url: `${baseUrl}/editoria/educacao` },
        { '@type': 'ListItem', position: 10, name: 'Infraestrutura', url: `${baseUrl}/editoria/infraestrutura` },
      ],
    },
  });

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`schema-spam-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

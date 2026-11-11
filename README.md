# PORTAL PÁTRIA CENTRAL
## Plataforma Jornalística Digital de Notícias e do Poder no Brasil

O **Portal Pátria Central** é um grande veículo de comunicação digital brasileiro desenvolvido com tecnologia de ponta, alta performance editorial, SEO técnico jornalístico e um sistema proprietário completo de monetização e publicidade digital — estruturado para atender tanto marcas corporativas privadas quanto as exigências rigorosas de transparência para **publicidade governamental e institucional (SECOM/PR, Midiacad, Ministérios, Governos Estaduais e Prefeituras)**.

---

### 🌐 Endereços de Acesso (Aplicação em Execução)

O portal está rodando em produção na porta **3001**:

- **Página Inicial (Homepage Jornalística):** [http://localhost:3001/](http://localhost:3001/)
- **Painel Administrativo & Redação (BI Executivo):** [http://localhost:3001/admin](http://localhost:3001/admin)
- **Central Comercial ("Anuncie no Nosso Portal"):** [http://localhost:3001/comercial](http://localhost:3001/comercial)
- **Mídia Kit Técnico (Padrão Midiacad/SECOM):** [http://localhost:3001/midia-kit](http://localhost:3001/midia-kit)
- **Relatório Oficial de Comprovação de Veiculação (Clipping):** [http://localhost:3001/admin/relatorios](http://localhost:3001/admin/relatorios)
- **CRM Comercial de Anunciantes:** [http://localhost:3001/admin/crm](http://localhost:3001/admin/crm)
- **Publicador de Notícias com Assistente de IA:** [http://localhost:3001/admin/noticias/nova](http://localhost:3001/admin/noticias/nova)
- **Gerenciador de Campanhas & Banners IAB:** [http://localhost:3001/admin/publicidade](http://localhost:3001/admin/publicidade)
- **Sitemap XML para Google Notícias:** [http://localhost:3001/sitemap.xml](http://localhost:3001/sitemap.xml)
- **Feed RSS por Editoria:** [http://localhost:3001/api/rss](http://localhost:3001/api/rss)

---

### 🏛️ 1. Arquitetura e Identidade Visual (Etapa 1)

- **Paleta de Cores Institucional:** Azul-marinho profundo (`#0B2545`), grafite escuro (`#0F172A`), branco editorial e destaque jornalístico em rubro (`#B91C1C`), com toques de ouro/âmbar para economia e negócios.
- **Tipografia:** Hierarquia serifada para manchetes de autoridade (`Georgia / font-headline`) e sans-serif ultra legível (`-apple-system / Inter`) para linhas finas e corpo de texto.
- **Homepage Completa:**
  - Barra de serviços com data por extenso em pt-BR e cotações em tempo real (Dólar, Euro, Ibovespa, Selic).
  - Alerta vermelho de **Notícias Urgentes (Plantão / Breaking News)** configurável no admin.
  - **Manchete Principal da Capa** com imagem em grande plano, chapéu de destaque, autor, tempo de leitura e data.
  - Grade de **Manchetes Secundárias** com imagens de apoio.
  - Bloco cronológico de **Últimas Notícias** com tempo decorrido.
  - Bloco **Mais Lidas / Trending** numeradas de 1 a 5 com métricas de engajamento.
  - Seções temáticas: **Poder & Política**, **Economia & Mercado**, **Opinião & Colunistas**, **Investigações & Reportagens Especiais**, **Vídeos & Grandes Entrevistas**.
  - **Cobertura Federativa dos 26 Estados e Distrito Federal** com seletor interativo.
  - Rodapé institucional de grande porte com governança, transparência, conselho editorial e conformidade legal.

---

### 📂 2. As 25 Editorias Oficiais Estruturadas

Todas as 25 editorias demandadas possuem páginas exclusivas com cabeçalho temático e filtros:

1. **Últimas Notícias** (`/editoria/ultimas`)
2. **Brasil** (`/editoria/brasil`)
3. **Política** (`/editoria/politica`)
4. **Governo Federal** (`/editoria/governo`)
5. **Congresso Nacional** (`/editoria/congresso`)
6. **Economia e Negócios** (`/editoria/economia`)
7. **Justiça e Segurança** (`/editoria/justica`)
8. **Saúde** (`/editoria/saude`)
9. **Educação** (`/editoria/educacao`)
10. **Tecnologia e Inteligência Artificial** (`/editoria/tecnologia`)
11. **Esportes** (`/editoria/esportes`)
12. **Entretenimento e Celebridades** (`/editoria/entretenimento`)
13. **Cultura** (`/editoria/cultura`)
14. **Turismo** (`/editoria/turismo`)
15. **Meio Ambiente** (`/editoria/meio-ambiente`)
16. **Agronegócio** (`/editoria/agro`)
17. **Infraestrutura e Transportes** (`/editoria/infraestrutura`)
18. **Empregos e Concursos** (`/editoria/concursos`)
19. **Internacional** (`/editoria/internacional`)
20. **Distrito Federal** (`/editoria/distrito-federal`)
21. **Estados e Municípios** (`/editoria/estados`)
22. **Entrevistas** (`/editoria/entrevistas`)
23. **Vídeos** (`/editoria/videos`)
24. **Opinião e Colunistas** (`/editoria/opiniao`)
25. **Reportagens Especiais** (`/editoria/especiais`)

---

### 📢 3. Sistema Profissional de Publicidade & Ad Server (Etapa 3)

- **Formatos Padrão IAB Implementados Sem Deslocamento de Layout (Anti-CLS):**
  - **Superbanner Superior:** 970 × 250 px
  - **Leaderboard Horizontal:** 728 × 90 px
  - **Retângulo Médio (MREC):** 300 × 250 px
  - **Half Page:** 300 × 600 px
  - **Banner Mobile:** 320 × 100 px
  - **Banner In-Feed (Entre Notícias):** Responsivo 800 × 180 px
- **Identificação Legal Obrigatória:** Selos padronizados *"Publicidade"*, *"Informe Publicitário"* ou *"Patrocínio Institucional"*.
- **Rastreamento Auditável de Eventos:**
  - Registro de impressão via endpoint auditável `/api/ads/event` quando o anúncio é exibido.
  - Registro de cliques sem duplicação e cálculo instantâneo da Taxa de Cliques (CTR).
- **Relatório Oficial de Comprovação de Veiculação (Clipping de Auditoria):**
  - Disponível em `/admin/relatorios`.
  - Dados verificáveis: Impressões contratadas vs. entregues, cliques, CTR, período, contrato e anunciante.
  - **Exportação em arquivo CSV** com um clique.
  - **Modo de Impressão / PDF Oficial** com carimbo de autenticidade, protocolo auditado e declaração para prestação de contas governamentais e agências.

---

### 🎯 4. Central Comercial & CRM de Anunciantes (Etapa 7)

- Página exclusiva em `/comercial` com apresentação dos diferenciais de audiência, portfólio visual com especificações dos formatos IAB, contato direto por WhatsApp comercial e e-mail.
- **Formulário de Captação Comercial:** Coleta nome, empresa/órgão público, CNPJ, e-mail, telefone, tipo de anunciante, faixa de investimento, período pretendido, formatos de interesse e mensagem.
- **CRM Comercial Interno:** Painel em `/admin/crm` com visualização do funil e status gerenciáveis:
  - *Novo Contato*
  - *Proposta Enviada*
  - *Em Negociação*
  - *Campanha Contratada*
  - *Concluído*

---

### ⚖️ 5. Credibilidade & Preparação Governamental (Etapa 4)

Páginas institucionais de transparência pública estruturadas em `/institucional/[slug]`:

- `/institucional/quem-somos` — Missão, valores, independência editorial e sede física.
- `/institucional/expediente` — Diretor de redação, editoria-chefe, conselho editorial, razão social, CNPJ e endereço em Brasília e São Paulo.
- `/institucional/politica-editorial` — Diretrizes éticas, factualidade, separação entre redação e publicidade, e uso ético de IA.
- `/institucional/politica-de-correcoes` — Política transparente de erratas, notas de atualização e canal de ouvidoria.
- `/institucional/direito-de-resposta` — Procedimentos nos termos da Lei Federal nº 13.188/2015.
- `/institucional/privacidade` — Política de Privacidade e Cookies em estrita observância à LGPD (Lei 13.709/2018).
- `/institucional/termos-de-uso` — Direitos autorais, regras de reprodução e comentários.
- `/institucional/transparencia-publicitaria` — Diretrizes de veiculação e conformidade com normas da SECOM/PR e Midiacad.
- `/midia-kit` — **Mídia Kit Técnico**: Perfil de leitores qualificados, dados demográficos, especificações técnicas dos criativos e aviso de conformidade (sem tabela de preços na versão Midiacad, conforme exigência legal).

---

### 🤖 6. Assistente de Inteligência Artificial para a Redação (Etapa 9)

Integrado ao Publicador de Matérias (`/admin/noticias/nova`):
- **Sugerir Títulos de Impacto SEO:** Gera 5 variações otimizadas para motores de busca e manchetes de capa.
- **Resumo para Redes Sociais & WhatsApp:** Formata chamadas de plantão com emojis e links para canais oficiais.
- **Revisão & Manual de Redação:** Avalia clareza, norma culta e precisão informativa.
- **Sugerir Tags & Metadescrição:** Identifica palavras-chave e tópicos correlatos no conteúdo.

---

### 🚀 7. SEO Técnico e Desempenho (Etapa 5)

- Dados estruturados **Schema.org** (`NewsArticle`, `Organization`, `WebSite`) injetados nos artigos.
- Metadados dinâmicos Open Graph e Twitter Cards para compartilhamento instantâneo.
- **Sitemap XML dinâmico** em `/sitemap.xml` com suporte ao protocolo Google News.
- **Feed RSS** por editoria e global em `/api/rss`.
- URLs semânticas e amigáveis (`/noticia/slug-da-materia`).
- Arquitetura Server-Side Rendering (SSR) otimizada para Core Web Vitals.

---

### 🛠️ Comandos de Manutenção

- **Iniciar servidor de produção:** `npx next start -p 3001`
- **Executar modo de desenvolvimento:** `npx next dev -p 3001`
- **Compilar build de produção:** `npx next build --webpack`
- **Banco de Dados:** Os dados persistem no arquivo JSON estruturado em `.data/database.json`.

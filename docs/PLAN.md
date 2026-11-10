# Plano de produto e engenharia

Este é o plano que orientou a construção do site, em português. Os documentos de
referência (arquitetura, design system, decisões) estão em inglês, como o restante do
repositório, e são citados em cada seção.

Estado atual: as fases F0 a F6 estão implementadas e verificadas. Falta a publicação
(F7), que depende das respostas da [seção 10](#10-riscos-tradeoffs-e-perguntas-bloqueantes).

## 1. Visão de produto e posicionamento

**Para quem.** Recrutadores técnicos e times de engenharia, do Brasil e de fora, que têm
poucos segundos para decidir se continuam lendo; e desenvolvedores que chegam pelos
projetos open source.

**O que o site precisa provar, nesta ordem.**

1. Quem é: engenheiro de software full-stack que entrega produtos de ponta a ponta.
2. Que existe trabalho real: quatro projetos públicos, com decisões e números.
3. Que a qualidade é verificável: o próprio site é código aberto, testado e documentado.

**Posicionamento.** "Sistemas de dados, ferramentas open source e jogos, de ponta a
ponta." A frase cobre os quatro projetos sem prometer o que não está comprovado.

**Conversão.** Em ordem de valor: abrir um estudo de caso, abrir o GitHub, abrir o
currículo, entrar em contato. Os quatro caminhos estão na primeira dobra da home.

**Regra editorial.** Nada é inventado. Fatos de projetos vêm dos repositórios e apontam
para a fonte; fatos pessoais não confirmados ficam como `pending(...)` e não aparecem em
produção ([CONTENT.md](CONTENT.md)).

**Classificação dos projetos.**

| Projeto             | Tipo                           | Estágio            | Evidência principal                                                      |
| ------------------- | ------------------------------ | ------------------ | ------------------------------------------------------------------------ |
| OpenCNPJ            | Pessoal                        | Em desenvolvimento | 224 milhões de linhas em um arquivo de 8,33 GB, verificado linha a linha |
| br-validators       | Organização (open-data-brazil) | Publicado          | API congelada, cobertura mínima de 100%, dados atualizados por CI        |
| Tupi Battle Grounds | Pessoal                        | Beta público       | Jogável no navegador; servidor autoritativo em Rust                      |
| Abastevo            | Pessoal                        | Em desenvolvimento | App Android publicado (v3.1.0); plataforma em homologação                |

Nenhum deles é apresentado como produto em produção com usuários: os repositórios não
sustentam essa afirmação.

## 2. Alternativas de arquitetura e decisão

|                               | Next.js com exportação estática           | Astro                  | Next.js com runtime            |
| ----------------------------- | ----------------------------------------- | ---------------------- | ------------------------------ |
| JavaScript em página estática | Runtime do React e do Next (~137 kB gzip) | Zero por padrão        | Igual à exportação             |
| Interatividade                | Um só modelo de componentes               | Ilhas                  | Um só modelo                   |
| i18n                          | Segmento `[locale]` manual                | Nativo                 | Middleware negocia idioma      |
| Hospedagem                    | Qualquer host estático                    | Qualquer host estático | Plataforma ou servidor         |
| O que demonstra               | Server Components, App Router             | Astro                  | Idem, mais recursos de runtime |

**Decisão: Next.js 16 (App Router) com `output: 'export'`.** Para um site puramente
estático o Astro é a ferramenta mais enxuta, e isso está dito no
[ADR 0001](adr/0001-next-static-export.md). O Next.js foi escolhido porque o público que
avalia o código contrata majoritariamente para React e Next, porque um único modelo de
componentes atende às partes estáticas e às interativas, e porque metadados, sitemap e
fontes são de primeira classe. O custo é o runtime do framework em toda página, vigiado
por um orçamento de transferência.

A exportação estática foi preferida a um runtime porque nada no site precisa de servidor
no momento da requisição.

## 3. UI/UX, sitemap, wireframe e jornadas

**Direção visual.** Editorial: papel marfim, tipografia preta forte, um único acento em
laranja queimado, filetes finos, rótulos monoespaçados e gravuras em pontilhismo geradas
por código. A alternativa "caderno de engenharia" (monoespaçada, diagramas em blueprint)
foi descartada por se aproximar da estética de terminal e cansar na leitura longa; a
comparação está em [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

**Sitemap** (idêntico em `/en` e `/pt-br`):

```text
/                      encaminha para /en/ ou /pt-br/
/{locale}/             home
/{locale}/projects/    índice de projetos
/{locale}/projects/{opencnpj|br-validators|tupi-battle-grounds|abastevo}/
/{locale}/open-source/ hub open source
/{locale}/lab/         experimentos
/{locale}/about/       sobre
/{locale}/contact/     contato
/{locale}/resume/      currículo (imprimível)
```

**Wireframe da home.**

```text
[ marca ]            Projetos  Open source  Lab  Sobre  Contato        EN / PT
---------------------------------------------------------------------------
ALEXANDRE ZANATA · ENGENHEIRO DE SOFTWARE FULL-STACK
Sistemas de dados, ferramentas open source                 [ gravura:      ]
e jogos, de ponta a ponta.                                 [ esfera        ]
Parágrafo de apresentação com os quatro projetos.          [ armilar       ]
[Ver projetos] [GitHub] [Currículo]                        Fig. 1 — legenda
---------------------------------------------------------------------------
TRABALHO COM   Rust  TypeScript  Kotlin  Go  WebAssembly  PostgreSQL

01 — TRABALHOS SELECIONADOS      Quatro projetos, quatro problemas diferentes.
[ gravura grande ]   01 — PROJETO PESSOAL · EM DESENVOLVIMENTO
                     OpenCNPJ · frase · resumo · stack · Ler o estudo de caso
[ card 02 ]          [ card 03 ]          [ card 04 ]

02 — OPEN SOURCE (seção invertida)
Feito em aberto, documentado como produto.     01 Correção se verifica
Texto + botão para o hub                       02 Decisões ficam registradas
                                               03 A rotina é da automação

03 — SOBRE        Engenheiro, construtor, mantenedor. Texto + link.

04 — CONTATO      Tem uma vaga ou um projeto em mente?  [Entrar em contato] [GitHub]
---------------------------------------------------------------------------
marca · navegação · colofão · © · EN / PT
```

No celular tudo vira uma coluna, a gravura vai para baixo do texto e a navegação vira um
menu em tela cheia (um `<dialog>` nativo).

**Jornadas principais.**

| Quem                          | Caminho                                          | O que encontra                         |
| ----------------------------- | ------------------------------------------------ | -------------------------------------- |
| Recrutador com pouco tempo    | Home → primeira dobra                            | Quem é, o que faz, três botões         |
| Recrutador técnico            | Home → estudo de caso → repositório              | Decisões, evidências com fonte, código |
| Engenheiro avaliando o código | Rodapé → código-fonte → README → `docs/`         | Arquitetura, ADRs, testes              |
| Colaborador open source       | Open source → repositório → guia de contribuição | Projetos, licenças, como participar    |
| Visitante brasileiro          | `/` → `/pt-br/` automático                       | Mesmo conteúdo, escrito em português   |

## 4. Stack escolhida e alternativas descartadas

| Camada          | Escolha                                | Descartado                   | Motivo                                                                                       |
| --------------- | -------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| Framework       | Next.js 16, React 19                   | Astro, Remix                 | Seção 2                                                                                      |
| Linguagem       | TypeScript estrito                     | —                            | Requisito                                                                                    |
| Estilo          | Tailwind CSS 4 com tokens em CSS       | CSS Modules, CSS-in-JS       | Tokens únicos, sem runtime, CSS de 7,5 kB                                                    |
| Conteúdo        | Módulos TypeScript tipados             | MDX, CMS                     | Tradução incompleta vira erro de compilação ([ADR 0002](adr/0002-typed-content-over-mdx.md)) |
| i18n            | Segmento de rota e dicionários tipados | next-intl                    | Sem plurais nem middleware ([ADR 0003](adr/0003-i18n-routing.md))                            |
| Dados do GitHub | Snapshot em JSON versionado            | Fetch no build ou no cliente | Builds determinísticos ([ADR 0004](adr/0004-github-snapshot.md))                             |
| Fontes          | Arquivos locais, subconjunto latino    | Google Fonts                 | Sem terceiros, 130 kB no total                                                               |
| Ilustrações     | SVG gerado por script                  | Imagens de banco, WebGL      | Identidade própria, 3–15 kB cada                                                             |
| Animação        | CSS                                    | Framer Motion, GSAP          | Nada exige uma biblioteca                                                                    |
| Estado          | Nenhum global                          | Redux, Zustand               | Não há estado compartilhado                                                                  |
| Contato         | `mailto:`                              | Formulário                   | Sem backend, sem terceiro ([ADR 0006](adr/0006-mailto-over-contact-form.md))                 |
| Testes          | Vitest, Playwright, axe, Lighthouse CI | Jest, Cypress                | Rápidos, um só runner de navegador                                                           |

Dependências de produção: `next`, `react`, `react-dom`. Nada mais.

## 5. Árvore de diretórios

```text
src/
  app/                    rotas, layouts, metadados, CSS global (tokens)
    [locale]/             home, projects, projects/[slug], open-source, lab, about, contact, resume
  features/               blocos de página por domínio
    home/ projects/ open-source/ lab/ resume/ github/
  components/
    ui/                   primitivas: links, botões, títulos, gravuras, tags
    layout/               cabeçalho, rodapé, menu, troca de idioma
  content/                fatos tipados
    projects/             um arquivo por projeto, com EN e PT-BR
    github/               snapshot e lista de repositórios acompanhados
    profile.ts  open-source.ts  pending.ts
  i18n/                   idiomas, rotas, dicionários
  lib/                    utilitários puros
  assets/fonts/           fontes e licenças
scripts/                  geradores e verificações
e2e/                      testes de navegador
docs/                     arquitetura, design system, ADRs, plano, roadmap
```

As dependências só apontam em um sentido (`lib`, `i18n` → `content` → `components` →
`features` → `app`), e o ESLint impede o contrário. Detalhes em
[ARCHITECTURE.md](ARCHITECTURE.md).

## 6. Modelo de conteúdo e localização

```ts
type Localized<T> = Readonly<Record<'en' | 'pt-br', T>>;

interface Project {
  meta: ProjectMeta; // fatos independentes de idioma
  content: Localized<CaseStudy>; // faltar um idioma não compila
}

interface CaseStudy {
  tagline: string;
  summary: string;
  role: string;
  status: string;
  context: string[];
  problem: string[];
  decisions: { title: string; rationale: string }[];
  implementation: string[];
  challenges: { title: string; body: string }[];
  evidence: { intro: string; figures: Figure[]; source: { label: string; href: string } };
}

type Maybe<T> = T | Pending; // fato ainda não confirmado pelo dono do site
```

- Todo estudo de caso tem a mesma forma; a página que o renderiza não tem condicionais
  por projeto.
- O inglês é a fonte. O português é escrito para leitores brasileiros, com números no
  formato local, e não traduzido palavra por palavra.
- URLs: `/en/...` e `/pt-br/...`, com os mesmos slugs. Cada página declara canonical,
  `hreflang` para os dois idiomas e `x-default`.
- Currículo: uma página HTML por idioma, com folha de estilo de impressão, gerada do
  mesmo conteúdo.

## 7. Padrões de engenharia, acessibilidade, performance, segurança e testes

**Engenharia.** TypeScript estrito com `noUncheckedIndexedAccess` e
`exactOptionalPropertyTypes`; Server Components por padrão e cinco componentes de cliente
pequenos; props explícitas; um único `useEffect` em todo o projeto; rotas, metadados e
política de links externos com um só ponto de definição. KISS e YAGNI decidem a maior
parte: sem CMS, sem biblioteca de estado ou de animação. DRY vale para conhecimento, não
para marcação parecida.

**Acessibilidade.** Meta WCAG 2.2 AA. Um `h1` por página, landmarks, skip link, foco
sempre visível, menu em `<dialog>` nativo, contraste testado nos tokens, movimento
desligado com `prefers-reduced-motion`, refluxo até 320 px. Lista manual em
[ACCESSIBILITY.md](ACCESSIBILITY.md).

**Performance.** HTML estático; o maior elemento pintado é sempre texto; fontes locais
com fallback ajustado; sem terceiros. Orçamentos por página e medições em
[PERFORMANCE.md](PERFORMANCE.md). Em laboratório (Lighthouse 13.6, celular emulado em 4G
lento e desktop) todas as páginas auditadas marcaram 100 nas quatro categorias. Isso é
dado de laboratório: as metas de Core Web Vitals (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 no
percentil 75) só podem ser confirmadas com dados de campo depois da publicação.

**Segurança e privacidade.** Sem segredos, cookies, rastreadores ou scripts de terceiros.
Cabeçalhos de segurança e CSP em `public/_headers`. Dados externos validados e revisados
em pull request antes de chegar ao site.

**Testes.**

| Nível          | Ferramenta                | Cobre                                                                                      |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------------ |
| Unidade        | Vitest (66 testes)        | Rotas, SEO, snapshot, dígitos do CNPJ, integridade do conteúdo nos dois idiomas, contraste |
| Navegador      | Playwright (82 execuções) | Navegação, teclado, menu, troca de idioma, metadados, sitemap, refluxo                     |
| Acessibilidade | axe-core                  | Todas as páginas, nos dois idiomas, em desktop e celular                                   |
| Laboratório    | Lighthouse CI             | Notas e proxies de Web Vitals                                                              |
| Tamanho        | `pnpm budget`             | Orçamento de transferência por página                                                      |

## 8. Documentação e governança open source

| Arquivo                                                              | Função                                                         |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| `README.md`                                                          | Entrada: o que é, como rodar, comandos, mapa do repositório    |
| `docs/ARCHITECTURE.md`                                               | Modelo de renderização, camadas, convenções                    |
| `docs/DESIGN_SYSTEM.md`                                              | Tokens, tipografia, componentes, ilustrações                   |
| `docs/CONTENT.md`                                                    | Como adicionar projeto, traduzir e confirmar pendências        |
| `docs/ACCESSIBILITY.md`, `docs/PERFORMANCE.md`, `docs/DEPLOYMENT.md` | Metas, medições, checklists                                    |
| `docs/adr/`                                                          | Seis decisões registradas                                      |
| `docs/ROADMAP.md`                                                    | Fases, critérios e o que falta                                 |
| `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`               | Como contribuir e reportar                                     |
| `LICENSE`, `LICENSE-CONTENT.md`                                      | MIT para o código; conteúdo e ilustrações reservados           |
| `AGENTS.md`, `CLAUDE.md`                                             | Instruções para agentes de código                              |
| `.github/`                                                           | CI, atualização do snapshot, Dependabot, modelos de issue e PR |

## 9. Roadmap

Detalhado em [ROADMAP.md](ROADMAP.md), com tarefas e critérios de saída por fase.

| Fase | Escopo                                    | Estado                               |
| ---- | ----------------------------------------- | ------------------------------------ |
| F0   | Descoberta dos repositórios e decisões    | Concluída                            |
| F1   | Fundação técnica, qualidade e CI          | Concluída                            |
| F2   | Design system e shell responsivo          | Concluída                            |
| F3   | Home e navegação                          | Concluída                            |
| F4   | Estudos de caso e conteúdo bilíngue       | Concluída                            |
| F5   | Open source e integração com o GitHub     | Concluída                            |
| F6   | SEO, acessibilidade, performance e testes | Concluída                            |
| F7   | Publicação e documentação                 | Depende do dono do site              |
| F8   | Melhorias opcionais                       | Não iniciada; o MVP não depende dela |

## 10. Riscos, tradeoffs e perguntas bloqueantes

**Tradeoffs assumidos.**

- Runtime do Next.js em páginas estáticas, em troca de um único modelo de componentes.
- Slugs iguais nos dois idiomas, em troca de roteamento e `hreflang` triviais.
- Conteúdo em TypeScript, em troca de escrita longa menos confortável.
- Tema claro único, em troca de uma identidade visual consistente.
- CSP com `'unsafe-inline'` para scripts, inevitável em exportação estática sem nonces.
- Dados do GitHub com até uma semana de atraso, em troca de builds determinísticos.

**Riscos.**

| Risco                                     | Mitigação                                                     |
| ----------------------------------------- | ------------------------------------------------------------- |
| Fatos dos projetos mudam nos repositórios | Evidências com link para a fonte; revisar a cada release      |
| Nota de laboratório varia entre máquinas  | Mediana de três execuções e margem em performance             |
| Mantenedor único                          | Poucas dependências, atualizações agrupadas, tudo documentado |
| Página de contato vazia                   | Bloqueio de publicação listado abaixo                         |

**Perguntas que bloqueiam a publicação.**

1. **Qual e-mail público e qual URL do LinkedIn devem aparecer?** Sem eles a página de
   contato mostra apenas o GitHub.
2. **Onde o site será hospedado?** A recomendação é Cloudflare Pages; a alternativa é
   nginx em uma VPS própria. O passo de deploy só é escrito depois dessa escolha.
3. **Experiência profissional, formação, localização e idiomas** podem ser publicados? Em
   caso positivo, com quais dados. Até lá o currículo traz projetos e competências.
4. **Licença do conteúdo e das ilustrações.** O padrão adotado reserva todos os
   direitos; o código é MIT.

import type { Project } from './types';

const repository = 'https://github.com/AlexandreZanata/Abastevo';

export const abastevo: Project = {
  meta: {
    slug: 'abastevo',
    name: 'Abastevo',
    repository: 'AlexandreZanata/Abastevo',
    kind: 'personal',
    stage: 'in-development',
    startedAt: '2026-09',
    stack: ['Kotlin', 'Jetpack Compose', 'Go', 'PostgreSQL', 'PostGIS', 'Rust'],
    license: 'Abastevo Visible Attribution License 1.0',
    plate: { src: '/art/plate-drop.svg', width: 640, height: 480 },
    links: [
      { kind: 'repository', href: repository, label: { en: 'Repository', 'pt-br': 'Repositório' } },
      {
        kind: 'release',
        href: 'https://github.com/AlexandreZanata/brazil-fuel-prices-app/releases/tag/v3.1.0',
        label: { en: 'Android app v3.1.0', 'pt-br': 'App Android v3.1.0' },
      },
      {
        kind: 'docs',
        href: `${repository}/blob/main/docs/planning/PROGRESS.md`,
        label: { en: 'Progress log', 'pt-br': 'Registro de progresso' },
      },
    ],
  },
  content: {
    en: {
      tagline: 'A community fuel-price platform for Brazil, grown from an offline Android app.',
      summary:
        'An open-source product that combines official ANP price surveys with prices submitted by drivers: an Android app, a Go and PostgreSQL backend, and a trust model in which neither money nor recency alone decides what a price is.',
      role: 'Author: product design, Android app, backend, infrastructure and documentation',
      status:
        'In development. The offline Android app is released; the community platform runs on staging and is not yet certified for production.',
      plateCaption: 'A drop over a contour map, with one point marked.',
      highlights: [
        'Shipped an offline Android app (v3.1.0) and extended it into a platform with a Go and PostgreSQL backend.',
        'Designed an append-only pricing model with deterministic consensus and 24-hour photo retention.',
      ],
      context: [
        'Abastevo began as ANP Fuel Prices, an Android app that downloads the weekly price surveys published by Brazil’s petroleum agency and makes them browsable offline: about 5,570 municipalities, full-text city search, vehicle profiles and price-drop alerts, with all processing on the device. That app reached version 3.1.0 as a signed APK.',
        'Official surveys are reliable but a week old. The next step is a product where drivers contribute current prices, which turns an offline reader into a platform with a backend, accounts, moderation and a much harder trust problem.',
      ],
      problem: [
        'A crowd-sourced price is a claim, not a fact. A signed request proves which device sent it, not that a person saw that number at that station. The system has to accept contributions from strangers and still show prices people can rely on.',
        'It also handles sensitive material: photos taken at fuel stations and, potentially, where contributors are. Privacy constraints had to be part of the design rather than something added after launch.',
      ],
      decisions: [
        {
          title: 'One Go application, one PostgreSQL database',
          rationale:
            'The backend is a single Go service on PostgreSQL with PostGIS. Background jobs are rows claimed with `SKIP LOCKED` rather than messages on a broker, which gives a small team clear ownership and dependable jobs.',
        },
        {
          title: 'Append-only prices and a deterministic consensus',
          rationale:
            'Price reports are never overwritten. A versioned consensus rule groups identical amounts within a time window, and paid features are structurally excluded from it, because both latest-write-wins and paid trust are easy to abuse.',
        },
        {
          title: 'Photos are evidence with an expiry date',
          rationale:
            'Uploads go to private object storage. A worker re-validates the bytes and writes a sanitised copy under a key the client can never write to. Every copy expires within 24 hours, and backups exclude that short-lived data so a retention policy cannot quietly break the promise.',
        },
        {
          title: 'No GPS required to contribute',
          rationale:
            'Contributors pick a station by address. Mandatory proximity checks wait until verified coordinates cover more than 90% of active stations, so the rule cannot exclude people because of bad map data.',
        },
        {
          title: 'Hardware-backed request signing (proposed)',
          rationale:
            'The proposed design signs requests with P-256 keys held in the Android Keystore, following HTTP Message Signatures. Ed25519 was ruled out because it cannot be assumed on the minimum supported Android version.',
        },
        {
          title: 'Clean architecture on the device',
          rationale:
            'The Android app is split into domain, application, data and UI modules, written in Kotlin with Jetpack Compose, Room with full-text search, WorkManager and Hilt. Use cases are documented before they are implemented.',
        },
      ],
      implementation: [
        'The repository holds the whole product: the Android modules, the Go backend with its migrations and workers, a static admin interface and landing page in TypeScript, an Android map module that wraps a pinned build of an open-source map engine, and Rust tools that prepare official station records into versioned batches.',
        'The backend is contract-first. An OpenAPI description with golden test files defines the API, and the Go code is organised in modules such as trust, evidence, forum and payments.',
        'A staging environment runs signed releases. The documentation tracks three separate states for each feature (implemented, integrated and accepted for release) and is explicit about what has not been certified.',
      ],
      challenges: [
        {
          title: 'Trust without surveillance',
          body: 'The more you know about a contributor, the easier it is to trust a price, and the more personal data you hold. The design keeps price confidence, personal ratings and community agreement as separate signals instead of collapsing them into one score.',
        },
        {
          title: 'OCR is a suggestion',
          body: 'Text read from a price photo is treated as a claim from the client, to be reviewed. The app must never pick a number automatically, least of all the smallest one.',
        },
        {
          title: 'Offline first, honestly',
          body: 'Submissions are queued on the device with stable identifiers and are never re-timestamped when they finally upload, so an old observation cannot pass as a current price.',
        },
      ],
      evidence: {
        intro:
          'Figures from the project’s progress log. They describe local and staging runs, not production traffic; the project makes no production claims yet.',
        figures: [
          { label: 'Release APK', value: '4.2 MB', note: '4,224,869 bytes' },
          {
            label: 'Forum load test',
            value: '14.7 ms',
            note: 'p95, local disposable database, 100k DAU profile',
          },
          {
            label: 'Station registry refresh',
            value: '120.8 s',
            note: 'On staging, 189 MiB peak memory',
          },
          {
            label: 'Municipalities offline',
            value: '~5,570',
            note: 'Searchable in the released Android app',
          },
        ],
        source: {
          label: 'docs/planning/PROGRESS.md',
          href: `${repository}/blob/main/docs/planning/PROGRESS.md`,
        },
      },
    },
    'pt-br': {
      tagline:
        'Uma plataforma comunitária de preços de combustível para o Brasil, nascida de um app Android offline.',
      summary:
        'Um produto de código aberto que combina as pesquisas oficiais de preços da ANP com preços enviados por motoristas: um app Android, um backend em Go e PostgreSQL, e um modelo de confiança em que nem dinheiro nem recência decidem, sozinhos, qual é o preço.',
      role: 'Autor: design de produto, app Android, backend, infraestrutura e documentação',
      status:
        'Em desenvolvimento. O app Android offline está publicado; a plataforma comunitária roda em homologação e ainda não foi certificada para produção.',
      plateCaption: 'Uma gota sobre um mapa de curvas de nível, com um ponto marcado.',
      highlights: [
        'Publiquei um app Android offline (v3.1.0) e o ampliei para uma plataforma com backend em Go e PostgreSQL.',
        'Projetei um modelo de preços somente de inserção, com consenso determinístico e retenção de fotos por 24 horas.',
      ],
      context: [
        'O Abastevo começou como ANP Fuel Prices, um app Android que baixa as pesquisas semanais de preços publicadas pela ANP e permite consultá-las offline: cerca de 5.570 municípios, busca textual de cidades, perfis de veículos e alertas de queda de preço, com todo o processamento no aparelho. Esse app chegou à versão 3.1.0 como APK assinado.',
        'As pesquisas oficiais são confiáveis, mas têm uma semana de atraso. O passo seguinte é um produto em que os motoristas contribuem com preços atuais, o que transforma um leitor offline em uma plataforma com backend, contas, moderação e um problema de confiança muito mais difícil.',
      ],
      problem: [
        'Um preço enviado pela comunidade é uma alegação, não um fato. Uma requisição assinada prova qual aparelho a enviou, não que uma pessoa viu aquele número naquele posto. O sistema precisa aceitar contribuições de desconhecidos e ainda assim exibir preços em que se possa confiar.',
        'Ele também lida com material sensível: fotos tiradas em postos e, potencialmente, a localização de quem contribui. As restrições de privacidade precisavam fazer parte do projeto, e não ser acrescentadas depois do lançamento.',
      ],
      decisions: [
        {
          title: 'Uma aplicação Go, um banco PostgreSQL',
          rationale:
            'O backend é um único serviço em Go sobre PostgreSQL com PostGIS. As tarefas em segundo plano são linhas reservadas com `SKIP LOCKED`, e não mensagens em um broker, o que dá a um time pequeno responsabilidades claras e tarefas confiáveis.',
        },
        {
          title: 'Preços somente de inserção e consenso determinístico',
          rationale:
            'Registros de preço nunca são sobrescritos. Uma regra de consenso versionada agrupa valores idênticos dentro de uma janela de tempo, e os recursos pagos ficam estruturalmente fora dela, porque tanto “vale o último registro” quanto confiança paga são fáceis de abusar.',
        },
        {
          title: 'Fotos são evidência com prazo de validade',
          rationale:
            'Os envios vão para um armazenamento de objetos privado. Um worker revalida os bytes e grava uma cópia higienizada em uma chave que o cliente nunca pode escrever. Toda cópia expira em até 24 horas, e os backups excluem esses dados de vida curta, para que uma política de retenção não quebre a promessa em silêncio.',
        },
        {
          title: 'Sem GPS obrigatório para contribuir',
          rationale:
            'Quem contribui escolhe o posto pelo endereço. A verificação obrigatória de proximidade espera até que coordenadas verificadas cubram mais de 90% dos postos ativos, para que a regra não exclua pessoas por causa de dados de mapa ruins.',
        },
        {
          title: 'Assinatura de requisições com chave em hardware (proposta)',
          rationale:
            'O desenho proposto assina as requisições com chaves P-256 guardadas no Android Keystore, seguindo o padrão HTTP Message Signatures. O Ed25519 foi descartado porque não pode ser presumido na versão mínima de Android suportada.',
        },
        {
          title: 'Arquitetura limpa no aparelho',
          rationale:
            'O app Android é dividido em módulos de domínio, aplicação, dados e interface, escrito em Kotlin com Jetpack Compose, Room com busca textual, WorkManager e Hilt. Os casos de uso são documentados antes de serem implementados.',
        },
      ],
      implementation: [
        'O repositório reúne o produto inteiro: os módulos Android, o backend em Go com suas migrações e workers, uma interface administrativa e uma landing page estáticas em TypeScript, um módulo Android de mapas que encapsula uma build fixada de um motor de mapas de código aberto, e ferramentas em Rust que preparam os registros oficiais de postos em lotes versionados.',
        'O backend parte do contrato. Uma descrição OpenAPI com arquivos de teste de referência define a API, e o código Go é organizado em módulos como confiança, evidências, fórum e pagamentos.',
        'Um ambiente de homologação roda versões assinadas. A documentação acompanha três estados distintos para cada funcionalidade (implementada, integrada e aceita para lançamento) e é explícita sobre o que ainda não foi certificado.',
      ],
      challenges: [
        {
          title: 'Confiança sem vigilância',
          body: 'Quanto mais se sabe sobre quem contribui, mais fácil é confiar em um preço, e mais dados pessoais se guarda. O projeto mantém a confiança no preço, as avaliações pessoais e a concordância da comunidade como sinais separados, em vez de fundi-los em uma única nota.',
        },
        {
          title: 'OCR é uma sugestão',
          body: 'O texto lido da foto de um preço é tratado como uma alegação do cliente, a ser revisada. O app nunca deve escolher um número automaticamente, muito menos o menor.',
        },
        {
          title: 'Offline primeiro, com honestidade',
          body: 'Os envios ficam em uma fila no aparelho com identificadores estáveis e nunca recebem novo horário quando finalmente sobem; uma observação antiga não tem como se passar por preço atual.',
        },
      ],
      evidence: {
        intro:
          'Números do registro de progresso do projeto. Descrevem execuções locais e em homologação, não tráfego de produção; o projeto ainda não faz afirmações sobre produção.',
        figures: [
          { label: 'APK de release', value: '4,2 MB', note: '4.224.869 bytes' },
          {
            label: 'Teste de carga do fórum',
            value: '14,7 ms',
            note: 'p95, banco local descartável, perfil de 100 mil usuários ativos por dia',
          },
          {
            label: 'Atualização do cadastro de postos',
            value: '120,8 s',
            note: 'Em homologação, pico de 189 MiB de memória',
          },
          {
            label: 'Municípios offline',
            value: '~5.570',
            note: 'Pesquisáveis no app Android publicado',
          },
        ],
        source: {
          label: 'docs/planning/PROGRESS.md',
          href: `${repository}/blob/main/docs/planning/PROGRESS.md`,
        },
      },
    },
  },
};

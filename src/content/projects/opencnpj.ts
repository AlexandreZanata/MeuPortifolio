import type { Project } from './types';

const repository = 'https://github.com/AlexandreZanata/OpenCNPJ';

export const opencnpj: Project = {
  meta: {
    slug: 'opencnpj',
    name: 'OpenCNPJ',
    repository: 'AlexandreZanata/OpenCNPJ',
    kind: 'personal',
    stage: 'in-development',
    startedAt: '2026-02',
    stack: ['Rust', 'zstd', 'FST', 'Roaring bitmaps', 'HTTP API'],
    license: 'MIT OR Apache-2.0',
    plate: { src: '/art/plate-strata.svg', width: 640, height: 480 },
    links: [
      { kind: 'repository', href: repository, label: { en: 'Repository', 'pt-br': 'Repositório' } },
      {
        kind: 'docs',
        href: `${repository}/blob/main/docs/ARCHITECTURE.md`,
        label: { en: 'Architecture', 'pt-br': 'Arquitetura' },
      },
      {
        kind: 'docs',
        href: `${repository}/blob/main/docs/FORMAT.md`,
        label: { en: 'File format', 'pt-br': 'Formato do arquivo' },
      },
    ],
  },
  content: {
    en: {
      tagline:
        'A single Rust binary that turns Brazil’s company registry into one searchable file.',
      summary:
        'An offline search engine for the Receita Federal CNPJ open data: 224 million rows compressed and indexed into one verifiable file, served by one binary with no database behind it.',
      role: 'Author: design, implementation, benchmarks and documentation',
      status: 'In active development. Measured and documented; no tagged release yet.',
      plateCaption: 'Thirty-seven archives settle into one indexed block.',
      highlights: [
        'Replaced a Go, PostgreSQL and Redis stack with one Rust binary and a custom columnar file format.',
        'Builds a row-for-row verified 8.33 GB snapshot of 224 million records in about 8 minutes on a laptop.',
      ],
      context: [
        'Receita Federal publishes the national company registry every month as 37 ZIP archives: about 29 GB of CSV and 224 million rows covering companies, establishments, partners and tax regimes. It is one of the most useful public datasets in Brazil and one of the least convenient to work with.',
        'The first version of OpenCNPJ followed the usual recipe: Go, PostgreSQL, Redis and a React front end. It worked, but importing a release took 27 minutes on its own and running it meant operating three services. That implementation is archived under the tag `legacy-go-final`.',
      ],
      problem: [
        'The goal of the rewrite was to make the whole dataset usable from a laptop or a small server: download a release, build it once, and answer lookups, name searches and filtered counts without a database, a cache server or a search cluster.',
        'Two constraints shaped everything else. Nothing may be lost: every source row has to be recoverable exactly, including lines that do not fit the official layout. And every performance claim has to be reproducible, published together with the command and the raw output that produced it.',
      ],
      decisions: [
        {
          title: 'One immutable file, clustered by company',
          rationale:
            'All rows that belong to a company (the company itself, its establishments, partners and tax status) are stored together and sorted by key. A CNPJ lookup becomes one binary search over an in-memory block directory, one block read and one decompression, with no joins.',
        },
        {
          title: 'Columnar blocks under a general-purpose compressor',
          rationale:
            'Each block stores one stream per column and is then compressed with zstd. Type-specific codecs remove what zstd cannot see: dates become day numbers, money becomes cents, low-cardinality columns become dictionary ids. Anything that would not round-trip exactly is stored verbatim, so the encoding is lossless by construction.',
        },
        {
          title: 'A purpose-built index instead of a search library',
          rationale:
            'Terms live in a finite-state transducer, and postings are stored as delta-encoded lists or Roaring bitmaps, whichever is smaller. Filters are bitmap intersections and counts are exact. Tantivy was considered and rejected: it keeps its own copy of the documents and is far larger than these queries need.',
        },
        {
          title: 'Three access structures, each for one job',
          rationale:
            'Postings answer equality, prefix and text queries. A forward column of dictionary ids answers group-by in a single pass. Blocked numeric columns with min/max bounds answer date and capital ranges, sorting and yearly histograms.',
        },
        {
          title: 'Verification is a command, not a promise',
          rationale:
            '`opencnpj verify --sources` re-reads the original archives and checks, table by table, that every row is reproduced exactly. A snapshot is published only after it passes, and the previous one is kept for rollback.',
        },
      ],
      implementation: [
        'The build is a three-phase pipeline. Reader threads inflate the archives and cut them into chunks at record boundaries, and parser workers distribute the rows into about a thousand key-range buckets. Each bucket is then sorted, merge-joined into companies and encoded in parallel. A final pass merges the index runs and writes the file atomically with a SHA-256 sidecar.',
        'Memory is bounded by channel depth and per-worker buffers rather than by the size of the dataset, which is what lets a national release build on a laptop.',
        'The same binary serves the HTTP API: CNPJ lookups, accent-insensitive name search with prefix matching and typo tolerance, filters, statistics and streaming export, plus accounts with plans and quotas and an admin interface. A monthly update downloads, rebuilds, verifies and switches snapshots atomically.',
      ],
      challenges: [
        {
          title: 'A CSV dialect that is not quite CSV',
          body: 'The source files are Latin-1, semicolon-separated and occasionally malformed. Rejected lines are preserved verbatim instead of dropped, so the lossless guarantee holds even for rows the parser cannot interpret.',
        },
        {
          title: 'Group-by at national scale',
          body: 'Intersecting thousands of value postings with a large candidate set touched every bitmap container once per value. Moving municipality and CNAE to a forward column turned that into a single pass over the candidates.',
        },
        {
          title: 'Keeping the format honest',
          body: 'Every layout change updates the format specification and the version number, and every block and section carries a checksum, so truncated or corrupted files are rejected rather than read.',
        },
      ],
      evidence: {
        intro:
          'Measured on the 2026-10 national release on an i7-13620H laptop with NVMe storage, as published in the repository together with the methodology.',
        figures: [
          { label: 'Source rows', value: '223,628,880', note: '7.81 GB of ZIPs, 28.86 GB of CSV' },
          { label: 'Snapshot size', value: '8.33 GB', note: 'Format 1.2, balanced, every index' },
          {
            label: 'End-to-end build',
            value: '8 min 2 s',
            note: 'The legacy stack took 27 min 9 s just to import',
          },
          { label: 'CNPJ lookup', value: '0.166 ms', note: 'p50; p95 is 0.200 ms' },
          {
            label: 'Lookups over HTTP',
            value: '36.4k / s',
            note: 'p95 0.68 ms, 16 connections, loopback',
          },
          { label: 'Name search', value: '37–76 ms', note: 'p95, depending on the query' },
        ],
        source: {
          label: 'docs/BENCHMARKS.md',
          href: `${repository}/blob/main/docs/BENCHMARKS.md`,
        },
      },
    },
    'pt-br': {
      tagline:
        'Um único binário em Rust que transforma o cadastro nacional de empresas em um arquivo pesquisável.',
      summary:
        'Um motor de busca offline para os dados abertos de CNPJ da Receita Federal: 224 milhões de linhas compactadas e indexadas em um único arquivo verificável, servido por um binário, sem banco de dados por trás.',
      role: 'Autor: projeto, implementação, benchmarks e documentação',
      status: 'Em desenvolvimento ativo. Medido e documentado; ainda sem versão publicada.',
      plateCaption: 'Trinta e sete arquivos se assentam em um único bloco indexado.',
      highlights: [
        'Substituí uma stack Go, PostgreSQL e Redis por um binário em Rust e um formato colunar próprio.',
        'Gera em cerca de 8 minutos, em um notebook, um snapshot de 8,33 GB com 224 milhões de registros verificados linha a linha.',
      ],
      context: [
        'A Receita Federal publica todo mês o cadastro nacional de empresas em 37 arquivos ZIP: cerca de 29 GB de CSV e 224 milhões de linhas com empresas, estabelecimentos, sócios e regimes tributários. É uma das bases públicas mais úteis do Brasil e uma das menos práticas de usar.',
        'A primeira versão do OpenCNPJ seguia a receita habitual: Go, PostgreSQL, Redis e um front-end em React. Funcionava, mas só a importação de uma publicação levava 27 minutos, e mantê-la no ar significava operar três serviços. Essa implementação está arquivada na tag `legacy-go-final`.',
      ],
      problem: [
        'O objetivo da reescrita era tornar a base inteira utilizável em um notebook ou em um servidor pequeno: baixar a publicação, construí-la uma vez e responder a consultas por CNPJ, buscas por nome e contagens com filtros sem banco de dados, servidor de cache ou cluster de busca.',
        'Duas restrições definiram todo o resto. Nada pode se perder: cada linha da origem precisa ser recuperável com exatidão, inclusive as que não se encaixam no layout oficial. E toda afirmação de desempenho precisa ser reproduzível, publicada junto com o comando e a saída bruta que a geraram.',
      ],
      decisions: [
        {
          title: 'Um arquivo imutável, agrupado por empresa',
          rationale:
            'Todas as linhas de uma empresa (a própria empresa, seus estabelecimentos, sócios e situação no Simples) ficam juntas e ordenadas pela chave. Uma consulta por CNPJ vira uma busca binária em um diretório de blocos em memória, a leitura de um bloco e uma descompressão, sem nenhum join.',
        },
        {
          title: 'Blocos colunares sob um compressor genérico',
          rationale:
            'Cada bloco guarda um fluxo por coluna e é então comprimido com zstd. Codecs específicos removem o que o zstd não enxerga: datas viram número de dias, valores viram centavos, colunas de baixa cardinalidade viram ids de dicionário. O que não puder ser reconstruído com exatidão é guardado literalmente; por isso a codificação é sem perdas por construção.',
        },
        {
          title: 'Um índice sob medida em vez de uma biblioteca de busca',
          rationale:
            'Os termos ficam em um transdutor de estados finitos, e as listas de ocorrências são gravadas como listas delta ou bitmaps Roaring, o que for menor. Filtros são interseções de bitmaps e as contagens são exatas. O Tantivy foi avaliado e descartado: ele mantém a própria cópia dos documentos e é muito maior do que essas consultas exigem.',
        },
        {
          title: 'Três estruturas de acesso, cada uma para uma tarefa',
          rationale:
            'As listas de ocorrências respondem a igualdade, prefixo e texto. Uma coluna direta de ids de dicionário responde a agrupamentos em uma única passada. Colunas numéricas em blocos, com mínimo e máximo, respondem a intervalos de data e capital, ordenação e histogramas anuais.',
        },
        {
          title: 'Verificação é um comando, não uma promessa',
          rationale:
            '`opencnpj verify --sources` relê os arquivos originais e confere, tabela por tabela, que cada linha é reproduzida exatamente. Um snapshot só é publicado depois de passar, e o anterior é mantido para rollback.',
        },
      ],
      implementation: [
        'A construção é um pipeline em três fases. Threads de leitura descompactam os arquivos e os cortam em blocos nos limites de registro, e workers de parsing distribuem as linhas em cerca de mil buckets por faixa de chave. Cada bucket é então ordenado, combinado em empresas e codificado em paralelo. Uma passada final funde os índices e grava o arquivo de forma atômica, com um SHA-256 ao lado.',
        'A memória é limitada pela profundidade dos canais e pelos buffers de cada worker, não pelo tamanho da base. É isso que permite construir uma publicação nacional em um notebook.',
        'O mesmo binário serve a API HTTP: consultas por CNPJ, busca por nome sem distinção de acentos, com prefixo e tolerância a erros de digitação, filtros, estatísticas e exportação em streaming, além de contas com planos e cotas e uma interface administrativa. A atualização mensal baixa, reconstrói, verifica e troca o snapshot de forma atômica.',
      ],
      challenges: [
        {
          title: 'Um dialeto de CSV que não é bem CSV',
          body: 'Os arquivos de origem vêm em Latin-1, separados por ponto e vírgula e, às vezes, malformados. As linhas rejeitadas são preservadas literalmente em vez de descartadas, de modo que a garantia de não perder dados vale até para o que o parser não consegue interpretar.',
        },
        {
          title: 'Agrupamentos em escala nacional',
          body: 'Cruzar milhares de listas de valores com um conjunto grande de candidatos tocava cada contêiner de bitmap uma vez por valor. Levar município e CNAE para uma coluna direta transformou isso em uma única passada pelos candidatos.',
        },
        {
          title: 'Manter o formato honesto',
          body: 'Toda mudança de layout atualiza a especificação do formato e o número da versão, e cada bloco e cada seção carrega um checksum; arquivos truncados ou corrompidos são rejeitados em vez de lidos.',
        },
      ],
      evidence: {
        intro:
          'Medido na publicação nacional de 2026-10, em um notebook i7-13620H com NVMe, conforme publicado no repositório junto com a metodologia.',
        figures: [
          {
            label: 'Linhas na origem',
            value: '223.628.880',
            note: '7,81 GB em ZIPs, 28,86 GB em CSV',
          },
          {
            label: 'Tamanho do snapshot',
            value: '8,33 GB',
            note: 'Formato 1.2, perfil balanced, todos os índices',
          },
          {
            label: 'Construção completa',
            value: '8 min 2 s',
            note: 'A stack antiga levava 27 min 9 s só para importar',
          },
          { label: 'Consulta por CNPJ', value: '0,166 ms', note: 'p50; o p95 é 0,200 ms' },
          {
            label: 'Consultas via HTTP',
            value: '36,4 mil / s',
            note: 'p95 de 0,68 ms, 16 conexões, loopback',
          },
          { label: 'Busca por nome', value: '37–76 ms', note: 'p95, conforme a consulta' },
        ],
        source: {
          label: 'docs/BENCHMARKS.md',
          href: `${repository}/blob/main/docs/BENCHMARKS.md`,
        },
      },
    },
  },
};

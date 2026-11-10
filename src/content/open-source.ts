import type { Localized } from '@/i18n/config';

export interface OpenSourceEntry {
  /** `owner/name`; must also be listed in `github/tracked-repositories.json`. */
  readonly repository: `${string}/${string}`;
  readonly name: string;
  /** Curated by hand: GitHub's language detection is misleading for mixed repositories. */
  readonly tech: readonly string[];
  readonly summary: Localized<string>;
  /** Slug of the case study, when there is one. */
  readonly caseStudy?: string;
  /** Path of the contributor guide inside the repository. */
  readonly contributingPath?: string;
}

/** Projects with a case study on this site. */
export const maintained: readonly OpenSourceEntry[] = [
  {
    repository: 'open-data-brazil/br-validators',
    name: 'br-validators',
    tech: ['TypeScript'],
    summary: {
      en: 'Validation and formatting of Brazilian documents, plus government reference datasets that work offline. Zero runtime dependencies.',
      'pt-br':
        'Validação e formatação de documentos brasileiros, além de bases de referência do governo que funcionam offline. Sem dependências em runtime.',
    },
    caseStudy: 'br-validators',
    contributingPath: 'CONTRIBUTING.md',
  },
  {
    repository: 'AlexandreZanata/OpenCNPJ',
    name: 'OpenCNPJ',
    tech: ['Rust'],
    summary: {
      en: 'A compact, offline search engine for the Receita Federal CNPJ open data: one binary, one file, no database.',
      'pt-br':
        'Um motor de busca compacto e offline para os dados abertos de CNPJ da Receita Federal: um binário, um arquivo, nenhum banco de dados.',
    },
    caseStudy: 'opencnpj',
    contributingPath: 'docs/CONTRIBUTING.md',
  },
  {
    repository: 'AlexandreZanata/TBG-Tupi-Battle-Grounds',
    name: 'Tupi Battle Grounds',
    tech: ['Rust', 'Bevy', 'WebAssembly'],
    summary: {
      en: 'A real-time 1v1 strategy game with an authoritative Rust server and a browser client.',
      'pt-br':
        'Um jogo de estratégia 1v1 em tempo real, com servidor autoritativo em Rust e cliente no navegador.',
    },
    caseStudy: 'tupi-battle-grounds',
    contributingPath: 'AGENTS.md',
  },
  {
    repository: 'AlexandreZanata/Abastevo',
    name: 'Abastevo',
    tech: ['Kotlin', 'Go', 'PostgreSQL'],
    summary: {
      en: 'A community fuel-price platform for Brazil built on official ANP data.',
      'pt-br':
        'Uma plataforma comunitária de preços de combustível para o Brasil, construída sobre dados oficiais da ANP.',
    },
    caseStudy: 'abastevo',
    contributingPath: 'CONTRIBUTING.md',
  },
];

/** Other repositories under the open-data-brazil organization. */
export const organization: readonly OpenSourceEntry[] = [
  {
    repository: 'open-data-brazil/br-validators-rust',
    name: 'br-validators-rust',
    tech: ['Rust'],
    summary: {
      en: 'A Rust port of br-validators: validation and formatting of Brazilian documents with offline lookups of public data.',
      'pt-br':
        'Um port em Rust do br-validators: validação e formatação de documentos brasileiros com consultas offline a dados públicos.',
    },
  },
  {
    repository: 'open-data-brazil/open-data-agro',
    name: 'open-data-agro',
    tech: ['Go'],
    summary: {
      en: 'A curated collection of official Brazilian agricultural open datasets, standardised and ready to use.',
      'pt-br':
        'Uma coleção curada de bases abertas oficiais da agropecuária brasileira, padronizadas e prontas para uso.',
    },
  },
];

/** Smaller tools and earlier work that is public and still useful. */
export const more: readonly OpenSourceEntry[] = [
  {
    repository: 'AlexandreZanata/brazil-fuel-prices-app',
    name: 'brazil-fuel-prices-app',
    tech: ['Kotlin', 'Jetpack Compose'],
    summary: {
      en: 'The offline Android app for ANP weekly fuel price surveys that Abastevo grew out of.',
      'pt-br':
        'O app Android offline para as pesquisas semanais de preços da ANP, de onde o Abastevo nasceu.',
    },
  },
  {
    repository: 'AlexandreZanata/SorriPrecos',
    name: 'SorriPrecos',
    tech: ['Rust', 'Kotlin Multiplatform', 'SQLite'],
    summary: {
      en: 'An open-source supermarket price comparison for the city of Sorriso, Mato Grosso.',
      'pt-br':
        'Um comparador de preços de supermercados, de código aberto, para a cidade de Sorriso, em Mato Grosso.',
    },
  },
  {
    repository: 'AlexandreZanata/UrnaPack',
    name: 'UrnaPack',
    tech: ['Python'],
    summary: {
      en: 'Open electoral data, compressed and verifiable.',
      'pt-br': 'Dados eleitorais abertos, compactados e verificáveis.',
    },
  },
  {
    repository: 'AlexandreZanata/CelularLinuxADB',
    name: 'CelularLinuxADB',
    tech: ['Shell'],
    summary: {
      en: 'Mirror an Android phone on Linux with one command, using adb and scrcpy.',
      'pt-br': 'Espelhe um celular Android no Linux com um comando, usando adb e scrcpy.',
    },
  },
  {
    repository: 'AlexandreZanata/full-sales-web-system',
    name: 'full-sales-web-system',
    tech: ['Rust', 'PostgreSQL'],
    summary: {
      en: 'A Rust backend for field sales and inventory control, built with a hexagonal architecture.',
      'pt-br':
        'Um backend em Rust para vendas em campo e controle de estoque, com arquitetura hexagonal.',
    },
  },
];

export const allOpenSourceEntries: readonly OpenSourceEntry[] = [
  ...maintained,
  ...organization,
  ...more,
];

import type { Project } from './types';

const repository = 'https://github.com/open-data-brazil/br-validators';

export const brValidators: Project = {
  meta: {
    slug: 'br-validators',
    name: 'br-validators',
    repository: 'open-data-brazil/br-validators',
    kind: 'organization',
    stage: 'released',
    startedAt: '2026-06',
    stack: ['TypeScript', 'pnpm workspaces', 'tsup', 'Vitest', 'Next.js'],
    license: 'MIT',
    plate: { src: '/art/plate-seal.svg', width: 640, height: 480 },
    links: [
      { kind: 'repository', href: repository, label: { en: 'Repository', 'pt-br': 'Repositório' } },
      {
        kind: 'playground',
        href: 'https://open-data-brazil.github.io/br-validators/',
        label: { en: 'Playground', 'pt-br': 'Playground' },
      },
      {
        kind: 'docs',
        href: 'https://docs.br-validators.dev/',
        label: { en: 'Documentation', 'pt-br': 'Documentação' },
      },
      {
        kind: 'release',
        href: `${repository}/releases`,
        label: { en: 'Releases', 'pt-br': 'Versões' },
      },
    ],
  },
  content: {
    en: {
      tagline:
        'A zero-dependency TypeScript toolkit for Brazilian documents and public reference data.',
      summary:
        'Validators and formatters for Brazilian identifiers, plus government reference datasets that work entirely offline, published as a typed, tree-shakeable library with a CLI, framework adapters and a browser playground.',
      role: 'Creator and primary maintainer, under the open-data-brazil organization',
      status: 'Released. The API has been frozen since v1.0.0; data releases are automated.',
      plateCaption: 'A guilloché seal: the engraving language of official documents.',
      highlights: [
        'Designed a never-throwing, zero-dependency validation API with 62 tree-shakeable entry points.',
        'Automated the daily refresh, verification and release of embedded government datasets.',
      ],
      context: [
        'Almost every Brazilian application validates the same things: CPF, CNPJ, CEP, PIX keys, state registrations. Most teams copy a snippet from somewhere, and most snippets are wrong at the edges: a new alphanumeric CNPJ format, a state with its own check-digit rule, an input that makes the function throw.',
        'br-validators started as a way to stop rewriting that code. It grew into a monorepo with a core library, a command-line tool, adapters for Zod, React Hook Form, Express and Vue, a documentation site and a playground that runs entirely in the browser.',
      ],
      problem: [
        'A validation library is only useful if it can be trusted without being read. Every algorithm has to be traceable to an official source, the API has to be hard to misuse, and the package has to be cheap enough to import that nobody is tempted to copy the code out of it.',
        'The second half of the project has a different problem. Reference data such as municipality codes, bank lists and tax tables changes on someone else’s schedule, and a library that embeds it has to stay current without a person in the loop.',
      ],
      decisions: [
        {
          title: 'Results, not exceptions',
          rationale:
            'Every validator returns a discriminated union: `{ ok: true, value }` or `{ ok: false, code, message }`. Nothing throws, error codes are stable, and branded types can only be produced by a successful validation.',
        },
        {
          title: 'No algorithm without a citation',
          rationale:
            'Each rule traces to a primary source such as Receita Federal or Banco Central, and official examples are kept as golden test vectors. The alphanumeric CNPJ follows the published rule (character code minus 48, modulo 11), and the official sample is a mandatory test.',
        },
        {
          title: 'Zero runtime dependencies, one entry point per concern',
          rationale:
            'The core has no dependencies and touches no network, filesystem or environment. It ships as ESM with 62 subpath exports, so importing the CPF validator costs about 1.5 kB gzipped and never pulls in a dataset.',
        },
        {
          title: 'Data releases are versioned separately',
          rationale:
            'A scheduled job refreshes the embedded datasets, runs the full verification suite and cuts a release with a `-data.N` suffix. Data updates stay correctly ordered without pretending to be API changes.',
        },
        {
          title: 'Fail closed on upstream problems',
          rationale:
            'When a government source is unreachable or changes shape, the previous embedded copy stays in place and the failure is recorded in a public alerts file, instead of shipping partial data.',
        },
      ],
      implementation: [
        'The repository is a pnpm workspace: packages for the core and its adapters, and apps for the CLI, the VitePress documentation and the Next.js playground, which is exported statically and deployed to GitHub Pages.',
        'The core is built with tsup and tested with Vitest. Coverage thresholds are set to 100% for lines, functions, branches and statements, and linting runs with zero warnings allowed.',
        'Releases are cut by CI. The tag is checked against every package manifest, the verification suite runs, and the tarballs, the data bundle, a catalog with record counts and SHA-256 checksums are attached to the GitHub Release.',
      ],
      challenges: [
        {
          title: 'Publishing without a registry token',
          body: 'When npm publishing began to require a one-time password, an automated release failed. Distribution moved to GitHub Release tarballs, which install with any package manager straight from a URL and need no stored secret. Earlier versions remain on npm.',
        },
        {
          title: 'Versioning data honestly',
          body: 'A data refresh is neither a bug fix nor a feature. The first idea, a long patch number, would have sorted below real patch releases; a dedicated suffix keeps semantic versioning meaningful.',
        },
        {
          title: 'Sources that fail quietly',
          body: 'Government endpoints go down, move and change format. The pipeline treats every source as unreliable: it retries, checks for drift, and reports a dataset as stale instead of hiding it.',
        },
      ],
      evidence: {
        intro: 'Taken from the repository configuration and README at the time of writing.',
        figures: [
          {
            label: 'Coverage thresholds',
            value: '100%',
            note: 'Lines, functions, branches, statements',
          },
          { label: 'Subpath exports', value: '62', note: 'One entry point per concern' },
          { label: 'CPF validator', value: '1.5 kB', note: 'Gzipped, tree-shaken' },
          { label: 'CNPJ validator', value: '2.0 kB', note: 'Gzipped, alphanumeric included' },
          { label: 'Runtime dependencies', value: '0' },
          { label: 'Data refresh', value: 'Daily', note: 'Scheduled CI; a few sources are manual' },
        ],
        source: { label: 'README.md', href: `${repository}#readme` },
      },
    },
    'pt-br': {
      tagline:
        'Um toolkit TypeScript sem dependências para documentos brasileiros e dados públicos de referência.',
      summary:
        'Validadores e formatadores de identificadores brasileiros, além de bases de referência do governo que funcionam totalmente offline, publicados como uma biblioteca tipada e tree-shakeable, com CLI, adaptadores para frameworks e um playground no navegador.',
      role: 'Criador e principal mantenedor, na organização open-data-brazil',
      status:
        'Publicado. A API está congelada desde a v1.0.0; as versões de dados são automáticas.',
      plateCaption: 'Um selo em guilhochê: a linguagem de gravura dos documentos oficiais.',
      highlights: [
        'Projetei uma API de validação que nunca lança exceções, sem dependências e com 62 pontos de entrada tree-shakeable.',
        'Automatizei a atualização diária, a verificação e a publicação das bases governamentais embutidas.',
      ],
      context: [
        'Quase toda aplicação brasileira valida as mesmas coisas: CPF, CNPJ, CEP, chaves PIX, inscrições estaduais. A maioria dos times copia um trecho de algum lugar, e a maioria desses trechos erra nos casos de borda: o novo CNPJ alfanumérico, um estado com regra própria de dígito verificador, uma entrada que faz a função lançar exceção.',
        'O br-validators nasceu para parar de reescrever esse código. Cresceu até virar um monorepo com biblioteca principal, ferramenta de linha de comando, adaptadores para Zod, React Hook Form, Express e Vue, site de documentação e um playground que roda inteiramente no navegador.',
      ],
      problem: [
        'Uma biblioteca de validação só é útil se puder ser confiada sem ser lida. Cada algoritmo precisa ser rastreável até uma fonte oficial, a API precisa ser difícil de usar errado, e o pacote precisa ser leve o bastante para que ninguém prefira copiar o código.',
        'A segunda metade do projeto tem outro problema. Dados de referência como códigos de municípios, listas de bancos e tabelas tributárias mudam no calendário de outra pessoa, e uma biblioteca que os embute precisa se manter atual sem alguém no meio do processo.',
      ],
      decisions: [
        {
          title: 'Resultados, não exceções',
          rationale:
            'Todo validador devolve uma união discriminada: `{ ok: true, value }` ou `{ ok: false, code, message }`. Nada lança exceção, os códigos de erro são estáveis e os tipos com marca só podem ser produzidos por uma validação bem-sucedida.',
        },
        {
          title: 'Nenhum algoritmo sem citação',
          rationale:
            'Cada regra remete a uma fonte primária, como a Receita Federal ou o Banco Central, e os exemplos oficiais são mantidos como vetores de teste. O CNPJ alfanumérico segue a regra publicada (código do caractere menos 48, módulo 11), e o exemplo oficial é um teste obrigatório.',
        },
        {
          title: 'Zero dependências em runtime, um ponto de entrada por assunto',
          rationale:
            'O núcleo não tem dependências e não toca rede, sistema de arquivos ou ambiente. É distribuído como ESM com 62 subcaminhos de exportação: importar o validador de CPF custa cerca de 1,5 kB em gzip e nunca arrasta uma base de dados junto.',
        },
        {
          title: 'Versões de dados têm numeração própria',
          rationale:
            'Um job agendado atualiza as bases embutidas, roda toda a suíte de verificação e gera uma versão com o sufixo `-data.N`. As atualizações de dados ficam ordenadas corretamente sem se passar por mudanças de API.',
        },
        {
          title: 'Diante de falha na origem, nada muda',
          rationale:
            'Quando uma fonte do governo fica fora do ar ou muda de formato, a cópia embutida anterior permanece e a falha é registrada em um arquivo público de alertas, em vez de publicar dados parciais.',
        },
      ],
      implementation: [
        'O repositório é um workspace pnpm: pacotes para o núcleo e seus adaptadores, e apps para a CLI, a documentação em VitePress e o playground em Next.js, exportado estaticamente e publicado no GitHub Pages.',
        'O núcleo é compilado com tsup e testado com Vitest. Os limites de cobertura são de 100% para linhas, funções, ramos e instruções, e o lint roda sem tolerar avisos.',
        'As versões são geradas pela CI. A tag é conferida contra o manifesto de cada pacote, a suíte de verificação roda, e os tarballs, o pacote de dados, um catálogo com contagem de registros e os checksums SHA-256 são anexados à Release no GitHub.',
      ],
      challenges: [
        {
          title: 'Publicar sem token de registro',
          body: 'Quando a publicação no npm passou a exigir senha de uso único, uma versão automática falhou. A distribuição foi para tarballs nas Releases do GitHub, que qualquer gerenciador de pacotes instala direto da URL e que não exigem segredo armazenado. As versões anteriores continuam no npm.',
        },
        {
          title: 'Versionar dados com honestidade',
          body: 'Uma atualização de dados não é correção nem funcionalidade. A primeira ideia, um número de patch longo, ficaria ordenada abaixo dos patches reais; um sufixo dedicado mantém o versionamento semântico com significado.',
        },
        {
          title: 'Fontes que falham em silêncio',
          body: 'Endpoints do governo caem, mudam de endereço e de formato. O pipeline trata toda fonte como não confiável: repete a tentativa, verifica desvios e informa quando uma base está desatualizada, em vez de esconder o problema.',
        },
      ],
      evidence: {
        intro: 'Extraído da configuração do repositório e do README no momento da escrita.',
        figures: [
          {
            label: 'Limites de cobertura',
            value: '100%',
            note: 'Linhas, funções, ramos e instruções',
          },
          { label: 'Subcaminhos exportados', value: '62', note: 'Um ponto de entrada por assunto' },
          { label: 'Validador de CPF', value: '1,5 kB', note: 'Em gzip, após tree-shaking' },
          { label: 'Validador de CNPJ', value: '2,0 kB', note: 'Em gzip, com o alfanumérico' },
          { label: 'Dependências em runtime', value: '0' },
          {
            label: 'Atualização dos dados',
            value: 'Diária',
            note: 'CI agendada; algumas fontes são manuais',
          },
        ],
        source: { label: 'README.md', href: `${repository}#readme` },
      },
    },
  },
};

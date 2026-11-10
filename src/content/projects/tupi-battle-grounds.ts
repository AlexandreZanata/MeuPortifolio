import type { Project } from './types';

const repository = 'https://github.com/AlexandreZanata/TBG-Tupi-Battle-Grounds';

export const tupiBattleGrounds: Project = {
  meta: {
    slug: 'tupi-battle-grounds',
    name: 'Tupi Battle Grounds',
    repository: 'AlexandreZanata/TBG-Tupi-Battle-Grounds',
    kind: 'personal',
    stage: 'beta',
    startedAt: '2026-06',
    stack: ['Rust', 'Bevy', 'WebAssembly', 'Axum', 'Tokio', 'SQLite'],
    license: 'TBG Visible Attribution License 1.0',
    plate: { src: '/art/plate-lane.svg', width: 640, height: 480 },
    links: [
      { kind: 'repository', href: repository, label: { en: 'Repository', 'pt-br': 'Repositório' } },
      {
        kind: 'live',
        href: 'https://app.tupibg.com/',
        label: { en: 'Play in the browser', 'pt-br': 'Jogar no navegador' },
      },
      {
        kind: 'live',
        href: 'https://tupibg.com/',
        label: { en: 'Official site', 'pt-br': 'Site oficial' },
      },
      {
        kind: 'docs',
        href: `${repository}/blob/main/docs/DECISIONS.md`,
        label: { en: 'Decision log', 'pt-br': 'Registro de decisões' },
      },
    ],
  },
  content: {
    en: {
      tagline: 'A real-time 1v1 strategy game written entirely in Rust, playable in the browser.',
      summary:
        'An open-source competitive strategy game: a Bevy client compiled to WebAssembly and a deterministic rules crate shared with an authoritative Axum server, deployed as one binary on a single VPS.',
      role: 'Author: game design, client, server, art pipeline and operations',
      status:
        'Public beta. Playable in desktop browsers, with native Linux and Windows builds; competitive balance is not yet approved.',
      plateCaption: 'Two strongholds and the single lane between them.',
      highlights: [
        'Built a deterministic rules engine shared by a WebAssembly client and an authoritative server.',
        'Run the game on one VPS, with attested releases that drain live matches instead of dropping them.',
      ],
      context: [
        'Tupi Battle Grounds is a 1v1 strategy game with no micromanagement. Players buy champions from a rotating shop, combine factions for synergies and choose evolutions; combat then resolves automatically on a single lane until one stronghold falls.',
        'The first implementation used Unity, Nakama and Python. Its rules survived; its technology did not. For a solo developer, the licensing and build weight of that stack was not justified, so the game was rewritten in Rust and the old project was archived inside the repository.',
      ],
      problem: [
        'A competitive game has to be fair before it is anything else. Both players must see the same match, neither client can be trusted with the opponent’s hidden information, and a release must not interrupt games in progress.',
        'It also had to be something one person could build and operate: one language, one deployable, and an art pipeline that does not require rigging and animating a character for every unit.',
      ],
      decisions: [
        {
          title: 'One rules crate, shared by client and server',
          rationale:
            '`tbg-core` holds the rules, content, bot and protocol and depends only on serde and postcard. The server runs it as the source of truth; the client runs the same code locally for practice matches against the bot.',
        },
        {
          title: 'Authoritative snapshots instead of lockstep',
          rationale:
            'The server simulates at 20 Hz and sends each player their own view at 10 Hz, and the client interpolates between snapshots. This resists cheating, keeps each player’s shop and energy private, and cannot desynchronise.',
        },
        {
          title: 'Determinism by construction',
          rationale:
            'The simulation uses integer fixed-point arithmetic, an in-crate PCG32 generator and ordered collections, and it hashes its own state. A contract test shows that the server matches a headless replay at different tick intervals.',
        },
        {
          title: 'Bevy on every platform',
          rationale:
            'One client crate targets WebGL2 through WebAssembly and native Linux and Windows, with dependencies gated per target. Choosing Bevy let the client use the rules crate directly, with no bindings in between.',
        },
        {
          title: 'Art built in code',
          rationale:
            'Units are stylised figurines assembled procedurally. The earlier skinned-mesh pipeline passed its automated checks about 8% of the time and cost hours per unit; code-built figures removed that bottleneck.',
        },
        {
          title: 'One server, no containers',
          rationale:
            'An Axum and Tokio server keeps a single SQLite file in WAL mode, owned by one writer task, behind Caddy and systemd. PostgreSQL is deferred until more than one server needs to write.',
        },
      ],
      implementation: [
        'Client and server talk over a single WebSocket carrying binary postcard frames. Online play was validated before any 3D art existed, so the networking model was proven on placeholder visuals first.',
        'Production runs two release slots. A build is promoted only after the server verifies its GitHub build attestation, and matches in progress are drained rather than cut off, because a match has no time limit.',
        'Accounts are optional. Guests can practise and play casual matches, while ranked play and saved progress require an account with a manual recovery key.',
      ],
      challenges: [
        {
          title: 'WebAssembly size',
          body: 'The browser build has a 4 MB target and a 6 MB ceiling after compression, which meant trimming Bevy features. Published builds measure between 4.59 MB and 5.56 MB with Brotli.',
        },
        {
          title: 'Releasing without ending matches',
          body: 'Matches are open-ended, so a deployment cannot wait for a quiet moment. Two release slots and connection draining let a new version take over while existing matches finish on the old one.',
        },
        {
          title: 'Reporting status honestly',
          body: 'The project is in beta, and its documentation says what that excludes: competitive balance is not approved, Windows packages are unsigned, and device and rendering parity beyond Linux is not certified.',
        },
      ],
      evidence: {
        intro:
          'Local measurements published in the repository. The project explicitly makes no production capacity claim.',
        figures: [
          { label: 'Simulation rate', value: '20 Hz', note: 'Views sent to each player at 10 Hz' },
          {
            label: 'Local load test',
            value: '2,000 matches',
            note: '0 late ticks in 60 s, 0.529 busy cores, 92 MiB',
          },
          { label: 'Bandwidth per client', value: '1.46 kB/s', note: 'Downstream; 3 B/s upstream' },
          { label: 'Browser build', value: '4.59–5.56 MB', note: 'Brotli, against a 6 MB ceiling' },
          {
            label: 'Live slot switch',
            value: '0 failures',
            note: '1,801 views per client across the switch',
          },
        ],
        source: {
          label: 'docs/ARCHITECTURE.md',
          href: `${repository}/blob/main/docs/ARCHITECTURE.md`,
        },
      },
    },
    'pt-br': {
      tagline:
        'Um jogo de estratégia 1v1 em tempo real, escrito inteiramente em Rust e jogável no navegador.',
      summary:
        'Um jogo competitivo de estratégia, de código aberto: um cliente Bevy compilado para WebAssembly e um crate de regras determinístico compartilhado com um servidor autoritativo em Axum, implantados como um único binário em uma VPS.',
      role: 'Autor: game design, cliente, servidor, pipeline de arte e operação',
      status:
        'Beta público. Jogável em navegadores desktop, com builds nativas para Linux e Windows; o balanceamento competitivo ainda não foi aprovado.',
      plateCaption: 'Duas fortalezas e a única rota entre elas.',
      highlights: [
        'Construí um motor de regras determinístico compartilhado entre um cliente WebAssembly e um servidor autoritativo.',
        'Opero o jogo em uma única VPS, com versões atestadas que drenam as partidas em andamento em vez de derrubá-las.',
      ],
      context: [
        'Tupi Battle Grounds é um jogo de estratégia 1v1 sem microgerenciamento. Os jogadores compram campeões em uma loja rotativa, combinam facções para ativar sinergias e escolhem evoluções; o combate então se resolve sozinho em uma única rota, até que uma fortaleza caia.',
        'A primeira implementação usava Unity, Nakama e Python. As regras sobreviveram; a tecnologia, não. Para um desenvolvedor solo, o licenciamento e o peso de build daquela stack não se justificavam, então o jogo foi reescrito em Rust e o projeto antigo foi arquivado dentro do repositório.',
      ],
      problem: [
        'Um jogo competitivo precisa ser justo antes de qualquer outra coisa. Os dois jogadores têm de ver a mesma partida, nenhum cliente pode receber a informação oculta do oponente, e uma nova versão não pode interromper partidas em andamento.',
        'Também precisava ser algo que uma pessoa conseguisse construir e operar: uma linguagem, um artefato de implantação e um pipeline de arte que não exija rigging e animação para cada unidade.',
      ],
      decisions: [
        {
          title: 'Um crate de regras, compartilhado por cliente e servidor',
          rationale:
            'O `tbg-core` reúne regras, conteúdo, bot e protocolo, e depende apenas de serde e postcard. O servidor o executa como fonte da verdade; o cliente roda o mesmo código localmente nas partidas de treino contra o bot.',
        },
        {
          title: 'Snapshots autoritativos em vez de lockstep',
          rationale:
            'O servidor simula a 20 Hz e envia a cada jogador a sua própria visão a 10 Hz, e o cliente interpola entre os snapshots. Isso resiste a trapaças, mantém privadas a loja e a energia de cada jogador e não tem como dessincronizar.',
        },
        {
          title: 'Determinismo por construção',
          rationale:
            'A simulação usa aritmética inteira de ponto fixo, um gerador PCG32 interno e coleções ordenadas, e calcula um hash do próprio estado. Um teste de contrato mostra que o servidor coincide com um replay sem interface em diferentes intervalos de tick.',
        },
        {
          title: 'Bevy em todas as plataformas',
          rationale:
            'Um único crate de cliente tem como alvo WebGL2 via WebAssembly e builds nativas para Linux e Windows, com dependências condicionadas por plataforma. Escolher o Bevy permitiu ao cliente usar o crate de regras diretamente, sem bindings no meio.',
        },
        {
          title: 'Arte construída em código',
          rationale:
            'As unidades são estatuetas estilizadas montadas proceduralmente. O pipeline anterior, com malhas e esqueletos, passava nas verificações automáticas em cerca de 8% das vezes e custava horas por unidade; as figuras em código eliminaram esse gargalo.',
        },
        {
          title: 'Um servidor, sem contêineres',
          rationale:
            'Um servidor em Axum e Tokio mantém um único arquivo SQLite em modo WAL, com uma só tarefa de escrita, atrás de Caddy e systemd. O PostgreSQL fica para quando mais de um servidor precisar escrever.',
        },
      ],
      implementation: [
        'Cliente e servidor conversam por um único WebSocket com quadros binários em postcard. O jogo online foi validado antes de existir qualquer arte 3D; o modelo de rede foi comprovado primeiro com visuais provisórios.',
        'A produção roda dois slots de versão. Uma build só é promovida depois que o servidor verifica a atestação de build do GitHub, e as partidas em andamento são drenadas em vez de cortadas, porque uma partida não tem limite de tempo.',
        'Contas são opcionais. Convidados podem treinar e jogar partidas casuais; o modo ranqueado e o progresso salvo exigem uma conta com chave manual de recuperação.',
      ],
      challenges: [
        {
          title: 'Tamanho do WebAssembly',
          body: 'A build para navegador tem meta de 4 MB e teto de 6 MB após a compressão, o que exigiu enxugar recursos do Bevy. As builds publicadas medem entre 4,59 MB e 5,56 MB com Brotli.',
        },
        {
          title: 'Publicar sem encerrar partidas',
          body: 'As partidas não têm duração definida; uma implantação não pode esperar um momento calmo. Dois slots de versão e a drenagem de conexões permitem que a nova versão assuma enquanto as partidas existentes terminam na antiga.',
        },
        {
          title: 'Relatar o estado com honestidade',
          body: 'O projeto está em beta, e a documentação diz o que isso exclui: o balanceamento competitivo não foi aprovado, os pacotes para Windows não são assinados, e a paridade de dispositivos e de renderização além do Linux não foi certificada.',
        },
      ],
      evidence: {
        intro:
          'Medições locais publicadas no repositório. O projeto declara explicitamente que não faz afirmações de capacidade em produção.',
        figures: [
          {
            label: 'Taxa de simulação',
            value: '20 Hz',
            note: 'Visões enviadas a cada jogador a 10 Hz',
          },
          {
            label: 'Teste de carga local',
            value: '2.000 partidas',
            note: '0 ticks atrasados em 60 s, 0,529 núcleo ocupado, 92 MiB',
          },
          { label: 'Banda por cliente', value: '1,46 kB/s', note: 'Download; 3 B/s de upload' },
          {
            label: 'Build para navegador',
            value: '4,59–5,56 MB',
            note: 'Brotli, com teto de 6 MB',
          },
          {
            label: 'Troca de slot ao vivo',
            value: '0 falhas',
            note: '1.801 visões por cliente durante a troca',
          },
        ],
        source: {
          label: 'docs/ARCHITECTURE.md',
          href: `${repository}/blob/main/docs/ARCHITECTURE.md`,
        },
      },
    },
  },
};

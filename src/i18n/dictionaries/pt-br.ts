import type { Dictionary } from './en';

/** Brazilian Portuguese copy. Written for Brazilian readers, not translated line by line. */
export const ptBR: Dictionary = {
  meta: {
    siteTitle: 'Alexandre Zanata — Engenheiro de Software',
    description:
      'Portfólio de Alexandre Zanata, engenheiro de software full-stack que constrói sistemas de dados, ferramentas open source, produtos mobile e jogos.',
    ogAlt:
      'Alexandre Zanata — engenheiro de software. Sistemas de dados, ferramentas open source e jogos.',
  },
  a11y: {
    skipToContent: 'Pular para o conteúdo',
    mainNavigation: 'Principal',
    footerNavigation: 'Rodapé',
    menu: 'Menu',
    close: 'Fechar',
    language: 'Idioma',
    homeLink: 'Alexandre Zanata, página inicial',
    external: 'site externo',
  },
  nav: {
    projects: 'Projetos',
    openSource: 'Open source',
    lab: 'Lab',
    about: 'Sobre',
    contact: 'Contato',
    resume: 'Currículo',
  },
  common: {
    github: 'GitHub',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    readCaseStudy: 'Ler o estudo de caso',
    allProjects: 'Todos os projetos',
    pending: 'Pendente de validação',
    figure: 'Fig.',
  },
  kinds: {
    personal: 'Projeto pessoal',
    organization: 'Projeto de organização',
  },
  stages: {
    released: 'Publicado',
    beta: 'Beta público',
    'in-development': 'Em desenvolvimento',
  },
  home: {
    hero: {
      eyebrow: 'Alexandre Zanata · Engenheiro de software full-stack',
      // U+00A0 (no-break space) keeps "open source" on one line.
      titleLead: 'Sistemas de dados, ferramentas open\u00a0source e jogos, ',
      titleEmphasis: 'de ponta a ponta',
      titleTail: '.',
      lede: 'Projeto, construo e entrego software em toda a stack: um motor de busca em Rust que reúne 224 milhões de registros públicos de empresas em um único arquivo, um toolkit TypeScript para documentos brasileiros, um app Android de preços de combustível e um jogo de estratégia em tempo real que roda no navegador.',
      primaryCta: 'Ver projetos',
      figureCaption: 'Um só corpo de trabalho, várias órbitas: dados, ferramentas, produto e jogo.',
      stackLabel: 'Trabalho com',
      stack: ['Rust', 'TypeScript', 'Kotlin', 'Go', 'WebAssembly', 'PostgreSQL'],
    },
    work: {
      label: 'Trabalhos selecionados',
      title: 'Quatro projetos, quatro problemas diferentes.',
      description:
        'Todos são públicos, documentados e feitos para serem verificados, não apenas demonstrados.',
    },
    openSource: {
      label: 'Open source',
      title: 'Feito em aberto, documentado como produto.',
      body: 'A maior parte do que construo é pública: o código, as decisões por trás dele e as medições que o sustentam. Mantenho o br-validators na organização open-data-brazil e publico ferramentas que facilitam o trabalho com dados públicos brasileiros.',
      cta: 'Conhecer o hub open source',
      principles: [
        {
          title: 'Correção se verifica, não se presume',
          body: 'O OpenCNPJ confere cada linha da origem contra o snapshot que constrói. O br-validators exige citação oficial para cada algoritmo.',
        },
        {
          title: 'Decisões ficam registradas',
          body: 'Registros de decisão, especificações de formato e metodologia de benchmark ficam ao lado do código que explicam.',
        },
        {
          title: 'A rotina é da automação',
          body: 'Bases de referência são atualizadas por agendamento, as versões levam checksums e a integração contínua decide o que entra.',
        },
      ],
    },
    about: {
      label: 'Sobre',
      title: 'Engenheiro, construtor, mantenedor.',
      body: 'Sou engenheiro full-stack, com base em TypeScript em aplicações web, painéis administrativos e serviços de plataforma, e um volume crescente de trabalho de sistemas em Rust e Go. Gosto de problemas em que a parte difícil são os dados: obtê-los por completo, mantê-los corretos e torná-los rápidos de consultar.',
      cta: 'Mais sobre mim',
    },
    contact: {
      label: 'Contato',
      title: 'Tem uma vaga ou um projeto em mente?',
      body: 'Será um prazer conversar sobre vagas de engenharia, colaborações e trabalho open source.',
      cta: 'Entrar em contato',
    },
  },
  projects: {
    title: 'Projetos',
    lede: 'Estudos de caso de produtos e ferramentas que projetei e construí. Cada um diz o que é, em que pé está e o que ainda falta.',
    metaDescription:
      'Estudos de caso de Alexandre Zanata: OpenCNPJ, br-validators, Tupi Battle Grounds e Abastevo.',
  },
  caseStudy: {
    label: 'Estudo de caso',
    pageTitle: 'Estudo de caso: {name}',
    onThisPage: 'Nesta página',
    sections: {
      context: 'Contexto',
      problem: 'Problema',
      decisions: 'Decisões de arquitetura',
      implementation: 'Implementação',
      challenges: 'Desafios',
      evidence: 'Evidências',
    },
    facts: {
      type: 'Tipo',
      stage: 'Estágio',
      role: 'Papel',
      status: 'Situação',
      stack: 'Stack',
      license: 'Licença',
      started: 'Início',
      links: 'Links',
    },
    evidenceSource: 'Fonte',
    next: 'Próximo projeto',
  },
  openSource: {
    title: 'Open source',
    lede: 'Um hub das bibliotecas, ferramentas e bases de dados que mantenho, e dos caminhos mais simples para participar.',
    metaDescription:
      'Projetos open source mantidos por Alexandre Zanata e pela organização open-data-brazil, com formas de contribuir.',
    maintained: {
      label: 'Mantidos',
      title: 'Projetos com estudo de caso',
      description:
        'Onde passo a maior parte do meu tempo. Cada um tem um relato completo neste site.',
    },
    organization: {
      label: 'Organização',
      title: 'open-data-brazil',
      description:
        'Uma organização para ferramentas abertas em torno de dados públicos brasileiros. É a casa do br-validators.',
      cta: 'Ver a organização no GitHub',
    },
    more: {
      label: 'Mais',
      title: 'Outros repositórios públicos',
      description: 'Ferramentas menores e trabalhos anteriores que são públicos e continuam úteis.',
      cta: 'Todos os repositórios no GitHub',
    },
    contribute: {
      label: 'Contribua',
      title: 'Como participar',
      description:
        'Contribuições são bem-vindas em todos os repositórios acima. Alguns hábitos ajudam.',
      steps: [
        {
          title: 'Leia antes o guia de contribuição',
          body: 'Cada projeto documenta seu fluxo de trabalho, suas verificações e o que é uma boa mudança.',
        },
        {
          title: 'Abra uma issue antes de mudanças grandes',
          body: 'Uma conversa curta no início evita trabalho que não se encaixa na direção do projeto.',
        },
        {
          title: 'Mantenha os pull requests pequenos',
          body: 'Uma mudança focada, com seus testes, é revisada depressa; uma grande e misturada, não.',
        },
      ],
      guides: 'Guias de contribuição',
      site: {
        title: 'Este site também é open source',
        body: 'O código, os tokens de design e o programa que desenha as ilustrações são públicos.',
        cta: 'Ver o código-fonte',
      },
    },
    card: {
      updated: 'Atualizado',
      release: 'Última versão',
      license: 'Licença',
      stars: 'estrelas',
      repository: 'Repositório',
      customLicense: 'Licença própria',
    },
    snapshotNote: 'Dados dos repositórios obtidos do GitHub em',
  },
  lab: {
    title: 'Lab',
    lede: 'Pequenos experimentos e estudos. Nada aqui é necessário para entender o restante do site.',
    metaDescription:
      'Pequenos experimentos de Alexandre Zanata: dígitos verificadores do CNPJ alfanumérico e ilustrações generativas em pontilhismo.',
    cnpj: {
      label: 'Experimento 01',
      title: 'Dígitos verificadores do CNPJ alfanumérico',
      body: 'O formato de CNPJ de 2026 admite letras nas doze primeiras posições. Os dois dígitos verificadores continuam sendo calculados em módulo 11: cada caractere vale o seu código menos 48; os algarismos mantêm o próprio valor e as letras continuam a partir de 17. Digite um CNPJ para ver o cálculo.',
      inputLabel: 'CNPJ',
      inputHint: 'Numérico ou alfanumérico, com ou sem pontuação.',
      examples: 'Exemplos',
      status: {
        empty: 'Digite um CNPJ ou escolha um exemplo.',
        incomplete: 'caracteres restantes.',
        invalidCharacters:
          'Apenas letras e algarismos são aceitos, e as duas últimas posições devem ser algarismos.',
        valid: 'Válido: os dígitos verificadores conferem.',
        invalid: 'Inválido: os dígitos verificadores deveriam ser',
      },
      table: {
        caption: 'Cálculo do dígito verificador',
        character: 'Caractere',
        value: 'Valor',
        weight: 'Peso',
        product: 'Produto',
        sum: 'Soma',
        remainder: 'Resto da divisão da soma por 11',
        digit: 'Dígito verificador',
      },
      footnote: 'A mesma regra é implementada e testada contra exemplos oficiais no',
    },
    plates: {
      label: 'Experimento 02',
      title: 'Gravuras em pontilhismo',
      body: 'As ilustrações deste site são desenhadas por um pequeno programa em TypeScript. O tom é formado por pontos cujo espaçamento segue um campo de escuridão, as linhas são gravadas como filetes e curvas em guilhochê, e um gerador aleatório com semente torna toda execução idêntica.',
      cta: 'Ler o gerador',
      captions: [
        'Esfera armilar',
        'Bloco de estratos',
        'Selo em guilhochê',
        'Gota e curvas de nível',
        'Fortalezas e rota',
      ],
    },
  },
  about: {
    title: 'Sobre',
    lede: 'Construo software de ponta a ponta e me importo sobretudo com as partes fáceis de pular: verificação, documentação e operação.',
    metaDescription:
      'Sobre Alexandre Zanata: engenheiro de software full-stack que trabalha com TypeScript, Rust, Kotlin e Go em sistemas de dados, ferramentas open source e produtos.',
    bio: [
      'Sou engenheiro full-stack. TypeScript é a linguagem das maiores bases de código que já entreguei: aplicações web, painéis administrativos e serviços de plataforma. Ao redor dela, trabalho com Kotlin para Android, Go para backends e, cada vez mais, Rust nas partes em que desempenho e correção precisam nascer no projeto.',
      'Boa parte do meu trabalho open source gira em torno de dados públicos brasileiros. Eles são valiosos e incômodos na mesma medida: publicados em arquivos enormes, em codificações antigas, em calendários irregulares. Gosto de transformar isso em ferramentas que outros desenvolvedores possam simplesmente usar.',
      'Rendo mais em produtos que consigo acompanhar do primeiro esboço à produção: o modelo de dados, a interface, o pipeline de release e a documentação que permite a outra pessoa continuar o trabalho.',
    ],
    approach: {
      label: 'Abordagem',
      title: 'Como trabalho',
      items: [
        {
          title: 'Começar pelos dados',
          body: 'A maioria dos problemas difíceis dos meus projetos foi, antes de tudo, um problema de dados. Modelo os dados e seus casos de falha antes de escolher um framework.',
        },
        {
          title: 'Preferir infraestrutura sem surpresas',
          body: 'Um binário, um banco, um servidor, até que as medições digam o contrário. Menos peças móveis é uma qualidade que um único mantenedor consegue sustentar.',
        },
        {
          title: 'Registrar a decisão',
          body: 'Registros de decisão e especificações de formato custam uma hora e poupam semanas. É também por eles que quem contribui aprende o projeto.',
        },
        {
          title: 'Medir antes de afirmar',
          body: 'Não publico um número de desempenho sem o comando e a saída bruta que o sustentam, e digo o que ainda não foi verificado.',
        },
      ],
    },
    toolbox: {
      label: 'Ferramentas',
      title: 'Tecnologias com que trabalho',
      note: 'Confirmadas nos meus repositórios públicos ou listadas no meu perfil do GitHub.',
    },
    timeline: {
      label: 'Linha do tempo',
      title: 'Trabalho público recente',
      note: 'As datas são as de criação dos repositórios públicos.',
    },
    experience: {
      label: 'Experiência',
      title: 'Experiência profissional',
    },
    education: {
      label: 'Formação',
      title: 'Formação acadêmica',
    },
    present: 'Atual',
  },
  contact: {
    title: 'Contato',
    lede: 'Para vagas e colaborações, escreva diretamente para mim. Para assuntos de um projeto específico, uma issue no repositório mantém o contexto público.',
    metaDescription:
      'Fale com Alexandre Zanata sobre vagas de engenharia, colaborações e trabalho open source.',
    channels: {
      email: { title: 'E-mail', body: 'O melhor canal para vagas e colaborações.' },
      linkedin: { title: 'LinkedIn', body: 'Perfil profissional e mensagens.' },
      github: { title: 'GitHub', body: 'Código, issues e discussões de cada projeto.' },
    },
    resume: {
      title: 'Currículo',
      body: 'Um resumo de uma página, para imprimir ou salvar em PDF.',
      cta: 'Abrir o currículo',
    },
    privacy: {
      title: 'Privacidade',
      body: 'Este site não usa cookies, não carrega rastreadores e não tem formulários. A mensagem vai direto do seu cliente de e-mail para o meu.',
    },
  },
  resume: {
    title: 'Currículo',
    metaDescription:
      'Currículo de Alexandre Zanata, engenheiro de software full-stack: projetos, competências e links.',
    headline: 'Engenheiro de software full-stack',
    print: 'Imprimir ou salvar em PDF',
    summaryTitle: 'Resumo',
    summary:
      'Engenheiro full-stack que projeta, constrói e opera produtos de ponta a ponta. TypeScript em primeiro lugar na web, com trabalho de sistemas em Rust e Go e de Android em Kotlin. Mantenedor de ferramentas open source para dados públicos brasileiros.',
    projectsTitle: 'Projetos selecionados',
    skillsTitle: 'Competências',
    experienceTitle: 'Experiência',
    educationTitle: 'Formação',
    languagesTitle: 'Idiomas',
    linksTitle: 'Links',
    website: 'Site',
  },
  footer: {
    tagline: 'Engenheiro de software. Sistemas de dados, ferramentas open source e jogos.',
    colophonTitle: 'Colofão',
    colophon:
      'Composto em Fraunces, Instrument Sans e JetBrains Mono. As ilustrações são geradas por código. Feito com Next.js e servido como arquivos estáticos, sem cookies e sem rastreadores.',
    source: 'Código-fonte',
    rights: 'Todos os direitos reservados.',
  },
  notFound: {
    title: 'Página não encontrada',
    body: 'Esta página não existe ou mudou de endereço.',
    cta: 'Voltar para a página inicial',
  },
};

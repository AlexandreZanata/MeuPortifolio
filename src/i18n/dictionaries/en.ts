/**
 * English copy. This file defines the shape of every dictionary: `Dictionary` is derived
 * from it, so a key added here must be translated in every other locale to compile.
 */
export const en = {
  meta: {
    siteTitle: 'Alexandre Zanata — Software Engineer',
    description:
      'Portfolio of Alexandre Zanata, a full-stack software engineer building data systems, open-source tools, mobile products and games.',
    ogAlt: 'Alexandre Zanata — software engineer. Data systems, open-source tools and games.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNavigation: 'Main',
    footerNavigation: 'Footer',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
    homeLink: 'Alexandre Zanata, home',
    external: 'external site',
  },
  nav: {
    projects: 'Projects',
    openSource: 'Open source',
    lab: 'Lab',
    about: 'About',
    contact: 'Contact',
    resume: 'Résumé',
  },
  common: {
    github: 'GitHub',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    readCaseStudy: 'Read the case study',
    allProjects: 'All projects',
    pending: 'Pending validation',
    figure: 'Fig.',
  },
  kinds: {
    personal: 'Personal project',
    organization: 'Organization project',
  },
  stages: {
    released: 'Released',
    beta: 'Public beta',
    'in-development': 'In development',
  },
  home: {
    hero: {
      eyebrow: 'Alexandre Zanata · Full-stack software engineer',
      // U+2060 (word joiner) after the hyphen keeps "open-source" on one line.
      titleLead: 'Data systems, open-\u2060source tools and games, built ',
      titleEmphasis: 'end to end',
      titleTail: '.',
      lede: 'I design, build and ship software across the whole stack: a Rust search engine that packs 224 million public company records into one file, a TypeScript toolkit for Brazilian documents, an Android fuel-price app and a real-time strategy game that runs in the browser.',
      primaryCta: 'View projects',
      figureCaption: 'One body of work, several orbits: data, tooling, product and play.',
      stackLabel: 'Working with',
      stack: ['Rust', 'TypeScript', 'Kotlin', 'Go', 'WebAssembly', 'PostgreSQL'],
    },
    work: {
      label: 'Selected work',
      title: 'Four projects, four different problems.',
      description:
        'Each one is public, documented and built to be verified rather than merely demonstrated.',
    },
    openSource: {
      label: 'Open source',
      title: 'Built in the open, documented like a product.',
      body: 'Most of what I make is public: the source, the decisions behind it and the measurements that back it. I maintain br-validators under the open-data-brazil organization and publish tools that make Brazilian public data easier to work with.',
      cta: 'Explore the open-source hub',
      principles: [
        {
          title: 'Correctness is checked, not assumed',
          body: 'OpenCNPJ verifies every source row against the snapshot it builds. br-validators requires an official citation for every algorithm.',
        },
        {
          title: 'Decisions are written down',
          body: 'Decision records, format specifications and benchmark methodology live next to the code they explain.',
        },
        {
          title: 'Automation does the routine work',
          body: 'Reference datasets refresh on a schedule, releases carry checksums, and continuous integration is the gatekeeper.',
        },
      ],
    },
    about: {
      label: 'About',
      title: 'Engineer, builder, maintainer.',
      body: 'I am a full-stack engineer with a TypeScript-first background in web applications, admin panels and platform services, and a growing body of systems work in Rust and Go. I am drawn to problems where the hard part is the data: getting it complete, keeping it correct and making it fast to query.',
      cta: 'More about me',
    },
    contact: {
      label: 'Contact',
      title: 'Have a role or a project in mind?',
      body: 'I am glad to talk about engineering roles, collaborations and open-source work.',
      cta: 'Get in touch',
    },
  },
  projects: {
    title: 'Projects',
    lede: 'Case studies of products and tools I designed and built. Each one states what it is, where it stands and what is still unfinished.',
    metaDescription:
      'Case studies by Alexandre Zanata: OpenCNPJ, br-validators, Tupi Battle Grounds and Abastevo.',
  },
  caseStudy: {
    label: 'Case study',
    /** Page title; `{name}` is replaced with the project name. */
    pageTitle: '{name} case study',
    onThisPage: 'On this page',
    sections: {
      context: 'Context',
      problem: 'Problem',
      decisions: 'Architecture decisions',
      implementation: 'Implementation',
      challenges: 'Challenges',
      evidence: 'Evidence',
    },
    facts: {
      type: 'Type',
      stage: 'Stage',
      role: 'Role',
      status: 'Status',
      stack: 'Stack',
      license: 'License',
      started: 'Started',
      links: 'Links',
    },
    evidenceSource: 'Source',
    next: 'Next project',
  },
  openSource: {
    title: 'Open source',
    lede: 'A hub for the libraries, tools and datasets I maintain, and the easiest ways to get involved.',
    metaDescription:
      'Open-source projects maintained by Alexandre Zanata and the open-data-brazil organization, with ways to contribute.',
    maintained: {
      label: 'Maintained',
      title: 'Projects with a case study',
      description: 'The work I spend most of my time on. Each has a full write-up on this site.',
    },
    organization: {
      label: 'Organization',
      title: 'open-data-brazil',
      description:
        'An organization for open tooling around Brazilian public data. It is where br-validators lives.',
      cta: 'View the organization on GitHub',
    },
    more: {
      label: 'More',
      title: 'Other public repositories',
      description: 'Smaller tools and earlier work that is public and still useful.',
      cta: 'All repositories on GitHub',
    },
    contribute: {
      label: 'Contribute',
      title: 'How to get involved',
      description: 'Contributions are welcome in every repository above. A few habits help.',
      steps: [
        {
          title: 'Read the contributor guide first',
          body: 'Each project documents its workflow, its checks and what a good change looks like.',
        },
        {
          title: 'Open an issue before large changes',
          body: 'A short discussion up front avoids work that does not fit the direction of the project.',
        },
        {
          title: 'Keep pull requests small',
          body: 'One focused change with its tests is reviewed quickly; a large mixed one is not.',
        },
      ],
      guides: 'Contributor guides',
      site: {
        title: 'This site is open source too',
        body: 'The code, the design tokens and the program that draws the illustrations are public.',
        cta: 'View the source',
      },
    },
    card: {
      updated: 'Updated',
      release: 'Latest release',
      license: 'License',
      stars: 'stars',
      repository: 'Repository',
      customLicense: 'Custom license',
    },
    snapshotNote: 'Repository data from GitHub, captured on',
  },
  lab: {
    title: 'Lab',
    lede: 'Small experiments and studies. Nothing here is needed to understand the rest of the site.',
    metaDescription:
      'Small experiments by Alexandre Zanata: alphanumeric CNPJ check digits and generative stippled illustrations.',
    cnpj: {
      label: 'Experiment 01',
      title: 'Alphanumeric CNPJ check digits',
      body: 'The 2026 CNPJ format allows letters in the first twelve positions. The two check digits are still computed modulo 11: each character is worth its character code minus 48, so digits keep their value and letters continue from 17. Type a CNPJ to see the calculation.',
      inputLabel: 'CNPJ',
      inputHint: 'Numeric or alphanumeric, with or without punctuation.',
      examples: 'Examples',
      status: {
        empty: 'Type a CNPJ, or choose an example.',
        incomplete: 'characters to go.',
        invalidCharacters:
          'Only letters and digits are allowed, and the last two positions must be digits.',
        valid: 'Valid: the check digits match.',
        invalid: 'Invalid: the check digits should be',
      },
      table: {
        caption: 'Calculation of check digit',
        character: 'Character',
        value: 'Value',
        weight: 'Weight',
        product: 'Product',
        sum: 'Sum',
        remainder: 'Remainder of the sum divided by 11',
        digit: 'Check digit',
      },
      footnote: 'The same rule is implemented and tested against official examples in',
    },
    plates: {
      label: 'Experiment 02',
      title: 'Stippled plates',
      body: 'The illustrations on this site are drawn by a short TypeScript program. Tone is rendered by dots whose spacing follows a darkness field, lines are engraved as hairlines and guilloché curves, and a seeded random generator makes every run identical.',
      cta: 'Read the generator',
      captions: [
        'Armillary sphere',
        'Strata block',
        'Guilloché seal',
        'Drop and contours',
        'Strongholds and lane',
      ],
    },
  },
  about: {
    title: 'About',
    lede: 'I build software end to end, and I care most about the parts that are easy to skip: verification, documentation and operations.',
    metaDescription:
      'About Alexandre Zanata: full-stack software engineer working with TypeScript, Rust, Kotlin and Go on data systems, open-source tools and products.',
    bio: [
      'I am a full-stack engineer. TypeScript is the language of the largest codebases I have shipped: web applications, admin panels and platform services. Around it I work in Kotlin for Android, in Go for backends and, increasingly, in Rust for the parts where performance and correctness have to be designed in.',
      'Much of my open-source work is about Brazilian public data. It is valuable and awkward in equal measure: published as large archives, in old encodings, on irregular schedules. I like turning that into tools other developers can simply use.',
      'I work best on products I can follow from the first sketch to production: the data model, the interface, the release pipeline and the documentation that lets someone else pick it up.',
    ],
    approach: {
      label: 'Approach',
      title: 'How I work',
      items: [
        {
          title: 'Start from the data',
          body: 'Most hard problems in my projects were data problems first. I model the data and its failure cases before choosing a framework.',
        },
        {
          title: 'Prefer boring infrastructure',
          body: 'One binary, one database, one server until measurements say otherwise. Fewer moving parts is a feature a single maintainer can keep.',
        },
        {
          title: 'Write the decision down',
          body: 'Decision records and format specifications cost an hour and save weeks. They are also how contributors learn the project.',
        },
        {
          title: 'Measure, then claim',
          body: 'I do not publish a performance number without the command and the raw output behind it, and I say what has not been verified.',
        },
      ],
    },
    toolbox: {
      label: 'Toolbox',
      title: 'Technologies I work with',
      note: 'Confirmed in my public repositories or listed on my GitHub profile.',
    },
    timeline: {
      label: 'Timeline',
      title: 'Recent public work',
      note: 'Dates are the creation dates of the public repositories.',
    },
    experience: {
      label: 'Experience',
      title: 'Professional experience',
    },
    education: {
      label: 'Education',
      title: 'Education',
    },
    present: 'Present',
  },
  contact: {
    title: 'Contact',
    lede: 'For roles and collaborations, write to me directly. For anything about a specific project, an issue on its repository keeps the context public.',
    metaDescription:
      'Contact Alexandre Zanata about engineering roles, collaborations and open-source work.',
    channels: {
      email: { title: 'E-mail', body: 'The best channel for roles and collaborations.' },
      linkedin: { title: 'LinkedIn', body: 'Professional profile and messages.' },
      github: { title: 'GitHub', body: 'Code, issues and discussions on every project.' },
    },
    resume: {
      title: 'Résumé',
      body: 'A one-page summary you can print or save as PDF.',
      cta: 'Open the résumé',
    },
    privacy: {
      title: 'Privacy',
      body: 'This site sets no cookies, loads no trackers and has no forms. A message goes straight from your mail client to mine.',
    },
  },
  resume: {
    title: 'Résumé',
    metaDescription:
      'Résumé of Alexandre Zanata, full-stack software engineer: projects, skills and links.',
    headline: 'Full-stack software engineer',
    print: 'Print or save as PDF',
    summaryTitle: 'Summary',
    summary:
      'Full-stack engineer who designs, builds and operates products end to end. TypeScript-first on the web, with systems work in Rust and Go and Android work in Kotlin. Maintainer of open-source tools for Brazilian public data.',
    projectsTitle: 'Selected projects',
    skillsTitle: 'Skills',
    experienceTitle: 'Experience',
    educationTitle: 'Education',
    languagesTitle: 'Languages',
    linksTitle: 'Links',
    website: 'Website',
  },
  footer: {
    tagline: 'Software engineer. Data systems, open-source tools and games.',
    colophonTitle: 'Colophon',
    colophon:
      'Set in Fraunces, Instrument Sans and JetBrains Mono. Illustrations are generated from code. Built with Next.js and served as static files, with no cookies and no trackers.',
    source: 'Source code',
    rights: 'All rights reserved.',
  },
  notFound: {
    title: 'Page not found',
    body: 'This page does not exist or has moved.',
    cta: 'Back to the home page',
  },
};

export type Dictionary = typeof en;

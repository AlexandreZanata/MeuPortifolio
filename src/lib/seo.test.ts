import { describe, expect, it } from 'vitest';
import { languageAlternates, pageMetadata } from './seo';

describe('languageAlternates', () => {
  it('lists every locale and points x-default at English', () => {
    expect(languageAlternates('projects/')).toEqual({
      en: 'https://alexandrezanata.com.br/en/projects/',
      'pt-BR': 'https://alexandrezanata.com.br/pt-br/projects/',
      'x-default': 'https://alexandrezanata.com.br/en/projects/',
    });
  });
});

describe('pageMetadata', () => {
  const metadata = pageMetadata({
    locale: 'pt-br',
    path: 'about/',
    title: 'Sobre',
    description: 'Descrição.',
    imageAlt: 'Alt.',
  });

  it('sets a self-referencing canonical URL with a trailing slash', () => {
    expect(metadata.alternates?.canonical).toBe('https://alexandrezanata.com.br/pt-br/about/');
  });

  it('uses the localized social image and locale', () => {
    expect(metadata.openGraph).toMatchObject({
      locale: 'pt_BR',
      alternateLocale: ['en_US'],
      title: 'Sobre — Alexandre Zanata',
      images: [{ url: 'https://alexandrezanata.com.br/og/pt-br.png', width: 1200, height: 630 }],
    });
  });

  it('leaves the home title untouched when asked to', () => {
    const home = pageMetadata({
      locale: 'en',
      path: '',
      title: 'Alexandre Zanata — Software Engineer',
      description: 'Description.',
      imageAlt: 'Alt.',
      absoluteTitle: true,
    });
    expect(home.title).toEqual({ absolute: 'Alexandre Zanata — Software Engineer' });
    expect(home.alternates?.canonical).toBe('https://alexandrezanata.com.br/en/');
  });
});

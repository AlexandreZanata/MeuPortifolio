import { describe, expect, it } from 'vitest';
import { isCurrentPath, routes, stripLocale, swapLocale } from './routes';

describe('routes', () => {
  it('builds locale-prefixed paths with a trailing slash', () => {
    expect(routes.home('en')).toBe('/en/');
    expect(routes.projects('pt-br')).toBe('/pt-br/projects/');
    expect(routes.project('en', 'opencnpj')).toBe('/en/projects/opencnpj/');
  });
});

describe('stripLocale', () => {
  it('removes the locale segment', () => {
    expect(stripLocale('/en/')).toBe('');
    expect(stripLocale('/pt-br/projects/opencnpj/')).toBe('projects/opencnpj/');
  });

  it('accepts paths without a trailing slash', () => {
    expect(stripLocale('/en/about')).toBe('about/');
  });
});

describe('swapLocale', () => {
  it('keeps the page and changes the locale', () => {
    expect(swapLocale('/en/projects/opencnpj/', 'pt-br')).toBe('/pt-br/projects/opencnpj/');
    expect(swapLocale('/pt-br/', 'en')).toBe('/en/');
    expect(swapLocale('/en/lab', 'pt-br')).toBe('/pt-br/lab/');
  });

  it('falls back to the home page for paths outside a locale', () => {
    expect(swapLocale('/', 'pt-br')).toBe('/pt-br/');
    expect(swapLocale('/404', 'en')).toBe('/en/');
  });
});

describe('isCurrentPath', () => {
  it('matches the home page exactly', () => {
    expect(isCurrentPath('/en/', '/en/')).toBe(true);
    expect(isCurrentPath('/en/projects/', '/en/')).toBe(false);
  });

  it('matches a section and the pages below it', () => {
    expect(isCurrentPath('/en/projects/', '/en/projects/')).toBe(true);
    expect(isCurrentPath('/en/projects/opencnpj', '/en/projects/')).toBe(true);
    expect(isCurrentPath('/en/about/', '/en/projects/')).toBe(false);
  });
});

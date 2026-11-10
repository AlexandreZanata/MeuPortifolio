import type { Locale } from './config';
import { en, type Dictionary } from './dictionaries/en';
import { ptBR } from './dictionaries/pt-br';

const dictionaries: Record<Locale, Dictionary> = {
  en,
  'pt-br': ptBR,
};

/**
 * Dictionaries are only read by Server Components, so no translation ships to the
 * browser unless a page passes specific strings to a client component.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };

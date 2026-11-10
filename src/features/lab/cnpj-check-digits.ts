/**
 * Check digits of the Brazilian CNPJ, including the alphanumeric format.
 *
 * Each of the first 12 characters is worth its character code minus 48, so digits keep
 * their face value and letters continue from there (A = 17 ... Z = 42). The two check
 * digits are computed modulo 11 and are always numeric.
 */
const BASE_LENGTH = 12;
const FULL_LENGTH = 14;
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;
const SECOND_WEIGHTS = [6, ...FIRST_WEIGHTS] as const;

export interface CheckDigitTerm {
  readonly character: string;
  readonly value: number;
  readonly weight: number;
  readonly product: number;
}

export interface CheckDigitStep {
  readonly terms: readonly CheckDigitTerm[];
  readonly sum: number;
  readonly remainder: number;
  readonly digit: number;
}

export type CnpjAnalysis =
  | { readonly status: 'empty' }
  | { readonly status: 'invalid-characters'; readonly normalized: string }
  | { readonly status: 'incomplete'; readonly normalized: string; readonly missing: number }
  | {
      readonly status: 'valid' | 'invalid';
      readonly normalized: string;
      readonly formatted: string;
      readonly steps: readonly [CheckDigitStep, CheckDigitStep];
      readonly expected: string;
      readonly given: string;
    };

/** Uppercases and removes the punctuation people type: dots, slash, dash and spaces. */
export function normalizeCnpj(input: string): string {
  return input.toUpperCase().replace(/[\s./-]/g, '');
}

export function formatCnpj(normalized: string): string {
  return normalized.replace(/^(.{2})(.{3})(.{3})(.{4})(.{2})$/, '$1.$2.$3/$4-$5');
}

function checkDigitStep(characters: string, weights: readonly number[]): CheckDigitStep {
  const terms = [...characters].map((character, index) => {
    const value = character.charCodeAt(0) - 48;
    const weight = weights[index] ?? 0;
    return { character, value, weight, product: value * weight };
  });
  const sum = terms.reduce((total, term) => total + term.product, 0);
  const remainder = sum % 11;
  return { terms, sum, remainder, digit: remainder < 2 ? 0 : 11 - remainder };
}

/** Both check-digit calculations for the first 12 characters of a CNPJ. */
export function computeCheckDigits(base: string): readonly [CheckDigitStep, CheckDigitStep] {
  const first = checkDigitStep(base, FIRST_WEIGHTS);
  const second = checkDigitStep(`${base}${first.digit}`, SECOND_WEIGHTS);
  return [first, second];
}

export function analyseCnpj(input: string): CnpjAnalysis {
  const normalized = normalizeCnpj(input);
  if (normalized.length === 0) return { status: 'empty' };

  const base = normalized.slice(0, BASE_LENGTH);
  const given = normalized.slice(BASE_LENGTH);
  if (!/^[0-9A-Z]*$/.test(base) || !/^[0-9]*$/.test(given) || normalized.length > FULL_LENGTH) {
    return { status: 'invalid-characters', normalized };
  }
  if (normalized.length < FULL_LENGTH) {
    return { status: 'incomplete', normalized, missing: FULL_LENGTH - normalized.length };
  }

  const steps = computeCheckDigits(base);
  const expected = `${steps[0].digit}${steps[1].digit}`;
  return {
    status: expected === given ? 'valid' : 'invalid',
    normalized,
    formatted: formatCnpj(normalized),
    steps,
    expected,
    given,
  };
}

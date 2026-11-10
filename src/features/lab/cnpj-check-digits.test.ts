import { describe, expect, it } from 'vitest';
import { analyseCnpj, computeCheckDigits, formatCnpj, normalizeCnpj } from './cnpj-check-digits';

describe('normalizeCnpj', () => {
  it('uppercases and strips punctuation and spaces', () => {
    expect(normalizeCnpj(' 12.abc.345/01de-35 ')).toBe('12ABC34501DE35');
  });
});

describe('computeCheckDigits', () => {
  // Worked by hand from the rule: value = character code - 48, weights 5..2 then 9..2.
  it('reproduces the official alphanumeric example step by step', () => {
    const [first, second] = computeCheckDigits('12ABC34501DE');
    expect(first.terms.map((term) => term.value)).toEqual([
      1, 2, 17, 18, 19, 3, 4, 5, 0, 1, 20, 21,
    ]);
    expect(first).toMatchObject({ sum: 459, remainder: 8, digit: 3 });
    expect(second).toMatchObject({ sum: 424, remainder: 6, digit: 5 });
  });

  it('maps remainders below two to a zero digit', () => {
    const [first] = computeCheckDigits('000000000001');
    expect(first.remainder).toBeLessThan(2 + 9);
    expect(computeCheckDigits('000000000000')[0].digit).toBe(0);
  });
});

describe('analyseCnpj', () => {
  it.each([
    ['12.ABC.345/01DE-35', '12.ABC.345/01DE-35'],
    ['00.000.000/0001-91', '00.000.000/0001-91'],
    ['33000167000101', '33.000.167/0001-01'],
    ['11.222.333/0001-81', '11.222.333/0001-81'],
  ])('accepts %s', (input, formatted) => {
    expect(analyseCnpj(input)).toMatchObject({ status: 'valid', formatted });
  });

  it('reports the expected digits for a wrong CNPJ', () => {
    expect(analyseCnpj('12.ABC.345/01DE-36')).toMatchObject({
      status: 'invalid',
      expected: '35',
      given: '36',
    });
  });

  it('distinguishes empty, incomplete and malformed input', () => {
    expect(analyseCnpj('  ')).toEqual({ status: 'empty' });
    expect(analyseCnpj('12.ABC')).toMatchObject({ status: 'incomplete', missing: 9 });
    expect(analyseCnpj('12.ABC.345/01DE-3X')).toMatchObject({ status: 'invalid-characters' });
    expect(analyseCnpj('12.AB$.345/01DE-35')).toMatchObject({ status: 'invalid-characters' });
    expect(analyseCnpj('12ABC34501DE350')).toMatchObject({ status: 'invalid-characters' });
  });
});

describe('formatCnpj', () => {
  it('applies the standard mask', () => {
    expect(formatCnpj('12ABC34501DE35')).toBe('12.ABC.345/01DE-35');
  });
});

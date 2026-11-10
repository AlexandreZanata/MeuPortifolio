import { describe, expect, it } from 'vitest';
import { tokenizeRichText } from './rich-text';

describe('tokenizeRichText', () => {
  it('returns plain text untouched', () => {
    expect(tokenizeRichText('Nothing special here.')).toEqual([
      { type: 'text', value: 'Nothing special here.' },
    ]);
  });

  it('splits inline code and emphasis', () => {
    expect(tokenizeRichText('Run `verify --sources` and *nothing* is lost.')).toEqual([
      { type: 'text', value: 'Run ' },
      { type: 'code', value: 'verify --sources' },
      { type: 'text', value: ' and ' },
      { type: 'emphasis', value: 'nothing' },
      { type: 'text', value: ' is lost.' },
    ]);
  });

  it('keeps asterisks inside code literal', () => {
    expect(tokenizeRichText('`a * b * c`')).toEqual([{ type: 'code', value: 'a * b * c' }]);
  });

  it('does not treat a lone asterisk or a multiplication as emphasis', () => {
    expect(tokenizeRichText('2 * 3 * 4')).toEqual([{ type: 'text', value: '2 * 3 * 4' }]);
    expect(tokenizeRichText('a footnote*')).toEqual([{ type: 'text', value: 'a footnote*' }]);
  });
});

import { describe, expect, it } from 'vitest';
import { collectPending, confirmed, isPending, pending } from './pending';
import { profile } from './profile';

describe('pending', () => {
  it('distinguishes pending markers from real values', () => {
    expect(isPending(pending('e-mail'))).toBe(true);
    expect(isPending('me@example.com')).toBe(false);
    expect(isPending(null)).toBe(false);
    expect(isPending({ pending: false })).toBe(false);
  });

  it('unwraps confirmed values only', () => {
    expect(confirmed<string>('value')).toBe('value');
    expect(confirmed<string>(pending('missing'))).toBeUndefined();
  });

  it('collects pending fields with their paths, including inside arrays', () => {
    const content = {
      name: 'Confirmed',
      email: pending('E-mail'),
      links: [{ url: 'https://example.com' }, { url: pending('Second link') }],
    };
    expect(collectPending(content)).toEqual([
      { path: 'email', note: 'E-mail' },
      { path: 'links[1].url', note: 'Second link' },
    ]);
  });
});

/**
 * The list of facts the site owner still has to confirm. This snapshot is the audit trail:
 * filling a field, or adding a new pending one, has to be acknowledged here.
 * Run `pnpm test -u` after an intentional change. See docs/CONTENT.md.
 */
describe('profile', () => {
  it('lists exactly the fields that are still pending validation', () => {
    expect(collectPending(profile).map((item) => item.path)).toMatchInlineSnapshot(`
      [
        "email",
        "linkedin",
        "location",
        "spokenLanguages",
        "experience",
        "education",
      ]
    `);
  });
});

import { describe, expect, it } from 'vitest';
import { githubSnapshot, parseSnapshot } from './snapshot';

const repository = {
  url: 'https://github.com/owner/name',
  description: null,
  license: 'MIT',
  stars: 3,
  forks: 0,
  archived: false,
  createdAt: '2026-01-01T00:00:00Z',
  pushedAt: '2026-02-01T00:00:00Z',
  latestRelease: null,
};

describe('parseSnapshot', () => {
  it('accepts a well-formed snapshot', () => {
    const snapshot = parseSnapshot({
      generatedAt: '2026-02-02T00:00:00Z',
      repositories: { 'owner/name': repository },
    });
    expect(snapshot.repositories['owner/name']?.license).toBe('MIT');
  });

  it('rejects a snapshot without the top-level fields', () => {
    expect(() => parseSnapshot({ repositories: {} })).toThrow(/generatedAt/);
    expect(() => parseSnapshot(null)).toThrow();
  });

  it('names the entry that has the wrong shape', () => {
    const broken = { ...repository, stars: '3' };
    expect(() =>
      parseSnapshot({ generatedAt: 'now', repositories: { 'owner/name': broken } }),
    ).toThrow(/owner\/name/);
  });

  it('rejects URLs that do not point at GitHub', () => {
    const elsewhere = { ...repository, url: 'https://example.com/owner/name' };
    expect(() =>
      parseSnapshot({ generatedAt: 'now', repositories: { 'owner/name': elsewhere } }),
    ).toThrow(/owner\/name/);
  });
});

describe('committed snapshot', () => {
  it('is valid and dated', () => {
    expect(Number.isNaN(Date.parse(githubSnapshot.generatedAt))).toBe(false);
    expect(Object.keys(githubSnapshot.repositories).length).toBeGreaterThan(0);
  });
});

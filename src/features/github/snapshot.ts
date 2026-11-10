import rawSnapshot from '@/content/github/snapshot.json';

/**
 * Typed access to the committed GitHub snapshot. The file is produced by
 * `scripts/update-github-snapshot.ts`; nothing in the site calls the GitHub API.
 *
 * The JSON is validated when this module loads, so a malformed snapshot fails the build
 * instead of rendering a broken page.
 */
export interface ReleaseSnapshot {
  readonly tag: string;
  readonly publishedAt: string;
  readonly url: string;
}

export interface RepositorySnapshot {
  readonly url: string;
  readonly description: string | null;
  readonly license: string | null;
  readonly stars: number;
  readonly forks: number;
  readonly archived: boolean;
  readonly createdAt: string;
  readonly pushedAt: string;
  readonly latestRelease: ReleaseSnapshot | null;
}

export interface GithubSnapshot {
  readonly generatedAt: string;
  readonly repositories: Readonly<Record<string, RepositorySnapshot>>;
}

/** Star counts below this are not displayed: a small number says nothing useful. */
export const STAR_DISPLAY_THRESHOLD = 5;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string';

function isRelease(value: unknown): value is ReleaseSnapshot {
  return (
    isRecord(value) &&
    typeof value.tag === 'string' &&
    typeof value.publishedAt === 'string' &&
    typeof value.url === 'string'
  );
}

function isRepository(value: unknown): value is RepositorySnapshot {
  return (
    isRecord(value) &&
    typeof value.url === 'string' &&
    value.url.startsWith('https://github.com/') &&
    isNullableString(value.description) &&
    isNullableString(value.license) &&
    typeof value.stars === 'number' &&
    typeof value.forks === 'number' &&
    typeof value.archived === 'boolean' &&
    typeof value.createdAt === 'string' &&
    typeof value.pushedAt === 'string' &&
    (value.latestRelease === null || isRelease(value.latestRelease))
  );
}

/** Validates untrusted JSON as a snapshot, naming the first entry that is wrong. */
export function parseSnapshot(value: unknown): GithubSnapshot {
  if (!isRecord(value) || typeof value.generatedAt !== 'string' || !isRecord(value.repositories)) {
    throw new Error('GitHub snapshot: expected { generatedAt, repositories }');
  }
  for (const [name, repository] of Object.entries(value.repositories)) {
    if (!isRepository(repository)) {
      throw new Error(`GitHub snapshot: entry "${name}" has an unexpected shape`);
    }
  }
  return value as unknown as GithubSnapshot;
}

export const githubSnapshot: GithubSnapshot = parseSnapshot(rawSnapshot);

export function getRepository(fullName: string): RepositorySnapshot | undefined {
  return githubSnapshot.repositories[fullName];
}

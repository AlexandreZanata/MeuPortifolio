/**
 * Refreshes src/content/github/snapshot.json from the GitHub REST API.
 *
 * The site never calls GitHub while it is being built or viewed: pages read this committed
 * snapshot instead (docs/adr/0004-github-snapshot.md). That keeps builds deterministic and
 * immune to rate limits. This script is the only place that talks to the API.
 *
 * Failure policy: a repository that cannot be fetched keeps its previous entry, and the
 * script exits non-zero so a scheduled run is visibly red without publishing bad data.
 *
 * Usage: `pnpm github:snapshot` (set GITHUB_TOKEN to raise the rate limit from 60 to 5000/h).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

interface ReleaseSnapshot {
  tag: string;
  publishedAt: string;
  url: string;
}

interface RepositorySnapshot {
  url: string;
  description: string | null;
  license: string | null;
  stars: number;
  forks: number;
  archived: boolean;
  createdAt: string;
  pushedAt: string;
  latestRelease: ReleaseSnapshot | null;
}

interface Snapshot {
  generatedAt: string;
  repositories: Record<string, RepositorySnapshot>;
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'github');
const snapshotPath = join(root, 'snapshot.json');
const trackedPath = join(root, 'tracked-repositories.json');

const TIMEOUT_MS = 8000;
const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'alexandrezanata.com.br snapshot',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

/** Returns the parsed body, or `null` for a 404 (e.g. a repository with no releases). */
async function getJson(path: string): Promise<Record<string, unknown> | null> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${path}`);
  return (await response.json()) as Record<string, unknown>;
}

function text(value: unknown, field: string): string {
  if (typeof value !== 'string') throw new Error(`Expected "${field}" to be a string`);
  return value;
}

function count(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Expected "${field}" to be a number`);
  }
  return value;
}

async function fetchRepository(fullName: string): Promise<RepositorySnapshot> {
  const repo = await getJson(`/repos/${fullName}`);
  if (!repo) throw new Error(`Repository ${fullName} was not found`);
  const release = await getJson(`/repos/${fullName}/releases/latest`);
  const license = repo.license as { spdx_id?: unknown } | null;
  const spdx = typeof license?.spdx_id === 'string' ? license.spdx_id : null;

  return {
    url: text(repo.html_url, 'html_url'),
    description: typeof repo.description === 'string' ? repo.description : null,
    // "NOASSERTION" means GitHub found a licence file it does not recognise.
    license: spdx && spdx !== 'NOASSERTION' ? spdx : null,
    stars: count(repo.stargazers_count, 'stargazers_count'),
    forks: count(repo.forks_count, 'forks_count'),
    archived: repo.archived === true,
    createdAt: text(repo.created_at, 'created_at'),
    pushedAt: text(repo.pushed_at, 'pushed_at'),
    latestRelease: release
      ? {
          tag: text(release.tag_name, 'tag_name'),
          publishedAt: text(release.published_at, 'published_at'),
          url: text(release.html_url, 'html_url'),
        }
      : null,
  };
}

const tracked = JSON.parse(readFileSync(trackedPath, 'utf8')) as string[];
let previous: Snapshot = { generatedAt: '', repositories: {} };
try {
  previous = JSON.parse(readFileSync(snapshotPath, 'utf8')) as Snapshot;
} catch {
  // First run: there is nothing to fall back to.
}

const repositories: Record<string, RepositorySnapshot> = {};
const failures: string[] = [];

for (const fullName of tracked) {
  try {
    repositories[fullName] = await fetchRepository(fullName);
    console.log(`ok       ${fullName}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    const fallback = previous.repositories[fullName];
    if (fallback) repositories[fullName] = fallback;
    failures.push(fullName);
    console.error(`${fallback ? 'kept    ' : 'missing '} ${fullName}: ${reason}`);
  }
}

const snapshot: Snapshot = { generatedAt: new Date().toISOString(), repositories };
writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);

if (failures.length > 0) {
  console.error(`\n${failures.length} of ${tracked.length} repositories could not be refreshed.`);
  process.exit(1);
}

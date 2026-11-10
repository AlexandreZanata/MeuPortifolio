import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getRepository } from '@/features/github/snapshot';
import { locales } from '@/i18n/config';
import { en } from '@/i18n/dictionaries/en';
import { ptBR } from '@/i18n/dictionaries/pt-br';
import trackedRepositories from './github/tracked-repositories.json';
import { allOpenSourceEntries } from './open-source';
import { getProject, projects } from './projects';

const publicDir = join(process.cwd(), 'public');

/** Every string in a nested value, with its path, so a failure names the culprit. */
function strings(value: unknown, path = ''): { path: string; value: string }[] {
  if (typeof value === 'string') return [{ path, value }];
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${path}[${i}]`));
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, item]) =>
      strings(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

const shape = (value: unknown): string[] => strings(value).map((entry) => entry.path);

describe('projects', () => {
  it('have unique, URL-safe slugs', () => {
    const slugs = projects.map((project) => project.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(projects.map((project) => [project.meta.slug, project] as const))(
    '%s is complete in every locale',
    (_slug, project) => {
      for (const locale of locales) {
        const content = project.content[locale];
        const empty = strings(content).filter((entry) => entry.value.trim() === '');
        expect(empty).toEqual([]);
        expect(content.context.length).toBeGreaterThan(0);
        expect(content.problem.length).toBeGreaterThan(0);
        expect(content.decisions.length).toBeGreaterThanOrEqual(3);
        expect(content.implementation.length).toBeGreaterThan(0);
        expect(content.challenges.length).toBeGreaterThan(0);
        expect(content.evidence.figures.length).toBeGreaterThanOrEqual(3);
        expect(content.highlights).toHaveLength(2);
        // Used as the meta description: long enough to be useful, short enough not to be cut.
        expect(content.summary.length).toBeGreaterThan(70);
        expect(content.summary.length).toBeLessThanOrEqual(260);
      }
    },
  );

  it('have the same structure in every locale', () => {
    for (const project of projects) {
      expect(shape(project.content['pt-br'])).toEqual(shape(project.content.en));
    }
  });

  it('point at assets and links that exist', () => {
    for (const { meta, content } of projects) {
      expect(existsSync(join(publicDir, meta.plate.src))).toBe(true);
      expect(meta.startedAt).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      for (const link of meta.links) expect(link.href).toMatch(/^https:\/\//);
      for (const locale of locales) {
        expect(content[locale].evidence.source.href).toMatch(/^https:\/\/github\.com\//);
      }
    }
  });

  it('are present in the GitHub snapshot', () => {
    for (const { meta } of projects) {
      expect(getRepository(meta.repository), meta.repository).toBeDefined();
    }
  });
});

describe('open-source entries', () => {
  it('are unique and tracked by the snapshot script', () => {
    const repositories = allOpenSourceEntries.map((entry) => entry.repository);
    expect(new Set(repositories).size).toBe(repositories.length);
    expect([...repositories].sort()).toEqual([...trackedRepositories].sort());
  });

  it('link only to case studies that exist', () => {
    for (const entry of allOpenSourceEntries) {
      if (entry.caseStudy) expect(getProject(entry.caseStudy), entry.caseStudy).toBeDefined();
    }
  });
});

describe('dictionaries', () => {
  it('have identical keys in every locale', () => {
    expect(shape(ptBR)).toEqual(shape(en));
  });

  it('contain no empty strings', () => {
    for (const dictionary of [en, ptBR]) {
      expect(strings(dictionary).filter((entry) => entry.value.trim() === '')).toEqual([]);
    }
  });

  it('keep meta descriptions within a sensible length', () => {
    for (const dictionary of [en, ptBR]) {
      const descriptions = strings(dictionary).filter(
        (entry) => entry.path.endsWith('metaDescription') || entry.path === 'meta.description',
      );
      expect(descriptions.length).toBeGreaterThan(5);
      for (const { path, value } of descriptions) {
        expect(value.length, path).toBeGreaterThan(60);
        expect(value.length, path).toBeLessThanOrEqual(170);
      }
    }
  });
});

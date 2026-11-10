import { abastevo } from './abastevo';
import { brValidators } from './br-validators';
import { opencnpj } from './opencnpj';
import { tupiBattleGrounds } from './tupi-battle-grounds';
import type { Project } from './types';

/** Display order: the array position is the project's index number across the site. */
export const projects: readonly Project[] = [opencnpj, brValidators, tupiBattleGrounds, abastevo];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.meta.slug === slug);
}

/** Two-digit index shown next to a project, e.g. "01". */
export function projectNumber(slug: string): string {
  const index = projects.findIndex((project) => project.meta.slug === slug);
  return String(index + 1).padStart(2, '0');
}

/** The project after this one, wrapping around, for the pager at the end of a case study. */
export function nextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.meta.slug === slug);
  const next = projects[(index + 1) % projects.length];
  if (!next) throw new Error(`No project follows "${slug}"`);
  return next;
}

export type { CaseStudy, Project, ProjectKind, ProjectMeta, ProjectStage } from './types';

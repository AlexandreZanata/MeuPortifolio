import type { Localized } from '@/i18n/config';

/**
 * Who owns the work. Kept explicit so a visitor can tell a personal project from a
 * project maintained inside an organization (and, later, from contributions or client work).
 */
export type ProjectKind = 'personal' | 'organization';

/** How far along the project is, stated conservatively. */
export type ProjectStage = 'released' | 'beta' | 'in-development';

export type ProjectLinkKind = 'repository' | 'live' | 'docs' | 'playground' | 'release';

export interface ProjectLink {
  readonly kind: ProjectLinkKind;
  readonly href: string;
  readonly label: Localized<string>;
}

export interface Plate {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

/** Language-independent facts about a project. */
export interface ProjectMeta {
  readonly slug: string;
  readonly name: string;
  /** `owner/name` on GitHub; also the key into the GitHub snapshot. */
  readonly repository: `${string}/${string}`;
  readonly kind: ProjectKind;
  readonly stage: ProjectStage;
  /** Month the repository was created, `YYYY-MM`. */
  readonly startedAt: string;
  readonly stack: readonly string[];
  readonly license: string;
  readonly plate: Plate;
  readonly links: readonly ProjectLink[];
}

export interface Decision {
  readonly title: string;
  readonly rationale: string;
}

export interface Challenge {
  readonly title: string;
  readonly body: string;
}

export interface EvidenceFigure {
  readonly label: string;
  readonly value: string;
  readonly note?: string;
}

export interface Evidence {
  /** Where the figures come from and under which conditions they were measured. */
  readonly intro: string;
  readonly figures: readonly EvidenceFigure[];
  readonly source: { readonly label: string; readonly href: string };
}

/**
 * The translatable part of a project. Strings may use two inline marks, rendered by
 * `RichText`: `backticks` for code and *asterisks* for emphasis.
 */
export interface CaseStudy {
  readonly tagline: string;
  /** One or two sentences: used on cards and as the meta description. */
  readonly summary: string;
  readonly role: string;
  /** A short, honest statement of where the project stands today. */
  readonly status: string;
  readonly plateCaption: string;
  /** Two short lines for the résumé. */
  readonly highlights: readonly string[];
  readonly context: readonly string[];
  readonly problem: readonly string[];
  readonly decisions: readonly Decision[];
  readonly implementation: readonly string[];
  readonly challenges: readonly Challenge[];
  readonly evidence: Evidence;
}

export interface Project {
  readonly meta: ProjectMeta;
  readonly content: Localized<CaseStudy>;
}

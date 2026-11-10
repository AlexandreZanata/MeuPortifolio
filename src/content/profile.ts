import type { Localized } from '@/i18n/config';
import { pending, type Maybe } from './pending';

export interface ExperienceItem {
  readonly organization: string;
  readonly role: Localized<string>;
  /** `YYYY-MM`. */
  readonly start: string;
  /** `YYYY-MM`, or `null` for a current position. */
  readonly end: string | null;
  readonly highlights: Localized<readonly string[]>;
}

export interface EducationItem {
  readonly institution: string;
  readonly degree: Localized<string>;
  readonly start: string;
  readonly end: string | null;
}

export interface ToolboxGroup {
  readonly label: Localized<string>;
  readonly items: readonly string[];
}

export interface Profile {
  readonly name: string;
  readonly github: { readonly handle: string; readonly url: string };
  readonly organization: { readonly name: string; readonly url: string };
  readonly email: Maybe<string>;
  readonly linkedin: Maybe<string>;
  readonly location: Maybe<Localized<string>>;
  readonly spokenLanguages: Maybe<Localized<readonly string[]>>;
  readonly experience: Maybe<readonly ExperienceItem[]>;
  readonly education: Maybe<readonly EducationItem[]>;
  readonly toolbox: readonly ToolboxGroup[];
}

/**
 * Everything here is either verifiable from public repositories or explicitly pending.
 * Fill a pending field by replacing `pending(...)` with the real value; the type checker
 * will tell you the expected shape.
 */
export const profile: Profile = {
  name: 'Alexandre Zanata',
  github: { handle: 'AlexandreZanata', url: 'https://github.com/AlexandreZanata' },
  organization: { name: 'open-data-brazil', url: 'https://github.com/open-data-brazil' },

  email: pending('Public contact e-mail address'),
  linkedin: pending('LinkedIn profile URL'),
  location: pending('City and country to display, in both languages'),
  spokenLanguages: pending('Spoken languages and proficiency levels'),
  experience: pending('Employment history: organization, role, dates and highlights'),
  education: pending('Education: institution, degree and dates'),

  // Technologies confirmed in the public repositories or listed on the GitHub profile.
  toolbox: [
    {
      label: { en: 'Languages', 'pt-br': 'Linguagens' },
      items: ['TypeScript', 'Rust', 'Kotlin', 'Go', 'Python', 'PHP'],
    },
    {
      label: { en: 'Frontend and mobile', 'pt-br': 'Frontend e mobile' },
      items: ['React', 'Next.js', 'Vue', 'Astro', 'Jetpack Compose', 'WebAssembly'],
    },
    {
      label: { en: 'Backend and data', 'pt-br': 'Backend e dados' },
      items: ['Axum', 'Tokio', 'chi', 'PostgreSQL', 'PostGIS', 'SQLite'],
    },
    {
      label: { en: 'Platform', 'pt-br': 'Plataforma' },
      items: ['Linux', 'Docker', 'Kubernetes', 'GitHub Actions', 'Caddy'],
    },
  ],
};

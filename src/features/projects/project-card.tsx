import Link from 'next/link';
import { ArrowRight } from '@/components/ui/icons';
import { PlateImage } from '@/components/ui/plate';
import { TagList } from '@/components/ui/tag';
import { projectNumber, type Project } from '@/content/projects';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';
import { cn } from '@/lib/cn';

export interface ProjectCardProps {
  readonly project: Project;
  readonly locale: Locale;
  readonly dict: Dictionary;
  /** On wide screens the card spans the row and sets its plate beside the text. */
  readonly featured?: boolean;
  /** Heading level of the project name, so the card fits the outline of its page. */
  readonly headingLevel?: 'h2' | 'h3';
}

/**
 * A project teaser. The project name is the only link: its hit area is stretched over the
 * whole card, so there is one tab stop and one accessible name per card.
 */
export function ProjectCard({
  project,
  locale,
  dict,
  featured = false,
  headingLevel: Heading = 'h3',
}: ProjectCardProps) {
  const { meta } = project;
  const content = project.content[locale];

  return (
    <li className={cn('group relative', featured && 'lg:col-span-3')}>
      <article
        className={cn(
          'flex h-full flex-col',
          featured && 'lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12',
        )}
      >
        <div
          className={cn(
            'overflow-hidden rounded-sm border border-rule bg-paper px-[8%] py-[6%] transition-colors duration-300 ease-editorial group-hover:border-ink',
            featured && 'lg:col-span-7',
          )}
        >
          <PlateImage
            {...meta.plate}
            className="transition-transform duration-700 ease-editorial group-hover:scale-[1.035]"
          />
        </div>

        <div className={cn('mt-6 flex flex-1 flex-col', featured && 'lg:col-span-5 lg:mt-0')}>
          <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 label text-ink-muted">
            <span>
              <span className="text-accent">{projectNumber(meta.slug)}</span>
              <span aria-hidden="true"> — </span>
              {dict.kinds[meta.kind]}
            </span>
            <span>{dict.stages[meta.stage]}</span>
          </p>

          <Heading className={cn('mt-4 display text-title-2', featured && 'lg:text-title-1')}>
            <Link
              href={routes.project(locale, meta.slug)}
              className="decoration-accent decoration-1 underline-offset-[0.18em] group-hover:underline after:absolute after:inset-0"
            >
              {meta.name}
            </Link>
          </Heading>

          <p className={cn('mt-3 text-ink-soft', featured && 'lg:text-lede')}>{content.tagline}</p>
          {featured ? <p className="mt-4 text-ink-soft max-lg:hidden">{content.summary}</p> : null}

          <TagList items={meta.stack.slice(0, 4)} className="mt-5" />

          <p
            aria-hidden="true"
            className="mt-auto flex items-center gap-2 pt-6 text-[0.9375rem] font-medium"
          >
            {dict.common.readCaseStudy}
            <ArrowRight className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" />
          </p>
        </div>
      </article>
    </li>
  );
}

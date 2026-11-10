import { ArrowUpRight } from '@/components/ui/icons';
import { SmartLink } from '@/components/ui/smart-link';
import { TagList } from '@/components/ui/tag';
import { TextLink } from '@/components/ui/text-link';
import type { OpenSourceEntry } from '@/content/open-source';
import { getProject } from '@/content/projects';
import { getRepository, STAR_DISPLAY_THRESHOLD } from '@/features/github/snapshot';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';
import { formatDate } from '@/lib/format';

export interface RepositoryCardProps {
  readonly entry: OpenSourceEntry;
  readonly locale: Locale;
  readonly dict: Dictionary;
  readonly headingLevel?: 'h3' | 'h4';
}

/**
 * One repository: curated summary and stack from the content layer, live facts (licence,
 * last update, latest release) from the GitHub snapshot. Every snapshot field is optional
 * in the layout, so a repository missing from the snapshot still renders correctly.
 */
export function RepositoryCard({
  entry,
  locale,
  dict,
  headingLevel: Heading = 'h3',
}: RepositoryCardProps) {
  const labels = dict.openSource.card;
  const snapshot = getRepository(entry.repository);
  const project = entry.caseStudy ? getProject(entry.caseStudy) : undefined;
  const url = snapshot?.url ?? `https://github.com/${entry.repository}`;
  const license = project?.meta.license ?? snapshot?.license;
  const [owner] = entry.repository.split('/');

  const facts: { label: string; value: string }[] = [];
  if (license) facts.push({ label: labels.license, value: license });
  if (snapshot) {
    facts.push({ label: labels.updated, value: formatDate(snapshot.pushedAt, locale) });
  }
  if (snapshot?.latestRelease) {
    facts.push({ label: labels.release, value: snapshot.latestRelease.tag });
  }

  return (
    <li className="flex flex-col rounded-sm border border-rule bg-paper-raised p-6 transition-colors duration-300 ease-editorial hover:border-rule-strong">
      <p className="flex items-center justify-between gap-4 label text-ink-muted">
        <span>{owner}</span>
        {snapshot && snapshot.stars >= STAR_DISPLAY_THRESHOLD ? (
          <span>
            {snapshot.stars} {labels.stars}
          </span>
        ) : null}
      </p>

      <Heading className="mt-3 display text-title-3">
        <SmartLink
          href={url}
          className="inline-flex items-center gap-2 decoration-accent decoration-1 underline-offset-[0.18em] hover:underline"
        >
          {entry.name}
          <ArrowUpRight className="shrink-0 text-ink-muted" />
        </SmartLink>
      </Heading>

      <p className="mt-3 text-ink-soft">{entry.summary[locale]}</p>
      <TagList items={entry.tech} className="mt-4" />

      {facts.length > 0 ? (
        <dl className="mt-6 grid gap-1.5 border-t border-rule pt-4 text-sm text-ink-soft">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-wrap justify-between gap-x-4">
              <dt className="text-ink-muted">{fact.label}</dt>
              <dd className="text-right font-mono text-[0.8125rem] break-all">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {project ? (
        <p className="mt-auto pt-6">
          <TextLink href={routes.project(locale, project.meta.slug)} arrow>
            {dict.common.readCaseStudy}
          </TextLink>
        </p>
      ) : null}
    </li>
  );
}

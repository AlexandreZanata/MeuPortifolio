import type { ReactNode } from 'react';
import { RichText } from '@/components/ui/rich-text';
import { TagList } from '@/components/ui/tag';
import { TextLink } from '@/components/ui/text-link';
import type { CaseStudy, Project } from '@/content/projects';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { formatMonth } from '@/lib/format';

/** Ids of the case-study sections, in reading order. They are also the anchor targets. */
export const caseStudySections = [
  'context',
  'problem',
  'decisions',
  'implementation',
  'challenges',
  'evidence',
] as const;

export type CaseStudySectionId = (typeof caseStudySections)[number];

/** The fact sheet beside the plate: what kind of project this is and where it stands. */
export function ProjectFacts({
  project,
  locale,
  dict,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
}) {
  const { meta } = project;
  const content = project.content[locale];
  const labels = dict.caseStudy.facts;

  const rows: { label: string; value: ReactNode }[] = [
    { label: labels.type, value: dict.kinds[meta.kind] },
    { label: labels.stage, value: dict.stages[meta.stage] },
    { label: labels.status, value: content.status },
    { label: labels.role, value: content.role },
    { label: labels.started, value: formatMonth(meta.startedAt, locale) },
    { label: labels.license, value: meta.license },
    { label: labels.stack, value: <TagList items={meta.stack} /> },
    {
      label: labels.links,
      value: (
        <ul className="grid gap-1.5">
          {meta.links.map((link) => (
            <li key={link.href}>
              <TextLink href={link.href} arrow>
                {link.label[locale]}
              </TextLink>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <dl className="border-t border-ink">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-b border-rule py-3.5"
        >
          <dt className="pt-1 label text-ink-muted">{row.label}</dt>
          <dd className="min-w-0">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** In-page navigation. Plain anchors: no scroll listeners, and it works without scripts. */
export function SectionNav({ dict }: { dict: Dictionary }) {
  return (
    <nav
      aria-label={dict.caseStudy.onThisPage}
      className="sticky top-[calc(var(--header-height)+2rem)]"
    >
      <p className="label text-ink-muted">{dict.caseStudy.onThisPage}</p>
      <ol className="mt-4 border-l border-rule">
        {caseStudySections.map((id, index) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-ink-soft transition-colors hover:border-accent hover:text-ink"
            >
              <span aria-hidden="true" className="font-mono text-xs leading-[1.6] text-ink-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              {dict.caseStudy.sections[id]}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Section({
  id,
  index,
  title,
  children,
}: {
  id: CaseStudySectionId;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} id={id}>
      <p aria-hidden="true" className="label text-accent">
        {String(index + 1).padStart(2, '0')}
      </p>
      <h2 id={`${id}-title`} className="mt-3 display text-title-1">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Prose({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="grid max-w-[66ch] gap-5 text-[1.0625rem] leading-[1.7] text-ink-soft">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>
          <RichText>{paragraph}</RichText>
        </p>
      ))}
    </div>
  );
}

/** The body of a case study: six sections in a fixed order, the same for every project. */
export function CaseStudyBody({ content, dict }: { content: CaseStudy; dict: Dictionary }) {
  const titles = dict.caseStudy.sections;

  return (
    <div className="grid gap-16 lg:gap-24">
      <Section id="context" index={0} title={titles.context}>
        <Prose paragraphs={content.context} />
      </Section>

      <Section id="problem" index={1} title={titles.problem}>
        <Prose paragraphs={content.problem} />
      </Section>

      <Section id="decisions" index={2} title={titles.decisions}>
        <ol className="border-t border-ink">
          {content.decisions.map((decision, index) => (
            <li
              key={decision.title}
              className="grid gap-x-6 gap-y-2 border-b border-rule py-6 sm:grid-cols-[2.5rem_1fr]"
            >
              <span aria-hidden="true" className="pt-1.5 label text-ink-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="display text-title-3">{decision.title}</h3>
                <p className="mt-2 max-w-[62ch] text-ink-soft">
                  <RichText>{decision.rationale}</RichText>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="implementation" index={3} title={titles.implementation}>
        <Prose paragraphs={content.implementation} />
      </Section>

      <Section id="challenges" index={4} title={titles.challenges}>
        <ul className="grid gap-px sm:grid-cols-1">
          {content.challenges.map((challenge) => (
            <li key={challenge.title} className="border-l-2 border-accent py-1 pl-5 not-first:mt-7">
              <h3 className="display text-title-3">{challenge.title}</h3>
              <p className="mt-2 max-w-[62ch] text-ink-soft">
                <RichText>{challenge.body}</RichText>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="evidence" index={5} title={titles.evidence}>
        <p className="max-w-[62ch] text-ink-soft">{content.evidence.intro}</p>
        <dl className="mt-8 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
          {content.evidence.figures.map((figure) => (
            <div key={figure.label} className="flex flex-col bg-paper-raised p-5 lg:p-6">
              <dt className="label text-ink-muted">{figure.label}</dt>
              <dd className="mt-3">
                <span className="block display text-title-1">{figure.value}</span>
                {figure.note ? (
                  <span className="mt-2 block text-sm text-ink-muted">{figure.note}</span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm text-ink-muted">
          {dict.caseStudy.evidenceSource}:{' '}
          <TextLink href={content.evidence.source.href} arrow className="text-ink">
            <span className="font-mono text-[0.8125rem]">{content.evidence.source.label}</span>
          </TextLink>
        </p>
      </Section>
    </div>
  );
}

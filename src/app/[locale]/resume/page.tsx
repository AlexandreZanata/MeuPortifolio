import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PendingNote } from '@/components/ui/pending-note';
import { SmartLink } from '@/components/ui/smart-link';
import { confirmed, isPending } from '@/content/pending';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { EducationList, ExperienceList } from '@/features/resume/history';
import { PrintButton } from '@/features/resume/print-button';
import { getDictionary } from '@/i18n/get-dictionary';
import { resolveLocale, type LocaleParams } from '@/i18n/params';
import { routes } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl, site } from '@/lib/site';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: 'resume/',
    title: dict.resume.title,
    description: dict.resume.metaDescription,
    imageAlt: dict.meta.ogAlt,
  });
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-x-10 gap-y-4 border-t border-rule py-8 lg:grid-cols-12 print:py-5">
      <h2 className="pt-1 label text-ink-muted lg:col-span-3">{title}</h2>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}

const withoutProtocol = (url: string): string => url.replace(/^https?:\/\/(www\.)?/, '');

/**
 * The résumé is an HTML page with a print stylesheet rather than a PDF in the repository:
 * it is always in sync with the content layer, it is indexable, and "save as PDF" is one
 * click away in every browser.
 */
export default async function ResumePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const copy = dict.resume;
  const email = confirmed(profile.email);
  const linkedin = confirmed(profile.linkedin);
  const location = confirmed(profile.location);
  const spokenLanguages = confirmed(profile.spokenLanguages);
  const { experience, education } = profile;

  const links = [
    {
      label: copy.website,
      href: absoluteUrl(routes.home(locale)),
      display: withoutProtocol(site.url),
    },
    {
      label: dict.common.github,
      href: profile.github.url,
      display: withoutProtocol(profile.github.url),
    },
    ...(email ? [{ label: dict.common.email, href: `mailto:${email}`, display: email }] : []),
    ...(linkedin
      ? [{ label: dict.common.linkedin, href: linkedin, display: withoutProtocol(linkedin) }]
      : []),
  ];

  return (
    <article className="container-page pt-12 lg:pt-20 print:pt-0">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pb-10 print:pb-6">
        <div>
          <p className="label text-ink-muted">{copy.title}</p>
          <h1 className="mt-4 display text-display-2">{profile.name}</h1>
          <p className="mt-3 text-lede text-ink-soft">
            {copy.headline}
            {location ? ` · ${location[locale]}` : null}
          </p>
        </div>
        <PrintButton label={copy.print} />
      </header>

      <ResumeSection title={copy.linksTitle}>
        <ul className="grid gap-x-10 gap-y-1.5 sm:grid-cols-2">
          {links.map((link) => (
            <li key={link.href} className="flex gap-3">
              <span className="w-20 shrink-0 text-ink-muted">{link.label}</span>
              <SmartLink href={link.href} className="break-all link">
                {link.display}
              </SmartLink>
            </li>
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title={copy.summaryTitle}>
        <p className="max-w-[62ch] text-lede">{copy.summary}</p>
      </ResumeSection>

      <ResumeSection title={copy.projectsTitle}>
        <ul className="grid gap-7 print:gap-4">
          {projects.map((project) => {
            const content = project.content[locale];
            return (
              <li key={project.meta.slug} className="break-inside-avoid">
                <h3 className="display text-title-3">
                  <SmartLink
                    href={routes.project(locale, project.meta.slug)}
                    className="decoration-accent decoration-1 underline-offset-[0.18em] hover:underline"
                  >
                    {project.meta.name}
                  </SmartLink>
                  <span className="font-sans text-sm font-normal text-ink-muted">
                    {' '}
                    · {dict.kinds[project.meta.kind]} · {dict.stages[project.meta.stage]}
                  </span>
                </h3>
                <p className="mt-1 text-ink-soft">{content.tagline}</p>
                <ul className="mt-2 grid list-disc gap-1 pl-5 text-ink-soft">
                  {content.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p className="mt-2 font-mono text-[0.8125rem] text-ink-muted">
                  {project.meta.stack.join(' · ')}
                </p>
              </li>
            );
          })}
        </ul>
      </ResumeSection>

      <ResumeSection title={copy.skillsTitle}>
        <dl className="grid gap-2.5">
          {profile.toolbox.map((group) => (
            <div key={group.label.en} className="grid gap-x-6 sm:grid-cols-[11rem_1fr]">
              <dt className="text-ink-muted">{group.label[locale]}</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </ResumeSection>

      {isPending(experience) ? (
        <PendingNote label={dict.common.pending} note={experience.note} />
      ) : (
        <ResumeSection title={copy.experienceTitle}>
          <ExperienceList items={experience} locale={locale} present={dict.about.present} />
        </ResumeSection>
      )}

      {isPending(education) ? (
        <PendingNote label={dict.common.pending} note={education.note} />
      ) : (
        <ResumeSection title={copy.educationTitle}>
          <EducationList items={education} locale={locale} present={dict.about.present} />
        </ResumeSection>
      )}

      {spokenLanguages ? (
        <ResumeSection title={copy.languagesTitle}>
          <p>{spokenLanguages[locale].join(' · ')}</p>
        </ResumeSection>
      ) : null}
    </article>
  );
}

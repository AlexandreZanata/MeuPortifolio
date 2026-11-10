import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { PendingNote } from '@/components/ui/pending-note';
import { SectionHeading } from '@/components/ui/section-heading';
import { TagList } from '@/components/ui/tag';
import { TextLink } from '@/components/ui/text-link';
import { isPending } from '@/content/pending';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { EducationList, ExperienceList } from '@/features/resume/history';
import { getDictionary } from '@/i18n/get-dictionary';
import { resolveLocale, type LocaleParams } from '@/i18n/params';
import { routes } from '@/i18n/routes';
import { formatMonth } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: 'about/',
    title: dict.about.title,
    description: dict.about.metaDescription,
    imageAlt: dict.meta.ogAlt,
  });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const copy = dict.about;
  const [lead, ...rest] = copy.bio;
  const timeline = [...projects].sort((a, b) => b.meta.startedAt.localeCompare(a.meta.startedAt));
  const { experience, education, location } = profile;

  return (
    <>
      <PageHeader title={copy.title} lede={copy.lede} />

      <section aria-label={copy.title} className="container-page mt-12 lg:mt-20">
        <div className="grid gap-x-10 gap-y-10 border-t border-ink pt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-lede text-ink">{lead}</p>
            <div className="mt-6 grid gap-5 text-[1.0625rem] leading-[1.7] text-ink-soft">
              {rest.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <dl className="self-start lg:col-span-4 lg:col-start-9">
            <div className="border-b border-rule pb-4">
              <dt className="label text-ink-muted">{dict.common.github}</dt>
              <dd className="mt-1.5">
                <TextLink href={profile.github.url} arrow>
                  {profile.github.handle}
                </TextLink>
              </dd>
            </div>
            <div className="border-b border-rule py-4">
              <dt className="label text-ink-muted">{dict.openSource.organization.label}</dt>
              <dd className="mt-1.5">
                <TextLink href={profile.organization.url} arrow>
                  {profile.organization.name}
                </TextLink>
              </dd>
            </div>
            <div className="py-4">
              <dt className="label text-ink-muted">{dict.nav.resume}</dt>
              <dd className="mt-1.5">
                <TextLink href={routes.resume(locale)} arrow>
                  {dict.contact.resume.cta}
                </TextLink>
              </dd>
            </div>
            {isPending(location) ? (
              <PendingNote label={dict.common.pending} note={location.note} />
            ) : null}
          </dl>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="container-page section-space">
        <SectionHeading
          id="approach-title"
          index="01"
          label={copy.approach.label}
          title={copy.approach.title}
        />
        <ol className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:mt-12">
          {copy.approach.items.map((item, index) => (
            <li key={item.title} className="border-t border-rule py-6">
              <p aria-hidden="true" className="label text-accent">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 display text-title-2">{item.title}</h3>
              <p className="mt-3 max-w-[48ch] text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="toolbox-title" className="container-page">
        <SectionHeading
          id="toolbox-title"
          index="02"
          label={copy.toolbox.label}
          title={copy.toolbox.title}
          description={copy.toolbox.note}
        />
        <dl className="mt-10 lg:mt-12">
          {profile.toolbox.map((group) => (
            <div
              key={group.label.en}
              className="grid gap-x-10 gap-y-3 border-t border-rule py-5 lg:grid-cols-12"
            >
              <dt className="pt-1 label text-ink-muted lg:col-span-3">{group.label[locale]}</dt>
              <dd className="lg:col-span-9">
                <TagList items={group.items} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="timeline-title" className="container-page section-space">
        <SectionHeading
          id="timeline-title"
          index="03"
          label={copy.timeline.label}
          title={copy.timeline.title}
          description={copy.timeline.note}
        />
        <ol className="mt-10 lg:mt-12">
          {timeline.map((project) => (
            <li
              key={project.meta.slug}
              className="grid gap-x-10 gap-y-2 border-t border-rule py-6 lg:grid-cols-12"
            >
              <p className="pt-1.5 label text-ink-muted lg:col-span-3">
                {formatMonth(project.meta.startedAt, locale)}
              </p>
              <div className="lg:col-span-9">
                <h3 className="display text-title-3">
                  <Link
                    href={routes.project(locale, project.meta.slug)}
                    className="decoration-accent decoration-1 underline-offset-[0.18em] hover:underline"
                  >
                    {project.meta.name}
                  </Link>
                </h3>
                <p className="mt-1.5 max-w-[62ch] text-ink-soft">
                  {project.content[locale].tagline}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Employment and education appear only once the owner has confirmed them. */}
      {isPending(experience) ? (
        <div className="container-page">
          <PendingNote label={dict.common.pending} note={experience.note} />
        </div>
      ) : (
        <section aria-labelledby="experience-title" className="container-page">
          <SectionHeading
            id="experience-title"
            index="04"
            label={copy.experience.label}
            title={copy.experience.title}
          />
          <div className="mt-10">
            <ExperienceList items={experience} locale={locale} present={copy.present} />
          </div>
        </section>
      )}

      {isPending(education) ? (
        <div className="container-page mt-4">
          <PendingNote label={dict.common.pending} note={education.note} />
        </div>
      ) : (
        <section aria-labelledby="education-title" className="container-page section-space">
          <SectionHeading
            id="education-title"
            index="05"
            label={copy.education.label}
            title={copy.education.title}
          />
          <div className="mt-10">
            <EducationList items={education} locale={locale} present={copy.present} />
          </div>
        </section>
      )}
    </>
  );
}

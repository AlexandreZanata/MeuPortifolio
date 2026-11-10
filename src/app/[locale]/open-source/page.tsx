import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button-link';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeading } from '@/components/ui/section-heading';
import { SmartLink } from '@/components/ui/smart-link';
import { TextLink } from '@/components/ui/text-link';
import { maintained, more, organization, type OpenSourceEntry } from '@/content/open-source';
import { profile } from '@/content/profile';
import { githubSnapshot } from '@/features/github/snapshot';
import { RepositoryCard } from '@/features/open-source/repository-card';
import type { Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n/get-dictionary';
import { resolveLocale, type LocaleParams } from '@/i18n/params';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: 'open-source/',
    title: dict.openSource.title,
    description: dict.openSource.metaDescription,
    imageAlt: dict.meta.ogAlt,
  });
}

function RepositoryGrid({
  entries,
  locale,
  dict,
  wide = false,
}: {
  entries: readonly OpenSourceEntry[];
  locale: Locale;
  dict: Dictionary;
  /** Two columns at most, for the short list of maintained projects. */
  wide?: boolean;
}) {
  return (
    <ul className={cn('mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12', !wide && 'xl:grid-cols-3')}>
      {entries.map((entry) => (
        <RepositoryCard key={entry.repository} entry={entry} locale={locale} dict={dict} />
      ))}
    </ul>
  );
}

export default async function OpenSourcePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const copy = dict.openSource;
  const guides = maintained.filter((entry) => entry.contributingPath);

  return (
    <>
      <PageHeader title={copy.title} lede={copy.lede} />

      <section aria-labelledby="maintained-title" className="container-page section-space">
        <SectionHeading
          id="maintained-title"
          index="01"
          label={copy.maintained.label}
          title={copy.maintained.title}
          description={copy.maintained.description}
        />
        <RepositoryGrid entries={maintained} locale={locale} dict={dict} wide />
      </section>

      <section aria-labelledby="organization-title" className="container-page">
        <SectionHeading
          id="organization-title"
          index="02"
          label={copy.organization.label}
          title={copy.organization.title}
          description={copy.organization.description}
          action={
            <TextLink href={profile.organization.url} arrow>
              {copy.organization.cta}
            </TextLink>
          }
        />
        <RepositoryGrid entries={organization} locale={locale} dict={dict} />
      </section>

      <section aria-labelledby="more-title" className="container-page section-space">
        <SectionHeading
          id="more-title"
          index="03"
          label={copy.more.label}
          title={copy.more.title}
          description={copy.more.description}
          action={
            <TextLink href={`${profile.github.url}?tab=repositories`} arrow>
              {copy.more.cta}
            </TextLink>
          }
        />
        <RepositoryGrid entries={more} locale={locale} dict={dict} />
        <p className="mt-6 text-sm text-ink-muted">
          {copy.snapshotNote} {formatDate(githubSnapshot.generatedAt, locale)}.
        </p>
      </section>

      <section aria-labelledby="contribute-title" className="bg-ink text-paper">
        <div className="container-page section-space">
          <SectionHeading
            id="contribute-title"
            index="04"
            label={copy.contribute.label}
            title={copy.contribute.title}
            description={copy.contribute.description}
            tone="paper"
          />

          <div className="mt-12 grid gap-x-10 gap-y-12 lg:grid-cols-12">
            <ol className="lg:col-span-7 lg:col-start-4">
              {copy.contribute.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-paper/20 py-6 last:border-b"
                >
                  <span aria-hidden="true" className="pt-1.5 label text-accent-on-ink">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="display text-title-3">{step.title}</h3>
                    <p className="mt-2 text-paper/75">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="lg:col-span-7 lg:col-start-4">
              <h3 className="label text-paper/70">{copy.contribute.guides}</h3>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                {guides.map((entry) => (
                  <li key={entry.repository}>
                    <SmartLink
                      href={`https://github.com/${entry.repository}/blob/main/${entry.contributingPath}`}
                      className="underline decoration-paper/40 decoration-1 underline-offset-[0.22em] transition-colors hover:text-accent-on-ink hover:decoration-current"
                    >
                      {entry.name}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm border border-paper/20 p-6 lg:col-span-7 lg:col-start-4 lg:p-8">
              <h3 className="display text-title-2">{copy.contribute.site.title}</h3>
              <p className="mt-3 max-w-[52ch] text-paper/75">{copy.contribute.site.body}</p>
              <ButtonLink href={site.repository} variant="inverse" className="mt-6">
                {copy.contribute.site.cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { ButtonLink } from '@/components/ui/button-link';
import { SectionHeading } from '@/components/ui/section-heading';
import { TextLink } from '@/components/ui/text-link';
import { profile } from '@/content/profile';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';

export function AboutTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.home.about;

  return (
    <section aria-labelledby="about-title" className="container-page section-space">
      <SectionHeading id="about-title" index="03" label={copy.label} title={copy.title} />
      <div className="mt-8 grid gap-x-10 lg:grid-cols-12">
        <div className="lg:col-span-9 lg:col-start-4">
          <p className="max-w-[60ch] text-lede text-ink-soft">{copy.body}</p>
          <p className="mt-6">
            <TextLink href={routes.about(locale)} arrow>
              {copy.cta}
            </TextLink>
          </p>
        </div>
      </div>
    </section>
  );
}

export function ContactCallout({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.home.contact;

  return (
    <section aria-labelledby="contact-title" className="container-page">
      <div className="rounded-md border border-rule bg-paper-raised px-6 py-12 text-center sm:px-10 lg:py-20">
        <p className="label text-ink-muted">
          <span className="text-accent">04</span>
          <span aria-hidden="true"> — </span>
          {copy.label}
        </p>
        <h2 id="contact-title" className="mx-auto mt-6 max-w-[18ch] display text-display-2">
          {copy.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[44ch] text-lede text-ink-soft">{copy.body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href={routes.contact(locale)}>{copy.cta}</ButtonLink>
          <ButtonLink href={profile.github.url} variant="secondary">
            {dict.common.github}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

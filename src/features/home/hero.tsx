import { ButtonLink } from '@/components/ui/button-link';
import { PlateImage } from '@/components/ui/plate';
import { profile } from '@/content/profile';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';
import { cn } from '@/lib/cn';
import { frauncesItalic } from './hero-font';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.home.hero;

  return (
    <section aria-labelledby="hero-title" className="container-page pt-10 lg:pt-14">
      <div className="grid items-center gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label text-ink-muted">{copy.eyebrow}</p>
          {/* The headline is the largest paint on the page, so it is never animated in. */}
          <h1
            id="hero-title"
            className={cn(frauncesItalic.variable, 'mt-6 max-w-[17ch] display text-display-1')}
          >
            {copy.titleLead}
            <em className="display-italic text-accent sm:whitespace-nowrap">
              {copy.titleEmphasis}
            </em>
            {copy.titleTail}
          </h1>
          <p className="mt-7 max-w-[54ch] text-lede text-ink-soft">{copy.lede}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={routes.projects(locale)}>{copy.primaryCta}</ButtonLink>
            <ButtonLink href={profile.github.url} variant="secondary">
              {dict.common.github}
            </ButtonLink>
            <ButtonLink href={routes.resume(locale)} variant="secondary">
              {dict.nav.resume}
            </ButtonLink>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[26rem] motion-safe:animate-rise lg:col-span-5 lg:max-w-none">
          <PlateImage src="/art/hero-armillary.svg" width={720} height={820} priority />
          <figcaption className="mt-2 max-w-[42ch] label text-ink-muted">
            <span className="text-ink">{dict.common.figure} 1</span>
            <span aria-hidden="true"> — </span>
            {copy.figureCaption}
          </figcaption>
        </figure>
      </div>

      <div className="mt-14 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-rule pt-5 lg:mt-20">
        <h2 className="label text-ink-muted">{copy.stackLabel}</h2>
        <ul className="flex flex-wrap gap-x-7 gap-y-1 font-mono text-sm text-ink-soft">
          {copy.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

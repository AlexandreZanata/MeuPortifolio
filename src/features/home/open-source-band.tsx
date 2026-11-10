import { ButtonLink } from '@/components/ui/button-link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';

/** The one inverted section of the home page: ink ground, paper type. */
export function OpenSourceBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.home.openSource;

  return (
    <section aria-labelledby="open-source-title" className="bg-ink text-paper">
      <div className="container-page grid gap-x-10 gap-y-14 section-space lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label text-paper/70">
            <span className="text-accent-on-ink">02</span>
            <span aria-hidden="true"> — </span>
            {copy.label}
          </p>
          <h2 id="open-source-title" className="mt-6 max-w-[16ch] display text-title-1">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-[48ch] text-paper/75">{copy.body}</p>
          <ButtonLink href={routes.openSource(locale)} variant="inverse" className="mt-9">
            {copy.cta}
          </ButtonLink>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {copy.principles.map((principle, index) => (
            <li
              key={principle.title}
              className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-paper/20 py-6 last:border-b"
            >
              <span aria-hidden="true" className="pt-1.5 label text-accent-on-ink">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="display text-title-3">{principle.title}</h3>
                <p className="mt-2 text-paper/75">{principle.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

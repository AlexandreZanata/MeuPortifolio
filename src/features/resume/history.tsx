import type { EducationItem, ExperienceItem } from '@/content/profile';
import type { Locale } from '@/i18n/config';
import { formatMonth } from '@/lib/format';

function period(start: string, end: string | null, locale: Locale, present: string): string {
  return `${formatMonth(start, locale)} – ${end ? formatMonth(end, locale) : present}`;
}

/** Employment history, shared by the About page and the résumé. */
export function ExperienceList({
  items,
  locale,
  present,
}: {
  items: readonly ExperienceItem[];
  locale: Locale;
  present: string;
}) {
  return (
    <ol className="border-t border-ink">
      {items.map((item) => (
        <li
          key={`${item.organization}-${item.start}`}
          className="grid gap-x-10 gap-y-2 border-b border-rule py-6 md:grid-cols-[14rem_1fr]"
        >
          <p className="pt-1 label text-ink-muted">
            {period(item.start, item.end, locale, present)}
          </p>
          <div>
            <h3 className="display text-title-3">{item.role[locale]}</h3>
            <p className="text-ink-soft">{item.organization}</p>
            <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-ink-soft">
              {item.highlights[locale].map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function EducationList({
  items,
  locale,
  present,
}: {
  items: readonly EducationItem[];
  locale: Locale;
  present: string;
}) {
  return (
    <ol className="border-t border-ink">
      {items.map((item) => (
        <li
          key={`${item.institution}-${item.start}`}
          className="grid gap-x-10 gap-y-2 border-b border-rule py-6 md:grid-cols-[14rem_1fr]"
        >
          <p className="pt-1 label text-ink-muted">
            {period(item.start, item.end, locale, present)}
          </p>
          <div>
            <h3 className="display text-title-3">{item.degree[locale]}</h3>
            <p className="text-ink-soft">{item.institution}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

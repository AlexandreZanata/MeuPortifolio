import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button-link';
import { ArrowUpRight } from '@/components/ui/icons';
import { PageHeader } from '@/components/ui/page-header';
import { PendingNote } from '@/components/ui/pending-note';
import { SmartLink } from '@/components/ui/smart-link';
import { confirmed, isPending } from '@/content/pending';
import { profile } from '@/content/profile';
import { getDictionary } from '@/i18n/get-dictionary';
import { resolveLocale, type LocaleParams } from '@/i18n/params';
import { routes } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: 'contact/',
    title: dict.contact.title,
    description: dict.contact.metaDescription,
    imageAlt: dict.meta.ogAlt,
  });
}

interface Channel {
  readonly title: string;
  readonly body: string;
  readonly href: string;
  /** What the visitor sees: the address itself, not "click here". */
  readonly display: string;
}

const withoutProtocol = (url: string): string => url.replace(/^https?:\/\/(www\.)?/, '');

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const copy = dict.contact;
  const email = confirmed(profile.email);
  const linkedin = confirmed(profile.linkedin);

  // A plain mailto link instead of a form: no backend, no spam handling, no third-party
  // processor, and the visitor keeps a copy of what they sent (docs/adr/0006).
  const channels: Channel[] = [
    ...(email ? [{ ...copy.channels.email, href: `mailto:${email}`, display: email }] : []),
    ...(linkedin
      ? [{ ...copy.channels.linkedin, href: linkedin, display: withoutProtocol(linkedin) }]
      : []),
    {
      ...copy.channels.github,
      href: profile.github.url,
      display: withoutProtocol(profile.github.url),
    },
  ];

  return (
    <>
      <PageHeader title={copy.title} lede={copy.lede} />

      <section aria-label={copy.title} className="container-page mt-12 lg:mt-20">
        <ul className="border-t border-ink">
          {channels.map((channel) => (
            <li key={channel.href} className="border-b border-rule">
              <SmartLink
                href={channel.href}
                className="group grid gap-x-10 gap-y-2 py-7 lg:grid-cols-12 lg:items-baseline lg:py-9"
              >
                <span className="label text-ink-muted lg:col-span-3">{channel.title}</span>
                <span className="display text-title-1 decoration-accent decoration-1 underline-offset-[0.16em] group-hover:underline lg:col-span-6">
                  <span className="break-all">{channel.display}</span>
                </span>
                <span className="flex items-center justify-between gap-4 text-ink-soft lg:col-span-3">
                  {channel.body}
                  <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>

        {isPending(profile.email) || isPending(profile.linkedin) ? (
          <div className="mt-6 grid gap-2">
            {isPending(profile.email) ? (
              <PendingNote label={dict.common.pending} note={profile.email.note} />
            ) : null}
            {isPending(profile.linkedin) ? (
              <PendingNote label={dict.common.pending} note={profile.linkedin.note} />
            ) : null}
          </div>
        ) : null}
      </section>

      <section aria-label={copy.resume.title} className="container-page section-space">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-sm border border-rule bg-paper-raised p-6 lg:p-8">
            <h2 className="display text-title-2">{copy.resume.title}</h2>
            <p className="mt-3 text-ink-soft">{copy.resume.body}</p>
            <ButtonLink href={routes.resume(locale)} variant="secondary" className="mt-6">
              {copy.resume.cta}
            </ButtonLink>
          </div>
          <div className="rounded-sm border border-rule p-6 lg:p-8">
            <h2 className="display text-title-2">{copy.privacy.title}</h2>
            <p className="mt-3 text-ink-soft">{copy.privacy.body}</p>
          </div>
        </div>
      </section>
    </>
  );
}

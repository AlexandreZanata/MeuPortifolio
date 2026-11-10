import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/page-header';
import { PlateImage } from '@/components/ui/plate';
import { TextLink } from '@/components/ui/text-link';
import { CnpjPlayground } from '@/features/lab/cnpj-playground';
import { getDictionary } from '@/i18n/get-dictionary';
import { resolveLocale, type LocaleParams } from '@/i18n/params';
import { routes } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

const plates = [
  { src: '/art/hero-armillary.svg', width: 720, height: 820 },
  { src: '/art/plate-strata.svg', width: 640, height: 480 },
  { src: '/art/plate-seal.svg', width: 640, height: 480 },
  { src: '/art/plate-drop.svg', width: 640, height: 480 },
  { src: '/art/plate-lane.svg', width: 640, height: 480 },
] as const;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: 'lab/',
    title: dict.lab.title,
    description: dict.lab.metaDescription,
    imageAlt: dict.meta.ogAlt,
  });
}

export default async function LabPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const { cnpj, plates: platesCopy } = dict.lab;

  return (
    <>
      <PageHeader title={dict.lab.title} lede={dict.lab.lede} />

      <section aria-labelledby="cnpj-title" className="container-page section-space">
        <div className="grid gap-x-10 gap-y-8 border-t border-ink pt-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-accent">{cnpj.label}</p>
            <h2 id="cnpj-title" className="mt-4 display text-title-1">
              {cnpj.title}
            </h2>
            <p className="mt-5 text-ink-soft">{cnpj.body}</p>
            <p className="mt-4 text-sm text-ink-soft">
              {cnpj.footnote}{' '}
              <TextLink href={routes.project(locale, 'br-validators')}>br-validators</TextLink>.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <CnpjPlayground
              labels={{
                inputLabel: cnpj.inputLabel,
                inputHint: cnpj.inputHint,
                examples: cnpj.examples,
                status: cnpj.status,
                table: cnpj.table,
              }}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="plates-title" className="container-page">
        <div className="grid gap-x-10 gap-y-8 border-t border-ink pt-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-accent">{platesCopy.label}</p>
            <h2 id="plates-title" className="mt-4 display text-title-1">
              {platesCopy.title}
            </h2>
            <p className="mt-5 text-ink-soft">{platesCopy.body}</p>
            <p className="mt-5">
              <TextLink href={`${site.repository}/blob/main/scripts/generate-art.ts`} arrow>
                {platesCopy.cta}
              </TextLink>
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-8">
            {plates.map((plate, index) => (
              <li key={plate.src} className={index === 0 ? 'row-span-2' : undefined}>
                <figure className="flex h-full flex-col">
                  <div className="flex flex-1 items-center rounded-sm border border-rule bg-paper p-[7%]">
                    <PlateImage {...plate} />
                  </div>
                  <figcaption className="mt-2 label text-ink-muted">
                    {platesCopy.captions[index]}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

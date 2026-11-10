import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@/components/ui/icons';
import { PageHeader } from '@/components/ui/page-header';
import { PlateImage } from '@/components/ui/plate';
import { TagList } from '@/components/ui/tag';
import { projectNumber, projects } from '@/content/projects';
import { getDictionary } from '@/i18n/get-dictionary';
import { resolveLocale, type LocaleParams } from '@/i18n/params';
import { routes } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: 'projects/',
    title: dict.projects.title,
    description: dict.projects.metaDescription,
    imageAlt: dict.meta.ogAlt,
  });
}

export default async function ProjectsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.projects.title} lede={dict.projects.lede} />

      <ul className="container-page mt-12 lg:mt-20">
        {projects.map((project) => {
          const { meta } = project;
          const content = project.content[locale];
          return (
            <li key={meta.slug} className="group relative border-t border-ink">
              <article className="grid gap-x-10 gap-y-8 py-10 lg:grid-cols-12 lg:py-14">
                <div className="lg:col-span-7">
                  <p className="flex flex-wrap gap-x-6 gap-y-1 label text-ink-muted">
                    <span>
                      <span className="text-accent">{projectNumber(meta.slug)}</span>
                      <span aria-hidden="true"> — </span>
                      {dict.kinds[meta.kind]}
                    </span>
                    <span>{dict.stages[meta.stage]}</span>
                  </p>
                  <h2 className="mt-5 display text-title-1">
                    <Link
                      href={routes.project(locale, meta.slug)}
                      className="decoration-accent decoration-1 underline-offset-[0.18em] group-hover:underline after:absolute after:inset-0"
                    >
                      {meta.name}
                    </Link>
                  </h2>
                  <p className="mt-4 max-w-[52ch] text-lede text-ink-soft">{content.tagline}</p>
                  <p className="mt-4 max-w-[62ch] text-ink-soft">{content.summary}</p>
                  <TagList items={meta.stack} className="mt-6" />
                  <p
                    aria-hidden="true"
                    className="mt-7 flex items-center gap-2 text-[0.9375rem] font-medium"
                  >
                    {dict.common.readCaseStudy}
                    <ArrowRight className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" />
                  </p>
                </div>

                <div className="self-start overflow-hidden rounded-sm border border-rule bg-paper px-[8%] py-[6%] transition-colors duration-300 ease-editorial group-hover:border-ink lg:col-span-4 lg:col-start-9">
                  <PlateImage
                    {...meta.plate}
                    className="transition-transform duration-700 ease-editorial group-hover:scale-[1.035]"
                  />
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}

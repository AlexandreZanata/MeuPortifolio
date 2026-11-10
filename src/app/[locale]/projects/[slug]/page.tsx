import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from '@/components/ui/icons';
import { JsonLd } from '@/components/ui/json-ld';
import { Plate } from '@/components/ui/plate';
import { profile } from '@/content/profile';
import { getProject, nextProject, projectNumber, projects } from '@/content/projects';
import { CaseStudyBody, ProjectFacts, SectionNav } from '@/features/projects/case-study';
import { htmlLang, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { resolveLocale } from '@/i18n/params';
import { routes } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

interface ProjectPageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.meta.slug })),
  );
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const project = getProject((await params).slug);
  if (!project) notFound();
  const content = project.content[locale];
  return pageMetadata({
    locale,
    path: `projects/${project.meta.slug}/`,
    title: getDictionary(locale).caseStudy.pageTitle.replace('{name}', project.meta.name),
    description: content.summary,
    imageAlt: `${project.meta.name}. ${content.tagline}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const project = getProject((await params).slug);
  if (!project) notFound();

  const { meta } = project;
  const content = project.content[locale];
  const next = nextProject(meta.slug);
  const url = absoluteUrl(routes.project(locale, meta.slug));

  return (
    <article>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareSourceCode',
              name: meta.name,
              description: content.summary,
              url,
              codeRepository: `https://github.com/${meta.repository}`,
              programmingLanguage: meta.stack[0],
              license: meta.license,
              inLanguage: htmlLang[locale],
              author: { '@type': 'Person', name: profile.name, url: profile.github.url },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: dict.projects.title,
                  item: absoluteUrl(routes.projects(locale)),
                },
                { '@type': 'ListItem', position: 2, name: meta.name, item: url },
              ],
            },
          ],
        }}
      />

      <header className="container-page pt-8 lg:pt-12">
        <Link
          href={routes.projects(locale)}
          className="inline-flex h-11 items-center gap-2 label text-ink-muted transition-colors hover:text-accent"
        >
          <ArrowLeft />
          {dict.common.allProjects}
        </Link>

        <p className="mt-8 label text-ink-muted">
          <span className="text-accent">{projectNumber(meta.slug)}</span>
          <span aria-hidden="true"> — </span>
          {dict.caseStudy.label}
        </p>
        <h1 className="mt-4 display text-display-2">{meta.name}</h1>
        <p className="mt-5 max-w-[52ch] text-lede text-ink-soft">{content.tagline}</p>

        <div className="mt-10 grid gap-x-12 gap-y-10 lg:mt-14 lg:grid-cols-12">
          <Plate
            {...meta.plate}
            priority
            caption={content.plateCaption}
            figure={`${dict.common.figure} ${Number(projectNumber(meta.slug))}`}
            className="lg:col-span-7"
          />
          <div className="lg:col-span-5">
            <ProjectFacts project={project} locale={locale} dict={dict} />
          </div>
        </div>
      </header>

      <div className="container-page grid gap-x-12 section-space lg:grid-cols-12">
        <aside className="max-lg:hidden lg:col-span-3">
          <SectionNav dict={dict} />
        </aside>
        <div className="lg:col-span-9 xl:col-span-8">
          <CaseStudyBody content={content} dict={dict} />
        </div>
      </div>

      <nav aria-label={dict.caseStudy.next} className="container-page">
        <Link
          href={routes.project(locale, next.meta.slug)}
          className="group flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-t border-ink py-10 lg:py-14"
        >
          <span>
            <span className="block label text-ink-muted">
              <span className="text-accent">{projectNumber(next.meta.slug)}</span>
              <span aria-hidden="true"> — </span>
              {dict.caseStudy.next}
            </span>
            <span className="mt-3 block display text-display-2 decoration-accent decoration-1 underline-offset-[0.14em] group-hover:underline">
              {next.meta.name}
            </span>
          </span>
          <ArrowRight className="mb-3 size-8 transition-transform duration-300 ease-editorial group-hover:translate-x-2" />
        </Link>
      </nav>
    </article>
  );
}

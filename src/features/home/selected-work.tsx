import { SectionHeading } from '@/components/ui/section-heading';
import { TextLink } from '@/components/ui/text-link';
import { projects } from '@/content/projects';
import { ProjectCard } from '@/features/projects/project-card';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';

export function SelectedWork({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.home.work;

  return (
    <section aria-labelledby="work-title" className="container-page section-space">
      <SectionHeading
        id="work-title"
        index="01"
        label={copy.label}
        title={copy.title}
        description={copy.description}
        action={
          <TextLink href={routes.projects(locale)} arrow>
            {dict.common.allProjects}
          </TextLink>
        }
      />
      <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-y-20">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.meta.slug}
            project={project}
            locale={locale}
            dict={dict}
            featured={index === 0}
          />
        ))}
      </ul>
    </section>
  );
}

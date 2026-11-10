import type { MetadataRoute } from 'next';
import { githubSnapshot } from '@/features/github/snapshot';
import { projects } from '@/content/projects';
import { locales } from '@/i18n/config';
import { staticPaths } from '@/i18n/routes';
import { languageAlternates } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Every page in every locale, each with its hreflang alternates. `lastModified` is the
 * date of the content snapshot rather than the build time, so rebuilding without changes
 * does not tell crawlers that everything changed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticPaths, ...projects.map((project) => `projects/${project.meta.slug}/`)];
  const lastModified = new Date(githubSnapshot.generatedAt);

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}/${path}`),
      lastModified,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}

/** Facts about the deployment itself. Personal data lives in `content/profile.ts`. */
export const site = {
  url: 'https://alexandrezanata.com.br',
  name: 'Alexandre Zanata',
  repository: 'https://github.com/AlexandreZanata/MeuPortifolio',
} as const;

/** Absolute URL for a root-relative path such as `/en/projects/`. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

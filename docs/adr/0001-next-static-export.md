# 0001. Next.js App Router, exported as static files

Status: accepted (2026-11)

## Context

The site is content: a home page, case studies, a few lists and a résumé, in two
languages. It changes when the owner edits it. It needs excellent SEO and performance,
strict TypeScript, and room for a handful of interactive pieces. One person maintains it,
and it doubles as a public sample of frontend engineering.

## Options considered

|                             | Next.js, static export                    | Astro                            | Next.js on a Node or edge runtime |
| --------------------------- | ----------------------------------------- | -------------------------------- | --------------------------------- |
| Output                      | Static files                              | Static files                     | Server-rendered or ISR            |
| JavaScript on a static page | React and Next runtime, about 137 kB gzip | None by default                  | Same as export                    |
| Interactive pieces          | React components, one model               | Islands, React optional          | React components                  |
| Typed content               | TypeScript modules                        | Content collections with schemas | TypeScript modules                |
| i18n routing                | Manual `[locale]` segment                 | Built-in                         | Middleware can negotiate language |
| Hosting                     | Any static host                           | Any static host                  | A platform or a server to operate |
| Demonstrates                | React Server Components, App Router       | Astro                            | The same, plus runtime features   |

## Decision

Next.js 16 with the App Router, built with `output: 'export'`.

- **Why Next.js rather than Astro.** For a purely static site Astro is the leaner tool,
  and that is stated plainly here. Next.js was chosen for three reasons that matter to
  this project: the audience evaluating the code largely hires for React and Next.js; one
  component model serves both static sections and interactive ones; and the metadata,
  sitemap and font tooling are first-class. The cost is the framework runtime on every
  page.
- **Why static export rather than a runtime.** Nothing on the site needs a server at
  request time. Static files can be hosted anywhere, cannot fall over, have no cold
  starts and nothing to patch. The features given up (middleware, ISR, the image
  optimiser, response headers from the framework) each have a simple replacement here.

## Consequences

- Language negotiation at `/` is done by a tiny client-side redirect, or by the host.
- GitHub data cannot be revalidated at runtime; see [0004](0004-github-snapshot.md).
- Images are authored at their final size; the site currently uses only SVG.
- Security headers are the host's job (`public/_headers`, `docs/DEPLOYMENT.md`), and the
  CSP has to allow inline scripts.
- Every route must be enumerable at build time (`generateStaticParams`,
  `dynamicParams = false`).
- A transfer budget watches the JavaScript baseline so that application code does not
  add to it unnoticed.

## Revisit when

A feature genuinely needs request-time work (search over many pages, authenticated
content), or the JavaScript baseline becomes the limiting factor for real users. Moving
to a runtime means deleting one line of configuration; moving to Astro means rewriting
the routing and layout layer while keeping content, tokens and most components.

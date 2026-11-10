# alexandrezanata.com.br

The portfolio and open-source hub of Alexandre Zanata: case studies, a résumé and a small
lab, in English and Brazilian Portuguese.

It is also meant to be read as code. The site is a statically exported Next.js application
with strict TypeScript, a typed content layer, a small design system and a test suite that
covers logic, accessibility, layout and SEO.

|           |                                                                              |
| --------- | ---------------------------------------------------------------------------- |
| Live site | <https://alexandrezanata.com.br>                                             |
| Stack     | Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS 4 |
| Tests     | Vitest, Playwright, axe-core, Lighthouse CI                                  |
| Languages | `/en` (default) and `/pt-br`                                                 |

## Quick start

Requirements: Node.js 22.18 or newer (24 is what CI uses) and pnpm 10.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Build and preview the exported site exactly as a static host would serve it:

```bash
pnpm build        # writes ./out
pnpm start        # http://localhost:4173
```

## Commands

| Command                                        | What it does                                                                                 |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm dev`                                     | Development server with fast refresh                                                         |
| `pnpm build`                                   | Static export to `out/`                                                                      |
| `pnpm start`                                   | Serves `out/` with compression and cache headers                                             |
| `pnpm check`                                   | Everything CI runs before the browser tests: format, lint, types, unit tests, build, budgets |
| `pnpm lint` / `pnpm typecheck` / `pnpm format` | ESLint, `tsc --noEmit`, Prettier                                                             |
| `pnpm test`                                    | Unit tests (Vitest)                                                                          |
| `pnpm test:e2e`                                | Browser tests against `out/` (Playwright + axe). Run `pnpm build` first                      |
| `pnpm budget`                                  | Transfer-size budgets for every exported page                                                |
| `pnpm art`                                     | Regenerates the illustrations in `public/art`                                                |
| `pnpm og`                                      | Regenerates the social images and the touch icon                                             |
| `pnpm github:snapshot`                         | Refreshes repository facts from the GitHub API                                               |

The browser tests need a Chromium: `pnpm exec playwright install chromium`. If that is not
possible on your machine, point `CHROMIUM_PATH` at an existing Chrome or Chromium binary.

## How it is organised

```text
src/
  app/          routes, layouts, metadata files, global CSS (design tokens)
  features/     page-level building blocks, grouped by domain
  components/   shared UI primitives and the site shell
  content/      typed content: profile, projects, open-source list, GitHub snapshot
  i18n/         locales, route builders, dictionaries
  lib/          small framework-free helpers
scripts/        generators and checks (art, social images, snapshot, budgets, preview server)
e2e/            Playwright specs
docs/           architecture, design system, decisions, plan and roadmap
```

Dependencies point one way only: `lib`, `i18n` → `content` → `components` → `features` →
`app`. ESLint enforces it.

Start with [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The reasons behind the main
choices are recorded as short decision records in [docs/adr](docs/adr).

## Documentation

| Document                                       | Content                                                     |
| ---------------------------------------------- | ----------------------------------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)   | Rendering model, layers, data flow, conventions             |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Tokens, type scale, grid, components, motion, illustrations |
| [docs/CONTENT.md](docs/CONTENT.md)             | Adding a project, translating, confirming pending facts     |
| [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) | Target, automated checks and the manual checklist           |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md)     | Budgets, measurements and how to reproduce them             |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)       | Hosting options, headers and redirects                      |
| [docs/ROADMAP.md](docs/ROADMAP.md)             | What is done and what comes next                            |
| [docs/PLAN.md](docs/PLAN.md)                   | The original product and engineering plan (in Portuguese)   |
| [docs/adr](docs/adr)                           | Architecture decision records                               |

## Content honesty

Nothing on the site is invented. Facts about projects come from their repositories and
link to the source; personal facts that have not been confirmed are stored as
`pending(...)` and never rendered in production. See [docs/CONTENT.md](docs/CONTENT.md).

## Contributing

Corrections and improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first;
it is short. Please report security problems privately, as described in
[SECURITY.md](SECURITY.md).

## License

Code is released under the [MIT License](LICENSE). The written content, the personal brand
and the illustrations are not: see [LICENSE-CONTENT.md](LICENSE-CONTENT.md). Fonts are
licensed under the SIL Open Font License (`src/assets/fonts/licenses`).

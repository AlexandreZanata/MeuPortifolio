# AGENTS.md

Instructions for coding agents working in this repository. People should read
[CONTRIBUTING.md](CONTRIBUTING.md); the rules are the same.

## What this is

The portfolio of Alexandre Zanata: a statically exported Next.js 16 site (App Router,
React 19, strict TypeScript, Tailwind CSS 4) in English (`/en`) and Brazilian Portuguese
(`/pt-br`). No backend, no database, no runtime configuration.

## Commands

```bash
pnpm dev            # development server
pnpm check          # format:check, lint, typecheck, unit tests, build, budgets
pnpm test:e2e       # Playwright + axe against ./out (run `pnpm build` first)
pnpm art            # regenerate public/art after changing scripts/generate-art.ts
pnpm og             # regenerate social images after changing hero copy, palette or art
```

`pnpm check` must pass before you call a task done. Run `pnpm test:e2e` when you touch a
page, a component or a route. If Playwright's browser cannot be installed, set
`CHROMIUM_PATH` to an existing Chromium.

## Map

| Path                                         | Purpose                                                             |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `src/app`                                    | Routes, layouts, metadata files, `globals.css` (design tokens)      |
| `src/features`                               | Page sections by domain                                             |
| `src/components/ui`, `src/components/layout` | Shared primitives and the site shell                                |
| `src/content`                                | Typed content: projects, profile, open-source list, GitHub snapshot |
| `src/i18n`                                   | Locales, route builders, dictionaries                               |
| `src/lib`                                    | Pure helpers                                                        |
| `scripts`                                    | Generators and checks, run directly by Node                         |
| `e2e`                                        | Playwright specs                                                    |
| `docs`                                       | Architecture, design system, ADRs, content guide                    |

## Rules

1. **Never invent content.** Facts about projects must come from their repositories and
   cite the source in `evidence.source`. Personal facts you cannot verify are
   `pending('what is missing')`. Do not fill pending fields from guesses, from the git
   configuration or from any account data.
2. **Every string exists in both locales.** Add it to `src/i18n/dictionaries/en.ts` and
   `pt-br.ts`, or to both `content.en` and `content['pt-br']`. Write natural Portuguese,
   not a literal translation.
3. **Layer direction** is `lib`, `i18n` → `content` → `components` → `features` → `app`.
   Do not import against it and do not silence the lint rule.
4. **Server Components by default.** A new `'use client'` file needs a reason in its
   doc comment. Pass strings to it as props; do not import dictionaries into client code.
5. **Use the system.** Colours, sizes and radii come from `@theme` in `globals.css`.
   Internal URLs come from `routes` in `src/i18n/routes.ts`. Links go through `SmartLink`,
   `TextLink` or `ButtonLink`. Page metadata goes through `pageMetadata`.
6. **Do not add dependencies** unless the task cannot reasonably be done without one, and
   say so. No UI kits, animation, state or date libraries.
7. **Accessibility is not optional.** One `h1` per page, no skipped heading levels,
   visible focus, accessible names, 44 px targets for controls. New colour pairs go into
   `src/app/globals.test.ts`.
8. **Performance is a budget.** The largest element on arrival must be text. An
   illustration visible on arrival uses `priority`; others stay lazy. `pnpm budget` must
   pass; raising a budget needs a justification in the pull request.
9. **Generated files are committed.** After changing a generator, regenerate and include
   the output. Never edit `public/art/*.svg` or `snapshot.json` by hand.
10. **Glyphs.** The fonts are a Latin subset: no arrows or mathematical symbols in text.
    Use the icon components.

## Conventions

- Files `kebab-case`, components `PascalCase` named exports, props `readonly`.
- `import type` for types. `@/` alias across folders, relative imports within one.
- Comments explain why, not what. Match the density of the surrounding code.
- Commits: `type(scope): subject`. Do not commit or push unless asked.
- A decision that is expensive to reverse gets an ADR in `docs/adr`.

## When adding things

- A project: follow "Adding a project" in [docs/CONTENT.md](docs/CONTENT.md).
- A page: add the route under `src/app/[locale]`, a builder in `routes`, the path in
  `staticPaths` (sitemap) and in `e2e/pages.ts`, and its copy in both dictionaries.
- A component: put it in the feature that uses it. Move it to `components/ui` only when
  a second feature needs it.

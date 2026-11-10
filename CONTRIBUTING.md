# Contributing

Thanks for taking the time. This is a personal site, so the most useful contributions are
corrections (a wrong fact, a broken link, a clumsy translation), accessibility fixes and
bug reports. Larger changes are welcome too: open an issue first so we can agree on the
direction before you spend time on it.

## Setup

Node.js 22.18+ and pnpm 10.

```bash
pnpm install
pnpm dev
```

## Before you open a pull request

```bash
pnpm check        # format, lint, types, unit tests, build, transfer budgets
pnpm test:e2e     # browser, accessibility and layout tests (needs `pnpm build` first)
```

For the browser tests, install a Chromium once with
`pnpm exec playwright install chromium`, or set `CHROMIUM_PATH` to an existing binary.

Then look at what you changed at 375, 768, 1024 and 1440 px, and use it with the keyboard.

## Ground rules

- **Content is never invented.** A fact about a project needs a source in its repository;
  an unconfirmed personal fact is `pending(...)`. See [docs/CONTENT.md](docs/CONTENT.md).
- **Both languages or neither.** New copy needs English and Portuguese. The type checker
  will insist.
- **Respect the layers.** `lib`, `i18n` → `content` → `components` → `features` → `app`.
  ESLint enforces it; [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) explains it.
- **Server Components by default.** Add `'use client'` only for something that needs the
  browser, and keep that component small.
- **No new dependency without a reason.** Say in the pull request what it replaces and
  what it costs in bytes.
- **Tokens, not values.** Colours, type sizes and radii come from the theme in
  `src/app/globals.css`.
- **Accessibility is part of "done".** New interactive elements need a keyboard path, a
  visible focus state and an accessible name.
- **Decisions that are expensive to reverse** get a short record in `docs/adr`.

## Commits and pull requests

- Conventional Commits: `type(scope): subject`, for example
  `fix(content): correct OpenCNPJ snapshot size`. Types: `feat`, `fix`, `docs`, `style`,
  `refactor`, `test`, `chore`, `perf`.
- Keep pull requests small and single-purpose. Fill in the template.
- Generated files (`public/art`, `public/og`, the GitHub snapshot) are committed. If you
  change a generator, regenerate and commit the output in the same pull request.

## Reporting problems

- Bugs and content corrections: open an issue using the templates.
- Security: do not open a public issue. See [SECURITY.md](SECURITY.md).

By contributing you agree that your contribution is licensed under the
[MIT License](LICENSE), and you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

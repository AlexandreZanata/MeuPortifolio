# Content guide

Everything a visitor reads is in `src/content` (facts) and `src/i18n/dictionaries`
(interface copy and page text). Both are TypeScript, so the compiler and the tests check
them.

## The rule: nothing is invented

- A fact about a project must be traceable to its repository. Numbers go in the
  `evidence` section with a link to the document that states them.
- A personal fact that the site owner has not confirmed is written as `pending('...')`.
- When sources disagree, the site says less rather than picking a side.

## Pending facts

`src/content/profile.ts` currently has these fields waiting for confirmation:

| Field             | What is needed                                               |
| ----------------- | ------------------------------------------------------------ |
| `email`           | Public contact e-mail address                                |
| `linkedin`        | LinkedIn profile URL                                         |
| `location`        | City and country to display, in both languages               |
| `spokenLanguages` | Spoken languages and proficiency levels                      |
| `experience`      | Employment history: organization, role, dates and highlights |
| `education`       | Education: institution, degree and dates                     |

How pending fields behave:

- **Production**: the field and everything that depends on it are simply not rendered.
  The Contact page lists only confirmed channels; the résumé omits empty sections.
- **Development** (`pnpm dev`): a dashed "Pending validation" marker shows where content
  is missing.
- **Tests**: `src/content/pending.test.ts` holds the list of pending paths as a snapshot.
  Filling a field changes the list, so the test asks you to acknowledge it with
  `pnpm test -u`.

To confirm a field, replace `pending('...')` with the value. The type tells you the
shape. For example:

```ts
email: 'name@example.com',
location: { en: 'City, Brazil', 'pt-br': 'Cidade, Brasil' },
```

The e-mail address and LinkedIn URL are the two fields worth filling before launch: until
then the Contact page offers GitHub only.

## Adding a project

1. Create `src/content/projects/<slug>.ts` exporting a `Project` (copy an existing file).
   `meta` holds language-independent facts; `content.en` and `content['pt-br']` hold the
   case study. Both locales must have the same structure.
2. Add it to the array in `src/content/projects/index.ts`. Its position is its number.
3. Add the repository to `src/content/github/tracked-repositories.json` and to
   `src/content/open-source.ts`, then run `pnpm github:snapshot`.
4. Give it a plate: reuse one or add a generator function (see
   [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#illustrations)).
5. Add the page path to `e2e/pages.ts`.
6. Run `pnpm check`. The content tests verify completeness in both locales, summary
   lengths, link formats and that the plate file exists.

Classify the project honestly:

- `kind`: `personal` (your own repository) or `organization` (maintained inside an
  organization). Contributions to other people's projects and client work will need new
  kinds; add them to `ProjectKind` and to the `kinds` dictionary entry when they exist.
- `stage`: `released` (versioned releases are published), `beta` (publicly usable, not
  stable) or `in-development`.

## Writing case studies

- Lead with what the project is, in one sentence a non-specialist can follow.
- `decisions` are choices with a rejected alternative or a stated reason, not features.
- `challenges` are problems that were hard, with what was done about them.
- `evidence.intro` must say where and how the numbers were measured. If they are local or
  staging measurements, say so.
- Inline `code` uses backticks and _emphasis_ uses asterisks. Nothing else is parsed.
- The fonts ship a Latin subset. Avoid arrows and mathematical symbols in text; they
  would fall back to a system font.

## Translating

English is the source. Portuguese is written for Brazilian readers, not translated word
for word: prefer the natural phrase, keep established technical terms (open source,
snapshot, build) and use Brazilian number formats (`8,33 GB`, `223.628.880`).

- Interface and page copy: `src/i18n/dictionaries/en.ts` and `pt-br.ts`. A key missing in
  Portuguese is a type error.
- A new locale needs an entry in `src/i18n/config.ts`, a dictionary, and a translation of
  each project. `Localized<T>` will point at every place that needs one.

## Refreshing GitHub data

```bash
GITHUB_TOKEN=$(gh auth token) pnpm github:snapshot
```

The token is optional; without it the API allows 60 requests an hour, which is enough.
A scheduled workflow does the same weekly and opens a pull request.

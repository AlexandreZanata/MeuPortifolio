# 0002. Typed TypeScript content instead of MDX or a CMS

Status: accepted (2026-11)

## Context

The content is small and structured: four case studies with the same six sections, a
profile, a list of repositories and interface copy, all in two languages. It is edited by
a developer, in the repository.

## Options considered

- **MDX** (`@next/mdx` or a content-collection library): pleasant for long prose and
  embedded components. It needs a compile pipeline, a schema for front matter, and offers
  nothing that checks that the Portuguese file has the same sections as the English one.
- **A headless CMS**: an editing interface for non-developers, at the price of a service,
  credentials, a network dependency in the build and a second source of truth.
- **TypeScript modules**: plain objects checked by the compiler.

## Decision

Content is TypeScript. A project is a `Project` object with a `Localized<CaseStudy>`;
dictionaries satisfy a `Dictionary` type derived from the English one.

The deciding factors:

- **Translation completeness is a type error.** A missing locale, section or key does not
  compile.
- **Uniform structure.** Every case study has the same shape, so the page that renders it
  has no per-project branches, and tests can assert completeness and length limits.
- **Zero dependencies and zero build steps.**
- **Refactorable.** Renaming a field is a compiler-guided change across all content.

Strings may contain two inline marks, `code` and _emphasis_, handled by a 20-line
tokenizer. That is intentionally the whole markup language.

## Consequences

- Long, free-form writing (a blog post with headings, images and code blocks) would be
  awkward as nested arrays of strings.
- Editing content requires a pull request. For a personal site that is the review step,
  not an obstacle.
- The "pending" mechanism (`content/pending.ts`) is possible precisely because content is
  typed: an unconfirmed fact is a different type from a confirmed one.

## Revisit when

A writing section is added. At that point add MDX for that section only and keep the
structured content as it is.

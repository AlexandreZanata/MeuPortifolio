# 0003. Locale as a URL segment, shared slugs, no i18n library

Status: accepted (2026-11)

## Context

The site is published in English, for international readers, and in Brazilian
Portuguese. URLs must be stable, each language must be indexable on its own, and a static
host cannot inspect `Accept-Language`.

## Decision

- Every page lives under a locale segment: `/en/...` and `/pt-br/...`. Both are prefixed,
  so neither language is "the real one" in the URL structure. `x-default` points at
  English.
- **Slugs are the same in both locales** (`/pt-br/projects/`, not `/pt-br/projetos/`).
- No i18n library. A locale list, a typed dictionary per locale, a route builder and
  `Intl` for dates are all the site needs.
- `/` forwards the visitor: by `navigator.language` when scripts run, to English through
  a meta refresh otherwise, with plain links as the last fallback. Hosts with redirect
  rules do it earlier (`public/_redirects`, the nginx example).

## Why shared slugs

Localised slugs read slightly better in Portuguese search results. They also require a
route map between locales, duplicate route folders or rewrites (unavailable in a static
export), and make the language switch and `hreflang` generation depend on that map. With
shared slugs the alternate of any page is the same path under another prefix, which a
single pure function computes. Page titles, descriptions and content are fully localised,
and those carry far more weight than the path.

## Why no library

Libraries such as next-intl solve message formatting, pluralisation, middleware-based
negotiation and client-side translation. The site has no plurals, no interpolated
messages beyond one template, no middleware and no translated strings in client
components except labels passed as props. A dictionary object typed against the English
one gives compile-time completeness with nothing to configure.

## Consequences

- Dictionaries are imported only by Server Components, so no translation ships to the
  browser unless a page passes specific strings to a client component.
- Adding a locale is: one entry in `i18n/config.ts`, one dictionary, and translations of
  each project. The `Localized<T>` type lists everything that is missing.
- If messages with plurals or rich interpolation appear, introduce `Intl.MessageFormat`
  or a library then.

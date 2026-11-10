# 0004. GitHub data from a committed snapshot

Status: accepted (2026-11)

## Context

The Open source page shows a few live facts per repository: licence, last update, latest
release, stars. They come from the GitHub REST API, which is rate-limited (60 requests an
hour without a token) and occasionally unavailable. The site is a static export.

## Options considered

- **Fetch in the browser.** Always fresh, but every visitor spends requests against a
  shared anonymous rate limit, the page shifts when data arrives, and it adds client
  JavaScript and a third-party connection.
- **Fetch during the build.** Fresh at each deploy, but a rate limit or an outage fails
  or degrades the build, and two builds of the same commit can differ.
- **Fetch in a separate step and commit the result.**

## Decision

`scripts/update-github-snapshot.ts` writes `src/content/github/snapshot.json`, and the
site reads only that file.

- The script has a timeout per request, validates every field it stores, keeps the
  previous entry when a repository cannot be fetched, and exits non-zero if anything
  failed.
- A scheduled workflow runs it weekly and opens a pull request, so external data is
  reviewed like any other change.
- `features/github/snapshot.ts` validates the JSON when it is imported; a malformed file
  fails the build.
- The page states the capture date.

Stars are shown only from five upwards (`STAR_DISPLAY_THRESHOLD`): a small count says
nothing useful, and hiding it is not the same as inventing one.

## Consequences

- Data can be up to a week old. For licence and release information that is acceptable,
  and the date is visible.
- Builds are deterministic and need no network or token.
- Curated text (summary, technologies) lives in `content/open-source.ts`; only volatile
  facts come from the snapshot. GitHub's language detection is not used because it is
  misleading for repositories with large generated or script directories.

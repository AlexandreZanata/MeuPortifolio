# Roadmap

Work is split into small phases with verifiable exit criteria. F0 to F6 are done; F7 needs
decisions from the site owner; F8 is optional. The site is publishable without F8.

Legend: ✅ done · 🟡 partly done · ⬜ not started

## F0 — Discovery and decisions ✅

- [x] Read the four project repositories and extract verifiable facts
- [x] Compare Next.js static export, Astro and a Next.js runtime ([ADR 0001](adr/0001-next-static-export.md))
- [x] Decide content model, i18n routing, GitHub data strategy, theme and contact approach (ADRs 0002–0006)

Exit: every decision that is expensive to reverse has a written record.

## F1 — Technical foundation ✅

- [x] Next.js 16, React 19, strict TypeScript (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- [x] ESLint with layer boundaries and cycle detection, Prettier with class sorting
- [x] Vitest, Playwright, axe-core
- [x] CI: format, lint, types, unit tests, build, budgets, browser tests, Lighthouse
- [x] Dependabot for npm and GitHub Actions

Exit: `pnpm check` and `pnpm test:e2e` pass on a clean checkout.

## F2 — Design system and responsive shell ✅

- [x] Tokens: colour, type scale, spacing, radius, motion ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md))
- [x] Self-hosted, subset fonts
- [x] Header, footer, skip link, mobile menu as a native dialog, language switch
- [x] Generated illustrations with a deterministic generator

Exit: no horizontal overflow from 320 to 1920 px; token contrast test passes.

## F3 — Home page and navigation ✅

- [x] Hero with positioning statement, calls to action and plate
- [x] Selected work, open-source band, about teaser, contact call-out
- [x] Root language redirect and bilingual 404 page

Exit: navigation, keyboard and menu specs pass on desktop and mobile profiles.

## F4 — Case studies and bilingual content ✅

- [x] Typed content model with compile-time translation completeness
- [x] Four case studies in English and Portuguese, each fact traced to its repository
- [x] Projects index, case-study page with fact sheet, section navigation and evidence
- [x] About, Contact and Résumé pages; pending mechanism for unconfirmed facts

Exit: content tests pass; no pending field renders in a production build.

## F5 — Open source and GitHub integration ✅

- [x] Open-source hub: maintained projects, organization, other repositories, how to contribute
- [x] Snapshot script with timeouts, validation and fallback; weekly refresh workflow
- [x] Lab with one interactive experiment and the plate gallery

Exit: snapshot validation tests pass; the page renders with a repository missing from the snapshot.

## F6 — SEO, accessibility, performance, tests ✅

- [x] Canonical URLs, `hreflang`, Open Graph and Twitter cards, sitemap, robots, JSON-LD
- [x] Social images and touch icon generated from the real fonts and art
- [x] axe on every page in both locales; heading outline and reflow checks
- [x] Transfer budgets; Lighthouse CI thresholds
- [x] Lab measurements recorded with the commands that produced them ([PERFORMANCE.md](PERFORMANCE.md))

Exit: Lighthouse 100 in accessibility, best practices and SEO, and at least 95 in
performance, on the audited pages.

## F7 — Launch 🟡

Needs input from the site owner.

- [ ] Confirm the pending profile fields, at least e-mail and LinkedIn ([CONTENT.md](CONTENT.md#pending-facts))
- [ ] Choose the host and add the deploy step ([DEPLOYMENT.md](DEPLOYMENT.md))
- [ ] Point the domain, verify headers and redirects, run the post-deploy checklist
- [ ] Decide the licence for content and illustrations (`LICENSE-CONTENT.md` is a conservative default)
- [ ] Add real screenshots to the case studies where they help (Tupi Battle Grounds has published captures)
- [ ] Do the manual accessibility pass with a screen reader ([ACCESSIBILITY.md](ACCESSIBILITY.md#manual-checklist))
- [ ] Register the site in Search Console and submit the sitemap
- [x] README, architecture guide, decision records, contribution and security policies

Exit: the site is live on the domain, the checklist is ticked, and the first field data
is being collected.

## F8 — Optional improvements ⬜

None of these block publication. Each should be justified by a real need before it is
built.

- [ ] Command palette for keyboard navigation (must not replace the visible navigation)
- [ ] More lab experiments, each as an isolated client island
- [ ] Writing section, with MDX for that section only ([ADR 0002](adr/0002-typed-content-over-mdx.md))
- [ ] Dark theme with a second set of plates ([ADR 0005](adr/0005-light-theme-only.md))
- [ ] Visual regression baselines generated in CI (today CI attaches review screenshots)
- [ ] Field metrics dashboard once Chrome UX Report data exists
- [ ] Privacy-respecting, cookieless analytics, only if a concrete question needs data

## Risks being watched

| Risk                                              | Mitigation                                                              |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| Framework JavaScript baseline grows with upgrades | Transfer budget fails the build                                         |
| Case-study facts drift from the repositories      | Evidence links to the source; review when a project ships a release     |
| Lab scores vary between machines                  | Thresholds use the median of three runs and a margin on performance     |
| A single maintainer                               | Small dependency set, grouped Dependabot updates, everything documented |

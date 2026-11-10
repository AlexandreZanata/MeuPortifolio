# Performance

## Targets

Core Web Vitals in **field data**, at the 75th percentile:

| Metric                    | Target   |
| ------------------------- | -------- |
| Largest Contentful Paint  | ≤ 2.5 s  |
| Interaction to Next Paint | ≤ 200 ms |
| Cumulative Layout Shift   | ≤ 0.1    |

Field data only exists once real visitors use the deployed site (Chrome UX Report, Search
Console). Until then everything below is **lab data**: useful for catching regressions,
not a promise about real users. Lab runs use one emulated device on one network profile;
real visitors have slower phones, worse networks and warm or cold caches. A lab score can
also drop a few points on a slower CI runner without any change in the site, which is why
the automated threshold for performance is 95 rather than 100.

## How the site is kept fast

- **Static HTML.** Every page is pre-rendered; the first byte is a file read.
- **Text is the largest paint.** Headlines are plain HTML text and are never animated in.
  The plate visible on arrival is drawn by reference (`<use>`), so the browser's largest
  contentful paint is the text and does not wait for an ornament
  (`src/components/ui/plate.tsx`).
- **One complete first frame.** `<link rel="expect" blocking="render">` holds the first
  paint until the document is parsed, instead of painting the header first and the
  content a frame later.
- **Fonts.** Four self-hosted, Latin-subset variable files (31, 39, 30 and 30 kB). The
  display and body faces are preloaded; the italic is preloaded only on the home page,
  its only user; the monospace face is not preloaded. `next/font` generates size-adjusted
  fallbacks, so the swap does not shift the layout.
- **Images.** Illustrations are SVG between 3 and 15 kB compressed, with explicit
  dimensions. Plates below the first screen are lazy.
- **JavaScript.** Server Components by default; five small client components. No
  animation, state, date or UI library. What ships is essentially the framework runtime.
- **CSS.** One stylesheet of about 7.5 kB compressed, generated from the utilities
  actually used.
- **No third parties.** No analytics, tag manager, embedded media or web-font service.
- **Prefetch.** Navigation and project links are prefetched when they scroll into view;
  footer links and the language switch are not.
- **Caching.** Fingerprinted assets under `/_next/static` are immutable for a year; HTML
  is revalidated on every visit (see [DEPLOYMENT.md](DEPLOYMENT.md)).

## Budgets

`pnpm budget` checks every exported page (sizes after gzip; fonts as shipped):

| Asset           | Budget per page | Today                          |
| --------------- | --------------- | ------------------------------ |
| HTML            | 30 kB           | 3–16 kB                        |
| CSS             | 12 kB           | 7.5 kB                         |
| JavaScript      | 150 kB          | 137–144 kB                     |
| Preloaded fonts | 105 kB          | 60 kB (98 kB on the home page) |
| Each plate      | 18 kB           | 3–14 kB                        |

The JavaScript number is almost entirely the React and Next.js runtime, the price of the
framework choice discussed in [ADR 0001](adr/0001-next-static-export.md). The budget's
job is to notice when application code or a dependency starts adding to it.

## Lab measurements

Measured on 2026-11-10 with Lighthouse 13.6.0 and Chrome for Testing 149 against the
exported site served by `pnpm start` on localhost (Brotli, HTTP/1.1). Mobile runs use
Lighthouse's default emulated phone with simulated slow-4G throttling; desktop runs use
`--preset=desktop`.

```bash
pnpm build && pnpm start &
npx lighthouse http://localhost:4173/en/ --chrome-flags="--headless=new"
npx lighthouse http://localhost:4173/en/ --preset=desktop --chrome-flags="--headless=new"
```

| Page                     | Mobile: Perf / A11y / BP / SEO | Mobile LCP | Desktop: Perf / A11y / BP / SEO |
| ------------------------ | ------------------------------ | ---------- | ------------------------------- |
| `/en/`                   | 100 / 100 / 100 / 100          | 0.9 s      | 100 / 100 / 100 / 100           |
| `/pt-br/`                | 100 / 100 / 100 / 100          | 0.8 s      | 100 / 100 / 100 / 100           |
| `/en/projects/`          | 100 / 100 / 100 / 100          | 0.9 s      | 100 / 100 / 100 / 100           |
| `/en/projects/opencnpj/` | 100 / 100 / 100 / 100          | 0.8 s      | 100 / 100 / 100 / 100           |
| `/en/open-source/`       | 100 / 100 / 100 / 100          | 0.8 s      | 100 / 100 / 100 / 100           |
| `/en/lab/`               | 100 / 100 / 100 / 100          | 0.8 s      | 100 / 100 / 100 / 100           |
| `/en/about/`             | 100 / 100 / 100 / 100          | 0.8 s      | 100 / 100 / 100 / 100           |
| `/en/contact/`           | 100 / 100 / 100 / 100          | 0.8 s      | 100 / 100 / 100 / 100           |
| `/en/resume/`            | 100 / 100 / 100 / 100          | 0.8 s      | 100 / 100 / 100 / 100           |

Cumulative Layout Shift was 0 and Total Blocking Time at most 70 ms in every run. The
remaining case-study pages scored the same as the one listed.

Scores vary slightly between runs: across repeated mobile runs of the home page the
performance score stayed between 99 and 100. Treat a single run as a sample.

What these numbers do not cover:

- The production host. Latency, compression and protocol (HTTP/2 or 3) are the host's;
  re-measure with PageSpeed Insights after each deployment change.
- Interaction to Next Paint, which only exists in field data. Total Blocking Time is the
  lab proxy.
- Devices slower than Lighthouse's emulated mid-range phone.

## Automated checks

| Check            | Command                 | Fails when                                                                          |
| ---------------- | ----------------------- | ----------------------------------------------------------------------------------- |
| Transfer budgets | `pnpm budget`           | A page exceeds a budget above                                                       |
| Lighthouse CI    | `npx @lhci/cli autorun` | Performance below 95 (median of 3), any other category below 100, or CLS above 0.02 |
| Layout stability | `e2e/layout.spec.ts`    | An image has no intrinsic size                                                      |
| Console          | `e2e/lab.spec.ts`       | A page logs an error                                                                |

## When a number gets worse

1. Run `pnpm budget` to see which asset grew.
2. Check whether a component became a client component (`'use client'`) or a dependency
   was added.
3. In a Lighthouse report, open "Largest Contentful Paint element": it should be text.
   If it is an image, that image needs `priority`, or the layout changed which element is
   largest.
4. Do not fix a score by hiding work from the measurement. Fix what the visitor waits for.

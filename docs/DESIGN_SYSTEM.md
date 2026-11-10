# Design system

The visual language is **editorial**: ivory paper, strong black type, one burnt-orange
accent, hairline rules, monospace labels and engraved illustrations. It should read like a
well-set technical journal, not like a product dashboard.

All tokens live in [`src/app/globals.css`](../src/app/globals.css). This document explains
what they are for.

## Direction: two options, one chosen

|            | A. Editorial plate (chosen)                                                   | B. Engineering notebook                                                              |
| ---------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Idea       | A printed journal: serif display type, plates with captions, generous margins | A lab notebook: grid paper, monospace throughout, diagrams as wireframes             |
| Typography | High-contrast serif headlines, grotesque body, mono for labels only           | Monospace headlines and body, one sans for long text                                 |
| Art        | Stippled and engraved plates generated from code                              | Blueprint line diagrams of each system                                               |
| Strength   | Memorable in seconds, reads as mature, long case studies stay comfortable     | Signals "engineer" immediately, very cheap to extend                                 |
| Risk       | Serif display needs care at small sizes; art must stay an accent              | Close to the terminal aesthetic the brief rules out; monospace body tires the reader |

Direction A was chosen because recruiters read first and inspect later: a strong headline
and a clear hierarchy do more for comprehension than a technical costume, and the case
studies are long-form text that deserves a reading typeface. The notebook's best idea,
monospace labels and figure numbers, was kept as the secondary voice.

## Colour

One light theme ([ADR 0005](adr/0005-light-theme-only.md)). The default Tailwind palette
is removed, so these are the only colours available.

| Token           | Value     | Use                                                 |
| --------------- | --------- | --------------------------------------------------- |
| `paper`         | `#f5f0e6` | Page background                                     |
| `paper-raised`  | `#fbf8f1` | Cards and panels                                    |
| `paper-sunken`  | `#ebe4d5` | Inline code, table headers                          |
| `ink`           | `#17130e` | Headlines, body emphasis, inverted sections         |
| `ink-soft`      | `#3a342b` | Body text                                           |
| `ink-muted`     | `#625a4e` | Labels, captions, metadata                          |
| `rule`          | `#d6cdbb` | Hairlines, decorative borders                       |
| `rule-strong`   | `#8c816b` | Borders that identify a control (3:1 against paper) |
| `accent`        | `#b8430b` | The single accent: indices, emphasis, focus ring    |
| `accent-strong` | `#8f3207` | Accent on hover, error text                         |
| `accent-on-ink` | `#ef8a4f` | The accent on dark sections                         |

Contrast is tested, not assumed: `src/app/globals.test.ts` reads these tokens and fails
the build if a text pair drops below 4.5:1 or a control boundary below 3:1.

Rules of use:

- The accent marks at most one thing per view. It is never a background for a whole
  section.
- Colour never carries meaning alone: links are underlined, states have text, the current
  navigation item has an `aria-current` attribute and an underline.

## Typography

| Family                          | Role                         | File                                                 |
| ------------------------------- | ---------------------------- | ---------------------------------------------------- |
| Fraunces (display optical size) | Headlines and names          | `fraunces-display.woff2`, italic for the hero phrase |
| Instrument Sans                 | Body and interface           | `instrument-sans.woff2`                              |
| JetBrains Mono                  | Labels, captions, code, data | `jetbrains-mono.woff2`                               |

The scale is fluid between a 375 px and a 1440 px viewport, with `clamp()`:

| Utility          | Size                         | Use                              |
| ---------------- | ---------------------------- | -------------------------------- |
| `text-display-1` | 2.5 → 5.5 rem                | Home headline                    |
| `text-display-2` | 2.25 → 4.25 rem              | Page titles                      |
| `text-title-1`   | 1.875 → 3 rem                | Section titles, evidence figures |
| `text-title-2`   | 1.5 → 2 rem                  | Card titles                      |
| `text-title-3`   | 1.25 rem                     | Item titles                      |
| `text-lede`      | 1.125 → 1.3125 rem           | Introductory paragraphs          |
| `text-base`      | 1 rem / 1.65                 | Body                             |
| `text-sm`        | 0.875 rem                    | Secondary text                   |
| `text-label`     | 0.75 rem, uppercase, tracked | The `label` utility              |

- Headlines use the `display` utility (weight 560, slightly negative tracking) and
  `text-wrap: balance`; paragraphs use `text-wrap: pretty`.
- Line length is capped in `ch` on the text itself (`max-w-[62ch]`), not on containers.
- Fraunces is pinned to its display optical size. It is not used below 19 px.
- Only glyphs in the Latin subset are available. Arrows are SVG icons, not characters.

## Layout

- **Container**: `container-page`, 84 rem wide, with a fluid gutter (`--gutter`, 1.25 →
  3.5 rem).
- **Grid**: 12 columns from `lg` up; a single column below. Section openers put a label
  in columns 1–3 and the title in 4–12, which gives every page the same left margin
  rhythm.
- **Vertical rhythm**: `section-space` (`--section`, 4.5 → 9 rem) between page sections.
- **Breakpoints**: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Layouts
  are designed and tested at 375, 768, 1024 and 1440 px, and checked for overflow from
  320 to 1920 px.
- **Radius**: `xs` 2 px, `sm` 4 px, `md` 8 px. Nothing is pill-shaped.
- **Elevation**: none. Borders and background steps separate surfaces; the shadow scale
  is removed from the theme.

## Components

Primitives in `src/components/ui`:

| Component             | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `ButtonLink`          | A link styled as a button: `primary`, `secondary`, `inverse`  |
| `TextLink`            | Underlined inline link, optional arrow                        |
| `SmartLink`           | Chooses router link or anchor; owns the external-link policy  |
| `SectionHeading`      | Rule, margin label and title that open every section          |
| `PageHeader`          | Title block of inner pages; renders the page's only `h1`      |
| `Plate`, `PlateImage` | Illustration with frame and caption; lazy or priority loading |
| `Tag`, `TagList`      | Monospace chips for technologies                              |
| `RichText`            | Inline `code` and _emphasis_ in content strings               |
| `PendingNote`         | Development-only marker for unconfirmed content               |
| `JsonLd`              | Structured data                                               |
| Icons                 | Three arrows and the site mark, as inline SVG                 |

There is deliberately no generic `Card`, `Stack` or `Box`. Layout is written with
utilities where it is used; a component exists when it has behaviour or a contract.

## Interaction states

- **Focus**: a 2 px accent outline with a 3 px offset on every focusable element
  (`:focus-visible`). It is never removed. `scroll-padding-top` keeps focused elements
  clear of the sticky header.
- **Hover**: links take the accent and a solid underline; buttons invert; cards darken
  their border, move their arrow and enlarge the plate slightly.
- **Current**: navigation items carry `aria-current="page"` and a persistent underline.
- **Targets**: buttons, navigation and menu items are at least 44 px tall. Links inside
  running text are exempt, as WCAG allows.

## Motion

Motion confirms an action or introduces one element; it never decorates.

- Durations: 160–300 ms for state changes, 700 ms for the hero plate's entrance.
- Easing: `--ease-editorial` (`cubic-bezier(0.2, 0, 0, 1)`).
- The headline is never animated: it is the largest paint on the page.
- `prefers-reduced-motion: reduce` disables animations and transitions globally, and the
  entrance uses `motion-safe:`.
- No scroll-triggered effects, parallax, video or WebGL.

## Illustrations

Each plate is drawn by `scripts/generate-art.ts` and committed to `public/art`.

- **Technique**: tone is stippled (variable-density dart throwing over a darkness field,
  with spacing proportional to `1/sqrt(tone)`), and structure is engraved (hairlines,
  hatching, guilloché curves). Light always comes from the upper left.
- **Palette**: ink and one accent mark per plate.
- **Determinism**: a seeded generator makes the output byte-identical across runs and
  Node versions; CI regenerates the plates and fails on a difference.
- **Weight**: dots are zero-length strokes written as relative moves, which keeps a plate
  with thousands of dots between 3 and 15 kB compressed.
- **Meaning**: plates are decorative (`aria-hidden` or empty `alt`). The caption beside
  them carries the idea, so nothing depends on seeing the drawing.

| Plate                | Subject                                  | Used for            |
| -------------------- | ---------------------------------------- | ------------------- |
| `hero-armillary.svg` | An armillary sphere with bodies in orbit | Home, social image  |
| `plate-strata.svg`   | Loose sheets settling into one block     | OpenCNPJ            |
| `plate-seal.svg`     | A guilloché seal with a check            | br-validators       |
| `plate-lane.svg`     | Two strongholds and one lane             | Tupi Battle Grounds |
| `plate-drop.svg`     | A drop over a contour map                | Abastevo            |

To add a plate, write a function that returns `svg(width, height, body)`, register it in
the `plates` map, run `pnpm art` and reference the file from the project's `meta.plate`.

# Accessibility

**Target: WCAG 2.2 level AA.** Automated tools find only part of what matters, so this
document lists both what is checked by machines and what has to be checked by a person.

## Built in

- **Structure**: one `h1` per page, no skipped heading levels, landmarks for header,
  navigation, main and footer, lists and definition lists for list-like content.
- **Keyboard**: every interaction works with the keyboard. The first Tab stop is a skip
  link that moves focus to `<main>`. Focus is always visible, and a `scroll-padding-top`
  keeps focused elements out from under the sticky header (2.4.11).
- **Menu**: the small-screen menu is a native modal `<dialog>`: focus is trapped, Escape
  closes it, the page behind is inert and focus returns to the trigger.
- **Language**: `lang` is set per locale on `<html>`, and on links or sections written in
  the other language.
- **Colour**: text pairs meet 4.5:1 and control boundaries 3:1; this is a unit test on the
  tokens. Nothing is communicated by colour alone: links are underlined, the current
  navigation item has `aria-current` and an underline, validation results are text.
- **Images**: illustrations are decorative and hidden from assistive technology; the
  caption next to each one is real text.
- **Motion**: `prefers-reduced-motion` disables animation and smooth scrolling. Nothing
  moves on its own for more than a moment.
- **Zoom and reflow**: type and spacing are in `rem`; layouts reflow down to 320 px
  without horizontal scrolling (1.4.10) and are tested at a 200% zoom equivalent.
- **Targets**: controls are at least 44 px tall; the minimum required by 2.5.8 is 24 px.
- **Forms**: the only input (the CNPJ field in the Lab) has a visible label, a hint, an
  `aria-invalid` state and a live region that announces the result in words.
- **Links**: link text describes the destination. External links open in the same tab, so
  the Back button always works; buttons and cards that leave the site show an outward
  arrow.

## Automated checks

| Check                                               | Where                       | Scope                                                                     |
| --------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| axe-core, WCAG 2.0–2.2 A/AA and best-practice rules | `e2e/accessibility.spec.ts` | Every page, both locales, desktop and mobile profiles, plus the open menu |
| Heading outline                                     | `e2e/accessibility.spec.ts` | One `h1`, no skipped levels, every page                                   |
| Keyboard paths                                      | `e2e/navigation.spec.ts`    | Skip link, menu open/close/restore focus                                  |
| Reflow                                              | `e2e/layout.spec.ts`        | No horizontal overflow at 320, 375, 768, 1024, 1440, 1920 px              |
| Contrast of tokens                                  | `src/app/globals.test.ts`   | Every colour pair in use                                                  |
| Lint                                                | `eslint-plugin-jsx-a11y`    | Markup mistakes at authoring time                                         |
| Lighthouse accessibility                            | `lighthouserc.json`         | Must score 100 on the audited pages                                       |

A green run means "no detectable violations", not "accessible".

## Manual checklist

Run this before a release that changes layout, navigation or components.

**Keyboard**

- [ ] Tab through a page from the address bar: the order follows the reading order and
      nothing is skipped or trapped.
- [ ] Every focused element has a clearly visible ring, including on dark sections.
- [ ] The skip link appears on first Tab and moves focus into the content.
- [ ] On a narrow window: open the menu with Enter, Tab stays inside it, Escape closes it
      and focus returns to the Menu button.
- [ ] The in-page links of a case study move both the view and the focus position.

**Screen reader** (VoiceOver with Safari, NVDA with Firefox or Chrome)

- [ ] The page title and the `h1` identify the page.
- [ ] Landmarks and headings give a usable outline of the page.
- [ ] Project cards are announced once, by project name.
- [ ] The language switch is announced as a group named "Language" and says which
      language is current.
- [ ] In the Lab, typing a CNPJ announces the verdict without moving focus.
- [ ] Portuguese pages are read with a Portuguese voice.

**Visual**

- [ ] At 400% zoom (or a 320 px window) content reflows into one column and nothing is
      clipped or overlaps.
- [ ] With text spacing overrides (1.4.12) no text is cut off.
- [ ] In forced-colours / high-contrast mode, text, borders and focus rings remain
      visible.
- [ ] With reduced motion enabled, nothing animates.
- [ ] The page is understandable in greyscale.

**Touch**

- [ ] On a phone, every control can be tapped without hitting its neighbour.
- [ ] Nothing depends on hover.

**Print**

- [ ] The résumé prints on one or two pages without the site header and footer.

## Known limitations

- Automated contrast checks cannot evaluate text over the paper grain; the grain's
  opacity is low enough that it does not change the measured ratios meaningfully.
- The illustrations have no long description. They are ornamental, and their captions
  state the idea in text.

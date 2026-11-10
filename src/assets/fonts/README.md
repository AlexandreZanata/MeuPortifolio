# Fonts

All fonts are self-hosted and licensed under the SIL Open Font License 1.1
(see `licenses/`). They are loaded through `next/font/local` in `src/app/fonts.ts`.

| File | Family | Axes kept | Source |
| ---- | ------ | --------- | ------ |
| `fraunces-display.woff2` | Fraunces | `wght` 400–700, `opsz` pinned at 144 | `@fontsource-variable/fraunces` 5.3.0 |
| `fraunces-display-italic.woff2` | Fraunces Italic | `wght` 400–700, `opsz` pinned at 144 | `@fontsource-variable/fraunces` 5.3.0 |
| `instrument-sans.woff2` | Instrument Sans | `wght` 400–700 | `@fontsource-variable/instrument-sans` 5.3.0 |
| `jetbrains-mono.woff2` | JetBrains Mono | `wght` 400–600 | `@fontsource-variable/jetbrains-mono` 5.3.0 |

Every file is the Latin subset, which covers English and Portuguese.

## How the files were produced

The Fontsource packages ship one variable file per axis set. Axes that the design does
not use were removed with fontTools, which cuts the display faces to about half their size:

```bash
fonttools varLib.instancer fraunces-latin-opsz-normal.woff2 opsz=144 wght=400:700 -o fraunces-display.woff2
fonttools varLib.instancer fraunces-latin-opsz-italic.woff2 opsz=144 wght=400:700 -o fraunces-display-italic.woff2
fonttools varLib.instancer jetbrains-mono-latin-wght-normal.woff2 wght=400:600 -o jetbrains-mono.woff2
```

`instrument-sans-latin-wght-normal.woff2` is used unchanged.

Fraunces is only used at display sizes, so the optical size is pinned to its display
master (144). If the serif is ever needed for running text, ship a second instance with a
text optical size instead of reusing this one.

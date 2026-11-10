# 0005. A single light theme

Status: accepted (2026-11)

## Context

The identity is ink on ivory paper with engraved illustrations. A dark theme is a common
expectation on developer sites.

## Decision

Ship one light theme and declare `color-scheme: light`.

- The illustrations are drawn in ink with paper-coloured knock-outs. A dark variant is a
  second set of plates and a second art direction, not an inverted palette.
- Every colour pair is contrast-tested. A second theme doubles the pairs to design, test
  and review, for a site whose reading sessions are short.
- The page already has a dark register where it helps rhythm: the inverted sections.

## Consequences

- Visitors who prefer dark interfaces get a light page. The paper tone (`#f5f0e6`) is
  deliberately softer than white.
- Tokens are named by role (`paper`, `ink`, `rule`), not by colour, so a future theme is a
  second set of values under a `prefers-color-scheme` rule plus plates that use
  `currentColor`.

## Revisit when

The site gains long-form reading (articles), where a dark option matters more.

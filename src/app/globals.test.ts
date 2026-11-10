import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Contrast is a property of the design tokens, so it is tested where they are defined.
 * Every colour pair the components actually use is listed below with the WCAG 2.2 level it
 * has to meet; changing a token to something illegible fails the build, not a manual audit.
 */
const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

function token(name: string): string {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(css);
  if (!match?.[1]) throw new Error(`Token --color-${name} not found`);
  return match[1];
}

type Rgb = readonly [number, number, number];

function rgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** `foreground` at the given opacity over `background`, as the browser composites it. */
function blend(foreground: Rgb, background: Rgb, alpha: number): Rgb {
  return [0, 1, 2].map((i) =>
    Math.round((foreground[i] ?? 0) * alpha + (background[i] ?? 0) * (1 - alpha)),
  ) as unknown as Rgb;
}

function luminance(color: Rgb): number {
  const [r, g, b] = color.map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

const TEXT = 4.5; // WCAG 1.4.3, normal-size text
const UI = 3; // WCAG 1.4.11, component boundaries and large text

describe('colour tokens', () => {
  it.each([
    ['ink', 'paper', TEXT],
    ['ink', 'paper-raised', TEXT],
    ['ink-soft', 'paper', TEXT],
    ['ink-soft', 'paper-raised', TEXT],
    ['ink-soft', 'paper-sunken', TEXT],
    ['ink-muted', 'paper', TEXT],
    ['ink-muted', 'paper-raised', TEXT],
    ['accent', 'paper', TEXT],
    ['accent', 'paper-raised', TEXT],
    ['accent-strong', 'paper', TEXT],
    ['accent-strong', 'paper-raised', TEXT],
    ['paper', 'ink', TEXT],
    ['paper', 'accent-strong', TEXT],
    ['accent-on-ink', 'ink', TEXT],
    ['ink', 'accent-on-ink', TEXT],
    ['rule-strong', 'paper', UI],
    ['rule-strong', 'paper-raised', UI],
  ])('%s on %s meets %s:1', (foreground, background, minimum) => {
    const ratio = contrast(rgb(token(foreground)), rgb(token(background)));
    expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(minimum);
  });

  it.each([
    [0.75, TEXT],
    [0.7, TEXT],
  ])('paper at %s opacity on ink meets %s:1', (alpha, minimum) => {
    const ink = rgb(token('ink'));
    const ratio = contrast(blend(rgb(token('paper')), ink, alpha), ink);
    expect(ratio).toBeGreaterThanOrEqual(minimum);
  });
});

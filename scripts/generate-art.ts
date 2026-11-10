/**
 * Generates the engraved "plates" used across the site (public/art/*.svg).
 *
 * Everything is drawn from code with a seeded random generator, so the output is
 * deterministic: running `pnpm art` twice yields byte-identical files. The plates are
 * committed, which keeps the build free of this step and lets reviewers diff the art.
 *
 * Technique: tone is rendered by stippling (dots whose spacing follows a darkness field)
 * and by line engraving (hairlines, hatching, guilloché curves). See docs/DESIGN_SYSTEM.md.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const INK = '#17130e';
const ACCENT = '#b8430b';
const PAPER = '#f5f0e6';

type Vec2 = readonly [number, number];
type Vec3 = readonly [number, number, number];
/** Darkness at a point: 0 leaves the paper untouched, 1 is the densest stipple. */
type Field = (x: number, y: number) => number;

interface Dot {
  readonly x: number;
  readonly y: number;
  readonly tone: number;
}

// --- math ---------------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min = 0, max = 1): number {
  // NaN would slip through every comparison below and flood a plate with dots.
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function normalize([x, y, z]: Vec3): Vec3 {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

/** Light comes from the upper left, slightly towards the viewer, on every plate. */
const LIGHT = normalize([-0.52, -0.62, 0.58]);

const n1 = (value: number): string => String(Math.round(value * 10) / 10);

// --- stippling ----------------------------------------------------------------------------

interface StippleOptions {
  readonly bounds: readonly [number, number, number, number];
  /** Dot spacing where the field is fully dark. Lighter tones spread out from here. */
  readonly spacing: number;
  readonly seed: number;
  /** Tones below this stay empty, which keeps highlights clean. */
  readonly floor?: number;
}

/**
 * Variable-density dart throwing: a candidate is kept only if no accepted dot lies within
 * the spacing its own tone asks for. Spacing grows as 1/sqrt(tone), so dot density is
 * proportional to darkness, which is what makes stipple read as continuous tone.
 */
function stipple(field: Field, options: StippleOptions): Dot[] {
  const { bounds, spacing, seed, floor = 0.035 } = options;
  const [x0, y0, x1, y1] = bounds;
  const random = mulberry32(seed);
  const maxSpacing = spacing * 5.5;
  const cell = maxSpacing;
  const columns = Math.ceil((x1 - x0) / cell) + 1;
  const grid = new Map<number, Dot[]>();
  const dots: Dot[] = [];
  const attempts = Math.ceil((((x1 - x0) * (y1 - y0)) / (spacing * spacing)) * 9);

  for (let i = 0; i < attempts; i += 1) {
    const x = x0 + random() * (x1 - x0);
    const y = y0 + random() * (y1 - y0);
    const tone = clamp(field(x, y));
    if (tone < floor) continue;
    // Feather the lightest tones instead of letting them end on a hard edge.
    if (tone < 0.12 && random() > tone / 0.12) continue;

    const radius = Math.min(maxSpacing, spacing / Math.sqrt(tone));
    const cx = Math.floor((x - x0) / cell);
    const cy = Math.floor((y - y0) / cell);
    let free = true;
    for (let gy = cy - 1; gy <= cy + 1 && free; gy += 1) {
      for (let gx = cx - 1; gx <= cx + 1 && free; gx += 1) {
        const bucket = grid.get(gx + gy * columns);
        if (!bucket) continue;
        for (const other of bucket) {
          if (Math.hypot(other.x - x, other.y - y) < radius) {
            free = false;
            break;
          }
        }
      }
    }
    if (!free) continue;

    const dot: Dot = { x, y, tone };
    dots.push(dot);
    const key = cx + cy * columns;
    const bucket = grid.get(key);
    if (bucket) bucket.push(dot);
    else grid.set(key, [dot]);
  }
  return dots;
}

/**
 * Serialises dots as zero-length strokes with round caps, grouped in three sizes. Dots are
 * visited in a serpentine order and written as small relative moves, which is what keeps a
 * plate with thousands of dots in the tens of kilobytes.
 */
function dotsToSvg(dots: readonly Dot[], scale = 1, color = INK): string {
  const sizes = [1.7, 2.2, 2.75].map((size) => size * scale);
  const groups: Dot[][] = [[], [], []];
  for (const dot of dots) {
    const index = dot.tone > 0.62 ? 2 : dot.tone > 0.3 ? 1 : 0;
    groups[index]?.push(dot);
  }

  return groups
    .map((group, index) => {
      if (group.length === 0) return '';
      const band = 18;
      const ordered = [...group].sort((a, b) => {
        const rowA = Math.floor(a.y / band);
        const rowB = Math.floor(b.y / band);
        if (rowA !== rowB) return rowA - rowB;
        return rowA % 2 === 0 ? a.x - b.x : b.x - a.x;
      });
      let d = '';
      let px = 0;
      let py = 0;
      for (const dot of ordered) {
        const x = Math.round(dot.x);
        const y = Math.round(dot.y);
        const dx = x - px;
        const dy = y - py;
        d += `m${dx}${dy < 0 ? '' : ' '}${dy}h0`;
        px = x;
        py = y;
      }
      return `<path stroke="${color}" stroke-width="${n1(sizes[index] ?? 2)}" d="${d}"/>`;
    })
    .join('');
}

// --- tone fields --------------------------------------------------------------------------

function sphereField(cx: number, cy: number, radius: number): Field {
  return (x, y) => {
    const nx = (x - cx) / radius;
    const ny = (y - cy) / radius;
    const rr = nx * nx + ny * ny;
    if (rr >= 1) return 0;
    const nz = Math.sqrt(1 - rr);
    const lambert = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
    let tone = Math.pow(1 - clamp(lambert), 1.18);
    // Reflected light: the shadow side lifts slightly towards the limb, as in engravings.
    const limb = smoothstep(0.8, 1, Math.sqrt(rr));
    if (lambert < 0.2) tone *= 1 - 0.38 * limb;
    return clamp(tone * 1.08 - 0.06);
  };
}

/** Solves p = origin + u*e1 + v*e2 and returns [u, v], used to test parallelogram faces. */
function faceCoords(p: Vec2, origin: Vec2, e1: Vec2, e2: Vec2): Vec2 {
  const det = e1[0] * e2[1] - e1[1] * e2[0];
  const px = p[0] - origin[0];
  const py = p[1] - origin[1];
  return [(px * e2[1] - py * e2[0]) / det, (e1[0] * py - e1[1] * px) / det];
}

// --- line helpers -------------------------------------------------------------------------

function polyline(points: readonly Vec2[], close = false): string {
  let d = '';
  let previous: Vec2 = [0, 0];
  points.forEach((point, index) => {
    if (index === 0) {
      d += `M${n1(point[0])} ${n1(point[1])}`;
    } else {
      const dx = Math.round((point[0] - previous[0]) * 10) / 10;
      const dy = Math.round((point[1] - previous[1]) * 10) / 10;
      d += `l${dx}${dy < 0 ? '' : ' '}${dy}`;
      // Track the rounded position so rounding error cannot accumulate along the path.
      point = [previous[0] + dx, previous[1] + dy];
    }
    previous = point;
  });
  return close ? `${d}z` : d;
}

interface Ellipse {
  readonly cx: number;
  readonly cy: number;
  readonly rx: number;
  readonly ry: number;
  /** Rotation in degrees. */
  readonly tilt: number;
}

function ellipsePoint(ellipse: Ellipse, angle: number, grow = 0): Vec2 {
  const tilt = (ellipse.tilt * Math.PI) / 180;
  const x = (ellipse.rx + grow) * Math.cos(angle);
  const y = (ellipse.ry + grow) * Math.sin(angle);
  return [
    ellipse.cx + x * Math.cos(tilt) - y * Math.sin(tilt),
    ellipse.cy + x * Math.sin(tilt) + y * Math.cos(tilt),
  ];
}

function ellipseArc(ellipse: Ellipse, from: number, to: number, grow = 0, steps = 96): string {
  const points: Vec2[] = [];
  for (let i = 0; i <= steps; i += 1) {
    points.push(ellipsePoint(ellipse, from + ((to - from) * i) / steps, grow));
  }
  return polyline(points);
}

/** Graduation marks between two concentric ellipses, longer every `major` steps. */
function graduations(
  ellipse: Ellipse,
  from: number,
  to: number,
  count: number,
  width: number,
  major: number,
): string {
  let d = '';
  for (let i = 0; i <= count; i += 1) {
    const angle = from + ((to - from) * i) / count;
    const inner = ellipsePoint(ellipse, angle, 0);
    const outer = ellipsePoint(ellipse, angle, i % major === 0 ? width : width * 0.5);
    d += `M${n1(inner[0])} ${n1(inner[1])}L${n1(outer[0])} ${n1(outer[1])}`;
  }
  return d;
}

function hatchedEllipse(cx: number, cy: number, rx: number, ry: number, step: number): string {
  let d = '';
  for (let dy = -ry + step / 2; dy < ry; dy += step) {
    const half = rx * Math.sqrt(1 - (dy / ry) ** 2);
    d += `M${n1(cx - half)} ${n1(cy + dy)}h${n1(half * 2)}`;
  }
  return d;
}

/**
 * The drawing lives in a group with the id `plate`. Pages can then show a plate either as
 * an `<img>` or by reference (`<use href="plate.svg#plate">`), see components/ui/plate.tsx.
 */
const svg = (width: number, height: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><g id="plate" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>\n`;

const line = (d: string, width: number, opacity = 1, color = INK): string =>
  `<path stroke="${color}" stroke-width="${width}"${opacity < 1 ? ` opacity="${opacity}"` : ''} d="${d}"/>`;

// --- plates -------------------------------------------------------------------------------

/** Hero: an armillary sphere. One body, several orbits: the shape of the work itself. */
function heroPlate(): string {
  const width = 720;
  const height = 820;
  const cx = 356;
  const cy = 392;
  const radius = 198;
  const random = mulberry32(11);

  const sphere = dotsToSvg(
    stipple(sphereField(cx, cy, radius), {
      bounds: [cx - radius, cy - radius, cx + radius, cy + radius],
      spacing: 2.85,
      seed: 7,
    }),
  );

  const equator: Ellipse = { cx, cy, rx: 322, ry: 84, tilt: -17 };
  const orbit: Ellipse = { cx, cy, rx: 286, ry: 150, tilt: 34 };
  const meridian: Ellipse = { cx, cy, rx: 246, ry: 246, tilt: 0 };

  // Arcs behind the sphere are drawn first and covered by a paper disc; front arcs go on top.
  const behind =
    line(ellipseArc(equator, Math.PI, Math.PI * 2), 1.1) +
    line(ellipseArc(equator, Math.PI, Math.PI * 2, 9), 0.7, 0.75) +
    line(graduations(equator, Math.PI, Math.PI * 2, 72, 9, 6), 0.6, 0.7) +
    line(ellipseArc(orbit, Math.PI, Math.PI * 2), 0.8, 0.7);

  const front =
    line(ellipseArc(equator, 0, Math.PI, 4.5), 13, 1, PAPER) +
    line(ellipseArc(equator, 0, Math.PI), 1.1) +
    line(ellipseArc(equator, 0, Math.PI, 9), 0.7, 0.75) +
    line(graduations(equator, 0, Math.PI, 72, 9, 6), 0.6, 0.7) +
    line(ellipseArc(orbit, 0, Math.PI), 5, 1, PAPER) +
    line(ellipseArc(orbit, 0, Math.PI), 0.8, 0.7);

  const ring =
    line(ellipseArc(meridian, 0, Math.PI * 2, 0, 180), 0.9) +
    line(ellipseArc(meridian, 0, Math.PI * 2, 12, 180), 0.6, 0.7) +
    line(graduations(meridian, 0, Math.PI * 2, 180, 12, 5), 0.55, 0.6);

  // Polar axis, tilted like the equator, with small finials where it meets the ring.
  const axisAngle = ((-17 - 90) * Math.PI) / 180;
  const reach = 246 + 34;
  const top: Vec2 = [cx + Math.cos(axisAngle) * reach, cy + Math.sin(axisAngle) * reach];
  const bottom: Vec2 = [cx - Math.cos(axisAngle) * reach, cy - Math.sin(axisAngle) * reach];
  const axisStart: Vec2 = [cx + Math.cos(axisAngle) * radius, cy + Math.sin(axisAngle) * radius];
  const axisEnd: Vec2 = [cx - Math.cos(axisAngle) * radius, cy - Math.sin(axisAngle) * radius];
  const axis =
    line(
      `M${n1(top[0])} ${n1(top[1])}L${n1(axisStart[0])} ${n1(axisStart[1])}` +
        `M${n1(axisEnd[0])} ${n1(axisEnd[1])}L${n1(bottom[0])} ${n1(bottom[1])}`,
      0.9,
    ) +
    `<circle cx="${n1(top[0])}" cy="${n1(top[1])}" r="4.5" fill="${PAPER}" stroke="${INK}" stroke-width="1"/>` +
    `<circle cx="${n1(bottom[0])}" cy="${n1(bottom[1])}" r="4.5" fill="${INK}"/>`;

  // Bodies in orbit: the accent marks the one in front.
  const sun = ellipsePoint(equator, 0.62, 4.5);
  const trail = line(ellipseArc(equator, 0.62, 1.42, 4.5, 40), 2.4, 1, ACCENT);
  const moon = ellipsePoint(orbit, 2.42);
  const moonDots = dotsToSvg(
    stipple(sphereField(moon[0], moon[1], 17), {
      bounds: [moon[0] - 17, moon[1] - 17, moon[0] + 17, moon[1] + 17],
      spacing: 2.6,
      seed: 23,
    }),
    0.8,
  );
  const bodies =
    trail +
    `<circle cx="${n1(sun[0])}" cy="${n1(sun[1])}" r="20" fill="${PAPER}"/>` +
    `<circle cx="${n1(sun[0])}" cy="${n1(sun[1])}" r="14" fill="${ACCENT}"/>` +
    `<circle cx="${n1(moon[0])}" cy="${n1(moon[1])}" r="21" fill="${PAPER}"/>` +
    `<circle cx="${n1(moon[0])}" cy="${n1(moon[1])}" r="17" stroke="${INK}" stroke-width="0.7" opacity="0.6"/>` +
    moonDots;

  // The lit side has almost no dots, so a faint contour keeps the sphere closed.
  const limbLine = line(
    ellipseArc({ cx, cy, rx: radius, ry: radius, tilt: 0 }, Math.PI * 0.62, Math.PI * 1.78, 0, 80),
    0.6,
    0.4,
  );
  const shadow = line(hatchedEllipse(cx + 26, 742, 214, 17, 3.4), 0.7, 0.8);

  // A sparse field of points gives the plate air without competing with the figure.
  let dust = '';
  for (let i = 0; i < 46; i += 1) {
    const x = 20 + random() * (width - 40);
    const y = 20 + random() * (height - 130);
    if (Math.hypot(x - cx, y - cy) < 262) continue;
    dust += `M${Math.round(x)} ${Math.round(y)}h0`;
  }
  const marks = [
    [96, 118],
    [640, 96],
    [668, 598],
    [70, 640],
  ]
    .map(([x, y]) => `M${x! - 5} ${y}h10M${x} ${y! - 5}v10`)
    .join('');

  const body =
    line(dust, 1.8, 0.55) +
    line(marks, 0.8, 0.7) +
    shadow +
    ring +
    behind +
    `<circle cx="${cx}" cy="${cy}" r="${radius + 5}" fill="${PAPER}"/>` +
    axis +
    sphere +
    limbLine +
    front +
    bodies;
  return svg(width, height, body);
}

/** OpenCNPJ: loose sheets settle into one dense, indexed block. */
function strataPlate(): string {
  const width = 640;
  const height = 480;
  const origin: Vec2 = [320, 408];
  const scale = 1;
  const ex: Vec2 = [0.866 * scale, -0.5 * scale];
  const ey: Vec2 = [-0.866 * scale, -0.5 * scale];
  const project = (x: number, y: number, z: number): Vec2 => [
    origin[0] + x * ex[0] + y * ey[0],
    origin[1] + x * ex[1] + y * ey[1] - z * scale,
  ];
  const side = 150;
  const tall = 124;

  // Visible faces of the block: right (x axis), left (y axis) and top.
  const base = project(0, 0, 0);
  const rightEdge: Vec2 = [side * ex[0], side * ex[1]];
  const leftEdge: Vec2 = [side * ey[0], side * ey[1]];
  const up: Vec2 = [0, -tall];
  const topOrigin = project(0, 0, tall);

  const field: Field = (x, y) => {
    const p: Vec2 = [x, y];
    const [ru, rv] = faceCoords(p, base, rightEdge, up);
    if (ru >= 0 && ru <= 1 && rv >= 0 && rv <= 1) return 0.95 - 0.2 * rv - 0.1 * ru;
    const [lu, lv] = faceCoords(p, base, leftEdge, up);
    if (lu >= 0 && lu <= 1 && lv >= 0 && lv <= 1) return 0.46 - 0.14 * lv + 0.1 * lu;
    const [tu, tv] = faceCoords(p, topOrigin, rightEdge, leftEdge);
    if (tu >= 0 && tu <= 1 && tv >= 0 && tv <= 1) return 0.07 + 0.07 * (tu + tv);
    return 0;
  };
  const block = dotsToSvg(
    stipple(field, { bounds: [180, 124, 460, 414], spacing: 3, seed: 31 }),
    0.92,
  );

  // Strata: one hairline per layer, wrapping both side faces.
  let strata = '';
  const layers = 21;
  for (let i = 1; i < layers; i += 1) {
    const z = (tall * i) / layers;
    strata += polyline([project(side, 0, z), project(0, 0, z), project(0, side, z)]);
  }
  const band = (z0: number, z1: number): string =>
    `<path fill="${ACCENT}" d="${polyline(
      [
        project(side, 0, z0),
        project(0, 0, z0),
        project(0, side, z0),
        project(0, side, z1),
        project(0, 0, z1),
        project(side, 0, z1),
      ],
      true,
    )}"/>`;

  const outline = line(
    polyline(
      [
        project(side, 0, 0),
        project(0, 0, 0),
        project(0, side, 0),
        project(0, side, tall),
        project(side, side, tall),
        project(side, 0, tall),
      ],
      true,
    ) +
      polyline([project(side, 0, tall), project(0, 0, tall), project(0, side, tall)]) +
      polyline([project(0, 0, tall), project(0, 0, 0)]),
    1,
  );

  // Sheets still in the air, closer together as they approach the block.
  let sheets = '';
  [24, 46, 74, 108].forEach((gap, index) => {
    const z = tall + gap;
    sheets += line(
      polyline(
        [project(0, 0, z), project(side, 0, z), project(side, side, z), project(0, side, z)],
        true,
      ),
      0.8,
      0.85 - index * 0.17,
    );
  });
  const guides = line(
    `M${n1(project(side, 0, tall)[0])} ${n1(project(side, 0, tall)[1])}v-108` +
      `M${n1(project(0, side, tall)[0])} ${n1(project(0, side, tall)[1])}v-108`,
    0.6,
    0.35,
  );
  const ground = line(hatchedEllipse(326, 424, 196, 13, 3.2), 0.65, 0.7);

  return svg(
    width,
    height,
    ground + guides + sheets + block + line(strata, 0.5, 0.5) + band(68, 73) + outline,
  );
}

/** br-validators: a guilloché seal, the engraving language of official documents. */
function sealPlate(): string {
  const width = 640;
  const height = 480;
  const cx = 320;
  const cy = 240;

  const rosette = (
    base: number,
    amplitude: number,
    lobes: number,
    strands: number,
    steps: number,
  ): string => {
    let d = '';
    for (let strand = 0; strand < strands; strand += 1) {
      const phase = (Math.PI * 2 * strand) / strands;
      const points: Vec2[] = [];
      for (let i = 0; i < steps; i += 1) {
        const angle = (Math.PI * 2 * i) / steps;
        const r = base + amplitude * Math.sin(lobes * angle + phase);
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
      d += polyline(points, true);
    }
    return d;
  };

  const outer = line(rosette(176, 20, 16, 6, 288), 0.55, 0.85);
  const inner = line(rosette(112, 12, 12, 4, 216), 0.55, 0.8);

  const circle = (r: number): Ellipse => ({ cx, cy, rx: r, ry: r, tilt: 0 });
  const rings =
    line(ellipseArc(circle(146), 0, Math.PI * 2, 0, 120), 1) +
    line(ellipseArc(circle(140), 0, Math.PI * 2, 0, 120), 0.6, 0.7) +
    line(graduations(circle(128), 0, Math.PI * 2, 140, 10, 10), 0.6, 0.75) +
    line(ellipseArc(circle(92), 0, Math.PI * 2, 0, 96), 0.8) +
    line(ellipseArc(circle(206), 0, Math.PI * 2, 0, 160), 0.7, 0.6);

  // A soft stippled annulus gives the seal relief, lit from the same side as every plate.
  const relief: Field = (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const r = Math.hypot(dx, dy);
    if (r < 58 || r > 90) return 0;
    const t = (r - 58) / 32;
    const facing = (dx * LIGHT[0] + dy * LIGHT[1]) / r;
    return clamp(0.2 + 0.5 * t * (1 - facing * 0.9) - 0.1);
  };
  const reliefDots = dotsToSvg(
    stipple(relief, { bounds: [cx - 92, cy - 92, cx + 92, cy + 92], spacing: 3, seed: 41 }),
    0.85,
  );

  const check =
    `<circle cx="${cx}" cy="${cy}" r="52" fill="${PAPER}" stroke="${INK}" stroke-width="1"/>` +
    `<path stroke="${ACCENT}" stroke-width="9" d="M${cx - 22} ${cy + 2}l15 16 30-34"/>`;

  return svg(width, height, outer + rings + inner + reliefDots + check);
}

/** Abastevo: a drop over a contour map, with one point marked. */
function dropPlate(): string {
  const width = 640;
  const height = 480;
  const cx = 320;
  const ground = 352;

  // Contours of an invented terrain, perspective-flattened.
  let contours = '';
  for (let ring = 1; ring <= 8; ring += 1) {
    const points: Vec2[] = [];
    const steps = 120;
    for (let i = 0; i < steps; i += 1) {
      const angle = (Math.PI * 2 * i) / steps;
      const wobble =
        1 +
        0.11 * Math.sin(3 * angle + ring * 0.55) +
        0.06 * Math.sin(5 * angle + 1.3 + ring * 0.3);
      const r = ring * 33 * wobble;
      points.push([cx + r * Math.cos(angle), ground + r * 0.3 * Math.sin(angle)]);
    }
    contours += polyline(points, true);
  }

  // The drop: a sphere that tapers to a point above it.
  const dropCy = 208;
  const dropR = 66;
  const apexY = 62;
  const halfWidth = (y: number): number => {
    if (y >= dropCy) return Math.sqrt(Math.max(0, dropR ** 2 - (y - dropCy) ** 2));
    const t = clamp((y - apexY) / (dropCy - apexY));
    return dropR * Math.pow(t, 1.45) * (0.82 + 0.18 * t);
  };
  const drop: Field = (x, y) => {
    if (y < apexY || y > dropCy + dropR) return 0;
    const half = halfWidth(y);
    if (half <= 0) return 0;
    const nx = (x - cx) / half;
    if (Math.abs(nx) >= 1) return 0;
    // Below the centre the drop is a sphere; above it the surface leans back towards the
    // apex. Both branches meet at ny = 0, so the shading has no seam.
    const taper = clamp((y - apexY) / (dropCy - apexY));
    const ny = y >= dropCy ? (y - dropCy) / dropR : -0.34 * (1 - taper);
    const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    const lambert = clamp(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
    const limb = smoothstep(0.78, 1, Math.abs(nx));
    let tone = Math.pow(1 - lambert, 1.2);
    if (lambert < 0.2) tone *= 1 - 0.38 * limb;
    return clamp(tone * 1.08 - 0.06);
  };
  const dropDots = dotsToSvg(
    stipple(drop, {
      bounds: [cx - dropR, apexY, cx + dropR, dropCy + dropR],
      spacing: 2.9,
      seed: 53,
    }),
    0.9,
  );
  const outlinePoints: Vec2[] = [];
  for (let y = apexY; y <= dropCy + dropR; y += 3) outlinePoints.push([cx - halfWidth(y), y]);
  const dropOutline = line(polyline(outlinePoints), 0.7, 0.5);

  const pin =
    line(`M${cx} ${dropCy + dropR + 8}V${ground - 12}`, 0.8, 0.8) +
    line(hatchedEllipse(cx, ground, 46, 7, 2.6), 0.65, 0.85) +
    `<circle cx="${cx}" cy="${ground}" r="7.5" fill="${ACCENT}"/>`;

  return svg(width, height, line(contours, 0.6, 0.7) + pin + dropDots + dropOutline);
}

/** Tupi Battle Grounds: two strongholds and the single lane between them. */
function lanePlate(): string {
  const width = 640;
  const height = 480;
  const ground = 356;
  const half = 46;
  const overhang = 10;
  const crownHeight = 20;
  const merlonHeight = 17;

  interface Tower {
    readonly x: number;
    readonly top: number;
  }
  const towers: readonly [Tower, Tower] = [
    { x: 122, top: 172 },
    { x: 518, top: 172 },
  ];
  const crownHalf = half + overhang;
  const slot = (crownHalf * 2) / 5;

  const towerField: Field = (x, y) => {
    for (const tower of towers) {
      const dx = x - tower.x;
      const inBody = Math.abs(dx) < half && y >= tower.top && y <= ground;
      const inCrown = Math.abs(dx) < crownHalf && y >= tower.top - crownHeight && y < tower.top;
      const inMerlon =
        Math.abs(dx) < crownHalf &&
        y >= tower.top - crownHeight - merlonHeight &&
        y < tower.top - crownHeight &&
        Math.floor((dx + crownHalf) / slot) % 2 === 0;
      if (!inBody && !inCrown && !inMerlon) continue;

      // Shaded as a cylinder: tone depends only on how far round the tower the point is.
      const nx = dx / crownHalf;
      const nz = Math.sqrt(1 - nx * nx);
      const lambert = clamp(nx * LIGHT[0] * 1.35 + nz * LIGHT[2] * 1.05 + 0.1);
      let tone = Math.pow(1 - lambert, 1.1);
      if (nx > 0) tone *= 1 - 0.3 * smoothstep(0.72, 1, nx);
      // The overhanging crown throws a short shadow onto the wall below it.
      if (inBody) tone += 0.3 * (1 - smoothstep(0, 26, y - tower.top));
      return clamp(tone + 0.04);
    }
    return 0;
  };
  const towerDots = dotsToSvg(
    stipple(towerField, { bounds: [56, 120, 584, ground], spacing: 2.8, seed: 67 }),
    0.9,
  );

  let outlines = '';
  let masonry = '';
  for (const tower of towers) {
    const left = tower.x - half;
    const right = tower.x + half;
    const crownLeft = tower.x - crownHalf;
    const crownTop = tower.top - crownHeight;
    outlines +=
      `M${left} ${ground}V${tower.top}M${right} ${ground}V${tower.top}` +
      `M${crownLeft} ${tower.top}h${crownHalf * 2}v${-crownHeight}h${-crownHalf * 2}z` +
      // An arrow slit and a doorway keep the towers from reading as plain columns.
      `M${tower.x} ${tower.top + 46}v28` +
      `M${tower.x - 14} ${ground}v-32a14 14 0 0 1 28 0v32`;
    for (let index = 0; index < 5; index += 2) {
      outlines += `M${n1(crownLeft + index * slot)} ${crownTop}v${-merlonHeight}h${n1(slot)}v${merlonHeight}`;
    }

    // Masonry courses with staggered joints, kept faint so the stipple carries the tone.
    const course = 23;
    let row = 0;
    for (let y = tower.top + course; y < ground - 4; y += course) {
      masonry += `M${left} ${y}H${right}`;
      for (let x = left + (row % 2 === 0 ? 23 : 11.5); x < right - 2; x += 23) {
        masonry += `M${n1(x)} ${y}v${-course}`;
      }
      row += 1;
    }
  }

  const flag = (tower: Tower, color: string, direction: 1 | -1): string => {
    const base = tower.top - crownHeight - merlonHeight;
    const poleTop = base - 56;
    return (
      line(`M${tower.x} ${base}V${poleTop}`, 1) +
      `<path fill="${color}" d="M${tower.x} ${poleTop}l${36 * direction} 11${direction < 0 ? ' ' : '-'}${direction < 0 ? 36 : 36} 11z"/>`
    );
  };

  // The lane: a baseline, hatching underneath and a dashed centre line.
  const laneLeft = towers[0].x + half + 16;
  const laneRight = towers[1].x - half - 16;
  let hatch = '';
  for (let x = 34; x < width - 30; x += 7) hatch += `M${x} ${ground + 6}l-9 13`;
  const lane =
    line(`M24 ${ground}H${width - 24}`, 1.1) +
    line(hatch, 0.55, 0.55) +
    `<path stroke="${INK}" stroke-width="0.8" stroke-dasharray="2 7" opacity="0.7" d="M${laneLeft} ${ground - 15}H${laneRight}"/>`;

  // Units advancing from both sides; the accent marks the one about to connect.
  const units = [
    { x: 210, r: 10, accent: false },
    { x: 248, r: 12, accent: false },
    { x: 292, r: 14, accent: true },
    { x: 362, r: 14, accent: false },
    { x: 406, r: 11, accent: false },
    { x: 440, r: 9, accent: false },
  ];
  let unitMarks = '';
  const unitDots: Dot[] = [];
  for (const unit of units) {
    const y = ground - unit.r - 3;
    if (unit.accent) {
      unitMarks += `<circle cx="${unit.x}" cy="${y}" r="${unit.r}" fill="${ACCENT}"/>`;
    } else {
      unitMarks += `<circle cx="${unit.x}" cy="${y}" r="${unit.r}" stroke="${INK}" stroke-width="0.7" opacity="0.65"/>`;
      unitDots.push(
        ...stipple(sphereField(unit.x, y, unit.r), {
          bounds: [unit.x - unit.r, y - unit.r, unit.x + unit.r, y + unit.r],
          spacing: 2.4,
          seed: 71 + unit.x,
        }),
      );
    }
  }

  // A volley in flight, drawn as a dotted arc between the two crowns.
  let volley = '';
  for (let i = 0; i <= 32; i += 1) {
    const t = i / 32;
    const x = 186 + t * 268;
    const y = 62 + 96 * (2 * t - 1) ** 2;
    volley += `M${Math.round(x)} ${Math.round(y)}h0`;
  }

  return svg(
    width,
    height,
    lane +
      line(volley, 2, 0.75) +
      towerDots +
      line(masonry, 0.5, 0.32) +
      line(outlines, 0.9) +
      flag(towers[0], ACCENT, 1) +
      flag(towers[1], INK, -1) +
      unitMarks +
      dotsToSvg(unitDots, 0.72),
  );
}

// --- output -------------------------------------------------------------------------------

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'art');
mkdirSync(outDir, { recursive: true });

const plates: Record<string, string> = {
  'hero-armillary': heroPlate(),
  'plate-strata': strataPlate(),
  'plate-seal': sealPlate(),
  'plate-drop': dropPlate(),
  'plate-lane': lanePlate(),
};

for (const [name, markup] of Object.entries(plates)) {
  writeFileSync(join(outDir, `${name}.svg`), markup);
  console.log(`${name}.svg  ${(markup.length / 1024).toFixed(1)} kB`);
}

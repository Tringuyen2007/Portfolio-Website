// Procedurally generated pixel art: sky bands, moon glow, the tree (rasterized
// from the same Bézier skeleton the SVG tree used), the big apple preview shell,
// and the ground strip. Everything is deterministic (seeded PRNG).
import { Canvas, mulberry32 } from "./png.mjs";
import { P } from "./palette.mjs";
import { moon as moonSprite, L } from "./sprites.mjs";

const cubic = (p, t) => {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return { x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x, y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y };
};

/** Vertical banded sky with ordered dither at band seams and a sparse star field. */
export function sky(width, height, seed = 7) {
  const c = new Canvas(width, height);
  const bands = [P.sky0, P.sky1, P.sky2, P.sky3, P.sky4, P.haze];
  const rnd = mulberry32(seed);
  for (let y = 0; y < height; y += 1) {
    const f = (y / height) * (bands.length - 1);
    const i = Math.floor(f), frac = f - i;
    for (let x = 0; x < width; x += 1) {
      // 2×2 Bayer dither between adjacent bands
      const bayer = [[0, 2], [3, 1]][y % 2][x % 2] / 4;
      c.set(x, y, bands[Math.min(bands.length - 1, frac > bayer ? i + 1 : i)]);
    }
  }
  const stars = Math.floor((width * height) / 900);
  for (let s = 0; s < stars; s += 1) {
    const x = Math.floor(rnd() * width), y = Math.floor(rnd() * height * 0.7);
    c.set(x, y, rnd() > 0.7 ? P.cream : P.cloudLo);
  }
  return c;
}

/** Moon with a 2-step pixel glow halo. */
export function moonWithGlow() {
  const c = new Canvas(28, 28);
  c.circle(14, 14, 13.5, P.sky3);
  c.circle(14, 14, 11.5, P.sky4);
  c.blit(moonSprite, L, 6, 6);
  return c;
}

/** Ground strip: grass with a dithered edge and darker soil. */
export function ground(width, height = 14, seed = 3) {
  const c = new Canvas(width, height);
  const rnd = mulberry32(seed);
  for (let y = 0; y < height; y += 1)
    for (let x = 0; x < width; x += 1) {
      let col = y < 2 ? P.grassHi : y < 6 ? P.grass : y < 9 ? P.grassLo : P.soil;
      if (y === 0 && rnd() > 0.6) col = null;
      if (y === 1 && rnd() > 0.8) col = P.grassHi;
      if (y >= 6 && y < 9 && rnd() > 0.7) col = P.grass;
      if (col) c.set(x, y, col);
    }
  return c;
}

/** Big apple silhouette for the hover preview shell (w×h), panel fill + pixel border. */
export function appleShell(w = 60, h = 64, tone = "red") {
  const c = new Canvas(w, h);
  const r = w * 0.3;
  const edge = tone === "golden" ? P.gold : tone === "enchanted" ? P.ench : P.panelEdge;
  const hi = tone === "golden" ? P.goldHi : tone === "enchanted" ? P.enchHi : P.panelHi;
  // two lobes + lower body
  c.circle(w * 0.36, h * 0.36, r, P.panel);
  c.circle(w * 0.64, h * 0.36, r, P.panel);
  c.circle(w * 0.5, h * 0.55, w * 0.42, P.panel);
  // flatten bottom
  for (let y = Math.floor(h * 0.93); y < h; y += 1) for (let x = 0; x < w; x += 1) c.set(x, y, null);
  c.outline(edge);
  // inner highlight line (top-left)
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
    if (c.get(x, y) === P.panel && (c.get(x - 1, y) === edge || c.get(x, y - 1) === edge) && x < w * 0.6 && y < h * 0.5) c.set(x, y, hi);
  }
  // stem + leaf
  c.fillRect(Math.floor(w / 2) - 1, 1, 2, 5, P.barkLo);
  c.blit(["..ll", ".lLl", "lLE."], L, Math.floor(w / 2) + 1, 0);
  return c;
}

/** Pixel button (w×h): 1px edge, 1px highlight, fill. */
export function button(w, h, fill, edge, hi) {
  const c = new Canvas(w, h);
  c.fillRect(1, 0, w - 2, h, edge);
  c.fillRect(0, 1, w, h - 2, edge);
  c.fillRect(1, 1, w - 2, h - 2, fill);
  c.fillRect(2, 1, w - 4, 1, hi);
  c.fillRect(1, 2, 1, h - 4, hi);
  return c;
}

/**
 * Horizontally tileable bank of pixel clouds for the hero's bottom edge.
 * Puffs are painted back-to-front (each with an upper-left highlight and a
 * lower-right shadow rim), the body below them is solid, and the bottom
 * `fade` rows dither out to transparent with a 4×4 Bayer matrix so the bank
 * melts into whatever sits underneath.
 */
export function cloudBank({ width = 160, height = 40, baseY = 20, minR = 6, maxR = 13, fade = 12, tones, seed = 11 }) {
  const c = new Canvas(width, height);
  const rnd = mulberry32(seed);
  const puffs = [];
  let x = 0;
  while (x < width) {
    const r = minR + rnd() * (maxR - minR);
    puffs.push({ x, y: baseY + (rnd() - 0.3) * 5, r });
    x += r * (0.9 + rnd() * 0.5);
  }
  // Big puffs behind, small ones in front: painter's order by radius.
  puffs.sort((a, b) => b.r - a.r);
  const bayer = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  const plot = (px, py, col) => {
    const wx = ((Math.round(px) % width) + width) % width;
    if (py >= 0 && py < height) c.set(wx, Math.round(py), col);
  };

  // Body: everything below the baseline.
  for (let yy = Math.ceil(baseY); yy < height; yy += 1)
    for (let xx = 0; xx < width; xx += 1) c.set(xx, yy, tones.base);

  for (const p of puffs) {
    for (const off of [-width, 0, width]) {
      const cx = p.x + off;
      for (let yy = Math.floor(p.y - p.r); yy <= Math.ceil(p.y + p.r); yy += 1) {
        for (let xx = Math.floor(cx - p.r); xx <= Math.ceil(cx + p.r); xx += 1) {
          if (xx < 0 || xx >= width) continue;
          const dx = xx + 0.5 - cx, dy = yy + 0.5 - p.y;
          const d = Math.hypot(dx, dy);
          if (d > p.r) continue;
          let col = tones.base;
          // Shadow rim on the lower-right edge separates overlapping puffs.
          if (d > p.r - 1.4 && dx + dy > p.r * 0.35) col = tones.lo;
          // Highlight crescent toward the upper-left.
          else if (Math.hypot(dx + p.r * 0.28, dy + p.r * 0.32) < p.r * 0.62 && dy < 0) col = tones.hi;
          plot(xx, yy, col);
        }
      }
    }
  }

  // Dither the bottom rows out to transparent.
  const start = height - fade;
  for (let yy = start; yy < height; yy += 1) {
    const t = (yy - start + 1) / (fade + 1);
    for (let xx = 0; xx < width; xx += 1) {
      if (t * 16 > bayer[yy % 4][xx % 4]) c.clear(xx, yy);
    }
  }
  return c;
}

/**
 * The orchard tree, v2: larger, with forked branches and one canopy island per
 * branch so each branch reads on its own. Young branches use spring greens and
 * a few blossoms. Returns the canvas plus, per branch, apple hang slots (under
 * that branch's leaves, spread apart) and a sign hook point on the limb.
 */
export function orchardTree({ width = 184, height = 176, branches, seed = 5 }) {
  const c = new Canvas(width, height);
  const rnd = mulberry32(seed);
  const base = { x: width / 2, y: height - 8 };
  const top = { x: width / 2 + 1, y: height * 0.34 };
  const trunk = [base, { x: base.x - 3, y: base.y - (base.y - top.y) * 0.38 }, { x: top.x + 4, y: top.y + (base.y - top.y) * 0.32 }, top];
  const wood = (hi, mid, lo) => (dx, dy) => (dx < -0.3 * Math.abs(dy) && dy < 0 ? hi : dx > 0.4 || dy > 0.5 ? lo : mid);
  const greens = {
    mature: { hi: P.leafHi, mid: P.leaf, lo: P.leafLo, deep: P.leafDeep },
    young: { hi: P.springHi, mid: P.spring, lo: P.springLo, deep: P.leafLo },
  };

  const limbs = []; // { p, width, branch }
  const clusters = []; // { x, y, r, branch, young }
  const out = [];
  const unit = (a) => ({ x: Math.sin(a), y: -Math.cos(a) });

  for (const b of branches) {
    const start = cubic(trunk, b.attach);
    const dir = b.side === "left" ? -1 : 1;
    const ang = (b.angle * Math.PI) / 180;
    const len = 62 * b.length;
    const u = unit(ang);
    const end = { x: start.x + dir * u.x * len, y: start.y + u.y * len };
    const bend = (rnd() - 0.5) * 4;
    const p = [
      start,
      { x: start.x + dir * Math.sin(ang * 0.6) * len * 0.35, y: start.y - Math.cos(ang * 0.6) * len * 0.35 },
      { x: start.x + dir * Math.sin(ang * 1.08) * len * 0.72 + bend, y: start.y - Math.cos(ang * 1.08) * len * 0.72 - 2 },
      end,
    ];
    const w = b.young ? 6.4 : 8;
    limbs.push({ p, width: w, branch: b.id, root: true });

    // Twigs fork off the limb, alternating above and below.
    const forks = b.young ? [0.62, 0.84] : [0.6, 0.74, 0.88];
    const tips = [end];
    forks.forEach((t, i) => {
      const s = cubic(p, t);
      const up = i % 2 === 0 ? -1 : 1;
      const tl = len * (b.young ? 0.36 : 0.42) * (1 - t * 0.3);
      const tu = unit(ang - up * 0.85);
      const tip = { x: s.x + dir * tu.x * tl, y: s.y + tu.y * tl };
      const mid = { x: (s.x + tip.x) / 2, y: (s.y + tip.y) / 2 - 1.5 };
      limbs.push({ p: [s, mid, mid, tip], width: Math.max(2.4, w * 0.5), branch: b.id, twig: true });
      tips.push(tip);
    });

    const big = b.young ? 10 : 13;
    const add = (x, y, r, back = false) => clusters.push({ x, y, r, branch: b.id, young: b.young, back });
    // Darker back layer for depth, then the end clump, then clumps along each twig.
    add(end.x - dir * 4, end.y - 6, big * 1.05, true);
    add(end.x + dir * 2, end.y - 2, big);
    for (const [k, tip] of tips.slice(1).entries()) {
      const root = cubic(p, forks[k]);
      add(tip.x, tip.y - 2, big * 0.66);
      add(root.x + (tip.x - root.x) * 0.55, root.y + (tip.y - root.y) * 0.55 - 3, big * 0.5);
    }
    const midPt = cubic(p, 0.8);
    add(midPt.x, midPt.y - 4, big * 0.62);

    // Sign hook: on the limb near its base, where leaves don't cover it.
    const hook = cubic(p, b.signT ?? 0.3);
    out.push({ id: b.id, side: b.side, hook: { x: Math.round(hook.x), y: Math.round(hook.y) }, end });
  }

  // Dark back canopy behind the upper trunk: ties the islands into one tree
  // while staying darker than every branch's own leaves.
  const backMass = [[0, -6, 20], [-16, 4, 15], [16, 2, 15], [-6, 16, 13], [8, 16, 13], [-26, 18, 10], [26, 16, 10]];
  for (const [dx, dy, r] of backMass) {
    c.circle(top.x + dx, top.y + dy, r, P.leafDeep, (x, y, rr) => ((x + y) / rr < -0.5 && (Math.round(x) + Math.round(y)) % 2 === 0 ? P.leafLo : P.leafDeep));
  }
  // Shadows first, then wood, then leaves.
  for (const k of clusters) c.circle(k.x + 1, k.y + 2, k.r + 1, P.leafDeep);
  for (let s = 0; s <= 50; s += 1) {
    const t = s / 50, pt = cubic(trunk, t);
    c.circle(pt.x, pt.y, (18 - t * 8) / 2, P.bark, wood(P.barkHi, P.bark, P.barkLo));
  }
  for (const [dx, dy] of [[-13, 7], [13, 7], [-6, 8], [7, 8], [-18, 8], [18, 8]]) c.line(base.x, base.y - 3, base.x + dx, base.y + dy, P.barkLo, 2.6);
  for (const limb of limbs) {
    for (let s = 0; s <= 48; s += 1) {
      const t = s / 48, pt = cubic(limb.p, t);
      // Main limbs flare into a collar where they leave the trunk, then taper gently.
      const flare = limb.root ? Math.max(0, 1 - t / 0.14) * 2.6 : 0;
      const taper = limb.twig ? 0.5 : 0.42;
      c.circle(pt.x, pt.y, Math.max(1, (limb.width * (1 - t * taper) + flare) / 2), P.bark, wood(P.barkHi, P.bark, P.barkLo));
    }
  }
  // Bark grain: a dark seam along each main limb's underside.
  for (const limb of limbs) {
    if (!limb.root) continue;
    for (let s = 4; s <= 40; s += 1) {
      const t = s / 48, pt = cubic(limb.p, t);
      if (s % 7 < 4) c.set(pt.x, pt.y + limb.width * (1 - t * 0.42) * 0.25, P.barkLo);
    }
  }
  // Leaves: back-to-front by size so small clumps sit on top of big ones.
  const sorted = [...clusters].sort((a, b) => Number(b.back) - Number(a.back) || b.r - a.r);
  for (const k of sorted) {
    const base = k.young ? greens.young : greens.mature;
    const g = k.back ? { hi: base.mid, mid: base.lo, lo: base.deep } : base;
    c.circle(k.x, k.y, k.r, g.mid, (dx, dy, r) => {
      const d = (dx + dy) / r;
      if (d < -0.55) return g.hi;
      if (d > 0.5) return g.lo;
      return (Math.round(dx) + Math.round(dy)) % 2 === 0 || d < 0 ? g.mid : g.lo;
    });
    // leaf speckle
    for (let i = 0; i < k.r * 1.4; i += 1) {
      const a = rnd() * Math.PI * 2, rr = rnd() * k.r * 0.85;
      c.set(k.x + Math.cos(a) * rr, k.y + Math.sin(a) * rr, rnd() > 0.5 ? g.hi : g.lo);
    }
    // blossoms on young branches
    if (k.young) for (let i = 0; i < Math.round(k.r * 0.45); i += 1) {
      const a = rnd() * Math.PI * 2, rr = rnd() * k.r * 0.75;
      const bx = Math.round(k.x + Math.cos(a) * rr), by = Math.round(k.y + Math.sin(a) * rr);
      c.set(bx, by, P.blossom); c.set(bx + 1, by, P.blossomHi);
    }
  }
  // Bare twig tips poking out past each island, each with a two-pixel leaf.
  for (const limb of limbs) {
    if (!limb.twig) continue;
    const a = cubic(limb.p, 0.85), b = cubic(limb.p, 1);
    const dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1;
    const tip = { x: b.x + (dx / n) * 4, y: b.y + (dy / n) * 4 };
    c.line(b.x, b.y, tip.x, tip.y, P.bark, 1);
    c.set(tip.x, tip.y - 1, P.leafHi); c.set(tip.x + Math.sign(dx), tip.y - 1, P.leaf);
  }
  c.outline(P.barkEdge);

  // Apple slots per branch: hang under each of that branch's clusters, kept
  // apart (≥ 13 px) and inside the canvas. Ordered outer-first for a full look.
  const slots = {};
  for (const b of branches) {
    const own = clusters.filter((k) => k.branch === b.id && !k.back).sort((a, z) => z.r - a.r);
    const list = [];
    const tryAdd = (x, y) => {
      x = Math.round(x); y = Math.round(y);
      if (x < 1 || x > width - 13 || y < 1 || y > height - 24) return;
      if (list.some((s) => Math.hypot(s.x - x, s.y - y) < 13)) return;
      // keep clear of other branches' slots too
      for (const other of Object.values(slots)) if (other.some((s) => Math.hypot(s.x - x, s.y - y) < 13)) return;
      list.push({ x, y });
    };
    const offsets = [[0, 0.35], [-0.55, 0.05], [0.55, 0.1], [0, -0.35], [-0.5, 0.5], [0.5, 0.5], [-0.45, -0.4], [0.45, -0.4]];
    for (const [ox, oy] of offsets) {
      for (const k of own) tryAdd(k.x - 6 + k.r * ox, k.y - 6 + k.r * oy + 6);
    }
    slots[b.id] = list;
  }
  return { canvas: c, slots, signs: out, trunkTop: top };
}

/** Wooden sign plank w×h with grain, a darker rim and two rope holes. */
export function plank(w = 36, h = 11) {
  const c = new Canvas(w, h);
  c.fillRect(1, 0, w - 2, h, P.barkEdge);
  c.fillRect(0, 1, w, h - 2, P.barkEdge);
  c.fillRect(1, 1, w - 2, h - 2, P.bark);
  c.fillRect(1, 1, w - 2, 1, P.barkHi);
  for (let x = 3; x < w - 3; x += 7) c.fillRect(x, Math.floor(h / 2) + 1, 3, 1, P.barkLo);
  c.set(3, 2, P.barkEdge); c.set(w - 4, 2, P.barkEdge);
  return c;
}

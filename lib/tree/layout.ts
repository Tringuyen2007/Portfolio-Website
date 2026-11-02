import { branches, getBranchForCategory, type BranchDefinition } from "@/content/branches";

/** The subset of a project record the layout needs. Keeps the engine testable. */
export type TreeProjectInput = {
  slug: string;
  title: string;
  category: string;
  fruit: "golden" | "ripe" | "green" | "blossom";
  year: number;
  date?: string;
  tree?: { branch?: string; t?: number; side?: "left" | "right" };
};

export type Point = { x: number; y: number };

export type TreeFrame = {
  width: number;
  height: number;
  trunkBase: Point;
  trunkTop: Point;
  branchLength: number;
  /** Multiplier on branch angles; <1 makes the tree more upright (mobile). */
  angleScale: number;
  fruitRadius: number;
  minFruitGap: number;
};

export const DESKTOP_FRAME: TreeFrame = {
  width: 1200,
  height: 900,
  trunkBase: { x: 600, y: 850 },
  trunkTop: { x: 600, y: 330 },
  branchLength: 330,
  angleScale: 1,
  fruitRadius: 20,
  minFruitGap: 66,
};

export const MOBILE_FRAME: TreeFrame = {
  width: 720,
  height: 1100,
  trunkBase: { x: 360, y: 1040 },
  trunkTop: { x: 360, y: 430 },
  branchLength: 250,
  angleScale: 0.78,
  fruitRadius: 22,
  minFruitGap: 76,
};

export type CubicPath = { p0: Point; p1: Point; p2: Point; p3: Point };

export type LeafCluster = { center: Point; size: number; seed: number };

export type TwigLayout = { path: CubicPath; width: number; leaves: LeafCluster };

export type FruitLayout = {
  slug: string;
  title: string;
  fruit: TreeProjectInput["fruit"];
  branchId: string;
  position: Point;
  /** Where the stem meets the branch. */
  anchor: Point;
  radius: number;
  /** Deterministic per-fruit phase for ambient motion. */
  seed: number;
};

export type BranchLayout = {
  id: string;
  label: string;
  shortLabel: string;
  side: "left" | "right";
  path: CubicPath;
  width: number;
  attach: Point;
  end: Point;
  twigs: TwigLayout[];
  leaves: LeafCluster[];
  fruits: FruitLayout[];
  young: boolean;
  /** Label anchor, past the branch tip. */
  labelPosition: Point;
};

export type TreeLayout = {
  frame: TreeFrame;
  trunk: CubicPath;
  trunkWidth: number;
  branches: BranchLayout[];
  fruits: FruitLayout[];
  canopy: LeafCluster[];
};

// mulberry32: tiny deterministic PRNG so the tree never rearranges between loads.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function cubicPoint(path: CubicPath, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * path.p0.x + b * path.p1.x + c * path.p2.x + d * path.p3.x,
    y: a * path.p0.y + b * path.p1.y + c * path.p2.y + d * path.p3.y,
  };
}

export function cubicTangent(path: CubicPath, t: number): Point {
  const u = 1 - t;
  const x =
    3 * u * u * (path.p1.x - path.p0.x) +
    6 * u * t * (path.p2.x - path.p1.x) +
    3 * t * t * (path.p3.x - path.p2.x);
  const y =
    3 * u * u * (path.p1.y - path.p0.y) +
    6 * u * t * (path.p2.y - path.p1.y) +
    3 * t * t * (path.p3.y - path.p2.y);
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

export function cubicToSvg(path: CubicPath) {
  const f = (n: number) => n.toFixed(1);
  return `M${f(path.p0.x)} ${f(path.p0.y)} C ${f(path.p1.x)} ${f(path.p1.y)}, ${f(path.p2.x)} ${f(path.p2.y)}, ${f(path.p3.x)} ${f(path.p3.y)}`;
}

function trunkPoint(frame: TreeFrame, trunk: CubicPath, attach: number) {
  return cubicPoint(trunk, Math.min(1, Math.max(0, attach)));
}

function buildBranchPath(
  def: BranchDefinition,
  frame: TreeFrame,
  trunk: CubicPath,
  random: () => number,
  young: boolean,
): CubicPath {
  const start = trunkPoint(frame, trunk, def.attach);
  const dir = def.side === "left" ? -1 : 1;
  const angle = (def.angle * frame.angleScale * Math.PI) / 180;
  const length = frame.branchLength * def.length * (young ? 0.7 : 1);
  const end: Point = {
    x: start.x + dir * Math.sin(angle) * length,
    y: start.y - Math.cos(angle) * length,
  };
  // Branches leave the trunk steeply then relax outward: a natural droop-then-lift.
  const wobble = (random() - 0.5) * 40;
  const p1: Point = {
    x: start.x + dir * Math.sin(angle * 0.55) * length * 0.35,
    y: start.y - Math.cos(angle * 0.55) * length * 0.35 + wobble * 0.3,
  };
  const p2: Point = {
    x: start.x + dir * Math.sin(angle * 1.1) * length * 0.72 + wobble,
    y: start.y - Math.cos(angle * 1.1) * length * 0.72 - 24,
  };
  return { p0: start, p1, p2, p3: end };
}

function buildTwigs(
  path: CubicPath,
  side: "left" | "right",
  frame: TreeFrame,
  random: () => number,
  count: number,
): TwigLayout[] {
  const twigs: TwigLayout[] = [];
  const dir = side === "left" ? -1 : 1;
  for (let i = 0; i < count; i += 1) {
    const t = 0.42 + (i / Math.max(1, count - 1)) * 0.5;
    const base = cubicPoint(path, t);
    const tangent = cubicTangent(path, t);
    // Twigs alternate above/below the branch and lean toward the tip.
    const up = i % 2 === 0 ? -1 : 1;
    const normal = { x: -tangent.y * up, y: tangent.x * up };
    const length = frame.branchLength * (0.22 + random() * 0.14);
    const end: Point = {
      x: base.x + (tangent.x * 0.55 + normal.x * 0.75) * length,
      y: base.y + (tangent.y * 0.55 + normal.y * 0.75) * length - length * 0.25,
    };
    const p1: Point = { x: base.x + tangent.x * length * 0.3, y: base.y + tangent.y * length * 0.3 };
    const p2: Point = {
      x: end.x - normal.x * length * 0.2 - dir * 6,
      y: end.y + length * 0.18,
    };
    twigs.push({
      path: { p0: base, p1, p2, p3: end },
      width: 5 + random() * 2,
      leaves: { center: end, size: frame.branchLength * (0.17 + random() * 0.06), seed: random() },
    });
  }
  return twigs;
}

function compareProjects(a: TreeProjectInput, b: TreeProjectInput) {
  const da = a.date ?? `${a.year}-06-01`;
  const db = b.date ?? `${b.year}-06-01`;
  if (da !== db) return da < db ? -1 : 1;
  return a.slug.localeCompare(b.slug);
}

/**
 * Deterministic layout: same projects + same frame → identical tree.
 * Fruits hang from the branch at parameters spread along [0.4, 0.95],
 * oldest nearest the trunk, then a relaxation pass separates any that
 * would overlap as interaction targets.
 */
export function buildTreeLayout(
  projects: TreeProjectInput[],
  frame: TreeFrame = DESKTOP_FRAME,
  branchDefs: BranchDefinition[] = branches,
): TreeLayout {
  const trunk: CubicPath = {
    p0: frame.trunkBase,
    p1: { x: frame.trunkBase.x - 14, y: frame.trunkBase.y - (frame.trunkBase.y - frame.trunkTop.y) * 0.4 },
    p2: { x: frame.trunkTop.x + 18, y: frame.trunkTop.y + (frame.trunkBase.y - frame.trunkTop.y) * 0.3 },
    p3: frame.trunkTop,
  };

  const byBranch = new Map<string, TreeProjectInput[]>();
  for (const project of projects) {
    const def =
      branchDefs.find((b) => b.id === project.tree?.branch) ?? getBranchForCategory(project.category);
    const list = byBranch.get(def.id) ?? [];
    list.push(project);
    byBranch.set(def.id, list);
  }

  const branchLayouts: BranchLayout[] = branchDefs.map((def) => {
    const random = mulberry32(hash(def.id));
    const list = (byBranch.get(def.id) ?? []).sort(compareProjects);
    const young = list.length === 0;
    const path = buildBranchPath(def, frame, trunk, random, young);
    const twigCount = young ? 2 : 3;
    const twigs = buildTwigs(path, def.side, frame, random, twigCount);
    const end = path.p3;
    const leaves: LeafCluster[] = [
      { center: end, size: frame.branchLength * (young ? 0.2 : 0.27), seed: random() },
      {
        center: cubicPoint(path, 0.78),
        size: frame.branchLength * 0.2,
        seed: random(),
      },
    ];

    const fruits: FruitLayout[] = list.map((project, index) => {
      const fruitRandom = mulberry32(hash(project.slug));
      const spread = list.length === 1 ? 0.72 : 0.42 + (index / (list.length - 1)) * 0.53;
      const t = project.tree?.t ?? Math.min(0.97, spread + (fruitRandom() - 0.5) * 0.06);
      const anchor = cubicPoint(path, t);
      const tangent = cubicTangent(path, t);
      // Hang the fruit below the branch, alternating slightly fore/aft so a row of
      // fruits reads as a cluster rather than a string of beads.
      const hang = frame.fruitRadius * 1.9 + fruitRandom() * 10;
      const drift = (index % 2 === 0 ? -1 : 1) * (6 + fruitRandom() * 10);
      const position: Point = {
        x: anchor.x + tangent.x * drift,
        y: anchor.y + hang,
      };
      return {
        slug: project.slug,
        title: project.title,
        fruit: project.fruit,
        branchId: def.id,
        position,
        anchor,
        radius: frame.fruitRadius,
        seed: fruitRandom(),
      };
    });

    const dir = def.side === "left" ? -1 : 1;
    const labelPosition: Point = {
      x: end.x + dir * frame.branchLength * 0.18,
      y: end.y - frame.branchLength * 0.16,
    };

    return {
      id: def.id,
      label: def.label,
      shortLabel: def.shortLabel,
      side: def.side,
      path,
      width: young ? 9 : 16,
      attach: path.p0,
      end,
      twigs,
      leaves,
      fruits,
      young,
      labelPosition,
    };
  });

  // Relaxation: push overlapping fruits apart (deterministic order, few iterations).
  const fruits = branchLayouts.flatMap((b) => b.fruits);
  for (let iteration = 0; iteration < 24; iteration += 1) {
    let moved = false;
    for (let i = 0; i < fruits.length; i += 1) {
      for (let j = i + 1; j < fruits.length; j += 1) {
        const a = fruits[i];
        const b = fruits[j];
        const dx = b.position.x - a.position.x;
        const dy = b.position.y - a.position.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        if (dist < frame.minFruitGap) {
          const push = (frame.minFruitGap - dist) / 2 + 0.5;
          const nx = dx / dist;
          const ny = dy / dist;
          // Prefer vertical separation so fruits keep hanging under their branch.
          a.position = { x: a.position.x - nx * push * 0.6, y: a.position.y - ny * push };
          b.position = { x: b.position.x + nx * push * 0.6, y: b.position.y + ny * push };
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  // Keep fruits inside the frame with a margin.
  const margin = frame.fruitRadius * 2;
  for (const fruit of fruits) {
    fruit.position = {
      x: Math.min(frame.width - margin, Math.max(margin, fruit.position.x)),
      y: Math.min(frame.height - margin, Math.max(margin, fruit.position.y)),
    };
  }

  const canopyRandom = mulberry32(hash("canopy"));
  const canopy: LeafCluster[] = [
    { center: { x: frame.trunkTop.x, y: frame.trunkTop.y - 30 }, size: frame.branchLength * 0.32, seed: canopyRandom() },
    {
      center: { x: frame.trunkTop.x - 60, y: frame.trunkTop.y + 10 },
      size: frame.branchLength * 0.24,
      seed: canopyRandom(),
    },
    {
      center: { x: frame.trunkTop.x + 60, y: frame.trunkTop.y + 5 },
      size: frame.branchLength * 0.24,
      seed: canopyRandom(),
    },
  ];

  return {
    frame,
    trunk,
    trunkWidth: frame.branchLength * 0.11,
    branches: branchLayouts,
    fruits,
    canopy,
  };
}

/** Points for a leaf cluster: a deterministic rosette of ellipses. */
export function leafRosette(cluster: LeafCluster, count = 7) {
  const random = mulberry32(Math.floor(cluster.seed * 1e9));
  const leaves: { x: number; y: number; rx: number; ry: number; rotate: number; tone: number }[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 + random() * 0.6;
    const r = cluster.size * (0.15 + random() * 0.45);
    leaves.push({
      x: cluster.center.x + Math.cos(angle) * r,
      y: cluster.center.y + Math.sin(angle) * r * 0.75,
      rx: cluster.size * (0.32 + random() * 0.18),
      ry: cluster.size * (0.2 + random() * 0.12),
      rotate: (angle * 180) / Math.PI + (random() - 0.5) * 40,
      tone: random(),
    });
  }
  return leaves;
}

/** Apple silhouette centered at the origin, scaled by radius. Shared by fruits and the legend. */
export function applePath(r: number) {
  const f = (n: number) => (n * r).toFixed(2);
  return `M0 ${f(-0.82)} C ${f(0.5)} ${f(-1.15)}, ${f(1.12)} ${f(-0.62)}, ${f(1.02)} ${f(0.02)} C ${f(0.98)} ${f(0.7)}, ${f(0.5)} ${f(1.06)}, 0 ${f(0.96)} C ${f(-0.5)} ${f(1.06)}, ${f(-0.98)} ${f(0.7)}, ${f(-1.02)} ${f(0.02)} C ${f(-1.12)} ${f(-0.62)}, ${f(-0.5)} ${f(-1.15)}, 0 ${f(-0.82)} Z`;
}

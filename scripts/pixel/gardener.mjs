// "The gardener": a tiny chibi Tri (from the pixel portrait: messy dark hair,
// closed happy eyes, big grin, earrings, black shirt) who hangs out under the
// orchard tree. Frames are composed from parts in code, outlined like every
// other sprite, and packed into one sheet + a JSON manifest.
import { Canvas } from "./png.mjs";

export const FRAME_W = 32;
export const FRAME_H = 28;
const OUTLINE = "#140f1f";

const C = {
  h: "#2a1d1b", H: "#4a3430", // hair
  s: "#f1c4a1", S: "#d9a07e", b: "#ec9a9a", // skin, shade, blush
  k: "#1a1428", w: "#ffffff", m: "#b8434a", // features
  c: "#2f2b44", C: "#4a4566", p: "#201d30", f: "#0f0c16", // shirt, pants, shoes
  // props
  g: "#5b8fd6", G: "#3a5fa0", // watering can
  u: "#f4f1e6", R: "#c2553a", r: "#e07a5f", n: "#b07a4a", // rice bowl, chopsticks
  q: "#f2885b", Q: "#ffc1a0", z: "#1e3a2a", // sushi
  l: "#e8b33a", x: "#dfe6f2", a: "#8a5a3a", // shaker
};
// FX are drawn after the outline so they stay light and airy.
const FX = { Z: "#f4ecd8", N: "#f2c14e", d: "#7fd3f0", D: "#4f8ce8" };

const HEAD = [
  ".h.hhh.hh..",
  ".hhhhHhhhh.",
  "hhhHhhhhHhh",
  "hhhhhhhhhhh",
  "hhsshhhsshh",
  "hsssssssssh",
  "hsssssssssh",
  "sssssssssss",
  "sssssssssss",
  ".sssssssss.",
  "..sssssss..",
];
const TORSO = ["cccCcCccc", "ccccCcccc", "ccccCcccc", "ccccCcccc", "ppppppppp"];
const LEGS = {
  stand: [".ppp.ppp.", ".ppp.ppp.", "ffff.ffff"],
  liftL: [".ppp.ppp.", "ffff.ppp.", ".....ffff"],
  liftR: [".ppp.ppp.", ".ppp.ffff", "ffff....."],
};
const EYES = {
  happy: [[2, 6], [3, 6], [7, 6], [8, 6], [1, 5], [9, 5]].map(([x, y]) => [x, y, "k"]),
  sleep: [[2, 7], [3, 7], [7, 7], [8, 7]].map(([x, y]) => [x, y, "k"]),
};
const MOUTH = {
  grin: [[3, 8, "k"], [4, 8, "w"], [5, 8, "w"], [6, 8, "w"], [7, 8, "k"], [4, 9, "k"], [5, 9, "m"], [6, 9, "k"]],
  open: [[4, 8, "k"], [5, 8, "m"], [6, 8, "k"], [5, 9, "k"]],
  chew: [[4, 9, "k"], [5, 9, "k"], [6, 9, "k"], [9, 8, "S"]],
  chew2: [[4, 8, "k"], [5, 9, "k"], [6, 8, "k"], [1, 8, "S"]],
  sleep: [[5, 9, "k"]],
};
// Arm paths, head-relative: sleeve pixels then the hand.
const ARMS = {
  downL: { sleeve: [[0, 12], [0, 13], [0, 14]], hand: [[0, 15]] },
  downR: { sleeve: [[10, 12], [10, 13], [10, 14]], hand: [[10, 15]] },
  upL: { sleeve: [[0, 12], [-1, 11], [-2, 10]], hand: [[-3, 9], [-2, 9]] },
  upR: { sleeve: [[10, 12], [11, 11], [12, 10]], hand: [[13, 9], [12, 9]] },
  outL: { sleeve: [[0, 12], [-1, 13], [-2, 13]], hand: [[-3, 13]] },
  chestR: { sleeve: [[10, 12], [10, 13]], hand: [[9, 14], [8, 14]] },
  mouthR: { sleeve: [[10, 12], [10, 11]], hand: [[9, 10], [8, 10]] },
  liftR: { sleeve: [[10, 12], [11, 12], [12, 12]], hand: [[12, 11]] },
};
const PROPS = {
  can: [".....ggg", "....g..g", "G...gggg", ".GgGgggg", "...ggggg", "...GGGGG"],
  bowl: [".uuuu.", "uuuuuu", "rRRRRr", ".RRRR."],
  sushi: ["qQqQq", "uuzuu", "uuzuu"],
  shaker: [".ll.", "llll", "xxxx", "xaax", "xaax", "xaax", "xxxx"],
};
const Z = ["ZZZ", "..Z", ".Z.", "ZZZ"]; // tiny z
const ZBIG = ["ZZZZ", "..Z.", ".Z..", "ZZZZ"];
const NOTE = [".NN", ".N.", ".N.", "NN.", "NN."];

function grid(cv, rows, ox, oy, pal) {
  rows.forEach((row, y) => [...row].forEach((ch, x) => ch !== "." && cv.set(ox + x, oy + y, pal[ch])));
}
function dots(cv, list, ox, oy, pal, color) {
  for (const [x, y, ch] of list) cv.set(ox + x, oy + y, pal[ch ?? color]);
}

/** Draw the standing chibi with head top-left at (hx, hy). */
function body(cv, hx, hy, { eyes = "happy", mouth = "grin", arms = ["downL", "downR"], legs = "stand" } = {}) {
  grid(cv, LEGS[legs], hx + 1, hy + 17, C);
  grid(cv, TORSO, hx + 1, hy + 12, C);
  dots(cv, [[4, 11], [5, 11], [6, 11]], hx, hy, C, "S");
  grid(cv, HEAD, hx, hy, C);
  dots(cv, [[0, 8, "w"], [10, 8, "w"], [1, 7, "b"], [9, 7, "b"]], hx, hy, C);
  dots(cv, EYES[eyes], hx, hy, C);
  dots(cv, MOUTH[mouth], hx, hy, C);
  for (const a of arms) {
    dots(cv, ARMS[a].sleeve, hx, hy, C, "c");
    dots(cv, ARMS[a].hand, hx, hy, C, "s");
  }
}

const HX = 11; // head x inside the frame
const HY = 7; // head y: feet land on row 26

function frame(draw, fx) {
  const cv = new Canvas(FRAME_W, FRAME_H);
  draw(cv);
  cv.outline(OUTLINE);
  if (fx) fx(cv);
  return cv;
}

function rotateCCW(src) {
  const out = new Canvas(src.height, src.width);
  for (let y = 0; y < src.height; y += 1)
    for (let x = 0; x < src.width; x += 1) {
      const c = src.get(x, y);
      if (c) out.set(y, src.width - 1 - x, c);
    }
  return out;
}

function sleepFrame(i) {
  // Lie the sleeping chibi on its back, head to the left.
  const stand = new Canvas(13, 22);
  body(stand, 1, 1, { eyes: "sleep", mouth: "sleep", arms: ["downL", "downR"] });
  const lying = rotateCCW(stand);
  const rise = i % 2; // slow breathing: the chest lifts one pixel every other frame
  return frame(
    (cv) => {
      for (let y = 0; y < lying.height; y += 1)
        for (let x = 0; x < lying.width; x += 1) {
          const c = lying.get(x, y);
          if (!c) continue;
          const chest = x >= 13 && x <= 17 && rise;
          cv.set(x + 5, y + 14 - (chest ? 1 : 0), c);
        }
    },
    (cv) => {
      const zs = [[[4, 9, Z]], [[4, 8, Z], [8, 4, ZBIG]], [[5, 7, Z], [9, 3, ZBIG]], [[9, 2, ZBIG]]][i];
      for (const [x, y, g] of zs) grid(cv, g, x, y, FX);
    },
  );
}

function waterFrame(i) {
  return frame(
    (cv) => {
      body(cv, HX, HY, { arms: ["outL", "downR"], mouth: i % 2 ? "grin" : "open" });
      grid(cv, PROPS.can, HX - 3 - 7, HY + 11, C);
    },
    (cv) => {
      // Drops fall from the spout tip toward the roots.
      const tipX = HX - 10, tipY = HY + 14;
      for (let k = 0; k < 3; k += 1) {
        const y = tipY + ((i * 2 + k * 3) % 9);
        cv.set(tipX - (k % 2), y, FX.d);
        cv.set(tipX - (k % 2), y + 1, FX.D);
      }
    },
  );
}

function danceFrame(i) {
  const poses = [
    { arms: ["upL", "downR"], legs: "liftR", bob: 0 },
    { arms: ["downL", "upR"], legs: "stand", bob: 1 },
    { arms: ["downL", "upR"], legs: "liftL", bob: 0 },
    { arms: ["upL", "upR"], legs: "stand", bob: 1 },
  ];
  const p = poses[i];
  return frame(
    (cv) => body(cv, HX, HY + p.bob, { arms: p.arms, legs: p.legs, mouth: i === 3 ? "open" : "grin" }),
    (cv) => {
      const notes = [[[3, 2]], [[25, 1]], [[4, 0]], [[24, 3]]][i];
      for (const [x, y] of notes) grid(cv, NOTE, x, y, FX);
    },
  );
}

function riceFrame(i) {
  const toMouth = i === 1;
  return frame((cv) => {
    body(cv, HX, HY, { arms: ["downL", toMouth ? "mouthR" : "chestR"], mouth: ["grin", "open", "chew", "chew2"][i] });
    grid(cv, PROPS.bowl, HX + 3, HY + 14, C); // bowl held at the chest
    // chopsticks
    const [sx, sy] = toMouth ? [HX + 7, HY + 9] : [HX + 7, HY + 13];
    for (let k = 0; k < 4; k += 1) {
      cv.set(sx + k, sy + (toMouth ? k : -k), C.n);
    }
    if (toMouth) cv.set(HX + 6, HY + 9, C.u);
  });
}

function sushiFrame(i) {
  return frame((cv) => {
    const atMouth = i === 1;
    body(cv, HX, HY, { arms: ["downL", i === 0 ? "liftR" : atMouth ? "mouthR" : "downR"], mouth: ["grin", "open", "chew", "chew2"][i] });
    if (i === 0) grid(cv, PROPS.sushi, HX + 11, HY + 8, C);
    if (i === 1) grid(cv, PROPS.sushi, HX + 5, HY + 8, C);
  });
}

function proteinFrame(i) {
  return frame((cv) => {
    const drink = i >= 2;
    body(cv, HX, HY, {
      arms: ["downL", drink ? "mouthR" : "liftR"],
      mouth: drink ? (i === 2 ? "open" : "chew") : "grin",
    });
    if (!drink) grid(cv, PROPS.shaker, HX + 11, HY + 4 + (i === 0 ? 0 : 3), C);
    else grid(cv, PROPS.shaker, HX + 7, HY + 8 + (i === 3 ? 1 : 0), C);
  });
}

export const ANIMATIONS = [
  { name: "sleep", ms: 520, make: sleepFrame },
  { name: "water", ms: 200, make: waterFrame },
  { name: "dance", ms: 220, make: danceFrame },
  { name: "rice", ms: 320, make: riceFrame },
  { name: "sushi", ms: 340, make: sushiFrame },
  { name: "protein", ms: 260, make: proteinFrame },
];
export const FRAMES = 4;

export function gardenerSheet() {
  const sheet = new Canvas(FRAME_W * FRAMES, FRAME_H * ANIMATIONS.length);
  ANIMATIONS.forEach((anim, row) => {
    for (let i = 0; i < FRAMES; i += 1) sheet.blitCanvas(anim.make(i), i * FRAME_W, row * FRAME_H);
  });
  const manifest = {
    frame: { w: FRAME_W, h: FRAME_H },
    frames: FRAMES,
    animations: Object.fromEntries(ANIMATIONS.map((a, row) => [a.name, { row, ms: a.ms }])),
  };
  return { sheet, manifest };
}

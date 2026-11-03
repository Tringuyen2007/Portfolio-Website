// Hand-authored sprites. Text grids: one char per pixel, "." transparent.
// Letters resolve through palette.L (plus the local extras below).
import { L as BASE, P } from "./palette.mjs";

export const L = { ...BASE, v: P.redSpec, V: P.goldSpec, S: P.soil, z: P.barkHi, x: P.barkEdge, O: P.cloudDeep };

/** 12×12 Minecraft-inspired apple. body letters are swapped per variant. */
const APPLE = [
  ".....UU.....",
  "....UUll....",
  "...kkkkkkk..",
  "..krrvhrrrk.",
  ".krrhhrrrrrk",
  ".krhhrrrrrrk",
  ".krrrrrrrrRk",
  ".krrrrrrrRRk",
  ".krrrrrrRRRk",
  "..kRrrrRRRk.",
  "...kRRRRRk..",
  "....kkkkk...",
];
const swap = (rows, map) => rows.map((r) => [...r].map((c) => map[c] ?? c).join(""));

export const appleRed = APPLE;
export const appleGolden = swap(APPLE, { r: "Y", h: "X", R: "Z", v: "V" });
// Enchanted: golden body with purple rim light + 3 shimmer overlay frames.
export const appleEnchanted = swap(appleGolden, {}).map((row, y) =>
  y >= 6 && y <= 9 ? row.replace(/Z(?=k|Zk)/g, "P") : row,
);
export const shimmerFrames = [
  ["............", "............", ".H..........", "HHH.........", ".H..........", "............", "........p...", ".......pHp..", "........p...", "............", "............", "............"],
  ["............", "..........H.", ".........HHH", "..........H.", "............", "....p.......", "...pHp......", "....p.......", "............", "............", "............", "............"],
  ["............", "............", "............", "............", "............", ".H..........", "HHH......p..", ".H......pHp.", ".........p..", "............", "....H.......", "...HHH......"],
];

export const leafSmall = ["..ll", ".lLl", "lLE.", "lE.."];

/** Four-petal blossom for experience nodes on the vine (pinks match the tree's spring blossoms). */
export const flower = [
  "...kkkk...",
  "..kJJqqk..",
  "kkkJqqKkkk",
  "kJJkYYkqqk",
  "kJqYXYZqKk",
  "kqqYYZZKKk",
  "kqKkZZkKKk",
  "kkkqqKKkkk",
  "..kqKKKk..",
  "...kkkk...",
];

export const cloudSmall = [
  "......FFFF......",
  "...FFCCCCCFF....",
  ".FFCCCCCCCCCFF..",
  "FCCCCCCCCCCCCCF.",
  "DCCCCCCCCCCCCCDD",
  ".DDDDDDDDDDDDDD.",
];
export const cloudMedium = [
  "..........FFFFF.........",
  ".......FFFCCCCCFF.......",
  "....FFFCCCCCCCCCCFF.....",
  "..FFCCCCCCCCCCCCCCCFFF..",
  ".FCCCCCCCCCCCCCCCCCCCCF.",
  "FCCCCCCCCCCCCCCCCCCCCCCF",
  "DCCCCCCCCCCCCCCCCCCCCCDD",
  ".DDDDDDDDDDDDDDDDDDDDDD.",
];
export const cloudLarge = [
  "..............FFFFFF................",
  "..........FFFFCCCCCCFF..............",
  ".......FFFCCCCCCCCCCCCFF............",
  ".....FFCCCCCCCCCCCCCCCCCFF...FFFF...",
  "...FFCCCCCCCCCCCCCCCCCCCCCFFFCCCCFF.",
  "..FCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCF.",
  ".FCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCF",
  "DCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCDD",
  "DDCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCDDO",
  ".DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDO.",
];

/** 16×16 moon with three craters; glow is added procedurally. */
export const moon = [
  ".....WWWWWW.....",
  "...WWWMMMMMWW...",
  "..WMMMMMMMMMMW..",
  ".WMMMMQQMMMMMMW.",
  ".WMMMQQQQMMMMMM.",
  "WMMMMQQQQMMMMMMM",
  "WMMMMMQQMMMMMQMM",
  "WMMMMMMMMMMMQQQM",
  "WMMMMMMMMMMMMQMM",
  "WMMMMMMMMMMMMMMM",
  "MMMMQMMMMMMMMMMM",
  ".MMMMMMMMMMMMMMQ",
  ".QMMMMMMMMMMMMQ.",
  "..QMMMMMMMMMMQ..",
  "...QQMMMMMMQQ...",
  ".....QQQQQQ.....",
];

/** 9-slice panel, 12×12 with a 3px border: edge, highlight, fill. */
export const panel9 = [
  ".eeeeeeeeee.",
  "eejjjjjjjjee",
  "ejffffffffje",
  "ejffffffffje",
  "ejffffffffje",
  "ejffffffffje",
  "ejffffffffje",
  "ejffffffffje",
  "ejffffffffje",
  "ejffffffffje",
  "eeffffffffee",
  ".eeeeeeeeee.",
];

/** Wooden sign plank, 28×10, text is rendered separately. */
export const signPlank = [
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "xzzzzzzzzzzzzzzzzzzzzzzzzzzx",
  "xzTTTTTTTTTTTTTTTTTTTTTTTTUx",
  "xzTTTTTTTTTTTTTTTTTTTTTTTTUx",
  "xzTTTTTTTTTTTTTTTTTTTTTTTTUx",
  "xzTTTTTTTTTTTTTTTTTTTTTTTTUx",
  "xzTTTTTTTTTTTTTTTTTTTTTTTTUx",
  "xzTTTTTTTTTTTTTTTTTTTTTTTTUx",
  "xzUUUUUUUUUUUUUUUUUUUUUUUUUx",
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
];

/** Pixel arrow cursor 7×9 (used in the "click to explore" hint). */
export const cursor = ["k......", "kk.....", "kck....", "kcck...", "kccck..", "kcccck.", "kccckkk", "kkkck..", "...kk.."];

/** Vine tile 8×16 for the experience timeline (tiles vertically). */
export const vineTile = [
  "...GL...", "...GL...", "..GLl...", "..GL....", "lGL.....", ".GL.....", "..GL....", "...GL...",
  "...GL...", "...GLl..", "....GL..", "....GLl.", "....GL..", "...GL...", "...GL...", "...GL...",
];

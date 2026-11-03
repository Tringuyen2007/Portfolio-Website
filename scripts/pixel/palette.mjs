/**
 * "Pixel Orchard" palette. Every sprite in the world uses only these colors,
 * which is what keeps clouds, moon, tree, apples and project scenes in one style.
 * Mirrors the CSS tokens proposed in docs/pixel-redesign/pixel-art-direction.md.
 */
export const P = {
  // sky (top → horizon)
  sky0: "#0a0e24", sky1: "#111737", sky2: "#1b2048", sky3: "#2a2a5c", sky4: "#3a3470", haze: "#4b4280",
  // moon
  moon: "#f4e7a1", moonHi: "#fff8d2", moonLo: "#d9c673", moonGlow: "#f4e7a133",
  // clouds
  cloud: "#cfcbe9", cloudHi: "#f1eefc", cloudLo: "#9d96cc", cloudDeep: "#7a72ad",
  // ground
  grass: "#2f5a3a", grassHi: "#3f7a48", grassLo: "#1e3a2a", soil: "#3b2a1f",
  // bark
  bark: "#5a3a24", barkHi: "#7a5234", barkLo: "#3b2416", barkEdge: "#241409",
  // leaves
  leaf: "#3f8a46", leafHi: "#5fb35a", leafLo: "#2f6b3a", leafDeep: "#1e4a2a",
  // young-branch spring greens and blossoms
  spring: "#6aa84a", springHi: "#9ccc62", springLo: "#4a8a3e", blossom: "#f2b8c6", blossomHi: "#ffe3ea", blossomLo: "#d27a98",
  rope: "#c9a66b",
  // apples
  red: "#d9403f", redHi: "#f07a6a", redLo: "#8e1f26", redSpec: "#ffd6c9",
  gold: "#e9b63a", goldHi: "#ffd95a", goldLo: "#a8771a", goldSpec: "#fff6c8",
  ench: "#b25ee8", enchHi: "#e3a6ff", enchLo: "#6a2f9c",
  // ui
  ink: "#1a1428", cream: "#f3ead6", mute: "#a79f8f", panel: "#161a2f", panelHi: "#2b3058", panelEdge: "#4a4f80",
  // scene accents
  white: "#f8f4ff", gray: "#8d8aa3", dgray: "#3d3a55", orange: "#e98a2e", yellow: "#f4d35e",
  blue: "#4f8ce8", dblue: "#24448a", cyan: "#7fd3f0", magenta: "#e36bb0", skin: "#f1c4a1", tan: "#c48a4f",
};

/** Single-letter palette used by hand-authored text-grid sprites. */
export const L = {
  k: P.ink, w: P.white, c: P.cream, g: P.gray, d: P.dgray,
  r: P.red, R: P.redLo, h: P.redHi, o: P.orange, y: P.yellow, Y: P.gold, Z: P.goldLo, X: P.goldHi,
  l: P.leafHi, L: P.leaf, G: P.leafLo, E: P.leafDeep,
  b: P.blue, B: P.dblue, s: P.cyan, p: P.ench, P: P.enchLo, H: P.enchHi,
  n: P.sky1, N: P.sky2, t: P.tan, T: P.bark, U: P.barkLo, m: P.magenta, i: P.skin,
  C: P.cloud, D: P.cloudLo, F: P.cloudHi, M: P.moon, Q: P.moonLo, W: P.moonHi,
  a: P.grass, A: P.grassLo, e: P.panelEdge, f: P.panel, j: P.panelHi, u: P.mute,
  q: P.blossom, J: P.blossomHi, K: P.blossomLo,
};

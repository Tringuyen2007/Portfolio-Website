// Render every pixel asset to PNG. Usage: node scripts/pixel/build.mjs [outDir] [scale]
// Design-phase output goes to designs/pixel/renders (8× for Figma); the
// implementation later writes atlases to public/pixel at 1× for Pixi to scale.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Canvas } from "./png.mjs";
import { P } from "./palette.mjs";
import * as S from "./sprites.mjs";
import { scenes } from "./scenes.mjs";
import { gardenerSheet } from "./gardener.mjs";
import { sky, moonWithGlow, ground, orchardTree, plank, appleShell, button, cloudBank } from "./procedural.mjs";

const out = process.argv[2] ?? "designs/pixel/renders";
const scale = Number(process.argv[3] ?? 8);
mkdirSync(out, { recursive: true });

function validate(name, grid) {
  const w = grid[0].length;
  grid.forEach((row, i) => {
    if (row.length !== w) throw new Error(`${name}: row ${i} has length ${row.length}, expected ${w}: "${row}"`);
    for (const ch of row) if (ch !== "." && ch !== " " && !(ch in S.L) && ch !== "^") throw new Error(`${name}: unknown palette letter "${ch}" in row ${i}`);
  });
}
function fromGrid(name, grid, extra = {}) {
  validate(name, grid);
  const c = new Canvas(grid[0].length, grid.length);
  c.blit(grid, { ...S.L, ...extra }, 0, 0);
  return c;
}
const save = (name, canvas, k = scale) => {
  writeFileSync(join(out, `${name}.png`), canvas.scaled(k).png());
  return canvas;
};

// apples
save("apple-red", fromGrid("apple-red", S.appleRed));
save("apple-golden", fromGrid("apple-golden", S.appleGolden));
const ench = fromGrid("apple-enchanted", S.appleEnchanted);
save("apple-enchanted", ench);
S.shimmerFrames.forEach((f, i) => {
  const c = new Canvas(12, 12);
  c.blitCanvas(ench, 0, 0);
  c.blit(f, S.L, 0, 0);
  save(`apple-enchanted-f${i}`, c);
});
// environment
save("cloud-s", fromGrid("cloud-s", S.cloudSmall));
save("cloud-m", fromGrid("cloud-m", S.cloudMedium));
save("cloud-l", fromGrid("cloud-l", S.cloudLarge));
save("moon", moonWithGlow());
save("sky-desktop", sky(360, 200), scale === 1 ? 1 : 4);
save("sky-mobile", sky(130, 280), scale === 1 ? 1 : 3);
save("ground", ground(360), scale === 1 ? 1 : 4);
// Hero cloud bank: three parallax layers, back (dim, tall) → front (bright, low).
save("cloud-bank-back", cloudBank({ width: 192, height: 44, baseY: 18, minR: 8, maxR: 15, fade: 14, seed: 21, tones: { hi: P.cloudLo, base: P.cloudDeep, lo: P.haze } }));
save("cloud-bank-mid", cloudBank({ width: 160, height: 40, baseY: 18, minR: 6, maxR: 12, fade: 14, seed: 33, tones: { hi: P.cloud, base: P.cloudLo, lo: P.cloudDeep } }));
save("cloud-bank-front", cloudBank({ width: 128, height: 36, baseY: 16, minR: 5, maxR: 10, fade: 14, seed: 47, tones: { hi: P.cloudHi, base: P.cloud, lo: P.cloudLo } }));
save("leaf", fromGrid("leaf", S.leafSmall));
save("flower", fromGrid("flower", S.flower));
// the gardener: chibi Tri under the tree (sheet + frame manifest)
{
  const { sheet, manifest } = gardenerSheet();
  save("gardener", sheet);
  writeFileSync(join(out, "gardener.json"), JSON.stringify(manifest, null, 2));
}
save("vine-tile", fromGrid("vine", S.vineTile));
// ui
save("panel-9", fromGrid("panel", S.panel9));
save("sign-plank", fromGrid("sign", S.signPlank));
save("cursor", fromGrid("cursor", S.cursor));
save("btn-primary", button(40, 11, P.gold, P.goldLo, P.goldHi));
save("btn-secondary", button(40, 11, P.panel, P.panelEdge, P.panelHi));
save("shell-red", appleShell(60, 64, "red"));
save("shell-golden", appleShell(60, 64, "golden"));
save("shell-enchanted", appleShell(60, 64, "enchanted"));
// The orchard tree. Branch geometry for the pixel tree lives here (the ids and
// order must match content/branches.ts). Signs are baked into the sprite, hung
// from their limb on two ropes; tree-anchors.json carries the apple slots per
// branch and each plank's top-left so the DOM can lay label text over it.
const branches = [
  { id: "hackathons", side: "right", attach: 0.42, angle: 72, length: 1.32, young: false, signT: 0.45 },
  { id: "ai-ml", side: "left", attach: 0.6, angle: 56, length: 1.18, young: false, signT: 0.45 },
  { id: "software", side: "left", attach: 0.24, angle: 80, length: 1.12, young: false, signT: 0.45 },
  { id: "research", side: "right", attach: 0.76, angle: 44, length: 0.9, young: true, signT: 0.45 },
  { id: "leadership", side: "left", attach: 0.93, angle: 22, length: 0.72, young: true, signT: 0.45 },
];
const SIGN = { w: 36, h: 11 };
const t = orchardTree({ width: 196, height: 176, branches, seed: 5 });
const signs = t.signs.map((sg) => {
  const x = sg.hook.x - SIGN.w / 2, y = sg.hook.y + 6;
  t.canvas.line(sg.hook.x - 3, sg.hook.y + 1, x + 3, y + 2, P.rope, 1);
  t.canvas.line(sg.hook.x + 3, sg.hook.y + 1, x + SIGN.w - 4, y + 2, P.rope, 1);
  t.canvas.blitCanvas(plank(SIGN.w, SIGN.h), x, y);
  return { id: sg.id, side: sg.side, x, y };
});
save("tree", t.canvas);
writeFileSync(join(out, "tree-anchors.json"), JSON.stringify({ width: t.canvas.width, height: t.canvas.height, sign: SIGN, slots: t.slots, signs }, null, 2));
// scenes
const sceneExtra = { "^": P.cream };
for (const [slug, scene] of Object.entries(scenes)) {
  scene.frames.forEach((f, i) => save(`scene-${slug}-f${i}`, fromGrid(`${slug}#${i}`, f, sceneExtra)));
}
// composite: the hero environment at design scale for the Figma board
{
  const skyC = sky(360, 200);
  const comp = new Canvas(360, 200);
  comp.blitCanvas(skyC, 0, 0);
  comp.blitCanvas(moonWithGlow(), 268, 18);
  comp.blitCanvas(fromGrid("c", S.cloudLarge), 30, 40);
  comp.blitCanvas(fromGrid("c", S.cloudMedium), 210, 70);
  comp.blitCanvas(fromGrid("c", S.cloudSmall), 120, 24);
  comp.blitCanvas(ground(360), 0, 186);
  const TX = 360 - 196 - 24, TY = 200 - 176 - 12;
  comp.blitCanvas(t.canvas, TX, TY);
  // hang a few apples on anchors for the composite
  const red = fromGrid("a", S.appleRed), gold = fromGrid("g", S.appleGolden);
  const hang = [...t.slots.hackathons.slice(0, 6), ...t.slots.software.slice(0, 2), t.slots["ai-ml"][1]];
  hang.forEach((a, i) => comp.blitCanvas(i % 3 === 0 ? gold : red, TX + a.x, TY + a.y));
  comp.blitCanvas(ench, TX + t.slots["ai-ml"][0].x, TY + t.slots["ai-ml"][0].y);
  save("composite-hero", comp, 4);
}
console.log(`rendered to ${out} at ${scale}x`);

# PixiJS architecture — Pixel Orchard

Approved direction: 2026-11-02. This document is the engineering plan for turning the Figma frames into the site. It reuses the existing content model, tree layout engine, preview state machine, zoom provider, routes, and SEO.

## 1. Layers

```
<html>
 ├─ <PixelSky/>            fixed, z -10, PERSISTENT across routes (root layout)   ← Pixi app #1
 ├─ <SiteHeader/>          DOM
 ├─ <main>{template}</main> DOM; template.tsx crossfades page content only
 │    └─ /projects: <OrchardStage/>   Pixi app #2 (tree + apples + signs), DOM overlay buttons
 ├─ <ZoomProvider/>        DOM overlay for apple → project zoom (existing, retargeted)
 └─ <SiteFooter/>
```

**Persistent sky.** `PixelSky` mounts once in `app/layout.tsx` and is never unmounted by navigation, so cloud drift, moon glow, and fireflies continue through every route change. Page content crossfades above it (`template.tsx`: opacity 0→1 and 12 px rise over 320 ms, reduced motion: none). This answers the "clouds keep moving between pages" requirement directly.

**Orchard stage.** The tree is a second, route-scoped Pixi application on `/projects` and the home tree preview. Two small apps are simpler than sharing one canvas across layouts and avoid z-order fights with DOM content. Both are loaded with `next/dynamic({ ssr: false })` so the server render is unaffected; a static `<img>` of `composite-hero.png` is the SSR/no-JS fallback.

## 2. Modules

| Module | Responsibility |
|---|---|
| `lib/pixel/assets.ts` | Asset manifest (sprite URLs under `public/pixel/`), `loadPixelAssets()` with `Assets.load`, sets `scaleMode: "nearest"` on every texture |
| `lib/pixel/unit.ts` | `UNIT = 4` desktop / `3` below 768 px; `px(n)` helpers; integer rounding |
| `lib/pixel/motion.ts` | `prefersReducedMotion()`, `visibilityTicker(app)` (pause ticker when `document.hidden` or the canvas is off-screen via IntersectionObserver) |
| `components/pixel/pixel-sky.tsx` | Persistent sky island: sky texture, moon, 3 cloud layers, fireflies; resize handling; exposes `data-sky-ready` |
| `components/pixel/orchard-stage.tsx` | Tree island: loads `tree.png`, places apples from `lib/tree/layout.ts` anchors, signs, hover/dim states, emits `onApple{Enter,Leave,Activate}`; renders the DOM overlay of `<button>`s (one per apple, absolutely positioned from projected coordinates) |
| `components/pixel/apple-preview.tsx` | Apple-shaped preview (DOM, CSS-masked shell PNG) with a 2-frame scene `<img>` swap; replaces `fruit-preview.tsx` visuals, keeps its placement logic |
| `components/pixel/scene.tsx` | 2-frame scene player (`setInterval` at the scene's loop; stops on reduced motion) |
| `components/transitions/zoom-provider.tsx` | Existing. Change: the clone becomes the apple sprite PNG with `image-rendering: pixelated`, scale steps snap to integers (×4→×6→×24) instead of a continuous radial-gradient circle |
| `content-collections.ts` | Add `apple: "red" \| "golden" \| "enchanted"` derivation and the enchanted guard |
| `scripts/pixel/*` | Existing sprite pipeline; add `build:pixel` npm script writing to `public/pixel/` at 1× (the browser scales) |

## 3. Data flow

```
content/projects/*.mdx ─┐
content/branches.ts ────┼─► lib/tree/layout.ts (anchors, deterministic) ─► OrchardStage (sprite positions)
                         └─► apple kind (red/golden/enchanted) ─────────► sprite texture + preview shell
```

Positions are computed once per render from the same layout engine as today; the Pixi stage is a view, never a source of truth. Anchor coordinates are in art pixels and multiplied by `UNIT` at draw time.

## 4. Enchanted rule

In `content-collections.ts` transform:

```ts
const apple = document.enchanted ? "enchanted" : award ? "golden" : "red";
if (document.enchanted && document.slug !== "vision") {
  throw new Error(`Only "vision" may be enchanted (got ${document.slug})`);
}
```

The build fails on any second enchanted apple. The UI never decides; it only reads `apple`.

## 5. Rendering rules

- `TextureSource.defaultOptions.scaleMode = "nearest"` set once before any load.
- `app.renderer.resolution = 1`, canvas CSS size = world size × UNIT; `roundPixels: true`.
- Clouds move in whole art pixels: accumulate fractional velocity, apply `Math.floor`.
- Ticker runs at 60 fps but sprite animation is frame-stepped (sway: 3 positions, scenes: 2 frames). Visual work per frame is trivial.
- Ticker stops when the tab is hidden, the canvas is off-screen, or reduced motion is on (then one static frame is rendered).
- Pixi import is tree-shaken: `Application, Container, Sprite, Assets, Ticker` only. Budget: ≤ 160 kB gzipped added to the two routes that mount a stage, 0 kB to others except the sky (~same chunk, shared).

## 6. Transitions

| Event | Mechanism |
|---|---|
| Any route change | Sky persists untouched; `template.tsx` crossfades content (320 ms) |
| Apple click | `ZoomProvider.zoomTo` with `kind: "apple"`: dim 60%, clone sprite snaps ×6 at 120 ms, ×24 at 250 ms, `router.push` at 250 ms, clone fades once `[data-zoom-target]` mounts |
| Back to tree | `zoomBack` unchanged; the clone shrinks into the apple's overlay button |
| Reduced motion | `router.push`, no clone; template renders children directly |

## 7. Accessibility

Canvases are `aria-hidden`. Every apple has a DOM `<button>` with the project title, positioned over the sprite (min 44 px). Focus opens the preview, Enter activates, Esc closes, matching `tree-stage.tsx` today. The project list below the tree stays the complete, non-canvas path. Signs are decorative; branch filters are the real controls.

## 8. Fallbacks and failure modes

- No WebGL: Pixi v8 falls back to WebGPU→WebGL→canvas automatically; if `Application.init` throws, the island renders the static composite PNG and the DOM list.
- Asset load failure: stage stays hidden, list remains; error logged once.
- Hydration: no Pixi code runs on the server; islands render a sized placeholder to avoid layout shift.

# Existing site audit — before the pixel-art redesign

Date: 2026-11-02. Branch audited: `new-ui` (HEAD `2388236`, "Living Tree" redesign, unmerged to `main`).
Verified by reading every file under `app/`, `components/`, `lib/`, `content/`, running `eslint` (0 errors, 2 warnings)
and `tsc` (only errors come from stale duplicate files `.next/types/*\ 2.ts`, a local build artifact, not source).

## 1. Stack and architecture

| Layer | What is there | Verdict |
|---|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript strict, static rendering everywhere | Keep |
| Styling | Tailwind 4 with `@theme inline` tokens in `app/globals.css`; all colors are CSS variables (`--bg`, `--apple`, `--gold`, `--leaf`…) | Keep token names, change values |
| Content | content-collections + MDX. `content/projects/*.mdx` with a zod schema in `content-collections.ts`; `content/experience.ts`; `content/branches.ts` | Keep. Single source of truth; extend schema |
| Motion | framer-motion 12 (page template fade, ScrollReveal, zoom overlay, vine draw) | Keep for DOM UI; PixiJS owns the world |
| Icons | lucide-react | Keep for UI chrome; pixel icons for world elements |
| Fonts | Fraunces (display), Geist, Geist Mono via `next/font` | Keep Geist for body; add one pixel display face; Fraunces is retired from headings |
| Tests | None. No test runner installed | Add Vitest for the layout engine and classification rules |
| Rendering engine | None. No PixiJS, no canvas, no WebGL | PixiJS v8 to be added |

Dependencies are small (5 runtime). Adding `pixi.js` (~150 kB gzipped when tree-shaken to Sprite/Container/Graphics/Text) is the only heavy addition the redesign needs. No other dependency is justified.

## 2. Route inventory

| Route | File | State | Redesign action |
|---|---|---|---|
| `/` | `app/page.tsx` | Hero (name, intro, portrait with rose vines) → Tree preview (01) → Experience preview (02) → Contact invitation (03) → Closing quote ("Tri quote in progress") | Keep structure and order of sections; About Me section is missing and must be added (spec Frame 2) |
| `/projects` | `app/projects/page.tsx` | Heading + counts, `TreeStage` (SVG tree), `TreeLegend`, `ProjectList` (filterable cards) | Tree becomes PixiJS; list, legend, counts stay as DOM |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Hero band (`data-zoom-target`) with award chip, title, summary, links, cover art; facts `<dl>`; MDX body; sticky stack aside; gallery; back + next | Keep layout; restyle; pixel hero replaces SVG cover art |
| `/experience` | `app/experience/page.tsx` | Heading, `ExperienceTimeline` (climbing vine), skill groups | Keep data and hierarchy; restyle vine as pixel vine |
| `/contact` | `app/contact/page.tsx` | Email (env-gated), GitHub, LinkedIn cards; resume iframe + download | Keep all; restyle |
| `/resume` | `app/resume/page.tsx` | `redirect("/contact#resume")` | Keep |
| `/opengraph-image`, `/projects/[slug]/opengraph-image` | `app/**/opengraph-image.tsx` | Still use the old charcoal palette (`#14161A`) | Restyle to pixel palette (low risk, isolated) |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | Fine | Keep |
| 404 | `app/not-found.tsx` | Links to `/projects` | Restyle |

SEO: metadata template, canonical URLs, OG/Twitter cards, JSON-LD (`Person` on home, `CreativeWork` per project) all exist. Preserve all of it.

## 3. Component inventory

### Tree system (`lib/tree`, `components/tree`)
- `lib/tree/layout.ts` (547 lines): **pure, deterministic layout engine**. `buildTreeLayout(projects, frame, branchDefs)` → trunk cubic, branch cubics from `content/branches.ts` (side, attach, angle, length), twigs, leaf clusters, fruit positions by date along `t ∈ [0.42, 0.95]`, overlap relaxation, 2-decimal rounding for hydration safety. Seeded PRNG (`mulberry32`). **Reuse as-is for the PixiJS tree**: the Bézier paths become the skeleton that is rasterized to the pixel grid. This is the single most valuable asset in the repo.
- `lib/tree/types.ts`: `TreeProject` (serializable subset), `FRUIT_COLORS`, `FRUIT_LABELS`. Fruit kinds today: `golden | ripe | green | blossom`. **Must change** to `red | golden | enchanted` (plus the classification rule), see §6.
- `lib/tree/projects.ts`: `toTreeProject()` adapter. Keep.
- `components/tree/tree-stage.tsx` (320 lines): client orchestrator. Contains the **hover/touch/keyboard preview state machine** (open delay 70 ms, close grace 170 ms, swap-in-place, Escape, outside-tap, scroll re-anchor), IntersectionObserver + `visibilitychange` pause, return-from-project restore (`sessionStorage` key `tree:return`), fireflies. **Preserve the interaction logic; swap the SVG for a Pixi canvas and re-source anchors from Pixi world→screen coordinates.**
- `components/tree/tree-svg.tsx`: SVG renderer (bark gradients, roots, sway via CSS keyframes, wooden branch signs). Replaced by Pixi scene. Keep in the repo only as the `TreePreview`/reduced-motion fallback until the Pixi version is proven, then remove.
- `components/tree/fruit.tsx`: SVG `<g role="button" tabIndex=0>` per fruit with key handlers. The ARIA pattern (role, label, tabIndex, Enter/Space) must be reproduced as DOM hit-target overlays positioned over the canvas, so keyboard and screen-reader behavior is identical.
- `components/tree/fruit-preview.tsx`: apple-shaped preview (SVG silhouette + rounded content inset), `placePreview()` viewport-aware placement (right → left → above → below, clamped). **Keep `placePreview` verbatim.** Shell becomes a pixel-bordered apple; the inner art becomes a Pixi scene.
- `components/tree/project-list.tsx`: accessible card list with branch filter chips. Keep; restyle.
- `components/tree/tree-legend.tsx`, `apple-icon.tsx`: legend. Keep; swap icon for pixel sprites.

### Transitions (`components/transitions/zoom-provider.tsx`)
- `ZoomProvider` with `zoomTo(request)` and `zoomBack(href, selector, colors)`. Fixed overlay, framer `animate`, `router.prefetch` + `router.push` at 380 ms, waits for `[data-zoom-target]`, cross-fades out. Run counter cancels superseded runs; watchdog clears at 2.6 s; `popstate` and unrelated pathname changes clear. Reduced motion → plain `router.push`. **Robust; keep the state machine.** The clone content changes from a radial-gradient circle to the enlarged pixel apple sprite (nearest-neighbor scaled) and the dim layer becomes the sky.
- `components/project/back-to-tree.tsx`: writes `tree:return` then `zoomBack`. Keep.
- `components/home/tree-preview.tsx`: non-interactive tree + "Explore the tree" link that `zoomTo`s with `kind: "tree"`. Keep behavior; render the Pixi preview (static or low-tick).

### Page chrome and shared UI
- `site-header.tsx` (sticky, mobile menu), `site-footer.tsx`, `container.tsx`, `scroll-reveal.tsx`, `intro-overlay.tsx` (900 ms name card), `json-ld.tsx`, `mdx-components.tsx`, `ground-glow.tsx` (static CSS radial gradients + noise). Keep all; restyle header/footer with pixel borders; `GroundGlow` is replaced by the Pixi sky on pages that mount the world and by a static CSS pixel sky elsewhere.
- `components/botanical/flora.tsx`, `home/portrait-vines.tsx`: vector roses/leaves/thorns around the portrait and on the experience vine. **Incompatible with pixel art** (smooth Béziers). Replace with pixel vine/leaf sprites; keep the component API (`Rose`, `Bud`, `Leaf`) so call sites change minimally.
- `experience/experience-timeline.tsx` + `experience-details.tsx`: scroll-driven vine (`pathLength`), bud/rose nodes, `<details>` for extras. Keep structure and data flow; restyle.
- `gallery/project-gallery.tsx`: grid + lightbox (keyboard, swipe, body scroll lock). Keep; pixel frame styling only. **No project has gallery data yet** (`gallery: []` everywhere; `public/projects/` does not exist).
- `stack-icon-grid.tsx`: devicon `<img>` from jsDelivr + lucide fallbacks (lint warning). Replace with pixel stack chips; removes the external CDN dependency.
- `project-art/*.tsx` (10 files, 663 lines): hand-drawn **vector** cover arts using tokens. Replaced by pixel scenes. Keep as the reduced-motion/no-WebGL still fallback until pixel PNG stills exist, then delete.

## 4. Content and data

- 10 projects (`content/projects/*.mdx`), all `featured: true`, none archived. Categories: hackathon ×6 (Mira, Radar, LarpCity, Stochastic, CarbonLens, DataFest 2026), ai-ml ×2 (Vision, Vending Machine Robot), software ×2 (Leanify, Personal Website). `research` and `leadership` branches exist with no fruit ("young" branches).
- Awards (verified from the MDX, written by the owner): Mira "1st Overall · MLH Best Use of Tiger Data" (CodeRED Orion); Radar "1st Place Best UI/UX · 2nd GoDaddy Best Use of ANS" (VTHacks 14); LarpCity "Capital One Track Winner" (HackRice); Vision "Nationally Recognized · UTSA News".
- **Vision / Red Bull Basement verification** (fetched 2026-11-02 from `https://news.utsa.edu/2026/06/three-computer-science-students-gain-national-recognition-for-ai-based-homebuilding-platform/`, HTTP 200): "The project, called Vision, helped the UT San Antonio team land a spot as one of 15 national finalists in the 2026 Red Bull Basement competition"; the team (Cayden Hutcheson, Tri Nguyen, Eric Lee) pitched at the U.S. National Finals in Detroit, MI; "Vision did not advance to the World Finals in San Francisco." Published 2026-06-19. The MDX currently does not mention Red Bull Basement at all; the award line should become "Red Bull Basement 2026 · U.S. National Finalist (top 15)" and `event: "Red Bull Basement 2026"`. Only this project qualifies for the Enchanted Golden Apple.
- Experience: 4 entries in `content/experience.ts` (Better Future Institute, Vorpex, CooledTured, ACM at UTSA) + 5 skill groups. Keep verbatim.
- `lib/site.ts`: name, role, school, GitHub, LinkedIn, resume path, nav. Email comes from `NEXT_PUBLIC_CONTACT_EMAIL` (unset locally; UI hides the card gracefully). Never hardcode an email.
- Closing quote placeholder "Tri quote in progress" is in place as instructed.
- Images: `public/images/profile.jpg` (140 kB, used). Eight unreferenced photos in `public/images/` total ~30 MB (DJI_*.JPG, IMG_*.JPG/PNG). They are candidates for project galleries but need the owner to assign them to projects and provide alt text; until then they ship in the bundle for nothing. Flag, do not delete.

## 5. Accessibility, performance, responsive state

Working today:
- Fruits are focusable `role="button"` with full labels; `ProjectList` duplicates every link in DOM; preview is `role="dialog"` with `aria-live`; Escape closes; touch model (tap → preview with Explore button → tap again navigates); `prefers-reduced-motion` honored globally in CSS and in every framer component; focus ring token.
- Mobile: tree uses a portrait `MOBILE_FRAME` (720×1100) under 768 px; hit targets ≥ 44 px; header collapses to a menu.
- Performance: static pages, one SVG tree (~600 nodes), CSS-only ambient motion paused offscreen, no third-party scripts (except devicon CDN images on project pages).

Known weaknesses to fix in the redesign:
- The zoom clone is a flat gradient circle; a scaled vector art is drawn inside it. In pixel art this must become a crisp sprite scale (integer multiples, `image-rendering: pixelated`).
- Branch label signs and fruit hit areas are in the same SVG; on narrow phones labels overlap fruits.
- `TreePreview` on the homepage renders the full desktop layout and scales it down, so fruits are tiny on mobile (non-interactive, acceptable, but the pixel version should use a dedicated small-frame composition).
- OG images are still the old grey palette.
- `IntroOverlay` runs on every full load (900 ms). Keep but consider session-once.

## 6. What changes in the data model

Current `fruit` is derived: `award → golden`, `completed → ripe`, else `green`; `blossom` unused by any project. New rule (Part 7.4 of the brief):

```
apple: "red" | "golden" | "enchanted"
  default  → "red"
  award    → "golden"
  slug === "vision" with enchanted: true in frontmatter → "enchanted"
```
The transform in `content-collections.ts` throws at build time if any project other than `vision` sets `enchanted: true`, so the exclusivity is enforced by the build, not by convention. `fruitTypes` becomes `appleTypes`; `FRUIT_COLORS`/`FRUIT_LABELS` are renamed and the `green`/`blossom` legend entries are removed (no project uses them; "in progress" is shown as a status chip instead).

Schema additions: `pixelScene: string` (id of the Pixi preview scene, defaults to slug), `enchanted?: boolean`, `articleUrl` already exists.

## 7. Preservation strategy

Preserve unchanged: routing, metadata/SEO, JSON-LD, sitemap, MDX pipeline and all MDX bodies, `lib/tree/layout.ts`, `placePreview`, the preview state machine, `ZoomProvider` state handling, `ProjectList`, `ProjectGallery`, `ExperienceTimeline` data flow, `Container`, `ScrollReveal`, `IntroOverlay`, header/footer behavior, `/resume` redirect, env-gated email.

Replace (visual layer only): SVG tree renderer, vector fruits, vector project arts, rose/leaf flora, ground glow, Fraunces headings, OG images, devicon CDN icons.

Refactor: `TreeStage` splits into `TreeStage` (DOM: controls, hit-target overlay, preview) and `TreeWorld` (Pixi: scene graph). `fruit` → `apple` naming. `FRUIT_*` constants → `APPLE_*`.

Create: PixiJS app singleton + lifecycle hook, sprite atlas pipeline (`scripts/pixel/`), environment layers (sky, moon, clouds), pixel tree rasterizer, apple sprites, preview scene registry (10 scenes), pixel UI primitives (panel, button, chip, sign), pixel vine for experience, Vitest.

## 8. Technical risks

1. **Canvas + accessibility.** PixiJS has no DOM. Mitigation: a transparent DOM overlay with one `<button>` per apple positioned from the layout engine (world coords → CSS px); the canvas is `aria-hidden`. Same approach the SVG uses, so no regression.
2. **Hydration / SSR.** Pixi is client-only. Mitigation: `TreeWorld` is a `dynamic(..., { ssr: false })` island; the layout engine still runs on the server for the overlay, so hit targets and the project list render without JS.
3. **Pixel crispness across DPR.** Mitigation: `roundPixels`, `SCALE_MODES.NEAREST` on every texture, integer world scale chosen from `devicePixelRatio`, CSS `image-rendering: pixelated` on the zoom clone.
4. **Duplicate Pixi apps** (homepage preview + tree page + previews). Mitigation: one `Application` per route mounted in a provider; previews render into the same app via a dedicated container moved to the preview's screen rect, not a second renderer.
5. **Mobile GPU/battery.** Mitigation: ticker stops when offscreen/hidden (reuse existing IntersectionObserver logic), 30 fps cap for ambient layers, atlas ≤ 1024², no filters on mobile (shimmer is a sprite-sheet animation, not a shader).
6. **Bundle size.** Mitigation: import from `pixi.js` sub-paths; measure with `next build` before/after; budget +160 kB gz on the tree route only.
7. **Content gaps** (galleries, quote, dates/locations, email env var) remain owner inputs; nothing in the redesign blocks on them.
8. **Existing `.next/types` duplicates** break `tsc` locally; `rm -rf .next` fixes it. Not a source problem.

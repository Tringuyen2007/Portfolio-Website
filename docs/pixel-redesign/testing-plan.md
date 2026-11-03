# Testing plan — Pixel Orchard

No test runner exists today; Vitest is added in T12. Until then, checks are manual and recorded here with results, never claimed in advance.

## Automated (Vitest)

| Test | Asserts |
|---|---|
| `layout.test.ts` | `buildTreeLayout` is deterministic for a fixed seed; no two apples closer than the minimum; all coordinates rounded to 2 dp |
| `apple-kind.test.ts` | red/golden/enchanted derivation; transform throws for `enchanted: true` on any slug other than `vision` |
| `unit.test.ts` | `UNIT` is 4 ≥ 768 px and 3 below; `px()` returns integers |
| `scene-manifest.test.ts` | every project slug has `scene-<slug>-f0/f1.png` in `public/pixel/` |

## Manual / browser

| Check | Method | Pass criteria |
|---|---|---|
| Persistent sky | Navigate Home → Projects → Experience | Clouds never jump or reset; moon stays put |
| Ticker pause | Switch tabs, come back; scroll stage off-screen | `app.ticker.started` false while hidden |
| Reduced motion | macOS "Reduce motion" on | No sway/drift/sparkle; zoom replaced by direct navigation |
| Keyboard | Tab through `/projects` | Every apple focusable in reading order; Enter opens; Esc closes preview |
| Touch | iOS Safari, Android Chrome | First tap previews, second opens; scrim tap closes; sheet is 44 px-safe |
| Hover timing | DevTools performance | Preview opens ≈70 ms, closes ≈170 ms after leave |
| Enchanted uniqueness | Add `enchanted: true` to `mira.mdx` | `next build` fails with the guard message |
| Pixel crispness | 100% / 150% / 200% zoom | No blurred sprite edges (nearest scaling, integer unit) |
| Bundle | `next build` output | `/projects` first-load JS delta ≤ 160 kB gz vs. current branch |
| Lighthouse | Chrome, mobile preset | Performance ≥ 90, Accessibility ≥ 95, SEO 100 on `/`, `/projects`, one project page |
| SEO | View source | Metadata, OG, JSON-LD unchanged; sitemap lists all projects |
| No-JS | Disable JS | Static composite PNG + full list render |

## Results log

2026-11-03, Chrome desktop at 1470×801, dev server and `next build`:

| Check | Result |
|---|---|
| Vitest | 12 tests in 4 files pass |
| `tsc --noEmit`, `eslint .` | Clean (one pre-existing unused-directive warning in `app/layout.tsx`) |
| `next build` | Succeeds; all routes static or SSG as before |
| Persistent sky | Same canvas element survives Home → Experience; clouds continue |
| Tree explorer | 10 apple buttons with accessible names (title + award); 2 canvases (sky + orchard) |
| Hover preview | Mira opens the golden shell with scene; Vision opens the enchanted shell with shimmer and article hint |
| Apple zoom | Click Mira → `/projects/mira`; `data-zooming` cleared afterwards |
| Back to tree | Returns to `/projects` with apples restored; no stuck transition |
| Console | No errors on `/projects` |
| Not yet run | Real-device touch, Lighthouse, bundle-size delta (390 px viewport and reduced motion: see 2026-11-03 Playwright run below) |

2026-11-03, Playwright Chromium (headless) against the dev server: 390×844 @3x with `isMobile` + `hasTouch`, and 1440×900; `reducedMotion` emulated both ways. Pages: `/`, `/projects`, `/projects/mira`, `/projects/vision`, `/experience`, `/contact`. Scripts live outside the repo (session scratchpad).

| Check | Before fixes | After fixes |
|---|---|---|
| No horizontal scroll at 390 (`scrollWidth` ≤ 390) | Pass on all 6 pages | Pass on all 6 pages |
| Readable text at 390 | Fail: 14 px body copy (legend meanings, project list intro and summaries, home quote caption, sheet summary 13 px); 6 px sign labels; moon and clouds sat behind eyebrows and H1s on every page | Pass: body copy ≥ 15 px; labels ≥ 7 px (spec range); on phones the moon and clouds are tucked half under the 72 px header |
| Tap targets ≥ 44 px at 390 | Fail: branch filter chips 32 px, project-page link list 24 px, award-chip "Read the article" 14 px, sheet article link 11 px | Pass: every non-prose link/button ≥ 44 px; all 10 apple hit targets 44×44 (some neighbours overlap by 5–8 px) |
| Tree explorer touch | Fail: first tap mounted the sheet on `pointerdown`, the trailing click landed on the new scrim and closed it instantly, so no sheet ever stayed open | Pass: tap opens the bottom sheet (not the floating shell); second tap on the same apple or "Explore ▸" opens the project; scrim tap closes; tapping another apple swaps the sheet (one at a time); Vision sheet shows "Read the article ↗" |
| Nav menu at 390 | Pass: opens, items 58–64 px, Escape and scrim close it, `aria-expanded` flips, route change closes it | Pass |
| `--unit` at 390 | Pass: 3px | Pass: 3px |
| Reduced motion, 390 and 1440 | Fail: sky static, apples still, scenes static, apple click navigates directly with no zoom, but `app/template.tsx` swapped structure on the client → hydration error on every page, and SSR shipped `opacity:0` page wrappers | Pass: all of the above, no hydration error; template is a CSS fade that only runs under `prefers-reduced-motion: no-preference`; hero/scroll reveals pinned visible |
| Normal motion | Pass: clouds move across two frames 2 s apart, apples sway, scenes swap, zoom overlay runs | Pass |
| Keyboard at 1440 | Pass with a caveat: all 10 apples reachable, but in slug (alphabetical) order | Pass: Tab walks apples in reading order (top band first, left → right); focus ring 2 px gold-hi; Enter opens the project; Escape closes the preview; back returns to `/projects` with no stuck `data-zooming` |
| Console, both viewports, both motion modes | Fail: hydration error under reduced motion; image-preload warning on `/experience` and `/contact` | Pass: clean except Framer Motion's dev-only "Reduced Motion enabled" notice (guarded by `NODE_ENV !== "production"`) and headless GPU driver notices |
| `tsc --noEmit`, `eslint .`, Vitest | — | Clean (same pre-existing unused-directive warning in `app/layout.tsx`); 12 tests pass |
| Not verifiable here | Real iOS/Android hardware touch (Playwright synthesises touch via CDP), macOS system Reduce Motion toggle (emulated via media feature only) | |


2026-11-03, performance audit. Production builds (`next build` + `next start`) of a scratch copy of the working tree and a worktree of the pre-redesign commit `2388236`, both outside the repo. First-load JS = gzip -9 of every `/_next/static/**.js` referenced by the prerendered HTML. Lighthouse 13.6.0, default mobile config (simulated throttling), headless Chrome, 3 runs per page, median shown. The "before" redesign numbers are the working tree as handed over; "after" includes the fixes listed below.

| Route | Base KB gz | New KB gz (before → after fixes) | Delta vs base (after) | Lighthouse perf / a11y / bp / seo: base | Redesign before fixes | Redesign after fixes |
|---|---|---|---|---|---|---|
| `/` | 259.4 | 333.1 → 251.5 | −7.9 | 84 / 100 / 96 / 100 | 78 / 100 / 96 / 100 | 90 / 100 / 96 / 100 |
| `/projects` | 251.9 | 328.4 → 246.8 | −5.1 | 87 / 96 / 96 / 100 | 80 / 100 / 96 / 100 | 91 / 100 / 96 / 100 |
| `/projects/[slug]` (mira) | 246.7 | 330.0 → 248.3 | +1.6 | 89 / 96 / 96 / 100 | 78 / 100 / 96 / 100 | 91 / 100 / 96 / 100 |

Lazily loaded Pixi (fetched after `load` + idle, never in first-load JS): about 242 KB gz before fixes (whole `pixi.js` barrel), about 146 KB gz after (the trimmed runtime, renderer and Pixi's own lazy environment chunks). The orchard stage code adds about 5.5 KB gz on routes that mount it. Within the 160 KB budget.

Fixes:
- `lib/pixel/assets.ts` imported `pixi.js` statically, and the root layout's `PixelSky` imports that file, so all of Pixi shipped in first-load JS on every route. It now takes a type-only import and loads Pixi lazily.
- `components/pixel/pixi-runtime.ts` is new: static named re-exports (`Application, Assets, Container, Sprite, Texture, TextureSource, TilingSprite`). The stages `await import()` it instead of `import("pixi.js")`. A dynamic import of the package namespace can't be tree-shaken.
- `loadPixi()` and `whenPageIdle()` in `lib/pixel/assets.ts`: the sky fetches Pixi after `load` + idle and no earlier than 1.5 s after navigation, so it doesn't land on top of the entrance reveals or the LCP.
- `/projects` (`orchard-explorer.tsx`) mounts the stage after the page is idle. The home preview (`tree-preview.tsx`) mounts only when it is within 400 px of the viewport. Until then the same-size static tree placeholder shows, so there is no layout shift (CLS 0.000 on all three pages).
- `app/layout.tsx`: Geist Mono (used only for inline `code` in MDX) is no longer preloaded.
- Tried and reverted: `experimental.inlineCss` (larger HTML; perf dropped to 86–88).

Still open:
- Best-practices is 96 on every page, base included, because `/favicon.ico` returns 404 (no icon in `app/` or `public/`).
- LCP is the hero / page intro paragraph, held back by the Framer Motion `opacity: 0` reveals (and on `/` by the intro overlay). This is about 1.1 s observed on `/` and 0.4 s on `/projects/mira`, against 0.1 s on base mira. `/` is at the threshold (runs 89 / 91 / 90).

2026-11-03, follow-up fixes (Playwright 390×844 touch and 1440×900):

| Check | Result |
|---|---|
| Branch signs at 390 px | All 5 inside the viewport (3–387 px); clamped by `clampSignX`, unit stays 3 |
| Clouds vs headings | Clouds ride just under the header on every size; no overlap with eyebrow or H1 on `/projects` |
| Favicon | `app/icon.png` (golden apple, 64 px) and `app/apple-icon.png` serve 200; fixes the Lighthouse best-practices favicon 404 |
| Vitest / tsc / eslint | 14 tests pass; tsc clean; eslint 0 problems |
| Console | No errors at either viewport |
| Still not verifiable here | Real iOS/Android touch hardware; the physical macOS Reduce Motion switch (emulated only) |

### 2026-11-03: tree v2 (196×176, more branches and greenery)

- Type-check, lint, and 16 Vitest tests pass.
- Playwright on /projects: 10 apples, no console errors, no horizontal scroll. The smallest hit target is 56px on desktop at 1440 and 44px on mobile at 390.
- All sign labels fit on their planks. On mobile at 390 the stage is 376px at unit 2.
- Home preview card on mobile: caption moved below the tree so it no longer covers the Hackathons sign. On 342px cards the tree is cropped slightly at both edges, since unit 2 needs 392px.

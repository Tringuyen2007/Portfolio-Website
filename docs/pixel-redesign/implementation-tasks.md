# Implementation tasks — Pixel Orchard

Order matters; each task is independently verifiable. Tasks marked (S) can be given to a subagent in parallel once T1–T3 land.

| # | Task | Files | Done when |
|---|---|---|---|
| T1 | Install `pixi.js`, add `scripts/pixel` → `public/pixel/` build (`npm run build:pixel`) | `package.json`, `scripts/pixel/build.mjs` | `public/pixel/*.png` exist at 1× |
| T2 | Palette + fonts: map Pixel Orchard tokens into `app/globals.css`; load Pixelify Sans + Press Start 2P via `next/font`; retire Fraunces from headings | `app/globals.css`, `app/layout.tsx` | Headings render in Pixelify Sans; `--ench` tokens exist |
| T3 | Content model: `enchanted` field, `apple` derivation, build-time guard; update `vision.mdx` award/event/article link | `content-collections.ts`, `content/projects/vision.mdx`, `lib/tree/types.ts` | Build fails if a second project sets `enchanted: true` |
| T4 | **PixelSky** persistent island + template crossfade | `components/pixel/pixel-sky.tsx`, `lib/pixel/*`, `app/layout.tsx`, `app/template.tsx` | Clouds keep drifting across route changes; ticker pauses when hidden |
| T5 | **OrchardStage**: tree, apples, signs, hover/dim, DOM overlay buttons | `components/pixel/orchard-stage.tsx` | Keyboard + mouse + touch reach every apple; positions match `tree-apples.json` |
| T6 | Apple preview shell + 2-frame scenes (S) | `components/pixel/apple-preview.tsx`, `scene.tsx` | 10 scenes loop; enchanted shows article hint |
| T7 | Zoom transition retarget (S) | `components/transitions/zoom-provider.tsx` | Integer-step zoom, back path works, watchdog intact |
| T8 | Home: About Me section, tree preview card, Growth Rings, contact, quote restyle (S) | `app/page.tsx`, `components/home/*` | Matches Figma 01/02 |
| T9 | Project detail, Experience, Contact restyle (S) | `app/projects/[slug]`, `app/experience`, `app/contact`, components | Matches Figma 07/08/09 |
| T10 | Mobile: 3 px unit, bottom-sheet preview, nav menu (S) | same as T5/T6 + `site-header.tsx` | Matches Figma 10a–f at 390 px |
| T11 | OG images in the new palette; 404 | `app/**/opengraph-image.tsx`, `app/not-found.tsx` | Renders |
| T12 | Tests (Vitest): layout determinism, apple classification guard, reduced-motion paths | `tests/*` | `npm test` green |
| T13 | Perf + a11y pass: Lighthouse ≥ 90 perf/a11y on `/` and `/projects`, bundle delta ≤ 160 kB gz | — | Numbers recorded in `testing-plan.md` |

Out of scope until content arrives: real gallery photos, final quote, exact event dates.

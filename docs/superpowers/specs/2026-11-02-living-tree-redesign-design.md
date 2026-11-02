# Living Tree redesign — design spec

Date: 2026-11-02. Branch: `new-ui`. Supersedes the unapproved "Night City" spec of the same date.

## 1. Audit of the existing site

**Stack.** Next.js 16 (App Router), React 19, Tailwind 4 (`@theme inline` tokens in `app/globals.css`),
content-collections + MDX for projects (`content/projects/*.mdx`, zod schema in `content-collections.ts`),
framer-motion 12, lucide-react. Static rendering, sitemap/robots/OG images, JSON-LD on home and project pages.

**Pages.** `/` (hero + 2 text previews), `/projects` (3D ring carousel, desktop; conveyor, mobile),
`/projects/[slug]` (MDX case study with "Quick read" aside), `/experience` (hardcoded array, vertical timeline),
`/contact` (3 cards), `/resume` (PDF iframe over floating photos). Header with 4 nav items, footer.

**Strong, keep.**
- Content model: typed MDX frontmatter + body is already the single source of truth for projects. Extend it, don't replace it.
- SEO scaffolding: metadata template, canonical URLs, per-project OG image route, JSON-LD, sitemap.
- Typography pairing: Fraunces (display, with SOFT/WONK axes) + Geist + Geist Mono. Fraunces is already botanical/organic in feel. Keep.
- `Container`, `ScrollReveal`, `JsonLd`, `IntroOverlay`, `template.tsx` page fade, reduced-motion handling in CSS.
- Ten hand-drawn SVG project cover arts (`components/project-art/*`) that use CSS tokens. These become the preview images.
- Real content: 10 projects with 4 verified awards (Mira 1st Overall + MLH Best Use of Tiger Data at CodeRED Orion; Radar 1st Best UI/UX + 2nd GoDaddy ANS at VTHacks 14; LarpCity Capital One track at HackRice; Vision nationally recognized by UTSA news). 3 experiences.

**Weak, replace.**
- Neutral charcoal palette with gray accent reads as default dark mode and has no connection to identity.
- 3D carousel: only ~3 of 10 projects legible, awards hidden, requires drag. Replaced by the tree + an accessible list.
- Home shows two projects as text cards. No About, no experience preview, no tree, no closing.
- Experience page: identical bullets per role, data lives inside the page component.
- Contact and Resume are separate pages; the spec wants one Contact & Resume destination.
- `StarField` renders 70 absolutely positioned spans in the root layout on every page.
- No image galleries, no project-level gallery data, no categories/branches, no achievement flags.

**Missing content / assets (user input needed, non-blocking).**
- Project photo folders (gallery). The system is built; `content/projects/<slug>/gallery/` is empty until provided.
- A real quote (placeholder "Tri quote in progress" is used as instructed).
- Dates/locations for hackathon events beyond year. Only year is shown unless the MDX supplies `date`.
- Category of each project is inferred from existing content (see §6) and flagged for confirmation.

## 2. Creative direction: "Dusk Orchard"

A warm, dark ground so the tree's fruit glows like lanterns, but every hue is natural: bark, moss,
cream paper, apple red, leaf green, and a restrained gold reserved for achievements.

Tokens (replace values in `app/globals.css`, keep the token names so every component keeps working):

| token | value | role |
|---|---|---|
| `--bg` | `#101410` | deep moss-ink ground |
| `--bg-elevated` | `#171c16` | surfaces |
| `--bg-soft` | `#1f2620` | pills, code |
| `--border` | `#2b3429` | hairlines |
| `--text-primary` | `#f1ead8` | cream |
| `--text-secondary` | `#b8b19b` | |
| `--text-muted` | `#7f7b68` | |
| `--accent` | `#d9b55a` | warm gold (buttons, focus) |
| `--accent-strong` | `#f0d27a` | |
| `--leaf` | `#6f9a5a` | leaf green |
| `--leaf-deep` | `#3f5d38` | |
| `--bark` | `#6b4a36` | trunk |
| `--bark-deep` | `#3b2a1f` | |
| `--apple` | `#c8463c` | ripe fruit |
| `--apple-deep` | `#8e2f2a` | |
| `--gold` | `#e9c35c` | golden apple |
| `--gold-deep` | `#a9822a` | |

Typography stays Fraunces + Geist + Geist Mono. Headlines use Fraunces at `opsz` large with slightly
negative tracking; eyebrows use Geist Mono uppercase. Motifs: hairline rules, small mono labels,
leaf/seed glyphs as section ornaments, organic rounded corners (1.6rem) on surfaces.

Background: the star field is replaced by a `GroundGlow` (static CSS radial gradients: warm horizon
at the bottom, cool moss at the top) plus a very sparse firefly layer on the tree page only.

## 3. Site map

| route | purpose |
|---|---|
| `/` | Hero → About → Experience preview → Tree preview → Contact invitation → Closing quote |
| `/experience` | Editorial timeline from `content/experience.ts` |
| `/projects` | The tree (Projects & Events) + legend + accessible list |
| `/projects/[slug]` | Case study |
| `/contact` | Contact & Resume (email, GitHub, LinkedIn, resume preview + download) |
| `/resume` | Redirects to `/contact#resume` so old links keep working |

Nav: Home · Experience · Projects & Events · Contact & Resume. All plain links.

## 4. Tree rendering approach

**Decision: layered 2D SVG, generated from data, no WebGL.**

Rejected: Three.js (bundle, mobile GPU, accessibility of fruit controls), Canvas (fruits would need a
custom hit-test layer and lose native focus/ARIA), hand-drawn static illustration (does not grow).

Architecture:
- `lib/tree/layout.ts` is a pure function `buildTreeLayout(projects, branches, viewport) → TreeLayout`.
  Trunk is a fixed cubic path. Each branch in `content/branches.ts` has a `side` (left/right), an `order`,
  a base `angle`, and a `length` factor. The branch path is a cubic Bézier from its trunk attachment
  point. Sub-twigs are derived deterministically from a seeded PRNG (`mulberry32`, seed = hash of branch id).
- Fruits are placed at parameter `t` along their branch (or twig). `t` is assigned by sorting the branch's
  projects by date and spreading them in `[0.45, 0.95]`, with a per-fruit offset from the seeded PRNG.
  A project can pin itself with optional `tree: { branch, t, side }` frontmatter. A minimum-distance pass
  nudges fruits apart (deterministic, iterative) so no two interaction targets overlap (≥ 56px at desktop
  scale, ≥ 44px CSS at mobile).
- Leaves are clusters of 3–5 ellipses at each twig end, colored from `--leaf` / `--leaf-deep`.
- Fruit types render as `<g>` with a `<circle>`/apple path and a radial gradient:
  `golden` (award), `ripe` (completed), `green` (in progress), `blossom` (event participation / milestone).
- The SVG uses `viewBox="0 0 1200 900"` on desktop and a taller `0 0 720 1100` portrait framing on mobile
  (`<md`), so the whole tree stays readable without panning. Branch labels sit at branch ends.
- Ambient motion: CSS keyframes (`sway`) on branch groups with `transform-origin` at their base, tiny
  amplitude (0.6–1.2°), staggered durations; leaves use a second slower keyframe. Paused with
  `animation-play-state` when an IntersectionObserver reports the tree offscreen, when
  `document.hidden`, or under reduced motion.

Every fruit is a `<button>` inside a `<foreignObject>`? No: foreignObject is unreliable in Safari for
focus. Instead each fruit is an SVG `<g role="button" tabIndex=0 aria-label=…>` with key handlers, and
the hidden `TreeProjectList` below provides the semantic, screen-reader-first path.

## 5. Apple-shaped hover preview

`components/tree/fruit-preview.tsx`, a client component rendered once per tree in a portal.

- State machine in `useFruitPreview`: `closed → opening(slug) → open(slug) → closing`. Only one slug.
  Hover intent: open after 80ms, close after 160ms grace, cancelled if the pointer enters the preview.
  A second fruit hover during `open` swaps content in place (no close/open flicker).
- Position: anchored to the fruit's screen rect (from `getBoundingClientRect` on the SVG `g`), placed to
  the side with the most room, clamped to the viewport with 16px padding, flipped if needed.
- Shape: a 220×240 apple-inspired silhouette via SVG `clipPath` (`clip-path: url(#apple-clip)`) applied to
  a positioned div; a stem/leaf ornament drawn outside the clip. Inner content lives inside a safe inset
  that is a plain rounded rectangle (readability over strict silhouette).
- Content: title (Fraunces), the project cover art (SVG art, 120px tall), award line (only if present),
  one sentence (`summary` clamped to 2 lines), "Click to explore" with arrow. Golden variant: gold border
  gradient and a gold award chip; no particles.
- Grows out of the fruit: `transform-origin` set to the fruit's side, scale 0.6→1, opacity, 220ms, custom
  ease. The hovered fruit itself scales 1→1.12 and lifts 4px; adjacent leaf cluster gets a 1° nudge.
- Touch: `pointerType === "touch"` → first tap opens preview with an explicit "Explore" button; tap outside
  closes; second tap on the fruit or the preview navigates.
- Keyboard: focus opens the preview; Enter/Space activates; Escape closes.

## 6. Data model

`content-collections.ts` project schema gains:

```
category: enum["software", "ai-ml", "hackathon", "research", "leadership"]
fruit: enum["golden", "ripe", "green", "blossom"]  (default "ripe"; "golden" if award set)
award?: string              (verified achievement line; replaces `highlight`)
status: enum["completed", "in-progress", "ongoing"] (default "completed")
date?: string               (ISO; year remains required)
role?: string
event?: string              (e.g. "VTHacks 14")
location?: string
team?: string[]
gallery?: { src, alt, caption?, width?, height? }[]
links?: { label, href, kind: "github"|"devpost"|"live"|"article"|"other" }[]
tree?: { branch?: string, t?: number, side?: "left"|"right" }
```

Legacy `repo`, `liveUrl`, `articleUrl`, `highlight` are kept and mapped into `links`/`award` by a transform
so no MDX needs to be rewritten today.

`content/branches.ts`: ordered branch definitions (id, label, side, angle, categories[]).

`content/experience.ts`: typed experience entries (org, role, start, end, location, summary, bullets,
tech, achievements, links, images). The current three roles move here verbatim.

Project→branch mapping (from existing content, to confirm):
Hackathons: Mira, Radar, LarpCity, Stochastic, CarbonLens, DataFest 2026. AI/ML: Vision, Vending Machine
Robot. Software: Leanify, Personal Website. Research and Leadership branches exist but hold no fruits yet;
they render as shorter young branches with leaves only, so the tree visibly has room to grow.

Gallery images: `public/projects/<slug>/*.{jpg,png,webp}` referenced from `gallery` frontmatter. A script
`scripts/gallery-manifest.mjs` prints frontmatter entries for a folder so adding images is copy-paste.

## 7. Transitions

**Decision: framer-motion overlay choreography + Next router, with sessionStorage return context.**
The View Transitions API is not yet reliably available with Next 16 App Router streaming and would make
the zoom depend on browser support. The overlay works everywhere and degrades to a fade.

- `components/transitions/zoom-provider.tsx` holds a fixed-position `ZoomStage`. `zoomTo(rect, target, kind)`
  renders a clone (fruit art or the tree thumbnail) at `rect`, animates it to the destination hero rect
  (full-width hero band for projects; viewport for the tree), dims the page beneath, then calls
  `router.push`. The destination hero has `data-zoom-target` so the overlay can measure it after mount and
  cross-fade out. Timeline is 650ms; interruption: any new `zoomTo` or `popstate` cancels the running one
  and clears the stage; a watchdog clears the stage 1.5s after push regardless.
- Return: project page "Back to the tree" calls `zoomTo` in reverse with the stored slug. `/projects` reads
  `sessionStorage.tree:lastSlug` and `tree:scrollY`, restores scroll, and pulses the fruit once.
- Home tree preview → `/projects` uses the same stage with `kind: "tree"`.
- Reduced motion: `zoomTo` just pushes. Direct links work because the stage is only shown on `zoomTo`.

## 8. Mobile

Portrait tree framing; fruits ≥ 44px targets; tap model from §5; branch chips above the tree filter/highlight
a branch; `TreeProjectList` is always rendered under the tree as a grouped list with the same links.
Home sections stack; preview tree is non-interactive on mobile (whole card is one link).

## 9. Phases

1. Tokens, GroundGlow, header/footer, routes, Contact & Resume merge, Experience data + page.
2. Data model extension + branches + layout engine with unit tests.
3. Tree SVG, fruit types, legend, ambient motion, mobile framing, project list.
4. Fruit preview (hover/touch/keyboard).
5. Case study layout, gallery with lightbox, links.
6. Zoom transitions, return context.
7. Home sections (hero, about, experience preview, tree preview, contact, quote).
8. Polish, lint, build, viewport QA in Chrome.

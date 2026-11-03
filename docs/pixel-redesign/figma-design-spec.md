# Figma design spec — Pixel Orchard

Date: 2026-11-02. File: https://www.figma.com/design/jgsrovejIgPYeFI9yfjSPW, page **"02 Direction — Pixel Orchard"** (node `16:2`).
Everything below was built with the Figma MCP Plugin API in this session and screenshot-checked. Nothing is implemented in code yet.

## Frames

| # | Frame | Node | Size | What it shows |
|---|---|---|---|---|
| 00 | Pixel Orchard — Components & Tokens | `19:456` | 1440×2200 | Variable swatches, type scale, Button/Chip/Apple/Preview variant sets, Panel, Sign, environment sprites, timeline entry, gallery tile, mobile controls, all 10 project scenes |
| 01 | Homepage — Hero | `18:2` | 1440×900 | Night sky, moon, clouds, name in Pixelify Sans, intro, 3 buttons, tree on the horizon |
| 02 | Homepage — Scrolled | `19:2` | 1440×3180 | About Me (portrait in pixel frame, stat panels), Projects & Events intro + tree preview card, Growth Rings preview, Contact invitation, closing quote placeholder, footer |
| 03 | Tree Explorer | `18:45` | 1440×1100 | Full tree, 10 apples at data-driven positions, 5 wooden branch signs, filter chips, counts (10 / 3 / 1), legend |
| 04 | Standard Apple Hover — Mira | `20:108` | 1440×1100 | Mira selected (×1.25, lifted), golden apple-shaped preview with pixel scene, award line, summary, "CLICK TO EXPLORE" |
| 05 | Enchanted Golden Apple Hover — Vision | `20:217` | 1440×1100 | Vision selected with shimmer frame, purple glow, enchanted shell, "RED BULL BASEMENT 2026 · U.S. NATIONAL FINALIST", article hint |
| 06 | Apple Zoom Transition — Storyboard | `20:2` | 1440×680 | 5 states with timings: default → selected → focus → enlarge → project page |
| 07 | Project Detail — Mira | `18:142` | 1440×2200 | Hero band (award chip, title, summary, repo button, scene art), facts row, MDX body, stack aside, gallery, back/next |
| 08 | Experience | `18:240` | 1440×2196 | Pixel vine timeline, 4 roles, skills grid |
| 09 | Contact & Resume | `18:417` | 1440×1400 | Email/GitHub/LinkedIn panels, resume embed + download |
| 10a–f | Mobile (390) | `19:140` `19:199` `19:276` `19:321` `19:371` `19:423` | 390 wide | Home, Tree Explorer, Apple preview (bottom sheet), Enchanted preview, Project detail, Navigation open |

Prototype flows (set as `flowStartingPoints`): **Desktop** Home → Tree Explorer → hover Mira (04) → click → Project Detail → back; hover Vision → 05. **Mobile** Home → Tree → tap Mira → sheet → Explore → Project → back; scrim tap dismisses.

## Tokens (variable collection "Pixel Orchard", 39 colors)

| Group | Names | Values |
|---|---|---|
| sky | sky/0..4, sky/haze | #0a0e24 #111737 #1b2048 #2a2a5c #3a3470 #4b4280 |
| moon | moon/base, hi, lo | #f4e7a1 #fff8d2 #d9c673 |
| cloud | cloud/base, hi, lo, shadow | #cfcbe9 #f1eefc #9d96cc #7a72ad |
| ground | grass, grass-hi, grass-lo, soil | #2f5a3a #3f7a48 #1e3a2a #3b2a1f |
| bark | bark/base, hi, lo, edge | #5a3a24 #7a5234 #3b2416 #241409 |
| leaf | leaf/base, hi, lo, deep | #3f8a46 #5fb35a #2f6b3a #1e4a2a |
| apple | red / red-hi / red-lo; gold / gold-hi / gold-lo; ench / ench-hi / ench-lo | #d9403f #f07a6a #8e1f26; #e9b63a #ffd95a #a8771a; #b25ee8 #e3a6ff #6a2f9c |
| ui | ink, cream, mute, panel, panel-hi, panel-edge | #1a1428 #f3ead6 #a79f8f #161a2f #2b3058 #4a4f80 |

Mapping onto the existing CSS tokens in `app/globals.css`: `--bg`→sky/0, `--fg`→ui/cream, `--muted`→ui/mute, `--accent`→apple/gold, `--apple`→apple/red, `--gold`→apple/gold, `--leaf`→leaf/base, `--bark`→bark/base, `--surface`→ui/panel, `--line`→ui/panel-edge. New: `--ench` family.

## Type

| Role | Font | Sizes |
|---|---|---|
| Display / headings / buttons | Pixelify Sans Bold / Medium | hero 132, H1 60, H2 48, entry 34, button 18 |
| Labels, eyebrows, badges, signs | Press Start 2P | 7–12, uppercase only, never body copy |
| Body | Pixelify Sans Regular | 15–17, line-height 1.6–1.7 |
| Meta / timings / counts | Pixelify Sans | 10–12 |

Fraunces is retired from headings. Update 2026-11-03: at the owner's request, Geist was dropped and body copy now uses Pixelify Sans too, so the whole site is one pixel family. Pixelify Sans and Press Start 2P are Google Fonts and can be loaded the same way (subset latin, `display: swap`).

## Scale and spacing

- 1 art pixel = 4 CSS px on desktop, 3 on mobile. All sprite sizes are multiples of this unit. No corner radii; borders are 1 art px; panels get a 1 art px top highlight.
- Tree art is 128×148 art px (512×592 desktop, 384×444 mobile). Apples are 12×12 art px (48 / 36 px). DOM hit targets are ≥44 px regardless.
- Page grid: 1440 canvas, 64 px gutters, 1312 content width. Mobile 390 with 20 px gutters.
- Section rhythm: 2 px `ui/panel-edge` rule between sections, 60–80 px vertical padding.

## Components (Figma variant sets)

- **Button** kind=primary|secondary × state=default|hover|focus|pressed. Hover lightens fill one step (no scaling). Focus: gold-hi stroke. Pressed: label nudges 1 art px.
- **Chip** state=default|active (branch filters and stack chips).
- **Apple** kind=red|golden|enchanted × state=default|hover|dimmed. Hover: ×1.25 + 4 px lift, 2-frame snap. Dimmed 40% when another branch is active.
- **Preview** kind=red|golden|enchanted. 300×320 apple-shaped shell; content inset is a plain rectangle (title, 128×96 scene, award line, 2-line summary, cursor hint). Enchanted adds purple glow + "READ THE ARTICLE ↗".
- **Panel**, **Sign**, **Timeline entry**, **Gallery tile**, **Mobile sheet handle**, **Menu button**.

## Interaction rules carried over from the current site

Preview opens 70 ms after hover intent and closes after a 170 ms grace; moving between apples swaps the preview in place. Touch: first tap previews, second tap opens; tapping the scrim closes. Keyboard: Tab focuses apples (DOM overlay buttons), Enter opens, Esc closes. Reduced motion: no zoom, direct navigation. These are the exact rules already in `components/tree/tree-stage.tsx` and `zoom-provider.tsx`; the redesign reuses them.

## Apple → project transition (frame 06)

| State | Time | Behaviour |
|---|---|---|
| 1 Default | 0 | Tree idle; apples sway 1 px; fireflies drift |
| 2 Selected | hover, 120 ms | Apple lifts 4 px and scales ×1.25; preview grows from it |
| 3 Focus | 0–250 ms | Preview closes; sky dims to 60%; camera pans + zooms so the apple is centred |
| 4 Enlarge | 250–600 ms | Apple scales to ×24 nearest-neighbour; `router.push` at 250 ms; hero pre-rendered beneath |
| 5 Project page | 600–900 ms | Apple settles into the hero award chip; back reverses |

## Assets

Source sprites: `scripts/pixel/sprites.mjs`, `scenes.mjs`, `procedural.mjs`; renders in `designs/pixel/renders/` (build with `node scripts/pixel/build.mjs designs/pixel/renders 8`). Figma image hashes: `designs/pixel/renders/figma-hashes.json`. Apple placement data: `designs/pixel/renders/tree-apples.json`.

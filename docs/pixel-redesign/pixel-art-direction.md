# Pixel art direction — Pixel Orchard

## Mood

A quiet orchard at night. Deep indigo sky banded in five tones with ordered-dither transitions, a soft yellow moon with a two-ring glow, slow parallax clouds in three sizes, and one large fruit tree on a strip of grass. The feeling is calm and slightly playful, closer to a cozy farming game than an arcade. Nothing flashes; the only sparkle in the whole scene belongs to the enchanted apple.

## Palette

The 39-colour "Pixel Orchard" palette lives in `scripts/pixel/palette.mjs` and as Figma variables. Rules:

- Every sprite uses only palette colours. No gradients inside sprites; shading is 3 tones (base / hi / lo) plus an outline.
- Outlines are `bark/edge` (#241409) for organic things and `ui/ink` for UI. The sky has no outlines.
- Apples: red for projects, gold for verified awards, purple-rimmed gold for the one enchanted apple. The red and gold apples share the same 12×12 silhouette (stem + leaf, Minecraft-style stepped body) so they read as one family.
- Photos are never pixelated. Portrait and gallery images sit inside pixel frames with real image fills.

## Sprites

| Sprite | Art px | Notes |
|---|---|---|
| apple red / golden / enchanted | 12×12 | Enchanted = golden + purple rim rows + 3-frame sparkle sheet (220 ms/frame) |
| leaf | 6×6 | Ornament and timeline node |
| cloud s / m / l | 16×6, 24×8, 36×10 | Three parallax layers: 16 / 10 / 6 px/s |
| moon + glow | 28×28 | Static; glow rings at 20% and 10% |
| tree | 196×176 | `procedural.orchardTree()` (seed 5): trunk and five branches, each with twig forks and its own leaf clusters so branches read separately. Research and Community are young branches in spring green with blossoms. Wooden sign planks and ropes are baked in. Apple slots and sign positions are written to `tree-anchors.json`; DOM labels sit on the planks |
| ground | 360×14 | Grass with blade noise, soil below (tree explorer only) |
| cloud bank back / mid / front | 192×44, 160×40, 128×36 | Tileable hero bottom edge; puffs shaded hi/lo, bottom rows Bayer-dithered to transparent |
| sign plank | 28×10 | Wooden sign per branch, Press Start 2P label |
| panel 9-slice | 12×12 | 1 px edge + 1 px highlight |
| preview shells | 60×64 | Apple silhouette in red / gold / enchanted tone |
| cursor | 7×9 | Hint icon only |
| vine tile | 8×16 | Repeats vertically for the experience timeline |
| project scenes | 32×24, 2 frames | One per project (see `project-visual-mapping.md`) |

## Animation vocabulary

- **Idle:** apples sway ±1 px on a 3 s sine, each with a phase offset; leaves do not move. Fireflies are 1 px dots that fade in/out over 4–6 s, max 8 on screen.
- **Clouds:** wrap horizontally, integer-pixel steps, never sub-pixel (keeps the art crisp). They ride just under the header so they never cross headings.
- **Hero cloud bank:** three layers drift sideways (160 s / 95 s / 55 s per tile, middle layer reversed, `steps()` so motion stays on the pixel grid) and rise at different rates as the hero scrolls away (40 / 110 / 220 px), so leaving the hero feels like sinking into the clouds.
- **Hover:** 2-frame snap to ×1.25 + 4 px lift. No easing curves on sprites; easing only on DOM UI.
- **Enchanted:** sparkle sheet loops; glow ellipse pulses opacity 0.20–0.35 on a 2.4 s cycle.
- **Scenes:** two frames at the loop interval listed per project (600–1000 ms).
- **Reduced motion:** sway, fireflies, cloud drift, sparkle, scene loops all stop; hover still snaps (instant).

## Rendering rules

- Nearest-neighbour everywhere: Pixi `TextureSource.scaleMode = "nearest"`, CSS `image-rendering: pixelated` on any `<img>` sprite.
- Integer scale factors only (4 desktop, 3 mobile); the world container is scaled, individual sprites are not.
- Position sprites on whole art pixels; round camera offsets to the unit.
- Sky is one pre-rendered texture per breakpoint (`sky-desktop`, `sky-mobile`), stars included; the moon and clouds are separate sprites so they can parallax.

## Typography inside the world

All text is pixel type (owner's request, 2026-11-03): Pixelify Sans for headings and body, Press Start 2P for tiny labels. Text stays in the DOM layer above the canvas.

## Accessibility

The canvas is decorative (`aria-hidden`). A DOM overlay places one `<button>` per apple at its projected position with the project title as the accessible name; the existing list view below the tree remains the primary accessible path. Contrast: cream on sky/0 is 14:1, mute on panel 6.2:1, ink on gold 8.9:1.

## The gardener (added 2026-11-03)

A chibi Tri, drawn from the pixel portrait (messy dark hair, closed happy eyes, big grin, earrings, black shirt), lives on the grass just right of the trunk. `scripts/pixel/gardener.mjs` composes every frame from parts (head, torso, legs, arm paths, props), outlines it like the other sprites, and writes `gardener.png` (4 frames × 6 rows of 32×28) plus `gardener.json`. Activities: sleep (Zzz), water (can pours onto the roots), dance (music notes), and a random snack: rice with chopsticks, sushi, or a protein shake. `components/pixel/gardener.tsx` picks a new activity every 6–13 s and pauses while the tab is hidden; reduced motion shows him napping. He is decorative (`aria-hidden`).

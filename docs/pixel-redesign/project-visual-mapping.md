# Project visual mapping

Source of truth for facts: `content/projects/*.mdx` (no facts invented here). Apple type rule: `red` = project or hackathon build, `golden` = project with a verified `award`, `enchanted` = Vision only (`enchanted: true`, enforced at build time; any other slug fails the build).

Scenes are 32×24 art px, two frames, defined in `scripts/pixel/scenes.mjs`; renders in `designs/pixel/renders/scene-<slug>-f{0,1}.png`.

| Project | Category | Apple | Award / event (from MDX) | Scene (frame 0 → frame 1) | Loop | Links | Status |
|---|---|---|---|---|---|---|---|
| Vision | ai-ml | **enchanted** | Red Bull Basement 2026 · U.S. National Finalist (top 15) — verified via UTSA news; MDX currently says "Nationally Recognized · UTSA News" and should be updated | Blueprint grid with a parcel; wireframe house → built house | 900 ms | repo, UTSA article | Rendered, in Figma |
| Mira | hackathon | golden | 1st Overall · MLH Best Use of Tiger Data — CodeRED Orion | Webcam frame with pose skeleton; squat down → up, rep bar fills, heart beats | 700 ms | repo | Rendered, in Figma |
| Radar | hackathon | golden | 1st Place Best UI/UX · 2nd GoDaddy Best Use of ANS — VTHacks 14 | House with Wi-Fi arcs; shutter closed → open revealing lens | 800 ms | repo | Rendered, in Figma |
| LarpCity | hackathon | golden | Capital One Track Winner — HackRice | Isometric city blocks; coin bobs, windows flicker | 800 ms | repo | Rendered, in Figma |
| CarbonLens | hackathon | red | EcoHack 2026 | Skyline with smoke; gauge needle swings | 900 ms | repo | Rendered, in Figma |
| DataFest 2026 | hackathon | red | DataFest 2026 at SMU | Hospital + bar chart; bars grey → coloured | 1000 ms | repo | Rendered, in Figma |
| Stochastic | hackathon | red | Cal Hacks 13.0 | Two ledgers merge; flagged line blinks | 800 ms | repo | Rendered, in Figma |
| Leanify | software | red | — | Phone with macro bars; L/M/H week toggles | 900 ms | repo | Rendered, in Figma |
| Vending Machine Robot | ai-ml | red | — (2025) | Robot blinks, antenna light, wheels turn | 600 ms | repo | Rendered, in Figma |
| Personal Website | software | red | — (ongoing) | Browser window with a tree; apple ripens, cursor moves | 1000 ms | repo | Rendered, in Figma |

Counts shown in the explorer: 10 apples, 3 golden, 1 enchanted. Branch counts: Hackathons 6, AI/ML 2, Software 2, Research 0, Community 0 (young branches keep their signs with no apples).

## Required content change (after approval)

`content/projects/vision.mdx`: set `award: "Red Bull Basement 2026 · U.S. National Finalist"`, `event: "Red Bull Basement 2026"`, `enchanted: true`, and add the UTSA article URL under `links`. `content-collections.ts`: add `apple` derivation and the enchanted guard.

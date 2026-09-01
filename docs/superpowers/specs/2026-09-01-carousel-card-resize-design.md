# Desktop project carousel: responsive, shorter cards

## Problem

On desktop (`lg:` and up), `/projects` renders `CarouselRing`, a 3D rotating
carousel of fixed-size cards (`CARD_WIDTH = 340`, `CARD_HEIGHT = 560`, plus a
perspective projection that renders the front-facing card even larger). Combined
with the page header and site chrome (80px sticky nav, page title block, footer),
the total page height exceeds the viewport on most laptop screens, forcing users
to scroll down to see the full carousel.

## Goal

Resize the desktop carousel cards so the full carousel plus page chrome fits
within the viewport with no vertical scrolling on common desktop/laptop heights
(900px+ viewport height — covers 1440x900, 1512x982, 1920x1080, external
monitors), and minimizes scrolling as much as possible on shorter ~768px-tall
laptop windows via fluid sizing rather than a fixed breakpoint jump. Zero-scroll
on every conceivable desktop height (some report as little as ~650px usable) is
not a goal — cards must stay readable.

Scope: desktop `CarouselRing` path only. The mobile/tablet `HorizontalScrollList`
already scrolls horizontally and isn't affected by this problem; it is not a
target of this change, though it shares the `ProjectCard` component so its
content-density tweaks (item 3 below) apply there too as a harmless side effect.

## Design

### 1. Fluid card sizing — `components/project-carousel/carousel-ring.tsx`

Replace the hardcoded `CARD_WIDTH` / `CARD_HEIGHT` constants with a
`useCardSize()` hook (new file: `components/project-carousel/use-card-size.ts`)
that:

- Reads `window.innerHeight` on mount and on resize (rAF-debounced)
- Computes `cardHeight = clamp(280, viewportHeight * 0.34, 420)` (px)
- Computes `cardWidth = cardHeight * 0.78` (wider aspect than today's ~0.61,
  per "wider and smaller")
- Returns `{ cardWidth, cardHeight }`, defaulting to a fixed SSR-safe value
  (`{ cardWidth: 296, cardHeight: 380 }`) before the client effect runs, to
  avoid a hydration mismatch / layout flash

`CarouselRing` and `CarouselItem` consume these values instead of the module
constants; all existing radius/perspective/wrapperHeight math is unchanged,
just fed responsive inputs instead of fixed ones.

### 2. Reclaim page chrome — `app/projects/page.tsx`

- `py-18 sm:py-24` → `py-10 sm:py-14`
- Title `text-4xl sm:text-5xl` → `text-3xl sm:text-4xl`
- `space-y-10` → `space-y-6` between the title block and the carousel

### 3. Tighten card content density — `components/project-card.tsx`

- Image aspect `aspect-[4/3]` → `aspect-[16/10]`
- `p-6` → `p-5`, `space-y-5` → `space-y-4`
- Summary `line-clamp-3` → `line-clamp-2`
- Title `text-xl` → `text-lg`

## Testing

No existing automated tests cover this component. Verification is manual:
run the dev server, load `/projects` at representative desktop viewport
heights (768px, 900px, 1080px) via browser devtools responsive mode, and
confirm:

- No vertical scroll needed at 900px+ heights
- Carousel remains legible and the rotation/wheel-scrub interaction still
  works correctly at the new sizes
- Mobile (`HorizontalScrollList`) still renders correctly with the shared
  `ProjectCard` density changes
- No hydration warnings in the console on initial load

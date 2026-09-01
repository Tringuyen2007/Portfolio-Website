# Horizontal spin control, full-page viewport lock, and 2D mobile conveyor

## Problem

Two follow-on requests on top of the previous responsive-card-resize work:

1. The desktop 3D carousel's manual spin control currently reads vertical wheel
   scroll (`event.deltaY`). The user wants this to be a horizontal gesture
   instead, matching the ring's left-right visual motion.
2. The `/projects` page should never require vertical scrolling, on any
   device (desktop and mobile) — the whole page (nav, title, carousel/card
   area, footer) should be locked to exactly one viewport-height screen.
   Today only the desktop card size adapts to the viewport; the page itself
   can still grow taller than the viewport and require scrolling, and mobile
   has no such constraint applied at all.

Additionally, mobile currently shows a static, swipeable horizontal list of
cards (`HorizontalScrollList`). The user wants mobile devices (motion-safe)
to instead show a flat, continuously auto-scrolling 2D "conveyor" of cards —
no 3D/perspective effect, just a horizontally moving strip that the user can
also grab and drag to browse manually.

## Goal

- Desktop ring: wheel-driven manual spin uses horizontal input
  (`deltaX`) instead of vertical (`deltaY`).
- `/projects` never vertically scrolls, on any device: the page is locked to
  `100dvh` with `overflow: hidden`, and all sections (header, title,
  carousel/conveyor area, footer) fit within that locked height via
  flexbox — no manually-tuned pixel budgets.
- Card/track sizing for every variant is driven by measuring the *actual*
  leftover space at runtime (`ResizeObserver`), not a viewport-height guess,
  so it stays correct through any layout change (e.g. the mobile nav menu
  opening).
- Mobile/tablet (motion-safe, below the `lg` breakpoint) gets a new flat 2D
  auto-scrolling conveyor (`MobileConveyor`) instead of the static list,
  with drag-to-browse support and seamless looping.
- `prefers-reduced-motion` users keep getting the existing static,
  non-auto-moving `HorizontalScrollList` on every screen size (this already
  happens today for desktop; it's preserved and now made explicit for
  mobile too), just resized to fit the locked page height like everything
  else.

## Non-goals

- No changes to the carousel's rotation/spin *speed* tuning beyond what's
  needed for the axis swap.
- No momentum/flick physics for the mobile conveyor's drag — drag follows
  the pointer 1:1, then idle auto-scroll resumes from wherever the drag
  ended. No inertia simulation.
- No changes to `ProjectCard`'s internal content/density (already tuned in
  the prior change).

## Design

### 1. Desktop spin axis — `components/project-carousel/carousel-ring.tsx`

The `handleWheel` listener currently reads `event.deltaY` to adjust
`extraSpeed`. Change it to read `event.deltaX` instead. No other change to
the decay/clamp logic.

### 2. Page-wide viewport lock

**New: `components/viewport-lock.tsx`** — a client component with no visual
output. In a `useEffect`, it adds a class (`viewport-locked`) to
`document.documentElement` on mount and removes it on unmount, so the lock
is scoped to the lifetime of whichever page renders it.

**`app/globals.css`** — new rule:

```css
html.viewport-locked {
  height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
}

html.viewport-locked body {
  height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
}
```

**`app/layout.tsx`** — `<main className="flex-1">` becomes
`<main className="flex-1 min-h-0">` (globally; harmless on pages that don't
lock the viewport, since `min-h-0` only matters when the flex container is
itself height-constrained).

**`components/site-header.tsx`** — the root `<header>` gains `shrink-0` (so
it never compresses below its natural size under the lock).

**`components/site-footer.tsx`** — the root `<footer>` gains `shrink-0` for
the same reason.

**`app/projects/page.tsx`** — renders `<ViewportLock />`, and restructures
into a flex column that fills whatever height `main` has: a `shrink-0`
title block (slightly smaller, since less vertical budget is available than
before) and a `flex-1 min-h-0` area containing `<ProjectsShowcase>`.

Because `body` is already `flex flex-col` (header → main → footer), capping
`html`/`body` height and marking header/footer `shrink-0` means flexbox
automatically gives `main` (and therefore the page's carousel area) exactly
the leftover space — no manual header/footer pixel accounting needed, and it
self-corrects live if the mobile nav menu opens (that changes header's
height, which flexbox immediately re-resolves).

### 3. Container-measured sizing (replaces viewport-height guessing)

**New: `components/project-carousel/use-element-size.ts`** — a generic
`ResizeObserver`-based hook: `useElementSize(ref: RefObject<Element | null>): { width: number; height: number }`,
SSR-safe (returns `{ width: 0, height: 0 }` before the client can measure).

**`components/project-carousel/carousel-ring.tsx`** — replaces the deleted
`useCardSize` hook. `CarouselRing` gets a new outer `containerRef` div
(`className="h-full min-h-0"`, sized purely by its flex-parent chain) that
wraps the existing perspective `wrapperRef` div. `useElementSize(containerRef)`
reports the real available height; a small fixed-point iteration (the ring's
own perspective projection makes its rendered footprint *larger* than the
raw card height, so solving for a card height that fits requires a few
iterations to converge) picks a `cardHeight` (and `cardWidth = cardHeight *
0.78`) such that the ring's rendered footprint fits the measured container.

**Deleted: `components/project-carousel/use-card-size.ts`** — its
viewport-fraction guess is fully superseded by the container-measured
approach above.

### 4. `MobileConveyor` — new flat, auto-scrolling mobile carousel

**New: `components/project-carousel/mobile-conveyor.tsx`** — client
component, same idle-speed-plus-decaying-extra-speed animation model as
`CarouselRing` (via Framer Motion `useMotionValue` + `useAnimationFrame`),
but driving a 2D `translateX` instead of a 3D `rotateY`:

- Renders the project list twice back-to-back (`[...projects, ...projects]`)
  in a single flex row (a "track"), each card sized by pure CSS
  (`h-full aspect-[0.78] shrink-0`, no JS math).
- An `offsetX` motion value drives `transform: translateX(offsetXpx)` on the
  track. Every frame (unless the user is actively dragging), it decreases by
  `IDLE_SPEED_PX + extraSpeed`, using the same decay formula as the ring.
- The track's true single-set width is measured via `useElementSize` on the
  track ref (unaffected by the container's `overflow: hidden`, since
  `ResizeObserver` reports the *content* box of the observed element, not
  what's visually clipped) — `singleSetWidth = trackWidth / 2`. Every frame,
  `offsetX` is wrapped back into `(-singleSetWidth, 0]`, so with two
  identical copies rendered, the loop is seamless (standard infinite-marquee
  technique) in both scroll directions.
- Pointer drag: `pointerdown` records the start position and current
  `offsetX`; `pointermove` sets `offsetX` directly to follow the finger
  1:1 once movement exceeds a 6px threshold (below that, it's treated as a
  tap, not a drag); a capturing `click` handler on the track suppresses the
  click (so it doesn't trigger the "Full details" link navigation) only if
  that threshold was crossed during the current pointer session.
- Respects `prefers-reduced-motion` by not running the idle-scroll frame
  loop — though in practice this component is never rendered at all under
  reduced motion, per the CSS switch below.

### 5. Three-way variant switch — `components/project-carousel/index.tsx`

Replaces the current two-way `motion-safe:` swap with an explicit
three-way, pure-CSS switch (Tailwind v4, which supports `max-*` variants
natively) — no JS media-query hook, no hydration flash:

```tsx
<div className="hidden h-full motion-safe:lg:block">
  <CarouselRing projects={projects} />
</div>
<div className="hidden h-full motion-safe:max-lg:block">
  <MobileConveyor projects={projects} />
</div>
<div className="hidden h-full motion-reduce:block">
  <HorizontalScrollList projects={projects} />
</div>
```

### 6. `HorizontalScrollList` resized for the locked layout

**`components/project-carousel/horizontal-scroll-list.tsx`** — still the
`prefers-reduced-motion` fallback on every screen size. Its row becomes
`h-full`, and each card wrapper becomes `aspect-[0.78] h-full shrink-0`
(replacing the current `w-[85%] max-w-sm shrink-0`) — pure CSS, no JS
measurement, consistent with the mobile conveyor's card sizing.

## Testing

No test framework exists in this repo (`lint`/`build`/`dev`/`start` only).
Verification is `npm run lint`, `npm run build`, and (where a browser is
available) manual checks:

- `/projects` never shows a vertical scrollbar, at representative desktop
  (1440×900, 1366×768) and mobile (390×844, 360×640) viewport sizes.
- Desktop: shift+scroll or a horizontal trackpad swipe visibly speeds
  up/reverses the ring's spin; vertical scroll no longer does.
- Mobile (motion-safe): the conveyor auto-scrolls continuously, loops
  seamlessly with no visible seam or blank gap, and dragging left/right
  follows the finger and doesn't trigger a project-link navigation; a plain
  tap on a card still navigates.
- Reduced motion (any screen size, via OS/browser setting or devtools
  emulation): the static `HorizontalScrollList` renders instead of either
  moving variant, and doesn't auto-scroll.
- No hydration warnings in the console.

## Accepted trade-offs

- A vertical-scroll-only mouse can no longer manually nudge the desktop
  ring's spin (only horizontal/trackpad input can); auto-rotation still
  runs regardless.
- On a genuinely tiny viewport, the carousel/conveyor area can compress
  toward very little space rather than ever producing a scrollbar — header
  and footer always render at full size; no scroll is prioritized over
  always showing a comfortably-sized carousel.
- The lock is applied via client-side `useEffect`, so there is a brief
  window before hydration where the page is technically still scrollable.
  Accepted as low-risk for a portfolio site.

## Process note

Per explicit instruction, this work is implemented directly on `main` and
**no git commits are made during implementation** — all changes are left as
uncommitted working-tree edits for the user to review and commit themselves.

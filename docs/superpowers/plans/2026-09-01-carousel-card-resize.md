# Desktop Carousel Card Resize Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the desktop 3D project carousel's cards responsively smaller so `/projects` fits within the viewport without vertical scrolling on common desktop heights (900px+), while keeping the rotation/wheel-scrub interaction intact.

**Architecture:** A new `useCardSize` hook measures `window.innerHeight` and derives a clamped, viewport-proportional card height/width, replacing the carousel's hardcoded pixel constants. The page header is trimmed to reclaim vertical space, and `ProjectCard`'s internal spacing/type scale is tightened so content still reads well in a shorter card. No new dependencies; no test framework exists in this repo (`package.json` has only `lint`/`build`/`dev`/`start`), so verification is `npm run lint`, `npm run build`, and manual browser checks at specific viewport heights.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion.

## Global Constraints

- Scope is the desktop `CarouselRing` path (`lg:` and up) plus the shared `ProjectCard` component and the `/projects` page header. Do not modify `HorizontalScrollList`.
- No test framework exists in this repo — verification is `npm run lint`, `npm run build`, and a manual dev-server check, not automated unit tests.
- Card sizing must remain SSR-safe: the hook must return a fixed default on first render (no `window` access during SSR) to avoid hydration mismatches.
- Work happens directly on `main` — no feature branch or worktree (explicit user instruction).
- Target: no vertical scroll on `/projects` at 900px+ viewport heights; minimize scroll as much as possible at ~768px viewport heights.

---

### Task 1: `useCardSize` hook

**Files:**
- Create: `components/project-carousel/use-card-size.ts`

**Interfaces:**
- Produces: `useCardSize(): { cardWidth: number; cardHeight: number }` — a React hook. Consumed by `CarouselRing` in Task 2.

- [ ] **Step 1: Create the hook**

```ts
"use client";

import { useEffect, useState } from "react";

const MIN_CARD_HEIGHT = 280;
const MAX_CARD_HEIGHT = 420;
const VIEWPORT_HEIGHT_RATIO = 0.34;
const CARD_ASPECT_RATIO = 0.78; // width / height

// SSR-safe default so the server-rendered markup matches the client's
// first render before the effect below can measure window.innerHeight.
const DEFAULT_CARD_HEIGHT = 380;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeCardHeight(viewportHeight: number) {
  return clamp(viewportHeight * VIEWPORT_HEIGHT_RATIO, MIN_CARD_HEIGHT, MAX_CARD_HEIGHT);
}

export function useCardSize() {
  const [cardHeight, setCardHeight] = useState(DEFAULT_CARD_HEIGHT);

  useEffect(() => {
    let frame = 0;

    function measure() {
      setCardHeight(computeCardHeight(window.innerHeight));
    }

    function handleResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { cardWidth: cardHeight * CARD_ASPECT_RATIO, cardHeight };
}
```

- [ ] **Step 2: Verify it type-checks and lints**

Run: `npm run lint`
Expected: no errors reported for the new file.

- [ ] **Step 3: Commit**

```bash
git add components/project-carousel/use-card-size.ts
git commit -m "Add responsive card-size hook for the desktop project carousel"
```

---

### Task 2: Wire `CarouselRing` to the responsive card size

**Files:**
- Modify: `components/project-carousel/carousel-ring.tsx`

**Interfaces:**
- Consumes: `useCardSize()` from Task 1 (`{ cardWidth: number; cardHeight: number }`).
- Produces: no external interface change — `CarouselRing` and `CarouselItem` keep their existing exported props (`{ projects: Project[] }` and internal-only `CarouselItem` props respectively). `CarouselItem` gains `cardWidth`/`cardHeight` props.

- [ ] **Step 1: Remove the fixed size constants and import the hook**

In `components/project-carousel/carousel-ring.tsx`, replace:

```ts
const CARD_WIDTH = 340;
const CARD_HEIGHT = 560;
const PERSPECTIVE = 1400;
```

with:

```ts
const PERSPECTIVE = 1400;
```

Add the import:

```ts
import { useCardSize } from "@/components/project-carousel/use-card-size";
```

- [ ] **Step 2: Thread `cardWidth`/`cardHeight` into `CarouselItem`**

Update the `CarouselItem` props type and destructure:

```ts
function CarouselItem({
  project,
  itemAngle,
  radius,
  angle,
  cardWidth,
  cardHeight,
}: {
  project: Project;
  itemAngle: number;
  radius: number;
  angle: import("framer-motion").MotionValue<number>;
  cardWidth: number;
  cardHeight: number;
}) {
```

Update the returned `motion.div` style to use these instead of the old constants:

```ts
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: cardWidth,
        height: cardHeight,
        transform,
        opacity,
      }}
```

- [ ] **Step 3: Compute size in `CarouselRing` and pass it down**

Inside `CarouselRing`, right after `const wrapperRef = useRef<HTMLDivElement>(null);`, add:

```ts
  const { cardWidth, cardHeight } = useCardSize();
```

Update the radius calculation, which currently reads `CARD_WIDTH`:

```ts
  const radius = n > 1 ? (cardWidth / 2 / Math.tan(Math.PI / n)) * 1.5 : 0;
```

Update the projected-scale/wrapper-height calculation, which currently reads `CARD_HEIGHT`:

```ts
  const projectedScale = PERSPECTIVE / (PERSPECTIVE - radius);
  const wrapperHeight = Math.ceil(cardHeight * projectedScale);
```

Update the `CarouselItem` mapping to pass the new props:

```ts
        {projects.map((project, index) => (
          <CarouselItem
            angle={angle}
            cardHeight={cardHeight}
            cardWidth={cardWidth}
            itemAngle={index * (360 / n)}
            key={project.slug}
            project={project}
            radius={radius}
          />
        ))}
```

- [ ] **Step 4: Verify build and lint**

Run: `npm run lint && npm run build`
Expected: both succeed with no type errors (in particular, no leftover references to `CARD_WIDTH`/`CARD_HEIGHT`).

- [ ] **Step 5: Manual check — carousel still rotates and sizes responsively**

Run: `npm run dev`, open `http://localhost:3000/projects` in a desktop-width browser window.
Expected: the carousel renders and auto-rotates as before; resizing the browser window's height changes card size smoothly; no console hydration warnings.

- [ ] **Step 6: Commit**

```bash
git add components/project-carousel/carousel-ring.tsx
git commit -m "Make desktop carousel card size responsive to viewport height"
```

---

### Task 3: Reclaim page chrome on `/projects`

**Files:**
- Modify: `app/projects/page.tsx`

**Interfaces:**
- None (leaf page component, no consumers).

- [ ] **Step 1: Trim section padding, title size, and block spacing**

In `app/projects/page.tsx`, change:

```tsx
    <section className="py-18 sm:py-24">
      <Container className="space-y-10">
        <div className="space-y-4 text-center">
          <span className="eyebrow">Projects</span>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
            Projects I&apos;ve worked and collaborated on.
          </h1>
        </div>
```

to:

```tsx
    <section className="py-10 sm:py-14">
      <Container className="space-y-6">
        <div className="space-y-4 text-center">
          <span className="eyebrow">Projects</span>
          <h1 className="font-heading text-3xl font-semibold tracking-[-0.045em] text-text-primary sm:text-4xl">
            Projects I&apos;ve worked and collaborated on.
          </h1>
        </div>
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add app/projects/page.tsx
git commit -m "Trim /projects page header spacing to reclaim vertical space"
```

---

### Task 4: Tighten `ProjectCard` content density

**Files:**
- Modify: `components/project-card.tsx`

**Interfaces:**
- None (props unchanged: `{ project: Project }`).

- [ ] **Step 1: Shrink the image aspect ratio, padding, spacing, and title size**

In `components/project-card.tsx`, change the image wrapper's class from:

```tsx
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_18rem),linear-gradient(180deg,#1f2329,#171a1f)]">
```

to:

```tsx
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_18rem),linear-gradient(180deg,#1f2329,#171a1f)]">
```

Change the content wrapper from:

```tsx
      <div className="flex flex-1 flex-col space-y-5 p-6">
```

to:

```tsx
      <div className="flex flex-1 flex-col space-y-4 p-5">
```

Change the title from:

```tsx
            <h3 className="text-xl font-semibold tracking-tight text-text-primary">
```

to:

```tsx
            <h3 className="text-lg font-semibold tracking-tight text-text-primary">
```

Change the summary from:

```tsx
          <p className="line-clamp-3 text-sm leading-7 text-text-secondary">{project.summary}</p>
```

to:

```tsx
          <p className="line-clamp-2 text-sm leading-7 text-text-secondary">{project.summary}</p>
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Manual check — full page at target viewport heights**

Run: `npm run dev`, open `http://localhost:3000/projects`, use browser devtools responsive mode to check at 1440x900, 1920x1080, and 1366x768.
Expected: no vertical scrollbar at 900px+ heights; carousel and card content remain legible and well-proportioned at 768px height (minor scroll acceptable there per spec); mobile view (narrow width) still shows `HorizontalScrollList` correctly with the shared card density changes.

- [ ] **Step 4: Commit**

```bash
git add components/project-card.tsx
git commit -m "Tighten ProjectCard content density for shorter carousel cards"
```

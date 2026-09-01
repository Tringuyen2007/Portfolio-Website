# Horizontal Spin, Viewport Lock, and Mobile Conveyor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Desktop carousel spin control responds to horizontal input instead of vertical; `/projects` is locked to exactly one viewport-height screen (no vertical scroll) on every device; mobile/tablet gets a new flat, auto-scrolling 2D "conveyor" of cards instead of the static swipeable list, while reduced-motion users keep the static list on every screen size.

**Architecture:** A CSS class toggled on `<html>` by a small client component locks the whole page to `100dvh`/`overflow:hidden`; flexbox (with `shrink-0` header/footer and `min-h-0` main) automatically gives the carousel area exactly the leftover space. A new generic `ResizeObserver` hook measures that actual leftover space at runtime, replacing the old viewport-height-guessing hook. The desktop 3D ring and the new mobile conveyor both use this measured size (the ring via a small fixed-point solve to account for its perspective magnification; the conveyor via pure CSS `aspect-ratio` cards, no math needed). A pure-CSS three-way Tailwind switch (`motion-safe:lg:`, `motion-safe:max-lg:`, `motion-reduce:`) picks which of the three carousel variants renders — no JS media-query hook, no hydration flash.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS v4 (supports `max-*` variants natively), Framer Motion.

## Global Constraints

- **Do not run `git commit`, `git add`, or any other git write command during implementation.** Leave all changes as uncommitted working-tree edits. This applies to every task and every fix — no exceptions, per explicit user instruction.
- Work happens directly on `main`, no branch or worktree.
- No test framework exists in this repo (`package.json` has only `lint`/`build`/`dev`/`start`) — verification is `npm run lint` and `npm run build`, plus manual checks where a browser is available (state clearly if one isn't).
- `CARD_ASPECT_RATIO` (width / height) is `0.78` everywhere a card aspect ratio appears (desktop ring, mobile conveyor, reduced-motion list) — keep this value consistent across all three.
- Tailwind v4 supports `max-lg:` (and other `max-*`) variants natively — no plugin or config change needed.
- Preserve the existing behavior that `prefers-reduced-motion` fully swaps to the static `HorizontalScrollList` component (not just "disables animation") on every screen size, desktop included.

---

### Task 1: `useElementSize` hook

**Files:**
- Create: `components/project-carousel/use-element-size.ts`

**Interfaces:**
- Produces: `useElementSize<T extends Element>(ref: RefObject<T | null>): { width: number; height: number }`. Consumed by `CarouselRing` (Task 4) and `MobileConveyor` (Task 6).

- [ ] **Step 1: Create the hook**

```ts
"use client";

import { useEffect, useState, type RefObject } from "react";

export function useElementSize<T extends Element>(ref: RefObject<T | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { inlineSize, blockSize } = entry.borderBoxSize?.[0] ?? {
        inlineSize: entry.contentRect.width,
        blockSize: entry.contentRect.height,
      };
      setSize({ width: inlineSize, height: blockSize });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
```

- [ ] **Step 2: Verify it type-checks and lints**

Run: `npm run lint`
Expected: no errors reported for the new file.

- [ ] **Step 3: Leave the change uncommitted**

Do not run `git add` or `git commit`. Confirm with `git status --short` that `components/project-carousel/use-element-size.ts` shows as untracked (`??`).

---

### Task 2: Page-wide viewport lock infrastructure

**Files:**
- Create: `components/viewport-lock.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `components/site-header.tsx`
- Modify: `components/site-footer.tsx`

**Interfaces:**
- Produces: `<ViewportLock />` component (no props, no visible output). Consumed by `app/projects/page.tsx` in Task 3.

- [ ] **Step 1: Create the `ViewportLock` component**

```tsx
"use client";

import { useEffect } from "react";

export function ViewportLock() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("viewport-locked");
    return () => root.classList.remove("viewport-locked");
  }, []);

  return null;
}
```

- [ ] **Step 2: Add the lock CSS rule**

In `app/globals.css`, find this exact block (the end of the existing
`@media (prefers-reduced-motion: reduce) { ... }` rule and the closing brace
of the surrounding `@layer base { ... }` block):

```css
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

Replace it with (adding the two new `viewport-locked` rules as a new
sibling inside `@layer base`, right after the `@media` block, before the
closing `}` of `@layer base`):

```css
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }

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
}
```

- [ ] **Step 3: Let `main` shrink within a locked page**

In `app/layout.tsx`, change:

```tsx
        <main className="flex-1">{children}</main>
```

to:

```tsx
        <main className="flex-1 min-h-0">{children}</main>
```

- [ ] **Step 4: Keep the header from compressing under the lock**

In `components/site-header.tsx`, change the root element's className from:

```tsx
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/65">
```

to:

```tsx
    <header className="sticky top-0 z-50 shrink-0 border-b border-border/80 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/65">
```

- [ ] **Step 5: Keep the footer from compressing under the lock**

In `components/site-footer.tsx`, change the root element's className from:

```tsx
    <footer className="border-t border-border/90 py-8">
```

to:

```tsx
    <footer className="border-t border-border/90 py-8 shrink-0">
```

- [ ] **Step 6: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed. (A pre-existing, unrelated lint error in `components/intro-overlay.tsx` — `react-hooks/set-state-in-effect` — is known and out of scope; ignore it.)

- [ ] **Step 7: Leave the change uncommitted**

Do not run `git add` or `git commit`.

---

### Task 3: `/projects` page restructure

**Files:**
- Modify: `app/projects/page.tsx`

**Interfaces:**
- Consumes: `<ViewportLock />` from Task 2 (`@/components/viewport-lock`).

- [ ] **Step 1: Restructure the page into a locked flex column**

Replace the full contents of `app/projects/page.tsx` with:

```tsx
import type { Metadata } from "next";

import { Container } from "@/components/container";
import { ProjectsShowcase } from "@/components/project-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ViewportLock } from "@/components/viewport-lock";
import { getAllProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Tri Nguyen, including detailed case studies and the thinking behind each build.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <section className="flex h-full min-h-0 flex-col py-6 sm:py-8">
      <ViewportLock />
      <Container className="flex h-full min-h-0 flex-col gap-4">
        <div className="shrink-0 space-y-2 text-center">
          <span className="eyebrow">Projects</span>
          <h1 className="font-heading text-2xl font-semibold tracking-[-0.045em] text-text-primary sm:text-3xl">
            Projects I&apos;ve worked and collaborated on.
          </h1>
        </div>

        <div className="min-h-0 flex-1">
          <ScrollReveal className="block h-full">
            <ProjectsShowcase projects={projects} />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
```

Note: `ScrollReveal` is given `className="block h-full"` so the height chain
from the `flex-1 min-h-0` wrapper reaches `ProjectsShowcase`.
`components/scroll-reveal.tsx` already accepts a `className` prop and
forwards it to its root element (both the reduced-motion `<div>` branch and
the `motion.div` branch) — no changes needed there.

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Leave the change uncommitted**

Do not run `git add` or `git commit`.

---

### Task 4: Desktop ring — horizontal spin + container-measured sizing

**Files:**
- Modify: `components/project-carousel/carousel-ring.tsx`
- Delete: `components/project-carousel/use-card-size.ts`

**Interfaces:**
- Consumes: `useElementSize` from Task 1 (`@/components/project-carousel/use-element-size`).
- Produces: no external interface change — `CarouselRing` keeps its `{ projects: Project[] }` prop signature.

- [ ] **Step 1: Replace the full file contents**

Replace the full contents of `components/project-carousel/carousel-ring.tsx` with:

```tsx
"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { ProjectCard } from "@/components/project-card";
import { useElementSize } from "@/components/project-carousel/use-element-size";
import type { Project } from "@/lib/content/projects";

const PERSPECTIVE = 1400;
const CARD_ASPECT_RATIO = 0.78; // width / height
const MIN_CARD_HEIGHT = 240;
const MAX_CARD_HEIGHT = 460;
const SIZE_SOLVE_ITERATIONS = 4;

const IDLE_SPEED = 6; // degrees per second
const MAX_EXTRA_SPEED = 5 * IDLE_SPEED;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// A card at translateZ(radius) inside the ring's perspective sits closer to
// the camera, so its rendered footprint is larger than its nominal height by
// a factor of PERSPECTIVE / (PERSPECTIVE - radius) — see the wrapperHeight
// comment in CarouselRing below. That factor itself depends on radius, which
// depends on cardWidth, which depends on cardHeight — so solving for the
// cardHeight whose PROJECTED footprint fits a given container height takes a
// few fixed-point iterations rather than one division.
function solveCardHeight(containerHeight: number, projectCount: number) {
  let height = clamp(containerHeight, MIN_CARD_HEIGHT, MAX_CARD_HEIGHT);

  for (let i = 0; i < SIZE_SOLVE_ITERATIONS; i++) {
    const width = height * CARD_ASPECT_RATIO;
    const radius = projectCount > 1 ? (width / 2 / Math.tan(Math.PI / projectCount)) * 1.5 : 0;
    const projectedScale = PERSPECTIVE / (PERSPECTIVE - radius);
    height = clamp(containerHeight / projectedScale, MIN_CARD_HEIGHT, MAX_CARD_HEIGHT);
  }

  return height;
}

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
  const itemRef = useRef<HTMLDivElement>(null);

  const facing = useTransform(angle, (value) => {
    const effectiveAngleDeg = ((itemAngle + value) % 360 + 360) % 360;
    const signedAngle = effectiveAngleDeg > 180 ? effectiveAngleDeg - 360 : effectiveAngleDeg;
    return Math.cos((signedAngle * Math.PI) / 180);
  });

  // Front-facing (facing=1) is fully visible; anything past the side profile
  // (facing<=0, i.e. the back half of the ring) is fully blank, not just dim.
  const visibility = useTransform(facing, (value) => Math.max(value, 0));
  const opacity = useTransform(visibility, (value) => Math.pow(value, 0.6));
  const scale = useTransform(visibility, (value) => 0.72 + value * 0.28);

  // Framer Motion owns the `transform` CSS property as soon as any
  // motion-recognized transform key (scale, x, y, rotateY, ...) is set on the
  // same style object — it silently overwrites a manually-written `transform`
  // string with only what it recognizes, dropping everything else. So the
  // ring placement (self-centering translate + rotateY + translateZ) and the
  // scale must be composed into ONE motion-value-driven transform string
  // instead of splitting `scale` out as its own style prop.
  const transform = useTransform(
    scale,
    (value) =>
      `translate(-50%, -50%) rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${value})`,
  );

  // `inert` is a DOM attribute (not a CSS style), so it can't be driven by
  // useTransform's style output — it's applied imperatively via a ref instead,
  // and it keeps blanked-out back-half cards out of tab order / clicks.
  useMotionValueEvent(facing, "change", (value) => {
    const node = itemRef.current;
    if (!node) return;
    const isBack = value <= 0;
    node.inert = isBack;
    node.style.pointerEvents = isBack ? "none" : "auto";
  });

  return (
    <motion.div
      ref={itemRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: cardWidth,
        height: cardHeight,
        transform,
        opacity,
      }}
    >
      <ProjectCard project={project} />
    </motion.div>
  );
}

export function CarouselRing({ projects }: { projects: Project[] }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { height: containerHeight } = useElementSize(containerRef);

  const angle = useMotionValue(0);
  const extraSpeed = useMotionValue(0);

  const n = projects.length;
  const cardHeight = solveCardHeight(containerHeight || MIN_CARD_HEIGHT, n);
  const cardWidth = cardHeight * CARD_ASPECT_RATIO;
  const radius = n > 1 ? (cardWidth / 2 / Math.tan(Math.PI / n)) * 1.5 : 0;

  // A card at translateZ(radius) inside this perspective sits closer to the
  // camera, so the CSS 3D projection renders it larger than cardHeight by a
  // factor of PERSPECTIVE / (PERSPECTIVE - radius) — the same "pop toward
  // viewer" effect that makes the front card readable. solveCardHeight()
  // above already accounts for this so the projected footprint fits
  // containerHeight; wrapperHeight here is just that same projected size,
  // used to size the perspective box itself.
  const projectedScale = PERSPECTIVE / (PERSPECTIVE - radius);
  const wrapperHeight = Math.ceil(cardHeight * projectedScale);

  useAnimationFrame((_time, delta) => {
    if (prefersReducedMotion) return;

    // extraSpeed is signed so a user can scroll either direction to spin the
    // ring forward or backward; it always exponentially decays back toward 0,
    // so the ring eases back to its constant forward idle speed either way.
    const decayed = extraSpeed.get() * Math.pow(0.001, delta / 1000);
    extraSpeed.set(clamp(decayed, -MAX_EXTRA_SPEED, MAX_EXTRA_SPEED));

    const currentSpeed = IDLE_SPEED + extraSpeed.get();
    angle.set(angle.get() + currentSpeed * (delta / 1000));
  });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      extraSpeed.set(
        clamp(extraSpeed.get() + event.deltaX * 0.15, -MAX_EXTRA_SPEED, MAX_EXTRA_SPEED),
      );
    }

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, [prefersReducedMotion, extraSpeed]);

  return (
    <div className="h-full min-h-0" ref={containerRef}>
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          height: wrapperHeight,
          perspective: `${PERSPECTIVE}px`,
          overflow: "visible",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transformStyle: "preserve-3d",
            rotateY: angle,
          }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}
```

This is the same wheel-listener effect the file had before, just reading
`event.deltaX` instead of `event.deltaY`; everything else (the perspective
math, `CarouselItem`, the animation frame loop) is unchanged from before
except for sourcing `cardHeight`/`cardWidth` from `solveCardHeight` and the
new `containerRef` wrapper.

- [ ] **Step 2: Delete the superseded hook**

```bash
rm components/project-carousel/use-card-size.ts
```

- [ ] **Step 3: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed, with no leftover references to `use-card-size` or
`useCardSize` anywhere in the codebase. Confirm with:
`grep -rn "use-card-size\|useCardSize" --include="*.ts*" .` (expect no
output, aside from anything inside `node_modules` or `.next`, which don't
count).

- [ ] **Step 4: Leave the change uncommitted**

Do not run `git add` or `git commit`.

---

### Task 5: `HorizontalScrollList` resized for the locked layout

**Files:**
- Modify: `components/project-carousel/horizontal-scroll-list.tsx`

**Interfaces:**
- None (props unchanged: `{ projects: Project[] }`).

- [ ] **Step 1: Make the row and cards fill the available height**

Replace the full contents of `components/project-carousel/horizontal-scroll-list.tsx` with:

```tsx
import type { Project } from "@/lib/content/projects";
import { ProjectCard } from "@/components/project-card";

type HorizontalScrollListProps = {
  projects: Project[];
};

export function HorizontalScrollList({ projects }: HorizontalScrollListProps) {
  return (
    <div className="flex h-full snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {projects.map((project) => (
        <div className="aspect-[0.78] h-full shrink-0 snap-center" key={project.slug}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Leave the change uncommitted**

Do not run `git add` or `git commit`.

---

### Task 6: `MobileConveyor` — new flat auto-scrolling carousel

**Files:**
- Create: `components/project-carousel/mobile-conveyor.tsx`

**Interfaces:**
- Consumes: `useElementSize` from Task 1.
- Produces: `MobileConveyor({ projects: Project[] })` component. Consumed by `ProjectsShowcase` in Task 7.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

import { ProjectCard } from "@/components/project-card";
import { useElementSize } from "@/components/project-carousel/use-element-size";
import type { Project } from "@/lib/content/projects";

const IDLE_SPEED_PX = 40; // pixels per second
const MAX_EXTRA_SPEED_PX = 5 * IDLE_SPEED_PX;
const DRAG_THRESHOLD_PX = 6;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// Keeps x within (-setWidth, 0] so that, with two identical copies of the
// project list rendered back-to-back, the track always shows valid card
// content and the loop point is invisible — a standard infinite-marquee
// technique. Guards setWidth <= 0 (not yet measured) by leaving x alone.
function wrapOffset(x: number, setWidth: number) {
  if (setWidth <= 0) return x;
  const wrapped = ((x % setWidth) + setWidth) % setWidth;
  return wrapped > 0 ? wrapped - setWidth : wrapped;
}

export function MobileConveyor({ projects }: { projects: Project[] }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { width: trackWidth } = useElementSize(trackRef);
  const singleSetWidth = trackWidth / 2;

  const offsetX = useMotionValue(0);
  const extraSpeed = useMotionValue(0);

  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  useAnimationFrame((_time, delta) => {
    if (prefersReducedMotion) return;

    if (!isDraggingRef.current) {
      const decayed = extraSpeed.get() * Math.pow(0.001, delta / 1000);
      extraSpeed.set(clamp(decayed, -MAX_EXTRA_SPEED_PX, MAX_EXTRA_SPEED_PX));

      const speed = IDLE_SPEED_PX + extraSpeed.get();
      offsetX.set(offsetX.get() - speed * (delta / 1000));
    }

    offsetX.set(wrapOffset(offsetX.get(), singleSetWidth));
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handlePointerDown(event: PointerEvent) {
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      dragStartXRef.current = event.clientX;
      dragStartOffsetRef.current = offsetX.get();
      container?.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDraggingRef.current) return;
      const delta = event.clientX - dragStartXRef.current;
      if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
        hasDraggedRef.current = true;
      }
      offsetX.set(dragStartOffsetRef.current + delta);
    }

    function handlePointerUp(event: PointerEvent) {
      isDraggingRef.current = false;
      container?.releasePointerCapture(event.pointerId);
    }

    function handleClickCapture(event: MouseEvent) {
      if (hasDraggedRef.current) {
        event.preventDefault();
        event.stopPropagation();
        hasDraggedRef.current = false;
      }
    }

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerUp);
    container.addEventListener("click", handleClickCapture, { capture: true });

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerUp);
      container.removeEventListener("click", handleClickCapture, { capture: true });
    };
  }, [offsetX]);

  const trackProjects = [...projects, ...projects];

  return (
    <div className="h-full min-h-0 touch-pan-y overflow-hidden" ref={containerRef}>
      <motion.div
        className="flex h-full items-stretch gap-6"
        ref={trackRef}
        style={{ x: offsetX, width: "max-content" }}
      >
        {trackProjects.map((project, index) => (
          <div
            className="aspect-[0.78] h-full shrink-0"
            key={`${project.slug}-${index < projects.length ? "a" : "b"}`}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed. (Note: `MobileConveyor` is not yet imported anywhere
until Task 7, so a successful build here confirms only that the file itself
is valid — an "unused export" style warning, if any, is expected and will
resolve once Task 7 wires it in.)

- [ ] **Step 3: Leave the change uncommitted**

Do not run `git add` or `git commit`.

---

### Task 7: Three-way variant switch in `ProjectsShowcase`

**Files:**
- Modify: `components/project-carousel/index.tsx`

**Interfaces:**
- Consumes: `MobileConveyor` from Task 6 (`@/components/project-carousel/mobile-conveyor`).

- [ ] **Step 1: Replace the two-way swap with the three-way CSS switch**

Replace the full contents of `components/project-carousel/index.tsx` with:

```tsx
import type { Project } from "@/lib/content/projects";
import { CarouselRing } from "@/components/project-carousel/carousel-ring";
import { HorizontalScrollList } from "@/components/project-carousel/horizontal-scroll-list";
import { MobileConveyor } from "@/components/project-carousel/mobile-conveyor";

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="h-full min-h-0">
      <div className="hidden h-full motion-safe:lg:block">
        <CarouselRing projects={projects} />
      </div>
      <div className="hidden h-full motion-safe:max-lg:block">
        <MobileConveyor projects={projects} />
      </div>
      <div className="hidden h-full motion-reduce:block">
        <HorizontalScrollList projects={projects} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Manual check, where a browser is available**

Run: `npm run dev`, open `http://localhost:3000/projects`.
Expected:
- No vertical scrollbar at desktop and mobile viewport sizes in devtools
  responsive mode (try 1440×900, 1366×768, 390×844, 360×640).
- Desktop: shift+scroll or a horizontal trackpad gesture over the ring
  speeds up/reverses its spin.
- Mobile width: a flat strip of cards auto-scrolls left continuously and
  loops seamlessly; dragging left/right follows the pointer and doesn't
  navigate; a plain click/tap on "Full details" still navigates.
- Emulate `prefers-reduced-motion: reduce` in devtools (Rendering tab):
  the static swipeable list renders instead, on both desktop and mobile
  widths, with no auto-scrolling.
- No hydration warnings in the console.

If no browser is available in this environment, state that clearly in the
report instead of claiming this step passed.

- [ ] **Step 4: Leave the change uncommitted**

Do not run `git add` or `git commit`.

# Intro Overlay & Page Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a ~1.5s branded intro overlay that plays on every full page load/refresh, and a subtle crossfade transition between client-side page navigations.

**Architecture:** Two new client components (`IntroOverlay`, `PageTransition`) rendered from the root layout, powered by `framer-motion`. `IntroOverlay` mounts once per hard page load (root layout only remounts on full reload). `PageTransition` wraps `{children}` and keys an `AnimatePresence` block on `usePathname()` so it crossfades on every client-side route change.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, `framer-motion` (new dependency).

## Global Constraints

- Intro overlay must use `bg-bg` and existing site tokens (`--text-primary`, etc.) — no new colors.
- Intro overlay total duration: ~1.5s (0.6s fade/scale in, 0.3s hold, 0.6s fade out), matching the spec.
- Page transition: ~0.2s exit fade, ~0.25s enter fade, opacity only — no slide/layout shift.
- Both components must fully no-op under `prefers-reduced-motion: reduce` (instant/no animation), matching the existing reduced-motion handling in `app/globals.css`.
- No automated test framework exists in this repo (spec confirms manual verification only) — each task ends with a manual `npm run dev` check instead of an automated test run.
- Header/footer (`SiteHeader`, `SiteFooter`) must remain outside the animated region — only main content crossfades.

---

### Task 1: Add `framer-motion` dependency

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `framer-motion` package available for import in later tasks (`import { motion, AnimatePresence } from "framer-motion"`).

- [ ] **Step 1: Install the package**

Run: `npm install framer-motion`

Expected: `package.json` `dependencies` gains a `"framer-motion": "^..."` entry, `package-lock.json` updates, install completes with no errors.

- [ ] **Step 2: Verify it's importable**

Run: `node -e "require.resolve('framer-motion')"`

Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add framer-motion dependency"
```

---

### Task 2: Create `IntroOverlay` component

**Files:**
- Create: `components/intro-overlay.tsx`

**Interfaces:**
- Consumes: `siteConfig.name` from `@/lib/site` (already exists, value `"Tri Nguyen"`).
- Produces: `export function IntroOverlay()` — a client component with no props, rendered directly in `app/layout.tsx` (Task 4).

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { siteConfig } from "@/lib/site";

const HOLD_MS = 900;
const EXIT_MS = 600;

export function IntroOverlay() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"visible" | "exiting" | "done">(
    "visible",
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }

    const exitTimer = setTimeout(() => setPhase("exiting"), HOLD_MS);
    const doneTimer = setTimeout(
      () => setPhase("done"),
      HOLD_MS + EXIT_MS,
    );

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          animate={{ opacity: phase === "exiting" ? 0 : 1 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: EXIT_MS / 1000, ease: "easeInOut" }}
        >
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm tracking-[0.3em] text-text-primary uppercase"
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {siteConfig.name}
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`

Expected: no new type errors referencing `components/intro-overlay.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/intro-overlay.tsx
git commit -m "Add IntroOverlay component"
```

---

### Task 3: Create `PageTransition` component

**Files:**
- Create: `components/page-transition.tsx`

**Interfaces:**
- Consumes: `usePathname` from `next/navigation` (built-in).
- Produces: `export function PageTransition({ children }: { children: React.ReactNode })`, rendered around `{children}` in `app/layout.tsx` (Task 4).

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        key={pathname}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`

Expected: no new type errors referencing `components/page-transition.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/page-transition.tsx
git commit -m "Add PageTransition component"
```

---

### Task 4: Wire both components into the root layout

**Files:**
- Modify: `app/layout.tsx:1-65`

**Interfaces:**
- Consumes: `IntroOverlay` from `@/components/intro-overlay` (Task 2), `PageTransition` from `@/components/page-transition` (Task 3).

- [ ] **Step 1: Add imports**

In `app/layout.tsx`, add after the existing `SiteHeader`/`SiteFooter` imports (currently lines 6-7):

```tsx
import { IntroOverlay } from "@/components/intro-overlay";
import { PageTransition } from "@/components/page-transition";
```

- [ ] **Step 2: Render the components in the body**

Replace the current body block (lines 58-62):

```tsx
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
```

with:

```tsx
      <body className="flex min-h-screen flex-col">
        <IntroOverlay />
        <SiteHeader />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
      </body>
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`

Expected: no type errors.

- [ ] **Step 4: Manual verification in the browser**

Run: `npm run dev`, then open `http://localhost:3000`.

Expected:
- On first load, a full-screen dark overlay shows "TRI NGUYEN" (or configured name) fading/scaling in, holding briefly, then fading out to reveal the home page — total ~1.5s.
- Refresh the page: the intro plays again from scratch.
- Open `http://localhost:3000/about` directly (hard navigation / paste URL): intro also plays there.
- Click through nav links (Overview → Projects → About → Experience → Contact): each navigation shows a quick opacity crossfade of the main content; header/footer do not move or flicker; intro does NOT replay.
- In browser devtools, enable "Emulate CSS media feature prefers-reduced-motion: reduce", then reload and navigate again: intro shows nothing (page is immediately visible) and page transitions swap instantly with no fade.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "Wire intro overlay and page transitions into root layout"
```

---

## Post-Implementation

Run `npm run lint` once all tasks are complete to confirm no lint regressions from the new files.

# Intro Overlay & Page Transitions

## Context

The site currently loads and switches between pages with no motion — content simply appears. The goal is to add two pieces of polish using UI/UX best practices:

1. A slow, deliberate intro overlay that plays on every full page load/refresh, giving the site a more premium, branded first impression.
2. Consistent, subtle fade transitions between page navigations, so moving between Home / About / Projects / Experience / Resume / Contact feels cohesive rather than an abrupt swap.

This is a portfolio site (Next.js 16 App Router, React 19, Tailwind v4, dark theme), so both effects should stay minimal and on-brand rather than flashy.

## Scope

- Add an intro overlay that plays once per full page load (any route, since `app/layout.tsx` mounts on every hard load).
- Add a crossfade transition on client-side route changes.
- Both respect `prefers-reduced-motion`.
- No new pages, no changes to page content/copy.

## Approach

Add `framer-motion` as a dependency. Both effects live in `app/layout.tsx` since it's the one place that wraps every route.

### 1. Intro overlay — `components/intro-overlay.tsx`

- `"use client"` component rendered once in `app/layout.tsx`, above `<SiteHeader />`.
- Full-screen `fixed inset-0 z-50` div using `bg-bg` (the site's existing dark background token) so it visually matches the page underneath.
- Shows the site name (reuse `siteConfig.name`, styled similarly to the header wordmark) centered on screen.
- Timeline (~1.5s total), via framer-motion variants:
  - `0.0s–0.6s`: name fades in and scales up slightly (opacity 0→1, scale 0.96→1).
  - `0.6s–0.9s`: hold.
  - `0.9s–1.5s`: whole overlay fades out (opacity 1→0), then unmounts (`pointer-events-none` during fade-out so the page beneath becomes interactive immediately as it fades).
- Runs once per component mount. Since this component lives in the root layout, it mounts on every full page load/refresh (any route) but does **not** remount on client-side `<Link>` navigations (React keeps the layout mounted across route changes in the App Router) — so it never replays mid-session, only on actual reloads.
- `prefers-reduced-motion: reduce` → skip the animation entirely (render nothing / render already-resolved state), matching the existing reduced-motion handling in `app/globals.css`.

### 2. Page transition — `components/page-transition.tsx`

- `"use client"` wrapper component used in `app/layout.tsx` around `{children}`, outside `<SiteHeader />` / `<SiteFooter />` so only the main content area animates.
- Uses `usePathname()` from `next/navigation` as the `key` for an `AnimatePresence mode="wait"` block wrapping a `motion.div`.
- Simple opacity crossfade: exiting page fades out (~0.2s), incoming page fades in (~0.25s). No layout shift/slide, to keep header/footer perfectly stable.
- `prefers-reduced-motion: reduce` → render children directly with no `AnimatePresence`/motion wrapper (instant swap).

### Integration point — `app/layout.tsx`

```tsx
<body>
  <IntroOverlay />
  <SiteHeader />
  <main className="flex-1">
    <PageTransition>{children}</PageTransition>
  </main>
  <SiteFooter />
</body>
```

## Error Handling / Edge Cases

- JS disabled or hydration delay: overlay must not be rendered server-side as a blocking element that hides content if JS fails — implement as a client-only mount (`useEffect`-gated `isVisible` state starting `true`, framer-motion handles the rest) so worst case (no JS) the page is simply visible with no overlay ever shown, not stuck hidden.
- Reduced motion: both components branch early into a no-animation path.
- Fast navigation clicks during the intro: intro and page-transition are independent components: the intro is not in the route-changing tree, so nothing needs a mutual lock.

## Testing / Verification

Manual only (no automated test framework in this repo currently):

1. `npm run dev`, load `/` fresh in browser — confirm intro plays once (~1.5s: name fades in, holds, fades out) before revealing the home page.
2. Refresh `/` — confirm intro plays again from scratch.
3. Load `/about` directly (hard navigation) — confirm intro also plays there (layout-level, not home-page-specific).
4. Click through nav links (Home → Projects → About, etc.) — confirm each transition is a quick crossfade with no intro replay.
5. Enable OS-level "reduce motion" — reload and navigate — confirm both the intro and page transitions are skipped/instant.

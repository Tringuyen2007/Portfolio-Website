"use client";

import { usePathname, useRouter } from "next/navigation";
import { animate, useReducedMotion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ZoomRect = { x: number; y: number; width: number; height: number };

export type ZoomRequest = {
  /** "fruit": a fruit grows to fill the viewport. "tree": a preview card grows to fill it. */
  kind: "fruit" | "tree";
  href: string;
  rect: ZoomRect;
  /** Fill of the growing clone (fruit gradient colors, or the tree card background). */
  colors: [string, string];
  /** Optional content drawn at the clone's center as it grows (cover art). */
  art?: ReactNode;
  /** Slug to restore on return. */
  slug?: string;
};

type ZoomContextValue = {
  zoomTo: (request: ZoomRequest) => void;
  /** Reverse journey: cover the page, navigate, then shrink into the fruit/card at `selector`. */
  zoomBack: (href: string, selector: string, colors: [string, string]) => void;
  active: boolean;
};

const ZoomContext = createContext<ZoomContextValue | null>(null);

export const TREE_RETURN_KEY = "tree:return";

export function useZoom() {
  const value = useContext(ZoomContext);
  if (!value) {
    throw new Error("useZoom must be used inside <ZoomProvider>");
  }
  return value;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const WATCHDOG_MS = 2600;

function coverScale(rect: ZoomRect) {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const farX = Math.max(cx, vw - cx);
  const farY = Math.max(cy, vh - cy);
  const radius = Math.hypot(farX, farY);
  return (radius * 2) / Math.min(rect.width, rect.height) + 0.15;
}

function waitForTarget(selector: string, timeout = 1600) {
  return new Promise<Element | null>((resolve) => {
    const started = performance.now();
    const tick = () => {
      const node = document.querySelector(selector);
      if (node) {
        resolve(node);
        return;
      }
      if (performance.now() - started > timeout) {
        resolve(null);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export function ZoomProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<ZoomRequest | null>(null);
  const [active, setActive] = useState(false);
  const runRef = useRef(0);
  const dimRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const watchdogRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    runRef.current += 1;
    if (watchdogRef.current) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
    setStage(null);
    setActive(false);
    document.documentElement.removeAttribute("data-zooming");
  }, []);

  const arm = useCallback(() => {
    if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
    watchdogRef.current = window.setTimeout(clear, WATCHDOG_MS);
  }, [clear]);

  // Browser back/forward during a transition must never leave the stage stuck.
  useEffect(() => {
    const onPop = () => clear();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [clear]);

  // A pathname change that we did not drive (e.g. header link) also clears.
  useEffect(() => {
    if (active) return;
    const id = window.setTimeout(clear, 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const zoomTo = useCallback(
    (request: ZoomRequest) => {
      if (request.slug) {
        try {
          sessionStorage.setItem(
            TREE_RETURN_KEY,
            JSON.stringify({ slug: request.slug, scrollY: window.scrollY }),
          );
        } catch {
          /* storage unavailable: nothing to restore */
        }
      }
      if (prefersReducedMotion) {
        router.push(request.href);
        return;
      }
      runRef.current += 1;
      const run = runRef.current;
      setStage(request);
      setActive(true);
      document.documentElement.setAttribute("data-zooming", "");
      arm();
      router.prefetch(request.href);

      requestAnimationFrame(async () => {
        const clone = cloneRef.current;
        const dim = dimRef.current;
        if (!clone || !dim || runRef.current !== run) return;
        const scale = coverScale(request.rect);
        animate(dim, { opacity: [0, 0.75] }, { duration: 0.45, ease: "easeOut" });
        const grow = animate(
          clone,
          { scale: [1, scale], opacity: [1, 1] },
          { duration: 0.72, ease: EASE },
        );
        const art = clone.querySelector<HTMLElement>("[data-zoom-art]");
        if (art) {
          animate(art, { opacity: [0, 1], scale: [0.6, 1] }, { duration: 0.5, delay: 0.15, ease: EASE });
        }
        window.setTimeout(() => {
          if (runRef.current === run) router.push(request.href);
        }, 380);
        await grow;
        if (runRef.current !== run) return;
        await waitForTarget("[data-zoom-target]");
        if (runRef.current !== run) return;
        await animate(clone, { opacity: 0 }, { duration: 0.42, ease: "easeInOut" });
        animate(dim, { opacity: 0 }, { duration: 0.3 });
        if (runRef.current === run) clear();
      });
    },
    [arm, clear, prefersReducedMotion, router],
  );

  const zoomBack = useCallback(
    (href: string, selector: string, colors: [string, string]) => {
      if (prefersReducedMotion) {
        router.push(href);
        return;
      }
      runRef.current += 1;
      const run = runRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = Math.max(vw, vh) * 2.2;
      setStage({
        kind: "fruit",
        href,
        colors,
        rect: { x: vw / 2 - size / 2, y: vh / 2 - size / 2, width: size, height: size },
      });
      setActive(true);
      document.documentElement.setAttribute("data-zooming", "");
      arm();

      requestAnimationFrame(async () => {
        const clone = cloneRef.current;
        const dim = dimRef.current;
        if (!clone || !dim || runRef.current !== run) return;
        await animate(clone, { opacity: [0, 1] }, { duration: 0.32, ease: "easeIn" });
        if (runRef.current !== run) return;
        router.push(href);
        const target = await waitForTarget(selector);
        if (runRef.current !== run) return;
        if (target) {
          target.scrollIntoView({ block: "center", behavior: "instant" });
          const rect = target.getBoundingClientRect();
          const toScale = Math.max(rect.width, rect.height) / size;
          const dx = rect.x + rect.width / 2 - vw / 2;
          const dy = rect.y + rect.height / 2 - vh / 2;
          await animate(
            clone,
            { scale: [1, toScale], x: [0, dx], y: [0, dy] },
            { duration: 0.7, ease: EASE },
          );
          if (runRef.current !== run) return;
          await animate(clone, { opacity: 0 }, { duration: 0.25 });
        } else {
          await animate(clone, { opacity: 0 }, { duration: 0.4 });
        }
        if (runRef.current === run) clear();
      });
    },
    [arm, clear, prefersReducedMotion, router],
  );

  const value = useMemo(() => ({ zoomTo, zoomBack, active }), [zoomTo, zoomBack, active]);

  return (
    <ZoomContext.Provider value={value}>
      {children}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[70] ${stage ? "" : "hidden"}`}
      >
        <div className="absolute inset-0 bg-bg opacity-0" ref={dimRef} />
        {stage ? (
          <div
            className="absolute will-change-transform"
            ref={cloneRef}
            style={{
              left: stage.rect.x,
              top: stage.rect.y,
              width: stage.rect.width,
              height: stage.rect.height,
              borderRadius: stage.kind === "fruit" ? "9999px" : "1.6rem",
              background: `radial-gradient(circle at 35% 30%, ${stage.colors[0]}, ${stage.colors[1]})`,
              transformOrigin: "center",
            }}
          >
            {stage.art ? (
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0"
                data-zoom-art
                style={{ transform: "scale(0.6)" }}
              >
                {stage.art}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </ZoomContext.Provider>
  );
}

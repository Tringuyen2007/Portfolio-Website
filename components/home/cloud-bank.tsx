"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { RefObject } from "react";

/**
 * The hero's lower edge: three tileable pixel cloud banks (public/pixel/cloud-bank-*.png).
 * Each layer drifts sideways at its own speed (CSS, whole art-pixel steps) and rises at
 * its own rate as the hero scrolls away, so leaving the hero feels like sinking into the
 * clouds. The bottom rows of every sprite dither out to transparent, so the bank melts
 * into the next section instead of ending on a hard line. Reduced motion: static.
 */

type Layer = {
  name: "back" | "mid" | "front";
  /** Native sprite size in art px. */
  w: number;
  h: number;
  /** Distance from the hero bottom, in art px. */
  bottom: number;
  /** Seconds for one full horizontal tile cycle. */
  drift: number;
  /** How far the layer rises (CSS px) over the hero's scroll-out. */
  rise: number;
  /** Drift direction. */
  dir: 1 | -1;
};

const LAYERS: Layer[] = [
  { name: "back", w: 192, h: 44, bottom: 18, drift: 160, rise: 40, dir: 1 },
  { name: "mid", w: 160, h: 40, bottom: 8, drift: 95, rise: 110, dir: -1 },
  { name: "front", w: 128, h: 36, bottom: -2, drift: 55, rise: 220, dir: 1 },
];

/** Snap a CSS px value to the 4 px art grid (3 px on phones rounds close enough). */
const snap = (v: number) => Math.round(v / 4) * 4;

function BankLayer({ layer, progress, still }: { layer: Layer; progress: MotionValue<number>; still: boolean }) {
  const y = useTransform(progress, [0, 1], [0, -layer.rise], { clamp: true });
  const ySnapped = useTransform(y, snap);

  return (
    <motion.div
      aria-hidden="true"
      className="cloud-bank-layer pixelated pointer-events-none absolute inset-x-0"
      data-layer={layer.name}
      style={{
        y: still ? 0 : ySnapped,
        bottom: `calc(var(--unit) * ${layer.bottom})`,
        height: `calc(var(--unit) * ${layer.h})`,
        backgroundImage: `url(/pixel/cloud-bank-${layer.name}.png)`,
        backgroundSize: `calc(var(--unit) * ${layer.w}) calc(var(--unit) * ${layer.h})`,
        backgroundRepeat: "repeat-x",
        // Consumed by the drift keyframes in globals.css.
        ["--tile" as string]: `calc(var(--unit) * ${layer.w * layer.dir})`,
        ["--steps" as string]: layer.w,
        animationDuration: `${layer.drift}s`,
      }}
    />
  );
}

export function CloudBank({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[calc(var(--unit)*64)]">
      {LAYERS.map((layer) => (
        <BankLayer key={layer.name} layer={layer} progress={scrollYProgress} still={reduced} />
      ))}
    </div>
  );
}

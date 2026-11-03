"use client";

import { useEffect, useState } from "react";

const SCENE_W = 32;
const SCENE_H = 24;

/**
 * The project's 32×24 two-frame pixel scene. Frame 0 is the SSR content; the
 * client swaps to frame 1 and back on an interval, and stays on frame 0 under
 * prefers-reduced-motion or while the tab is hidden.
 */
export function SceneArt({
  slug,
  title,
  scale = 8,
  interval = 800,
  className = "",
}: {
  slug: string;
  title: string;
  /** Art pixels per scene pixel (8 → 256×192 on desktop). */
  scale?: number;
  interval?: number;
  className?: string;
}) {
  const [frame, setFrame] = useState<0 | 1>(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      setFrame(0);
    };
    const start = () => {
      stop();
      if (media.matches || document.hidden) return;
      timer = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), interval);
    };

    start();
    media.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    return () => {
      stop();
      media.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, [interval]);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- pixel sprite drawn at an exact art-pixel scale
    <img
      alt={`Pixel scene for ${title}`}
      className={`pixelated block ${className}`}
      decoding="async"
      height={SCENE_H}
      src={`/pixel/scene-${slug}-f${frame}.png`}
      style={{
        width: `min(100%, calc(var(--unit) * ${SCENE_W * scale}))`,
        height: "auto",
        aspectRatio: `${SCENE_W} / ${SCENE_H}`,
      }}
      width={SCENE_W}
    />
  );
}

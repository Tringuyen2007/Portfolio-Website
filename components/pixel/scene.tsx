"use client";

import { useEffect, useState } from "react";

import { PixelImg } from "@/components/pixel/pixel-img";
import { SCENE_LOOP_MS, sceneFrames } from "@/lib/pixel/orchard";
import { prefersReducedMotion } from "@/lib/pixel/motion";

/** Two-frame project scene (32×24 art px) looping at the project's interval. */
export function Scene({
  slug,
  className = "",
  scale = 4,
}: {
  slug: string;
  className?: string;
  /** CSS px per art px. */
  scale?: number;
}) {
  const [frame, setFrame] = useState(0);
  const frames = sceneFrames(slug);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const interval = SCENE_LOOP_MS[slug] ?? 800;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 2), interval);
    return () => window.clearInterval(id);
  }, [slug]);

  return (
    <span
      aria-hidden="true"
      className={`relative block overflow-hidden ${className}`}
      style={{ width: 32 * scale, height: 24 * scale }}
    >
      {frames.map((src, index) => (
        <PixelImg
          className="absolute inset-0"
          height={24 * scale}
          key={src}
          src={src}
          style={{ opacity: frame === index ? 1 : 0 }}
          width={32 * scale}
        />
      ))}
    </span>
  );
}

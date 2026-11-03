"use client";

import { useEffect, useState } from "react";

import manifest from "@/public/pixel/gardener.json";
import { prefersReducedMotion } from "@/lib/pixel/motion";

type Activity = keyof typeof manifest.animations;

const SHEET_W = manifest.frame.w * manifest.frames;
const SHEET_H = manifest.frame.h * Object.keys(manifest.animations).length;
/** Snacks are picked at random whenever he gets hungry. */
const SNACKS: Activity[] = ["rice", "sushi", "protein"];
const MOODS = ["sleep", "water", "dance", "eat"] as const;
type Mood = (typeof MOODS)[number];

function pick<T>(list: readonly T[], not?: T): T {
  const pool = list.filter((x) => x !== not);
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Chibi Tri living under the orchard tree. Every so often he picks something
 * new to do at random: nap, water the tree, dance, or have a snack (rice,
 * sushi, or a protein shake). Decorative; reduced motion shows him napping.
 */
export function Gardener({
  left,
  top,
  unit,
  className = "",
}: {
  left: number;
  top: number;
  unit: number;
  className?: string;
}) {
  const [activity, setActivity] = useState<Activity>("sleep");
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let mood: Mood = pick(MOODS);
    let timer: ReturnType<typeof setTimeout>;
    let frameTimer: ReturnType<typeof setInterval>;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      const next: Activity = mood === "eat" ? pick(SNACKS) : mood;
      setActivity(next);
      setFrame(0);
      clearInterval(frameTimer);
      frameTimer = setInterval(() => {
        if (!document.hidden) setFrame((f) => (f + 1) % manifest.frames);
      }, manifest.animations[next].ms);
      // Naps last a little longer than everything else.
      const stay = (mood === "sleep" ? 9000 : 6000) + Math.random() * 4000;
      timer = setTimeout(() => {
        mood = pick(MOODS, mood);
        start();
      }, stay);
    };
    start();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(frameTimer);
    };
  }, []);

  const row = manifest.animations[activity].row;
  return (
    <div
      aria-hidden="true"
      className={`pixelated pointer-events-none absolute ${className}`}
      data-gardener={activity}
      style={{
        left,
        top,
        width: manifest.frame.w * unit,
        height: manifest.frame.h * unit,
        backgroundImage: "url(/pixel/gardener.png)",
        backgroundSize: `${SHEET_W * unit}px ${SHEET_H * unit}px`,
        backgroundPosition: `${-frame * manifest.frame.w * unit}px ${-row * manifest.frame.h * unit}px`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

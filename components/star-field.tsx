"use client";

import { useMemo } from "react";

type Star = {
  left: number;
  top: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  delay: number;
};

// Deterministic seeded PRNG (mulberry32) so server and client render
// identical star positions and avoid hydration mismatches.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateStars(count: number): Star[] {
  const random = mulberry32(42);
  const stars: Star[] = [];

  for (let index = 0; index < count; index += 1) {
    stars.push({
      left: random() * 100,
      top: random() * 100,
      size: 1 + random(), // 1-2px
      opacity: 0.15 + random() * 0.35, // 0.15-0.5
      twinkle: index % 6 === 0,
      delay: (index * 0.7) % 5,
    });
  }

  return stars;
}

export function StarField() {
  const stars = useMemo(() => generateStars(55), []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {stars.map((star, index) => (
        <span
          key={index}
          className={star.twinkle ? "animate-twinkle" : undefined}
          style={{
            position: "absolute",
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "9999px",
            background: "var(--text-primary)",
            opacity: star.opacity,
            animationDelay: star.twinkle ? `${star.delay}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

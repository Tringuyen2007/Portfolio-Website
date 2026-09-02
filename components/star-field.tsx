"use client";

import { useMemo } from "react";

type Star = {
  left: number;
  top: number;
  size: number;
  opacity: number;
  color: string;
  twinkle: boolean;
  duration: number;
  delay: number;
  glow: boolean;
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

// Mostly cool white with a faint sprinkle of blue/amber, echoing real
// star color temperature without leaning into saturated color.
const STAR_COLORS = ["230, 231, 233", "196, 214, 255", "255, 224, 189"];

function generateStars(count: number): Star[] {
  const random = mulberry32(42);
  const stars: Star[] = [];

  for (let index = 0; index < count; index += 1) {
    // Cubing the roll biases sizes toward the small end, so only a handful
    // of stars land large enough to earn a glow.
    const size = 0.6 + Math.pow(random(), 3) * 2.4;
    const colorRoll = random();
    const color =
      colorRoll < 0.82 ? STAR_COLORS[0] : colorRoll < 0.93 ? STAR_COLORS[1] : STAR_COLORS[2];

    stars.push({
      left: random() * 100,
      top: random() * 100,
      size,
      opacity: 0.12 + random() * 0.4,
      color,
      twinkle: index % 5 === 0,
      duration: 3 + random() * 3,
      delay: (index * 0.7) % 6,
      glow: size > 2.1,
    });
  }

  return stars;
}

export function StarField() {
  const stars = useMemo(() => generateStars(70), []);

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
            background: `rgb(${star.color})`,
            opacity: star.opacity,
            boxShadow: star.glow
              ? `0 0 ${(star.size * 2).toFixed(1)}px rgba(${star.color}, ${(star.opacity * 0.55).toFixed(2)})`
              : undefined,
            animationDuration: star.twinkle ? `${star.duration}s` : undefined,
            animationDelay: star.twinkle ? `${star.delay}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

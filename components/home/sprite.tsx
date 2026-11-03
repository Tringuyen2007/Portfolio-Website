import type { CSSProperties } from "react";

export type SpriteName =
  | "apple-red"
  | "apple-golden"
  | "apple-enchanted"
  | "leaf"
  | "flower"
  | "cursor"
  | "sign-plank";

/** Native 1x dimensions (art px) of the sprites in public/pixel. */
const SIZES: Record<SpriteName, [number, number]> = {
  "apple-red": [12, 12],
  "apple-golden": [12, 12],
  "apple-enchanted": [12, 12],
  leaf: [4, 4],
  flower: [10, 10],
  cursor: [7, 9],
  "sign-plank": [28, 10],
};

/**
 * A 1x pixel sprite scaled by whole art pixels (`--unit` is 4px desktop, 3px mobile).
 * `scale` multiplies the art size, so the image stays on the pixel grid.
 */
export function Sprite({
  name,
  scale = 1,
  alt = "",
  className = "",
  style,
}: {
  name: SpriteName;
  scale?: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const [w, h] = SIZES[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size pixel sprite, no optimisation wanted
    <img
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={`pixelated inline-block shrink-0 select-none ${className}`}
      decoding="async"
      draggable={false}
      height={h}
      // Tiny decorative sprites: lazy keeps React from emitting <link rel=preload>
      // for them, which Chrome flags when they sit below the fold.
      loading="lazy"
      src={`/pixel/${name}.png`}
      style={{
        width: `calc(var(--unit) * ${w * scale})`,
        height: `calc(var(--unit) * ${h * scale})`,
        ...style,
      }}
      width={w}
    />
  );
}

import type { AppleKind } from "@/lib/tree/types";
import { APPLE_LABELS } from "@/lib/tree/types";

/**
 * A 12×12 art-px apple sprite scaled by whole art pixels. `size` is in art
 * pixels (12 = natural size). Nearest-neighbour via `.pixelated`.
 */
export function AppleSprite({
  kind,
  size = 12,
  className = "",
  decorative = true,
}: {
  kind: AppleKind;
  /** Rendered size in art pixels (a multiple of var(--unit)). */
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const dimension = `calc(var(--unit) * ${size})`;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size pixel sprite, no optimisation wanted
    <img
      alt={decorative ? "" : APPLE_LABELS[kind].label}
      aria-hidden={decorative ? true : undefined}
      className={`pixelated inline-block shrink-0 ${className}`}
      decoding="async"
      height={12}
      src={`/pixel/apple-${kind}.png`}
      style={{ width: dimension, height: dimension }}
      width={12}
    />
  );
}

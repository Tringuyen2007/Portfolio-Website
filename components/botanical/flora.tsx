/**
 * Small SVG botanical parts shared by the hero vines and the experience vine.
 * Everything is drawn around the origin so callers position with `transform`.
 * Colors come from the Dusk Orchard tokens so the art follows the theme.
 */

const PETAL = "M0 0C-9-6-9-20 0-22C9-20 9-6 0 0Z";

export function Rose({
  x,
  y,
  size = 1,
  rotate = 0,
  tone = "apple",
}: {
  x: number;
  y: number;
  size?: number;
  rotate?: number;
  tone?: "apple" | "blossom" | "gold";
}) {
  const outer =
    tone === "apple" ? "var(--apple)" : tone === "blossom" ? "var(--blossom)" : "var(--gold)";
  const deep =
    tone === "apple"
      ? "var(--apple-deep)"
      : tone === "blossom"
        ? "var(--blossom-deep)"
        : "var(--gold-deep)";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`}>
      {/* sepals */}
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          d="M0 0C-5-8-4-18 0-24C4-18 5-8 0 0Z"
          fill="var(--leaf-deep)"
          key={`s${a}`}
          transform={`rotate(${a + 36}) scale(1.15)`}
        />
      ))}
      {/* outer petals */}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path d={PETAL} fill={outer} key={`o${a}`} stroke={deep} strokeWidth="0.8" transform={`rotate(${a})`} />
      ))}
      {/* inner petals */}
      {[30, 102, 174, 246, 318].map((a) => (
        <path
          d={PETAL}
          fill={outer}
          key={`i${a}`}
          opacity="0.95"
          stroke={deep}
          strokeWidth="0.8"
          transform={`rotate(${a}) scale(0.62)`}
        />
      ))}
      {/* heart */}
      <circle fill={deep} r="4.2" />
      <path d="M-2.4 0.6C-1.8-2.4 1.2-3 2.6-0.9C3.4 0.9 1.6 2.6-0.4 2C-1.6 1.6-2.2 0.8-1.4-0.2" fill="none" stroke={outer} strokeLinecap="round" strokeWidth="0.9" />
    </g>
  );
}

/** A closed rosebud on a short stem. */
export function Bud({
  x,
  y,
  size = 1,
  rotate = 0,
  tone = "apple",
}: {
  x: number;
  y: number;
  size?: number;
  rotate?: number;
  tone?: "apple" | "blossom";
}) {
  const fill = tone === "apple" ? "var(--apple)" : "var(--blossom)";
  const deep = tone === "apple" ? "var(--apple-deep)" : "var(--blossom-deep)";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`}>
      <path d="M0 2C-7-4-7-16 0-22C7-16 7-4 0 2Z" fill={fill} stroke={deep} strokeWidth="0.8" />
      <path d="M-1 -4C-1-10 1-14 2-18" fill="none" stroke={deep} strokeLinecap="round" strokeWidth="0.8" />
      {[-50, 0, 50].map((a) => (
        <path
          d="M0 2C-4-3-4-12 0-16C4-12 4-3 0 2Z"
          fill="var(--leaf-deep)"
          key={a}
          transform={`rotate(${a}) scale(0.9)`}
        />
      ))}
    </g>
  );
}

/** A single pointed leaf with a mid vein, tip pointing up (negative y). */
export function Leaf({
  x,
  y,
  size = 1,
  rotate = 0,
  flip = false,
}: {
  x: number;
  y: number;
  size?: number;
  rotate?: number;
  flip?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -size : size} ${size})`}>
      <path
        d="M0 0C-11-6-14-20-4-30C6-20 10-6 0 0Z"
        fill="var(--leaf)"
        stroke="var(--leaf-deep)"
        strokeWidth="0.8"
      />
      <path d="M0 -1C-2-10-3-18-4-27" fill="none" stroke="var(--leaf-deep)" strokeLinecap="round" strokeWidth="0.8" />
    </g>
  );
}

/**
 * Thorns distributed along a straight-ish horizontal stem segment.
 * `points` are [x, y] stem positions; thorns alternate above/below.
 */
export function Thorns({
  points,
  size = 1,
}: {
  points: Array<[number, number]>;
  size?: number;
}) {
  return (
    <g fill="#a8846a" stroke="var(--bark-deep)" strokeLinejoin="round" strokeWidth="0.5">
      {points.map(([x, y], i) => {
        const up = i % 2 === 0 ? -1 : 1;
        const lean = i % 3 === 0 ? 3 : -2;
        return (
          <path
            d={`M${x - 3.5 * size} ${y} Q${x + lean * size} ${y + up * 4 * size} ${x + lean * 1.4 * size} ${y + up * 14 * size} Q${x + 2 * size} ${y + up * 4 * size} ${x + 3.5 * size} ${y} Z`}
            key={`${x}-${y}`}
          />
        );
      })}
    </g>
  );
}

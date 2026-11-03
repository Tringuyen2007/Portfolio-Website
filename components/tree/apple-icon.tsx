import { useId } from "react";

import { applePath } from "@/lib/tree/layout";
import { FRUIT_COLORS } from "@/lib/tree/types";
import type { TreeProjectInput } from "@/lib/tree/layout";

/** Small inline apple (or blossom) matching the fruits on the tree. */
export function AppleIcon({
  kind,
  className = "size-6",
}: {
  kind: TreeProjectInput["fruit"];
  className?: string;
}) {
  const id = useId();
  const [light, deep] = FRUIT_COLORS[kind];
  return (
    <svg aria-hidden="true" className={`shrink-0 ${className}`} viewBox="-14 -14 28 28">
      <defs>
        <radialGradient cx="35%" cy="30%" id={id} r="75%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
      </defs>
      {kind === "blossom" ? (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <path d="M0 0C-5-4-5-12 0-13C5-12 5-4 0 0Z" fill={`url(#${id})`} key={a} transform={`rotate(${a})`} />
          ))}
          <circle fill="var(--gold)" r="2.6" />
        </g>
      ) : (
        <g>
          <path d={applePath(10)} fill={`url(#${id})`} />
          <rect fill="var(--bark-deep)" height="6" rx="1" width="2" x="-1" y="-13" />
          <path d="M1 -10 C4 -14 8 -13 9 -10 C6 -8 3 -8 1 -10Z" fill="var(--leaf)" />
        </g>
      )}
    </svg>
  );
}

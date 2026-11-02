import { FRUIT_LABELS } from "@/lib/tree/types";

const ORDER = ["golden", "ripe", "green", "blossom"] as const;

/** Highlight tint per fruit kind: the word itself carries the color, no icon needed. */
const TINT: Record<(typeof ORDER)[number], string> = {
  golden: "bg-gold/15 text-gold",
  ripe: "bg-apple/15 text-[#f0a098]",
  green: "bg-leaf/15 text-[#b6d49c]",
  blossom: "bg-blossom/15 text-blossom",
};

export function TreeLegend({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      aria-label="What the fruits mean"
      className={`flex flex-wrap gap-x-6 gap-y-3 ${compact ? "text-xs" : "text-sm"}`}
    >
      {ORDER.map((kind) => (
        <li className="inline-flex items-baseline gap-2" key={kind}>
          <span className={`rounded-md px-2 py-0.5 font-medium ${TINT[kind]}`}>
            {FRUIT_LABELS[kind].label}
          </span>
          <span className="text-text-secondary">{FRUIT_LABELS[kind].meaning}</span>
        </li>
      ))}
    </ul>
  );
}

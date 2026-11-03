import { AppleSprite } from "@/components/project/apple-sprite";
import { APPLE_LABELS, type AppleKind } from "@/lib/tree/types";

const ORDER: AppleKind[] = ["red", "golden", "enchanted"];

/** The apple itself is the symbol; only its meaning is spelled out. */
export function TreeLegend({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      aria-label="What the apples mean"
      className={`flex flex-wrap gap-x-8 gap-y-3 ${compact ? "text-sm" : "text-[15px]"}`}
    >
      {ORDER.map((kind) => (
        <li className="inline-flex items-center gap-3" key={kind}>
          <AppleSprite kind={kind} size={compact ? 6 : 8} />
          <span>
            <span className="font-label text-[7px] uppercase text-text-primary">{APPLE_LABELS[kind].label}</span>
            <span className="block text-text-secondary">{APPLE_LABELS[kind].meaning}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

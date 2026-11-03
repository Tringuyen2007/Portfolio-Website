import { AppleSprite } from "@/components/project/apple-sprite";
import type { AppleKind } from "@/lib/tree/types";

/**
 * The hero award chip the zoomed apple settles into. Golden for verified
 * awards; the enchanted variant takes the purple rim and the article link.
 */
export function AwardChip({
  apple,
  award,
  articleHref,
}: {
  apple: AppleKind;
  award: string;
  articleHref?: string;
}) {
  const enchanted = apple === "enchanted";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p
        className={`panel inline-flex items-center gap-3 px-3 py-2 font-label text-[9px] uppercase leading-[1.6] tracking-[0.04em] sm:text-[10px] ${
          enchanted ? "text-ench-hi" : "text-gold"
        }`}
        style={enchanted ? { borderColor: "var(--ench)", boxShadow: "inset 0 var(--unit) 0 var(--ench-deep)" } : undefined}
      >
        <AppleSprite kind={apple} size={4} />
        <span>{award}</span>
      </p>
      {enchanted && articleHref ? (
        <a
          className="font-label inline-flex min-h-11 items-center text-[9px] uppercase leading-[1.6] tracking-[0.04em] text-ench-hi underline decoration-ench underline-offset-4 hover:text-text-primary"
          href={articleHref}
          rel="noreferrer"
          target="_blank"
        >
          Read the article ↗
        </a>
      ) : null}
    </div>
  );
}

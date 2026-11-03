import { GROUND_H, GROUND_OVERLAP, STAGE_H, TREE_H, TREE_W } from "@/lib/pixel/orchard";

/**
 * SSR / loading fallback: the static tree sprite at the size the stage will use.
 * `unit` is the preferred scale; CSS caps it with --stage-unit (pixel.css) so a
 * phone gets the same fitted size the live stage computes, and nothing shifts.
 */
export function StagePlaceholder({ failed = false, unit = 4 }: { failed?: boolean; unit?: number }) {
  const u = `min(${unit}, var(--stage-unit))`;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative flex w-full flex-col items-center justify-end overflow-hidden"
      data-orchard-fallback={failed ? "failed" : "loading"}
      style={{ height: `calc(${STAGE_H}px * ${u})` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="pixelated"
        height={TREE_H}
        src="/pixel/tree.png"
        style={{
          width: `calc(${TREE_W}px * ${u})`,
          height: `calc(${TREE_H}px * ${u})`,
          marginBottom: `calc(${GROUND_H - GROUND_OVERLAP}px * ${u})`,
        }}
        width={TREE_W}
      />
      <div
        className="pixelated absolute inset-x-0 bottom-0"
        style={{
          height: `calc(${GROUND_H}px * ${u})`,
          backgroundImage: "url(/pixel/ground.png)",
          backgroundSize: `calc(360px * ${u}) calc(${GROUND_H}px * ${u})`,
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}

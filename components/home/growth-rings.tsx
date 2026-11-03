import type { ExperienceEntry } from "@/content/experience";

import { Sprite } from "@/components/home/sprite";

/** "September 2026" -> "SEP 2026"; "Present" stays. */
function shortDate(value: string) {
  const [month, year] = value.split(" ");
  if (!year) return value;
  return `${month.slice(0, 3)} ${year}`;
}

/**
 * Homepage preview of the experience timeline: a vertical pixel vine
 * (vine-tile.png repeated) with a flower blooming at each role. Current roles glow.
 */
export function GrowthRings({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <ol className="relative ml-[calc(var(--unit)*2)] list-none">
      <div
        aria-hidden="true"
        className="pixelated absolute top-0 bottom-0 left-0"
        style={{
          width: "calc(var(--unit) * 8)",
          backgroundImage: "url(/pixel/vine-tile.png)",
          backgroundSize: "calc(var(--unit) * 8) calc(var(--unit) * 16)",
          backgroundRepeat: "repeat-y",
        }}
      />
      {entries.map((entry) => {
        const current = entry.end === "Present";
        return (
          <li
            className="relative pl-[calc(var(--unit)*8+28px)] pb-10 last:pb-0"
            key={entry.id}
          >
            <span
              aria-hidden="true"
              className="absolute top-0 left-[calc(var(--unit)*-1)] block"
              style={{ width: "calc(var(--unit) * 10)", height: "calc(var(--unit) * 10)" }}
            >
              <Sprite
                name="flower"
                scale={1}
                style={current ? { filter: "drop-shadow(0 0 calc(var(--unit) * 2) #f2b8c6) brightness(1.1)" } : undefined}
              />
            </span>
            <p className="eyebrow-plain">
              {shortDate(entry.start)} — {shortDate(entry.end)}
              {current ? <span className="ml-3 text-leaf-hi">· Current</span> : null}
            </p>
            <h3 className="mt-3 font-heading text-[28px] font-medium leading-tight text-text-primary">
              {entry.organization}
            </h3>
            <p className="mt-1 text-[15px] leading-6 text-accent">{entry.role}</p>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-text-secondary">{entry.summary}</p>
          </li>
        );
      })}
    </ol>
  );
}

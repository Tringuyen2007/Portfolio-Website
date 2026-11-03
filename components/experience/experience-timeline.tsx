import type { ExperienceEntry } from "@/content/experience";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ExperienceDetails } from "@/components/experience/experience-details";

const kindLabel: Record<ExperienceEntry["kind"], string> = {
  professional: "Professional",
  leadership: "Leadership",
  academic: "Academic",
};

/** vine-tile.png is 8×16 art px; it repeats vertically at unit scale. */
const VINE_W = 8;
const VINE_H = 16;
/** flower.png is 10×10 art px; each role blooms on the vine at 1×. */
const FLOWER = 10;

/**
 * The pixel vine. A tiled sprite climbs the gutter; each role is a flower
 * blooming on it. Current roles glow. Everything is a multiple of var(--unit)
 * so the art stays crisp at both breakpoints.
 */
export function ExperienceTimeline({
  entries,
  compact = false,
}: {
  entries: ExperienceEntry[];
  compact?: boolean;
}) {
  const px = (artPixels: number) => `calc(var(--unit) * ${artPixels})`;
  // Gutter layout in art px: stem occupies 4..12, text starts at 20.
  const STEM_LEFT = 4;
  const TEXT_LEFT = 20;

  return (
    <ol className="relative" style={{ paddingLeft: px(TEXT_LEFT) }}>
      {/* vine stem */}
      <span
        aria-hidden="true"
        className="pixelated pointer-events-none absolute top-0 h-[calc(100%-2rem)]"
        style={{
          left: px(STEM_LEFT),
          width: px(VINE_W),
          backgroundImage: "url(/pixel/vine-tile.png)",
          backgroundRepeat: "repeat-y",
          backgroundSize: `${px(VINE_W)} ${px(VINE_H)}`,
        }}
      />

      {entries.map((entry, index) => {
        const current = entry.end === "Present";
        return (
          <li
            className={`relative ${index === entries.length - 1 ? "" : compact ? "pb-14" : "pb-20 sm:pb-24"}`}
            key={entry.id}
          >
            {/* flower on the vine */}
            <span
              aria-hidden="true"
              className="absolute top-1 flex items-center justify-center"
              style={{
                left: px(-TEXT_LEFT + STEM_LEFT + (VINE_W - FLOWER) / 2),
                width: px(FLOWER),
                height: px(FLOWER),
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- pixel sprite at exact art scale */}
              <img
                alt=""
                className="pixelated block size-full"
                height={10}
                loading="lazy"
                src="/pixel/flower.png"
                style={
                  current
                    ? { filter: "drop-shadow(0 0 calc(var(--unit) * 2) #f2b8c6) brightness(1.1)" }
                    : undefined
                }
                width={10}
              />
            </span>
            {/* hairline from the vine to the entry */}
            <span
              aria-hidden="true"
              className="absolute top-[calc(var(--unit)*4)] h-[2px] bg-border"
              style={{ left: px(-TEXT_LEFT + STEM_LEFT + VINE_W), width: px(TEXT_LEFT - STEM_LEFT - VINE_W - 2) }}
            />

            <ScrollReveal delay={index * 0.06}>
              <article className={`grid gap-5 ${compact ? "" : "lg:grid-cols-[13rem_1fr] lg:gap-12"}`}>
                <header className="space-y-3">
                  <p className="font-label text-[8px] uppercase leading-[1.8] tracking-[0.04em] text-text-muted sm:text-[9px]">
                    {entry.start} — {entry.end}
                    <br />
                    <span className="text-text-muted/80">{entry.location}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="pill">{kindLabel[entry.kind]}</span>
                    {current ? <span className="pill pill-active">Current</span> : null}
                  </div>
                </header>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-[28px] font-medium leading-tight text-text-primary sm:text-3xl">
                      {entry.organization}
                    </h2>
                    <p className="mt-1 font-heading text-lg text-gold">{entry.role}</p>
                  </div>

                  <p className="max-w-2xl text-base leading-7 text-text-secondary">{entry.summary}</p>

                  {compact ? null : <ExperienceDetails entry={entry} />}
                </div>
              </article>
            </ScrollReveal>
          </li>
        );
      })}

      {/* ground at the base of the vine */}
      <li aria-hidden="true" className="relative h-8">
        <span
          className="pixelated absolute top-0"
          style={{
            left: px(-TEXT_LEFT),
            width: px(16),
            height: px(4),
            backgroundImage: "url(/pixel/ground.png)",
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
          }}
        />
      </li>
    </ol>
  );
}

import type { ExperienceEntry } from "@/content/experience";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ExperienceDetails } from "@/components/experience/experience-details";

const kindLabel: Record<ExperienceEntry["kind"], string> = {
  professional: "Professional",
  leadership: "Leadership",
  academic: "Academic",
};

export function ExperienceTimeline({
  entries,
  compact = false,
}: {
  entries: ExperienceEntry[];
  compact?: boolean;
}) {
  return (
    <ol className="relative space-y-14 border-l border-border pl-8 sm:space-y-20 sm:pl-12">
      {entries.map((entry, index) => (
        <li className="relative" key={entry.id}>
          <span
            aria-hidden="true"
            className="absolute -left-8 top-3 flex size-4 -translate-x-1/2 items-center justify-center sm:-left-12"
          >
            <span
              className={`block size-2.5 rounded-full ${
                entry.end === "Present" ? "bg-leaf" : "bg-accent"
              }`}
            />
            {entry.end === "Present" ? (
              <span className="absolute inset-0 rounded-full border border-leaf/60 motion-safe:animate-[pulse-ring_2.6s_ease-out_infinite]" />
            ) : null}
          </span>

          <ScrollReveal delay={index * 0.06}>
            <article
              className={`grid gap-6 ${
                compact ? "" : "lg:grid-cols-[14rem_1fr] lg:gap-12"
              }`}
            >
              <header className="space-y-2">
                <p className="eyebrow-plain">
                  {entry.start} — {entry.end}
                </p>
                <p className="text-sm text-text-muted">{entry.location}</p>
                <p className="pill mt-1 text-xs">{kindLabel[entry.kind]}</p>
              </header>

              <div className="space-y-4">
                <div>
                  <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">
                    {entry.organization}
                  </h2>
                  <p className="mt-1 text-base text-text-secondary">{entry.role}</p>
                </div>

                <p className="max-w-2xl text-base leading-8 text-text-secondary">{entry.summary}</p>

                {compact ? null : <ExperienceDetails entry={entry} />}
              </div>
            </article>
          </ScrollReveal>
        </li>
      ))}
    </ol>
  );
}

"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

import { Bud, Leaf, Rose } from "@/components/botanical/flora";
import type { ExperienceEntry } from "@/content/experience";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ExperienceDetails } from "@/components/experience/experience-details";

const kindLabel: Record<ExperienceEntry["kind"], string> = {
  professional: "Professional",
  leadership: "Leadership",
  academic: "Academic",
};

/**
 * The climbing vine. A gently winding stem drawn once in a tall viewBox and
 * stretched to the list's height (non-scaling stroke keeps it crisp). It grows
 * with scroll: the stem is drawn as you read down, like the vine is climbing.
 *
 * Nodes sit in a gutter whose center is the vine's average x, and the wiggle
 * amplitude is smaller than the node radius so every node lands on the stem.
 */
const VINE_PATH =
  "M50 0 C68 90 30 170 50 260 S72 420 50 520 S30 680 50 780 S70 920 50 1000";

export function ExperienceTimeline({
  entries,
  compact = false,
}: {
  entries: ExperienceEntry[];
  compact?: boolean;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 55%"],
  });
  const growth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });

  return (
    <ol className="relative pl-16 sm:pl-20" ref={ref}>
      {/* vine stem */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[calc(100%-2.5rem)] w-16 sm:w-20"
        preserveAspectRatio="none"
        viewBox="0 0 100 1000"
      >
        <defs>
          <linearGradient id="exp-vine" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--leaf)" />
            <stop offset="0.6" stopColor="var(--leaf-deep)" />
            <stop offset="1" stopColor="var(--bark-deep)" />
          </linearGradient>
        </defs>
        {/* faint full stem so the route is always legible */}
        <path
          d={VINE_PATH}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d={VINE_PATH}
          fill="none"
          stroke="url(#exp-vine)"
          strokeLinecap="round"
          strokeWidth="3"
          style={{ pathLength: reduce ? 1 : growth }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {entries.map((entry, index) => {
        const current = entry.end === "Present";
        const side = index % 2 === 0 ? 1 : -1;
        return (
          <li
            className={`relative ${index === entries.length - 1 ? "" : compact ? "pb-14" : "pb-20 sm:pb-24"}`}
            key={entry.id}
          >
            {/* node: open rose for the current role, bud for past roles */}
            {/* hairline from the vine to the entry */}
            <span
              aria-hidden="true"
              className="absolute top-9 -left-8 h-px w-8 bg-border sm:-left-10 sm:w-10"
            />

            <ScrollReveal
              className="absolute top-0 -left-8 size-16 -translate-x-1/2 sm:-left-10 sm:size-20"
              delay={0.1}
            >
              <svg
                aria-hidden="true"
                className="size-full overflow-visible"
                viewBox="-36 -36 72 72"
              >
                <Leaf flip rotate={-55} size={0.7} x={-8} y={-16} />
                <Leaf rotate={70} size={0.65} x={6} y={22} />
                {current ? (
                  <>
                    <circle fill="var(--blossom)" fillOpacity="0.12" r="30" />
                    <circle
                      className="motion-safe:animate-[pulse-ring_2.8s_ease-out_infinite]"
                      fill="none"
                      r="16"
                      stroke="var(--blossom)"
                      strokeOpacity="0.6"
                      style={{ transformOrigin: "0 0" }}
                    />
                    <Rose rotate={side * 10} size={1.15} tone="blossom" x={0} y={0} />
                  </>
                ) : (
                  <Bud rotate={side * 18} size={1.1} x={0} y={10} />
                )}
              </svg>
              {current ? (
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-heading text-xs italic text-blossom">
                  In bloom
                </span>
              ) : null}
            </ScrollReveal>

            <ScrollReveal delay={index * 0.06}>
              <article
                className={`grid gap-6 ${compact ? "" : "lg:grid-cols-[13rem_1fr] lg:gap-12"}`}
              >
                <header className="space-y-2 pt-3">
                  <p className="eyebrow-plain text-text-secondary">
                    {entry.start} — {entry.end}
                    <span className="mx-2 inline-block h-px w-4 translate-y-[-3px] bg-border" />
                    <span className="text-text-muted">{entry.location}</span>
                  </p>
                  <p className="pill mt-1 text-xs">{kindLabel[entry.kind]}</p>
                </header>

                <div className="space-y-4 lg:pt-3">
                  <div>
                    <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">
                      {entry.organization}
                    </h2>
                    <p className="mt-1 font-heading text-lg italic text-text-secondary">{entry.role}</p>
                  </div>

                  <p className="max-w-2xl text-base leading-8 text-text-secondary">{entry.summary}</p>

                  {compact ? null : <ExperienceDetails entry={entry} />}
                </div>
              </article>
            </ScrollReveal>
          </li>
        );
      })}

      {/* roots at the base of the vine */}
      <li aria-hidden="true" className="relative h-10">
        <svg
          className="absolute -left-8 top-0 h-10 w-24 -translate-x-1/2 overflow-visible sm:-left-10"
          viewBox="-48 0 96 40"
        >
          <g fill="none" stroke="var(--bark)" strokeLinecap="round" strokeWidth="2">
            <path d="M0 -2 C-2 10 -10 14 -20 18 C-30 22 -38 24 -44 30" />
            <path d="M0 -2 C2 10 10 14 20 18 C30 22 36 26 42 32" />
            <path d="M0 -2 C-1 12 -4 22 -10 36" strokeWidth="1.4" />
            <path d="M0 -2 C1 12 6 20 12 32" strokeWidth="1.4" />
            <path d="M0 -2 C0 14 2 26 1 38" strokeWidth="1.1" />
          </g>
        </svg>
      </li>
    </ol>
  );
}

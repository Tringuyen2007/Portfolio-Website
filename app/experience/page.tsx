import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience and tech stack for Tri Nguyen — software engineer focused on AI, data science, and full-stack systems.",
  alternates: {
    canonical: "/experience",
  },
};

const experience = [
  {
    company: "CooledTured LLC",
    location: "Bensenville, IL",
    title: "Software Engineer",
    start: "April 2026",
    end: "Present",
    bullets: [
      "Building authentication systems, cloud deployment infrastructure, and data management pipelines using AWS, Kubernetes, and Docker",
      "Developing full-stack features for player registration, tournament organization, match reporting, and store management systems",
    ],
    tech: ["AWS", "Kubernetes", "Docker", "Next.js", "TypeScript", "Flask"],
  },
];

const skillGroups = [
  { label: "Cloud", skills: ["AWS"] },
  { label: "Infrastructure", skills: ["Kubernetes", "Docker"] },
  { label: "Full-Stack", skills: ["Next.js", "TypeScript", "Flask"] },
  { label: "Languages", skills: ["TypeScript"] },
];

export default function ExperiencePage() {
  return (
    <section className="py-18 sm:py-24">
      <Container className="max-w-3xl">
        {/* Page header */}
        <div className="space-y-4 mb-16">
          <span className="eyebrow">Experience</span>
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
            Where I&apos;ve worked.
          </h1>
          <p className="text-base leading-8 text-text-secondary sm:text-lg">
            A record of the roles and projects that shaped how I build.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-border pl-8 space-y-12">
          {experience.map((job) => (
            <div key={job.company + job.start} className="relative">
              {/* Dot on the timeline line */}
              <span className="absolute -left-[2.125rem] top-1.5 flex h-3 w-3 items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full bg-accent block" />
              </span>

              {/* Header row */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-lg font-semibold text-text-primary">
                  {job.company}
                </span>
                <span className="text-sm text-text-muted">
                  {job.start} – {job.end}
                </span>
              </div>

              {/* Subtitle row */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mt-0.5">
                <span className="text-sm text-text-secondary">{job.title}</span>
                <span className="text-sm text-text-muted">{job.location}</span>
              </div>

              {/* Bullets */}
              <ul className="mt-4 space-y-2">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="text-sm leading-7 text-text-secondary pl-4 border-l border-border"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* Tech pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tech.map((tag) => (
                  <span className="pill" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skills section */}
        <div className="mt-20 pt-12 border-t border-border space-y-8">
          <span className="eyebrow">Tech &amp; Tools</span>
          <div className="space-y-6">
            {skillGroups.map((group) => (
              <div key={group.label} className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-text-muted w-24 shrink-0">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span className="pill" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Writing",
  description: "Writing is planned for the next phase of the portfolio.",
  alternates: {
    canonical: "/writing",
  },
};

export default function WritingPage() {
  return (
    <section className="py-18 sm:py-24">
      <Container className="max-w-3xl space-y-6">
        <span className="eyebrow">Writing</span>
        <h1 className="text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
          The writing section is next.
        </h1>
        <p className="text-base leading-8 text-text-secondary sm:text-lg">
          I want this area to hold thoughtful project notes, lessons learned, and
          short essays on AI, data science, and building well. For now, the clearest
          place to start is still the project work itself.
        </p>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-3 text-sm font-medium text-text-primary hover:bg-bg-soft"
          href="/projects"
        >
          Browse projects instead
        </Link>
      </Container>
    </section>
  );
}

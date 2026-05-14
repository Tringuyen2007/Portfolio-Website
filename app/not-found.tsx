import Link from "next/link";

import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <section className="py-18 sm:py-24">
      <Container className="max-w-3xl space-y-6">
        <span className="eyebrow">404</span>
        <h1 className="text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
          That page is not here.
        </h1>
        <p className="text-base leading-8 text-text-secondary sm:text-lg">
          The route may have changed, or it may not exist yet. The project index is
          the best place to jump back in.
        </p>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-3 text-sm font-medium text-text-primary hover:bg-bg-soft"
          href="/projects"
        >
          Back to projects
        </Link>
      </Container>
    </section>
  );
}

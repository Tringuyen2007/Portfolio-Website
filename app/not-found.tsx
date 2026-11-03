import Link from "next/link";

import { Container } from "@/components/container";
import { Sprite } from "@/components/home/sprite";

export default function NotFound() {
  return (
    <section className="py-18 sm:py-24">
      <Container className="max-w-3xl">
        <div className="panel space-y-6 p-8 sm:p-12">
          <div className="flex items-center gap-4">
            <Sprite name="apple-red" />
            <p className="eyebrow-plain text-accent">404 · Fell off the tree</p>
          </div>
          <h1 className="font-heading text-4xl font-bold leading-[1.05] text-text-primary sm:text-5xl">
            That page is not here.
          </h1>
          <p className="max-w-[640px] text-[17px] leading-[29px] text-text-secondary">
            The route may have changed, or it may not exist yet. The project tree is the best
            place to jump back in.
          </p>
          <Link className="btn-primary" href="/projects">
            Back to the tree
          </Link>
        </div>
      </Container>
    </section>
  );
}

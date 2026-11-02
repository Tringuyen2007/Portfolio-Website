"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { siteConfig } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="space-y-8">
            <motion.p className="eyebrow" {...reveal(0.05)}>
              A living portfolio · The tree of my journey
            </motion.p>

            <h1 className="font-heading font-semibold leading-[0.9] tracking-[-0.05em] text-text-primary">
              <motion.span
                className="block text-[clamp(4rem,14vw,10.5rem)] italic text-accent"
                style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
                {...reveal(0.15)}
              >
                Tri
              </motion.span>
              <motion.span className="block text-[clamp(4rem,14vw,10.5rem)]" {...reveal(0.28)}>
                Nguyen
              </motion.span>
            </h1>

            <motion.p className="max-w-xl text-base leading-8 text-text-secondary sm:text-lg" {...reveal(0.42)}>
              Computer science student at UT San Antonio. I build AI, computer vision, and
              full-stack projects, many of them over hackathon weekends, and I keep planting
              new ones. This site is the tree they grow on.
            </motion.p>

            <motion.div className="flex flex-wrap gap-3" {...reveal(0.52)}>
              <Link className="btn-primary" href="/projects">
                Explore the tree
                <ArrowRight className="size-4" />
              </Link>
              <Link className="btn-secondary" href="/experience">
                Experience
              </Link>
              <Link className="btn-secondary" href="/contact">
                Contact &amp; Resume
              </Link>
            </motion.div>
          </div>

          <motion.figure
            className="relative mx-auto w-full max-w-sm"
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.96, y: 16 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  transition: { duration: 1, delay: 0.3, ease: EASE },
                })}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-[1.6rem] border border-border bg-bg-soft">
              <Image
                alt="Portrait of Tri Nguyen"
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 28vw, 80vw"
                src="/images/profile.jpg"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
              <span>Fig. 01 · The gardener</span>
              <span>San Antonio, TX</span>
            </figcaption>
          </motion.figure>
        </div>

        <motion.a
          aria-label="Scroll to about section"
          className="mt-16 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted hover:text-text-primary"
          href="#about"
          {...reveal(0.8)}
        >
          <ArrowDown className="size-3.5 motion-safe:animate-bounce" />
          Scroll to walk the orchard
        </motion.a>
      </Container>
      <span className="sr-only">{siteConfig.description}</span>
    </section>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">{children}</div>;
}

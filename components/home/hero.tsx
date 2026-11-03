"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";

import { Container } from "@/components/container";
import { CloudBank } from "@/components/home/cloud-bank";
import { siteConfig } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  // Same markup on server and client (no hydration mismatch); `data-reveal` lets
  // globals.css pin these visible and still under prefers-reduced-motion.
  const reveal = (delay: number) => ({
    "data-reveal": "",
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section
      className="relative flex min-h-[calc(100svh-72px)] flex-col justify-between overflow-hidden"
      ref={heroRef}
    >
      <Container className="relative z-10 flex flex-1 flex-col justify-center pt-14 pb-[calc(var(--unit)*66)] sm:pt-20">
        <div className="max-w-4xl space-y-8">
          <motion.p className="eyebrow-plain text-accent sm:text-[10px]" {...reveal(0.05)}>
            CS @ UT San Antonio · AI / Computer Vision / Full-Stack
          </motion.p>

          <motion.h1
            className="font-heading text-[64px] font-bold leading-[0.95] text-text-primary uppercase md:text-[clamp(64px,9.2vw,132px)]"
            {...reveal(0.15)}
          >
            {siteConfig.name}
          </motion.h1>

          <motion.p
            className="max-w-[640px] text-[17px] leading-[29px] text-text-secondary"
            {...reveal(0.3)}
          >
            His name is Tri(tree) and he loves to eat.
          </motion.p>

          <motion.div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" {...reveal(0.42)}>
            <Link className="btn-primary min-h-11 justify-center sm:w-auto" href="/projects">
              Explore the tree
            </Link>
            <Link className="btn-secondary min-h-11 justify-center sm:w-auto" href="/experience">
              Experience
            </Link>
            <Link className="btn-secondary min-h-11 justify-center sm:w-auto" href="/contact">
              Contact &amp; Resume
            </Link>
          </motion.div>
        </div>

        <motion.a
          className="eyebrow-plain mt-16 inline-flex min-h-11 w-fit items-center gap-3 hover:text-text-primary sm:mt-20"
          href="#about"
          {...reveal(0.7)}
        >
          <span
            aria-hidden="true"
            className="block bg-accent motion-safe:animate-bounce"
            style={{ width: "calc(var(--unit) * 2)", height: "calc(var(--unit) * 2)" }}
          />
          Scroll to walk the orchard
        </motion.a>
      </Container>

      <CloudBank heroRef={heroRef} />
      <span className="sr-only">{siteConfig.description}</span>
    </section>
  );
}

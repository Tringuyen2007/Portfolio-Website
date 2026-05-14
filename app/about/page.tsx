import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Tri Nguyen, his focus on AI and data science, and the kind of software work he wants to grow into.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/about"),
    sameAs: [siteConfig.githubUrl],
  };

  return (
    <>
      <JsonLd data={personJsonLd} />

      <section className="py-18 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="surface overflow-hidden">
            <div className="relative aspect-[4/5]">
              <Image
                alt="Tri Nguyen portrait"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                src="/images/profile.jpg"
              />
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <span className="eyebrow">About</span>
              <h1 className="text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl">
                Building range, depth, and a calmer way of presenting technical work.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                I&apos;m {siteConfig.name}, a computer science student at{" "}
                {siteConfig.school}. Right now I&apos;m especially drawn to projects
                that combine technical substance with clear product thinking:
                systems that solve a real problem, explain themselves well, and feel
                polished enough that someone would actually want to use them.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="surface p-6">
                <h2 className="text-lg font-semibold text-text-primary">What I care about</h2>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  AI and data science are the themes that keep pulling me back, but I
                  care just as much about the user-facing side: clear interfaces,
                  good defaults, and systems that stay understandable as they grow.
                </p>
              </div>

              <div className="surface p-6">
                <h2 className="text-lg font-semibold text-text-primary">How I learn</h2>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  I like learning by building. Real constraints, messy edges, and
                  iterative improvements teach me more than isolated demos ever do.
                </p>
              </div>

              <div className="surface p-6">
                <h2 className="text-lg font-semibold text-text-primary">What I&apos;m growing toward</h2>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  Stronger engineering judgment, deeper AI and data work, and a
                  portfolio of projects that feel credible to both technical peers and
                  non-technical collaborators.
                </p>
              </div>

              <div className="surface p-6">
                <h2 className="text-lg font-semibold text-text-primary">Outside of code</h2>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  I also enjoy lifting weights, listening to music, and spending time
                  with the people closest to me. That balance matters to how I work,
                  too: I want ambition without unnecessary noise.
                </p>
              </div>
            </div>

            <div className="surface p-6">
              <h2 className="text-lg font-semibold text-text-primary">Current toolkit</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {siteConfig.skills.map((skill) => (
                  <span className="pill" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";

import { Container } from "@/components/container";
import { AboutSection } from "@/components/home/about";
import { GrowthRings } from "@/components/home/growth-rings";
import { Hero } from "@/components/home/hero";
import { SectionHeading } from "@/components/home/section-heading";
import { Sprite, type SpriteName } from "@/components/home/sprite";
import { TreePreview } from "@/components/home/tree-preview";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { experience } from "@/content/experience";
import { getAllProjects } from "@/lib/content/projects";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { toTreeProject } from "@/lib/tree/projects";

const LEGEND: { sprite: SpriteName; label: string; meaning: string }[] = [
  { sprite: "apple-red", label: "Red", meaning: "Project or hackathon build" },
  { sprite: "apple-golden", label: "Golden", meaning: "Verified award" },
  { sprite: "apple-enchanted", label: "Enchanted", meaning: "Red Bull Basement finalist" },
];

export default function HomePage() {
  const projects = getAllProjects()
    .filter((project) => !project.archived)
    .map(toTreeProject);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    sameAs: [siteConfig.githubUrl, siteConfig.linkedinUrl],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.school,
    },
  };

  const helloHref = siteConfig.contactEmail
    ? `mailto:${siteConfig.contactEmail}`
    : "/contact";

  return (
    <>
      <JsonLd data={personJsonLd} />

      <Hero />

      {/* 01 About me */}
      <section className="scroll-mt-24 py-16 sm:py-20" id="about">
        <Container>
          <ScrollReveal>
            <AboutSection projects={projects} />
          </ScrollReveal>
        </Container>
      </section>

      <div aria-hidden="true" className="section-rule" />

      {/* 02 Projects & events */}
      <section className="scroll-mt-24 py-16 sm:py-20" id="tree">
        <Container className="space-y-10">
          <ScrollReveal>
            <div className="space-y-8">
              <SectionHeading title="How the tree has grown.">
                <p className="max-w-[640px] text-[17px] leading-[29px] text-text-secondary">
                  Each apple on this tree is a project, a hackathon, or an event. Golden apples
                  are the ones that came home with an award. One enchanted apple marks
                  Vision&rsquo;s run to the Red Bull Basement U.S. National Finals. The tree keeps
                  growing as I do.
                </p>
              </SectionHeading>
              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-text-secondary">
                {LEGEND.map((item) => (
                  <li className="flex items-center gap-3" key={item.sprite}>
                    <Sprite name={item.sprite} />
                    <span>
                      <span className="font-heading text-lg font-medium text-text-primary">
                        {item.label}
                      </span>
                      <span className="text-text-muted"> = {item.meaning}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <TreePreview projects={projects} />
          </ScrollReveal>
        </Container>
      </section>

      <div aria-hidden="true" className="section-rule" />

      {/* 03 Growth rings */}
      <section className="scroll-mt-24 py-16 sm:py-20" id="experience">
        <Container className="space-y-12">
          <ScrollReveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading title="Where the vine has climbed." />
              <Link className="btn-secondary shrink-0 self-start sm:self-auto" href="/experience">
                Full experience <span aria-hidden="true">▸</span>
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <GrowthRings entries={experience} />
          </ScrollReveal>
        </Container>
      </section>

      <div aria-hidden="true" className="section-rule" />

      {/* 04 Plant something */}
      <section className="py-16 sm:py-20" id="contact">
        <Container>
          <ScrollReveal>
            <div className="panel grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <SectionHeading title="Have a seed of an idea?">
                <p className="max-w-[640px] text-[17px] leading-[29px] text-text-secondary">
                  Internships, collaborations, hackathon teams, or a good conversation about AI and
                  software. My inbox is always in season.
                </p>
              </SectionHeading>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {helloHref.startsWith("mailto:") ? (
                  <a className="btn-primary justify-center" href={helloHref}>
                    <span aria-hidden="true">✉</span> Say hello
                  </a>
                ) : (
                  <Link className="btn-primary justify-center" href={helloHref}>
                    <span aria-hidden="true">✉</span> Say hello
                  </Link>
                )}
                <a
                  className="btn-secondary justify-center"
                  href={siteConfig.resumePath}
                  rel="noreferrer"
                  target="_blank"
                >
                  Resume
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <div aria-hidden="true" className="section-rule" />

      {/* 05 Closing quote */}
      <section className="py-24 sm:py-32">
        <Container>
          <ScrollReveal>
            <figure className="mx-auto max-w-3xl text-center">
              <Sprite className="mx-auto mb-8" name="leaf" scale={2} />
              <blockquote className="font-heading text-3xl leading-tight text-text-primary sm:text-[44px]">
                &ldquo;All truly strong people are kind.&rdquo;
              </blockquote>
              <figcaption className="eyebrow-plain mt-8 text-text-primary">
                <cite className="not-italic">Vagabond</cite>
              </figcaption>
            </figure>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}

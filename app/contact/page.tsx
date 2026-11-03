import type { Metadata } from "next";

import { Container } from "@/components/container";
import { ScrollReveal } from "@/components/scroll-reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Resume",
  description:
    "Get in touch with Tri Nguyen for collaborations, hackathons, internships, or technical conversations, and view or download his resume.",
  alternates: {
    canonical: "/contact",
  },
};

const eyebrow = "font-label text-[8px] uppercase leading-[1.8] tracking-[0.04em] text-gold sm:text-[9px]";
const cardLink =
  "mt-5 inline-flex min-h-11 items-center gap-2 break-all text-[15px] text-text-primary underline decoration-border underline-offset-4 hover:decoration-accent";

type ContactCard = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  label: string;
  external: boolean;
};

export default function ContactPage() {
  const hasEmail = Boolean(siteConfig.contactEmail);

  const cards: ContactCard[] = [
    ...(hasEmail
      ? [
          {
            eyebrow: "Email",
            title: "Say hello.",
            body: "The fastest route if you want a direct reply.",
            href: `mailto:${siteConfig.contactEmail}`,
            label: siteConfig.contactEmail,
            external: false,
          },
        ]
      : []),
    {
      eyebrow: "GitHub",
      title: "Read the code.",
      body: "Browse the repositories and the code behind every apple on the tree.",
      href: siteConfig.githubUrl,
      label: siteConfig.githubHandle,
      external: true,
    },
    {
      eyebrow: "LinkedIn",
      title: "Stay in touch.",
      body: "Connect to keep in touch or learn more about my background.",
      href: siteConfig.linkedinUrl,
      label: "Connect on LinkedIn",
      external: true,
    },
  ];

  return (
    <section className="py-18 sm:py-24">
      <Container className="space-y-16">
        <div className="max-w-3xl space-y-5">
          <h1 className="font-heading text-5xl font-bold leading-[0.95] text-text-primary sm:text-6xl">
            Let&apos;s grow something together.
          </h1>
          <p className="text-base leading-8 text-text-secondary sm:text-[17px]">
            If you want to talk about a project, a collaboration, a hackathon idea, or just compare
            notes on AI and software, reach out. I keep the contact flow intentionally light.
          </p>
        </div>

        <div className={`grid gap-5 ${cards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {cards.map((card, index) => (
            <ScrollReveal delay={index * 0.06} key={card.eyebrow}>
              <div className="panel flex h-full flex-col p-6">
                <p className={eyebrow}>{card.eyebrow}</p>
                <h2 className="mt-3 font-heading text-[28px] font-medium leading-tight text-text-primary">
                  {card.title}
                </h2>
                <p className="mt-3 flex-1 text-[15px] leading-7 text-text-secondary">{card.body}</p>
                <a
                  className={cardLink}
                  href={card.href}
                  rel={card.external ? "noreferrer" : undefined}
                  target={card.external ? "_blank" : undefined}
                >
                  {card.label}
                  {card.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="section-rule" />

        <div className="scroll-mt-28 space-y-6" id="resume">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="eyebrow-plain">Resume</p>
              <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
                The one-page version.
              </h2>
            </div>
            <a className="btn-primary justify-center" download href={siteConfig.resumePath}>
              Download resume
              <span aria-hidden="true">▼</span>
            </a>
          </div>
          <ScrollReveal>
            <div className="panel p-[calc(var(--unit)*2)]">
              <iframe
                className="h-[70vh] min-h-[32rem] w-full border-0 bg-bg-soft"
                src={`${siteConfig.resumePath}#view=FitH`}
                title="Tri Nguyen resume"
              />
            </div>
            <p className="mt-3 text-[15px] leading-7 text-text-muted">
              If the preview does not load in your browser,{" "}
              <a className="text-text-primary underline underline-offset-4" href={siteConfig.resumePath}>
                open the PDF directly
              </a>
              .
            </p>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

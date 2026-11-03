import Link from "next/link";

import { Container } from "@/components/container";
import { buildTimestamp, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer
      className="shrink-0 bg-bg/[0.94]"
      style={{ borderTop: "var(--unit) solid var(--border)" }}
    >
      <Container className="flex min-h-24 flex-col justify-center gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="eyebrow-plain">
          {siteConfig.name} · still growing · last pruned {buildTimestamp}
        </p>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
          {siteConfig.navItems.map((item) => (
            <Link
              className="inline-flex min-h-11 items-center hover:text-text-primary"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <a
            className="inline-flex min-h-11 items-center hover:text-text-primary"
            href={siteConfig.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a
            className="inline-flex min-h-11 items-center hover:text-text-primary"
            href={siteConfig.linkedinUrl}
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
        </nav>
      </Container>
    </footer>
  );
}

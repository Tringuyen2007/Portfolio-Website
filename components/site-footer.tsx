import Link from "next/link";
import { FolderGit2 } from "lucide-react";

import { Container } from "@/components/container";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { buildTimestamp, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-border/90 py-10">
      <Container className="flex flex-col gap-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-heading text-lg text-text-primary">{siteConfig.name}</p>
          <p>Still growing · last pruned {buildTimestamp}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-5">
          {siteConfig.navItems.map((item) => (
            <Link className="hover:text-text-primary" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <a
            aria-label="GitHub"
            className="inline-flex items-center gap-2 hover:text-text-primary"
            href={siteConfig.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            <FolderGit2 className="size-4" />
          </a>
          <a
            aria-label="LinkedIn"
            className="inline-flex items-center gap-2 hover:text-text-primary"
            href={siteConfig.linkedinUrl}
            rel="noreferrer"
            target="_blank"
          >
            <LinkedinIcon className="size-4" />
          </a>
        </nav>
      </Container>
    </footer>
  );
}

import Link from "next/link";
import { FolderGit2 } from "lucide-react";

import { Container } from "@/components/container";
import { buildTimestamp, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/90 py-8">
      <Container className="flex flex-col gap-4 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-text-secondary">
            {siteConfig.name} · built with Next.js, MDX, and a deliberately calm system.
          </p>
          <p>Last updated {buildTimestamp}</p>
        </div>

        <div className="flex items-center gap-5">
          <Link className="hover:text-text-primary" href="/projects">
            Work
          </Link>
          <Link className="hover:text-text-primary" href="/about">
            About
          </Link>
          <a
            className="inline-flex items-center gap-2 hover:text-text-primary"
            href={siteConfig.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            <FolderGit2 className="size-4" />
            GitHub
          </a>
        </div>
      </Container>
    </footer>
  );
}

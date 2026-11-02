import { ArrowUpRight } from "lucide-react";

import type { ExperienceEntry } from "@/content/experience";

/**
 * Essential accomplishments stay visible; only the long tail (links, images)
 * sits inside a native <details> so nothing important is hover-gated.
 */
export function ExperienceDetails({ entry }: { entry: ExperienceEntry }) {
  const hasExtras = Boolean(entry.links?.length || entry.images?.length);

  return (
    <div className="space-y-5">
      <ul className="space-y-2">
        {entry.responsibilities.map((item) => (
          <li
            className="relative pl-5 text-sm leading-7 text-text-secondary before:absolute before:left-0 before:top-[0.8em] before:size-1.5 before:rounded-full before:bg-leaf"
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>

      {entry.achievements?.length ? (
        <ul className="space-y-2">
          {entry.achievements.map((item) => (
            <li
              className="relative pl-5 text-sm leading-7 text-text-primary before:absolute before:left-0 before:top-[0.8em] before:size-1.5 before:rounded-full before:bg-gold"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {entry.technologies.length ? (
        <div className="flex flex-wrap gap-2">
          {entry.technologies.map((tag) => (
            <span className="pill text-xs" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {hasExtras ? (
        <details className="group">
          <summary className="cursor-pointer text-sm text-text-muted hover:text-text-primary">
            More from this role
          </summary>
          <div className="mt-3 flex flex-wrap gap-4">
            {entry.links?.map((link) => (
              <a
                className="inline-flex items-center gap-1 text-sm text-text-primary hover:text-accent-strong"
                href={link.href}
                key={link.href}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

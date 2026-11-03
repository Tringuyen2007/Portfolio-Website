import type { ExperienceEntry } from "@/content/experience";

const bullet =
  "relative pl-5 text-[15px] leading-7 text-text-secondary before:absolute before:left-0 before:top-[0.65em] before:size-[var(--unit)]";

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
          <li className={`${bullet} before:bg-leaf`} key={item}>
            {item}
          </li>
        ))}
      </ul>

      {entry.achievements?.length ? (
        <ul className="space-y-2">
          {entry.achievements.map((item) => (
            <li className={`${bullet} text-text-primary before:bg-gold`} key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {entry.technologies.length ? (
        <div className="flex flex-wrap gap-2">
          {entry.technologies.map((tag) => (
            <span className="pill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {hasExtras ? (
        <details className="group">
          <summary className="cursor-pointer font-label text-[8px] uppercase leading-[1.8] tracking-[0.04em] text-text-muted hover:text-text-primary sm:text-[9px]">
            More from this role
          </summary>
          <div className="mt-3 flex flex-wrap gap-4">
            {entry.links?.map((link) => (
              <a
                className="inline-flex items-center gap-1 text-[15px] text-text-primary underline decoration-border underline-offset-4 hover:decoration-accent"
                href={link.href}
                key={link.href}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  // The menu remembers which route it was opened on, so navigating closes it
  // without an effect. Escape and the scrim close it explicitly.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const isOpen = openedOn === pathname;
  const setIsOpen = (next: boolean | ((open: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(isOpen) : next;
    setOpenedOn(value ? pathname : null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOn(null);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <header
      className="sticky top-0 z-50 shrink-0 bg-bg/[0.94]"
      style={{ borderBottom: "var(--unit) solid var(--border)" }}
    >
      <Container className="flex h-[calc(72px-var(--unit))] items-center justify-between">
        <Link
          className="font-label inline-flex min-h-11 items-center text-[12px] uppercase text-text-primary hover:text-accent"
          href="/"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {siteConfig.navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`font-heading inline-flex min-h-11 items-center text-lg font-medium ${
                  active ? "text-accent" : "text-text-secondary hover:text-text-primary"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="panel relative flex size-11 flex-col items-center justify-center gap-[3px] text-text-primary md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <span
            aria-hidden="true"
            className={`block h-[3px] w-5 bg-current transition-transform ${
              isOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`block h-[3px] w-5 bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            aria-hidden="true"
            className={`block h-[3px] w-5 bg-current transition-transform ${
              isOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </Container>

      {isOpen ? (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-40 md:hidden" id="mobile-menu">
          <button
            aria-label="Close menu"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/60"
            onClick={() => setIsOpen(false)}
            tabIndex={-1}
            type="button"
          />
          <nav
            aria-label="Mobile"
            className="relative max-h-full overflow-y-auto bg-bg/[0.94] px-5 pt-5 pb-8"
            style={{ borderBottom: "var(--unit) solid var(--border)" }}
          >
            <ul className="flex flex-col gap-3">
              {siteConfig.navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`panel font-heading flex h-16 items-center px-5 text-xl font-medium ${
                        active ? "text-accent" : "text-text-primary hover:bg-bg-soft"
                      }`}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex gap-3">
              <a
                className="btn-secondary flex-1 justify-center"
                href={siteConfig.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                className="btn-secondary flex-1 justify-center"
                href={siteConfig.linkedinUrl}
                rel="noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

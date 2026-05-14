"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/65">
      <Container className="flex h-20 items-center justify-between">
        <Link
          className="inline-flex items-center gap-3 text-sm tracking-[0.18em] text-text-secondary uppercase hover:text-text-primary"
          href="/"
        >
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {siteConfig.navItems.map((item) => (
            <Link
              className={
                isActive(pathname, item.href)
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-bg-elevated text-text-primary md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      {isOpen ? (
        <div
          className="border-t border-border bg-bg px-6 py-6 md:hidden"
          id="mobile-menu"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-2">
            {siteConfig.navItems.map((item) => (
              <Link
                className={
                  isActive(pathname, item.href)
                    ? "rounded-2xl border border-border bg-bg-elevated px-4 py-4 text-lg text-text-primary"
                    : "rounded-2xl px-4 py-4 text-lg text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                }
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

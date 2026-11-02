"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

/**
 * Responsive masonry-ish grid with a fullscreen lightbox. Keyboard: arrows and
 * Escape. Touch: swipe left/right. Images lazy-load through next/image.
 */
export function ProjectGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  if (images.length === 0) return null;

  const current = index !== null ? images[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4" role="list">
        {images.map((image, i) => {
          const wide = i % 5 === 0;
          return (
            <li className={wide ? "col-span-2" : ""} key={image.src}>
              <button
                aria-label={`Open image: ${image.alt}`}
                className={`surface group relative block w-full overflow-hidden ${
                  wide ? "aspect-[16/9]" : "aspect-[4/3]"
                }`}
                onClick={() => setIndex(i)}
                type="button"
              >
                <Image
                  alt={image.alt}
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  fill
                  sizes={wide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                  src={image.src}
                />
                {image.caption ? (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent px-3 pb-2 pt-8 text-left text-xs text-text-secondary">
                    {image.caption}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {open && current ? (
        <div
          aria-label={`${title} gallery`}
          aria-modal="true"
          className="fixed inset-0 z-[80] flex flex-col bg-bg/95 backdrop-blur-sm"
          onClick={close}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const dx = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
            touchStart.current = null;
          }}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          role="dialog"
        >
          <div className="flex items-center justify-between px-5 py-4 text-sm text-text-secondary">
            <span className="font-mono text-xs">
              {(index ?? 0) + 1} / {images.length}
            </span>
            <button
              aria-label="Close gallery"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-bg-elevated text-text-primary"
              onClick={close}
              type="button"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex-1 px-4 pb-6" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-full w-full">
              <Image
                alt={current.alt}
                className="object-contain"
                fill
                priority
                sizes="100vw"
                src={current.src}
              />
            </div>
            {images.length > 1 ? (
              <>
                <button
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated/90 text-text-primary"
                  onClick={() => step(-1)}
                  type="button"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated/90 text-text-primary"
                  onClick={() => step(1)}
                  type="button"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>
          {current.caption ? (
            <p className="px-6 pb-6 text-center text-sm text-text-secondary">{current.caption}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

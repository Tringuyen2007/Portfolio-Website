"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

const PLACEHOLDERS = ["Screenshot · soon", "Demo · soon", "Team photo · soon"];

const controlClass =
  "panel inline-flex size-11 items-center justify-center font-label text-[10px] text-text-primary hover:bg-bg-soft";

/**
 * Pixel-framed photo grid with a fullscreen lightbox. Real photos are never
 * pixelated: the frame is pixel art, the fill is the image. Keyboard: arrows
 * and Escape. Touch: swipe left/right. With no images, labelled placeholder
 * tiles keep the section's rhythm.
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

  if (images.length === 0) {
    return (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4" role="list">
        {PLACEHOLDERS.map((label, i) => (
          <li className={i === 0 ? "col-span-2 sm:col-span-1" : ""} key={label}>
            <div className="panel flex aspect-[4/3] items-center justify-center p-4 text-center">
              <span className="font-label text-[8px] uppercase leading-[1.8] tracking-[0.04em] text-text-muted sm:text-[9px]">
                {label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  const current = index !== null ? images[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4" role="list">
        {images.map((image, i) => {
          const wide = i % 5 === 0;
          // With exactly three photos, the lead one fills two rows on desktop so the grid has no gap.
          const lead = wide && i === 0 && images.length === 3;
          return (
            <li className={wide ? `col-span-2${lead ? " sm:row-span-2" : ""}` : ""} key={image.src}>
              <button
                aria-label={`Open image: ${image.alt}`}
                className={`panel group relative block w-full overflow-hidden p-[var(--unit)] ${
                  wide ? `aspect-[16/9]${lead ? " sm:aspect-auto sm:h-full" : ""}` : "aspect-[4/3]"
                }`}
                onClick={() => setIndex(i)}
                type="button"
              >
                <span className="relative block size-full overflow-hidden">
                  <Image
                    alt={image.alt}
                    className="object-cover"
                    fill
                    sizes={wide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                    src={image.src}
                  />
                </span>
                {image.caption ? (
                  <span className="absolute inset-x-[var(--unit)] bottom-[var(--unit)] bg-bg/90 px-3 py-2 text-left text-[15px] leading-6 text-text-secondary">
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
          className="fixed inset-0 z-[80] flex flex-col bg-bg/95"
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
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-label text-[9px] uppercase text-text-muted">
              {(index ?? 0) + 1} / {images.length}
            </span>
            <button aria-label="Close gallery" className={controlClass} onClick={close} type="button">
              ✕
            </button>
          </div>
          <div className="relative flex-1 px-4 pb-6" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-full w-full">
              <Image alt={current.alt} className="object-contain" fill priority sizes="100vw" src={current.src} />
            </div>
            {images.length > 1 ? (
              <>
                <button
                  aria-label="Previous image"
                  className={`${controlClass} absolute left-4 top-1/2 -translate-y-1/2`}
                  onClick={() => step(-1)}
                  type="button"
                >
                  ◀
                </button>
                <button
                  aria-label="Next image"
                  className={`${controlClass} absolute right-4 top-1/2 -translate-y-1/2`}
                  onClick={() => step(1)}
                  type="button"
                >
                  ▶
                </button>
              </>
            ) : null}
          </div>
          {current.caption ? (
            <p className="px-6 pb-6 text-center text-[15px] leading-7 text-text-secondary">{current.caption}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

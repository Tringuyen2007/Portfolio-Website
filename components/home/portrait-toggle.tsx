"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const PIXEL_SRC = "/images/profile-pixel.png";
const PHOTO_SRC = "/images/profile.jpg";
/** Mosaic block sizes (CSS px) for each frame: coarsen the current image, then resolve the next. */
const OUT_STEPS = [4, 8, 14, 22];
const IN_STEPS = [22, 14, 8, 4, 2];
const FRAME_MS = 55;

type Face = "pixel" | "photo";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draw `img` (object-fit: cover) onto `canvas` as a mosaic of `block`-px squares. */
function drawMosaic(canvas: HTMLCanvasElement, img: HTMLImageElement, block: number, dpr: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = canvas;
  const cols = Math.max(1, Math.round(w / (block * dpr)));
  const rows = Math.max(1, Math.round(h / (block * dpr)));
  const small = document.createElement("canvas");
  small.width = cols;
  small.height = rows;
  const sctx = small.getContext("2d");
  if (!sctx) return;
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  sctx.imageSmoothingEnabled = true;
  sctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(small, 0, 0, w, h);
}

/**
 * About-section portrait. Shows the pixel-art portrait by default; clicking it
 * dissolves into the real photo through a pixel mosaic, and back again.
 * Reduced motion swaps instantly.
 */
export function PortraitToggle() {
  const [face, setFace] = useState<Face>("pixel");
  const [animating, setAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const toggle = async () => {
    if (animating) return;
    const next: Face = face === "pixel" ? "photo" : "pixel";
    const canvas = canvasRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !canvas) {
      setFace(next);
      return;
    }
    let from: HTMLImageElement;
    let to: HTMLImageElement;
    try {
      [from, to] = await Promise.all([
        loadImage(face === "pixel" ? PIXEL_SRC : PHOTO_SRC),
        loadImage(next === "pixel" ? PIXEL_SRC : PHOTO_SRC),
      ]);
    } catch {
      setFace(next);
      return;
    }
    // The canvas is display:none between animations, so size it from its frame.
    const frame = canvas.parentElement?.getBoundingClientRect();
    if (!frame || frame.width === 0) {
      setFace(next);
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(frame.width * dpr);
    canvas.height = Math.round(frame.height * dpr);
    const frames: [HTMLImageElement, number][] = [
      ...OUT_STEPS.map((b) => [from, b] as [HTMLImageElement, number]),
      ...IN_STEPS.map((b) => [to, b] as [HTMLImageElement, number]),
    ];
    drawMosaic(canvas, frames[0][0], frames[0][1], dpr);
    setAnimating(true);
    for (const [i, [img, block]] of frames.entries()) {
      drawMosaic(canvas, img, block, dpr);
      if (i === OUT_STEPS.length) setFace(next);
      await new Promise((r) => setTimeout(r, FRAME_MS));
    }
    setAnimating(false);
  };

  const isPhoto = face === "photo";

  return (
    <button
      aria-label={isPhoto ? "Portrait of Tri Nguyen. Show the pixel-art version" : "Pixel-art portrait of Tri Nguyen. Show the photo"}
      aria-pressed={isPhoto}
      className="group relative block size-full cursor-pointer overflow-hidden focus-visible:outline-accent"
      onClick={toggle}
      type="button"
    >
      <Image
        alt=""
        className={`pixelated object-cover ${isPhoto ? "opacity-0" : "opacity-100"}`}
        fill
        priority={false}
        sizes="(min-width: 1024px) 28vw, (min-width: 768px) 60vw, 100vw"
        src={PIXEL_SRC}
        unoptimized
      />
      <Image
        alt=""
        className={`object-cover ${isPhoto ? "opacity-100" : "opacity-0"}`}
        fill
        sizes="(min-width: 1024px) 28vw, (min-width: 768px) 60vw, 100vw"
        src={PHOTO_SRC}
      />
      <canvas
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 size-full [image-rendering:pixelated] ${animating ? "block" : "hidden"}`}
        ref={canvasRef}
      />
      <span className="pointer-events-none absolute right-2 bottom-2 bg-bg/85 px-2 py-1 font-label text-[8px] uppercase tracking-[0.04em] text-text-secondary opacity-90 transition group-hover:text-accent">
        {isPhoto ? "Tap to pixelate" : "Tap to reveal"}
      </span>
    </button>
  );
}

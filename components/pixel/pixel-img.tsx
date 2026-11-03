import type { ImgHTMLAttributes } from "react";

/**
 * A 1× sprite from public/pixel rendered with nearest-neighbour scaling.
 * Width/height are given in CSS px; pass `art` to size by art pixels × --unit.
 */
export function PixelImg({
  art,
  className = "",
  style,
  alt = "",
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { art?: { w: number; h: number } }) {
  const sized = art
    ? { width: `calc(var(--unit) * ${art.w})`, height: `calc(var(--unit) * ${art.h})`, ...style }
    : style;
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={`pixelated inline-block shrink-0 ${className}`} draggable={false} style={sized} {...rest} />;
}

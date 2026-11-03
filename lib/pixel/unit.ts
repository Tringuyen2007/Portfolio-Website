/** One art pixel in CSS pixels: 4 on desktop, 3 below the md breakpoint. */
export const MOBILE_MAX = 767;

export function unitFor(viewportWidth: number): 3 | 4 {
  return viewportWidth <= MOBILE_MAX ? 3 : 4;
}

/** Snap a CSS-pixel value to a whole art pixel. */
export function snap(value: number, unit: number): number {
  return Math.floor(value / unit) * unit;
}

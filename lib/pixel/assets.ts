// Type-only import: pixi.js itself is loaded lazily (see loadTextures) so it
// never lands in the root layout's initial chunk via the persistent sky.
import type { Texture } from "pixi.js";

export const PIXEL_BASE = "/pixel";

export const SKY_ASSETS = {
  skyDesktop: `${PIXEL_BASE}/sky-desktop.png`,
  skyMobile: `${PIXEL_BASE}/sky-mobile.png`,
  moon: `${PIXEL_BASE}/moon.png`,
  cloudS: `${PIXEL_BASE}/cloud-s.png`,
  cloudM: `${PIXEL_BASE}/cloud-m.png`,
  cloudL: `${PIXEL_BASE}/cloud-l.png`,
} as const;

/**
 * Resolves once the page has finished loading and the main thread is idle, so
 * decorative WebGL never competes with hydration or the first contentful paint.
 */
export function whenPageIdle(timeout = 2000): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const idle = () =>
    new Promise<void>((resolve) => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout });
      else setTimeout(resolve, 200);
    });
  if (document.readyState === "complete") return idle();
  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => void idle().then(resolve), { once: true });
  });
}

/**
 * Entrance reveals (hero, page headings) finish within ~1.2 s of navigation;
 * decorative WebGL waits for them so its download, shader compile and first
 * frames never land on top of the largest contentful paint.
 */
const DECORATIVE_START_MS = 1500;

/**
 * The trimmed Pixi runtime, fetched only after the page is idle. Pass
 * `decorative` for stages nobody is waiting on (the sky) to also hold off until
 * the entrance reveals have played.
 */
export async function loadPixi({ decorative = false }: { decorative?: boolean } = {}) {
  await whenPageIdle();
  if (decorative) {
    const wait = DECORATIVE_START_MS - performance.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  }
  return import("@/components/pixel/pixi-runtime");
}

let configured = false;

/** Nearest-neighbour everywhere, set once before the first load. */
export async function configurePixelRendering() {
  if (configured) return;
  const { TextureSource } = await import("@/components/pixel/pixi-runtime");
  TextureSource.defaultOptions.scaleMode = "nearest";
  configured = true;
}

export async function loadTextures<T extends Record<string, string>>(
  manifest: T,
): Promise<Record<keyof T, Texture>> {
  await configurePixelRendering();
  const { Assets } = await import("@/components/pixel/pixi-runtime");
  const entries = Object.entries(manifest);
  const textures = await Promise.all(entries.map(([, url]) => Assets.load<Texture>(url)));
  const result = {} as Record<keyof T, Texture>;
  entries.forEach(([key], index) => {
    result[key as keyof T] = textures[index];
  });
  return result;
}

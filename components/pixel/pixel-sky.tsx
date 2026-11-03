"use client";

import { useEffect, useRef } from "react";

import { loadPixi, loadTextures, SKY_ASSETS } from "@/lib/pixel/assets";
import { prefersReducedMotion, visibilityGate } from "@/lib/pixel/motion";
import { unitFor } from "@/lib/pixel/unit";

/** Site header height in CSS px (components/site-header.tsx). */
const HEADER_H = 72;

/**
 * Persistent night sky. Mounted once in the root layout so clouds keep
 * drifting across route changes; page content crossfades above it.
 * Decorative only (aria-hidden); nothing here is required to use the site.
 */
export function PixelSky() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { Application, Container, Sprite, TilingSprite } = await loadPixi({ decorative: true });
      const textures = await loadTextures(SKY_ASSETS);
      if (disposed) return;

      const app = new Application();
      await app.init({
        resizeTo: window,
        backgroundColor: 0x0a0e24,
        resolution: 1,
        autoDensity: false,
        antialias: false,
        roundPixels: true,
        preference: "webgl",
      });
      if (disposed) {
        app.destroy(true);
        return;
      }
      host.appendChild(app.canvas);
      host.dataset.skyReady = "";

      const world = new Container();
      app.stage.addChild(world);

      const sky = new TilingSprite({ texture: textures.skyDesktop });
      const moon = new Sprite(textures.moon);
      world.addChild(sky, moon);

      // Three parallax layers: far (large, slow) → near (small, fast).
      type Cloud = { sprite: InstanceType<typeof Sprite>; speed: number; carry: number; y: number };
      const layers: { texture: keyof typeof textures; speed: number; count: number; band: [number, number] }[] = [
        // Kept to the top ~22% of the viewport and slightly translucent so
        // page headings that sit over the sky stay readable.
        { texture: "cloudL", speed: 6, count: 2, band: [0.05, 0.14] },
        { texture: "cloudM", speed: 10, count: 2, band: [0.08, 0.2] },
        { texture: "cloudS", speed: 16, count: 3, band: [0.03, 0.22] },
      ];
      const clouds: Cloud[] = [];
      let seed = 17;
      const rnd = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (const layer of layers) {
        for (let i = 0; i < layer.count; i += 1) {
          const sprite = new Sprite(textures[layer.texture]);
          sprite.alpha = 0.72;
          world.addChild(sprite);
          clouds.push({ sprite, speed: layer.speed, carry: 0, y: layer.band[0] + rnd() * (layer.band[1] - layer.band[0]) });
          sprite.x = rnd() * window.innerWidth;
        }
      }

      let unit = unitFor(window.innerWidth);
      const layout = () => {
        unit = unitFor(window.innerWidth);
        const w = app.screen.width;
        const h = app.screen.height;
        const mobile = unit === 3;
        sky.texture = mobile ? textures.skyMobile : textures.skyDesktop;
        // Tile horizontally at the art scale, but stretch vertically by a whole
        // number so the banded sky always covers the viewport (no repeat seam on
        // windows taller than the texture).
        sky.tileScale.set(unit, Math.max(unit, Math.ceil(h / sky.texture.height)));
        sky.width = w;
        sky.height = h;
        moon.scale.set(unit);
        if (mobile) {
          // Phones have no free sky above the headings: tuck the moon and clouds
          // half under the 72 px header so they never sit behind eyebrows or H1s.
          moon.x = Math.floor((w - moon.width - 12) / unit) * unit;
          moon.y = Math.floor((HEADER_H - moon.height / 2) / unit) * unit;
        } else {
          moon.x = Math.floor((w - moon.width - 64) / unit) * unit;
          moon.y = Math.floor(72 / unit) * unit;
        }
        for (const cloud of clouds) {
          cloud.sprite.scale.set(unit);
          // Clouds ride just under the header on every screen size so they
          // never drift behind an eyebrow or heading. cloud.y (0.03–0.22) only
          // spreads them a little vertically.
          const spread = mobile ? 12 : 28;
          const y = HEADER_H - cloud.sprite.height / 2 + ((cloud.y - 0.03) / 0.19) * spread;
          cloud.sprite.y = Math.floor(y / unit) * unit;
        }
      };
      layout();
      app.renderer.on("resize", layout);

      const reduced = prefersReducedMotion();
      app.ticker.add((ticker) => {
        const dt = ticker.deltaMS / 1000;
        const w = app.screen.width;
        for (const cloud of clouds) {
          // Whole art-pixel steps keep the art crisp; fractional motion is carried over.
          cloud.carry += cloud.speed * dt;
          const step = Math.floor(cloud.carry / unit) * unit;
          if (step > 0) {
            cloud.carry -= step;
            cloud.sprite.x += step;
            if (cloud.sprite.x > w) cloud.sprite.x = -cloud.sprite.width;
          }
        }
      });
      app.render();
      if (reduced) app.ticker.stop();
      const gate = reduced ? undefined : visibilityGate(app.ticker, host, () => !prefersReducedMotion());

      cleanup = () => {
        gate?.();
        app.renderer.off("resize", layout);
        app.destroy(true, { children: true });
      };
    })().catch(() => {
      // Sky is decorative: fall back to the CSS background silently.
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg [&_canvas]:block [&_canvas]:[image-rendering:pixelated]"
      ref={hostRef}
    />
  );
}

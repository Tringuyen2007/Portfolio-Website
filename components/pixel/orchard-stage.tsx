"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { ApplePreview, AppleSheet } from "@/components/pixel/apple-preview";
import { useZoom, TREE_RETURN_KEY } from "@/components/transitions/zoom-provider";
import { loadTextures, PIXEL_BASE } from "@/lib/pixel/assets";
import { prefersReducedMotion, visibilityGate } from "@/lib/pixel/motion";
import {
  APPLE_PX,
  GROUND_H,
  GROUND_OVERLAP,
  placeApples,
  placeSigns,
  SIGN_H,
  SIGN_W,
  STAGE_H,
  stageUnit,
  TREE_H,
  TREE_W,
  type ApplePlacement,
} from "@/lib/pixel/orchard";
import { unitFor } from "@/lib/pixel/unit";
import { APPLE_COLORS, APPLE_SPRITES, type TreeProject } from "@/lib/tree/types";

import { StagePlaceholder } from "@/components/pixel/stage-placeholder";
import { Gardener } from "@/components/pixel/gardener";

import "./pixel.css";

/** Gardener frame placement in tree art px: left edge, and where his feet meet the grass. */
const GARDENER_X = 114;
const GARDENER_FEET_Y = TREE_H - GROUND_OVERLAP + 4;
/** Row of the feet inside a gardener frame (scripts/pixel/gardener.mjs). */
const GARDENER_FEET_ROW = 26;

const STAGE_ASSETS = {
  tree: `${PIXEL_BASE}/tree.png`,
  ground: `${PIXEL_BASE}/ground.png`,
  appleRed: `${PIXEL_BASE}/apple-red.png`,
  appleGolden: `${PIXEL_BASE}/apple-golden.png`,
  ench0: `${PIXEL_BASE}/apple-enchanted-f0.png`,
  ench1: `${PIXEL_BASE}/apple-enchanted-f1.png`,
  ench2: `${PIXEL_BASE}/apple-enchanted-f2.png`,
} as const;

const OPEN_DELAY = 70;
const CLOSE_GRACE = 170;
const SWAY_MS = 3000;
const SHIMMER_MS = 220;
const GLOW_MS = 2400;
const HOVER_SCALE = 1.25;
/** Hover lift in art px (= 4 CSS px on desktop). */
const HOVER_LIFT = 1;
const HIT_MIN = 44;

type PreviewState = {
  slug: string;
  anchor: DOMRect;
  mode: "hover" | "touch" | "keyboard";
};

/** Where the world sits inside the host, so DOM overlays can project art px → CSS px. */
type Geometry = {
  unit: number;
  /** Tree sprite origin in CSS px relative to the host. */
  ox: number;
  oy: number;
  width: number;
  height: number;
};

type SceneApi = {
  setSelected: (slug: string | null) => void;
  setActiveBranch: (branch: string | null) => void;
};

export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return mobile;
}

/** Soft dithered disc used behind the enchanted apple. */
function makeGlowCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const c = (size - 1) / 2;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const d = Math.hypot(x - c, y - c) / (size / 2);
      if (d > 1) continue;
      // Ordered dither: three rings of decreasing density.
      const checker = (x + y) % 2 === 0;
      const alpha = d < 0.45 ? 1 : d < 0.72 ? (checker ? 1 : 0) : checker && x % 2 === 0 ? 1 : 0;
      if (!alpha) continue;
      ctx.fillStyle = "#b25ee8";
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}

export type OrchardStageProps = {
  projects: TreeProject[];
  /** "interactive": hover previews and zoom. "preview": sway only, low tick, no overlay. */
  mode?: "interactive" | "preview";
  /** Branch id to keep lit; other apples dim to 40%. */
  activeBranch?: string | null;
  /** Force an art-pixel scale (the home card uses 3 to fit). */
  unit?: 3 | 4;
  className?: string;
};

export function OrchardStage({
  projects,
  mode = "interactive",
  activeBranch = null,
  unit: unitOverride,
  className = "",
}: OrchardStageProps) {
  const router = useRouter();
  const { zoomTo } = useZoom();
  const mobile = useIsMobile();
  const interactive = mode === "interactive";

  const apples = useMemo(() => placeApples(projects), [projects]);
  const signs = useMemo(() => placeSigns(), []);
  // Hit targets in reading order (top band first, then left → right) so Tab walks the
  // tree the way the eye does rather than in slug order.
  const tabOrder = useMemo(
    () => [...apples].sort((a, b) => Math.floor(a.y / APPLE_PX) - Math.floor(b.y / APPLE_PX) || a.x - b.x),
    [apples],
  );
  const bySlug = useMemo(() => new Map(projects.map((p) => [p.slug, p])), [projects]);

  const hostRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneApi | null>(null);
  const [geom, setGeom] = useState<Geometry | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [returnedSlug, setReturnedSlug] = useState<string | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const overPreview = useRef(false);
  const lastPointerType = useRef<string | null>(null);

  // ---------------------------------------------------------------- Pixi island
  useEffect(() => {
    const host = hostRef.current;
    const canvasHost = canvasHostRef.current;
    if (!host || !canvasHost) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { Application, Container, Sprite, Texture, TilingSprite } = await import("@/components/pixel/pixi-runtime");
      const textures = await loadTextures(STAGE_ASSETS);
      if (disposed) return;

      const app = new Application();
      await app.init({
        width: 10,
        height: 10,
        backgroundAlpha: 0,
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
      app.canvas.classList.add("orchard-canvas");
      canvasHost.appendChild(app.canvas);

      const world = new Container();
      app.stage.addChild(world);

      const ground = new TilingSprite({ texture: textures.ground, width: TREE_W, height: GROUND_H });
      const tree = new Container();
      const treeSprite = new Sprite(textures.tree);
      tree.addChild(treeSprite);
      world.addChild(ground, tree);


      const enchFrames = [textures.ench0, textures.ench1, textures.ench2];
      const glowTexture = Texture.from(makeGlowCanvas(28));
      type AppleNode = { def: ApplePlacement; sprite: InstanceType<typeof Sprite>; glow?: InstanceType<typeof Sprite> };
      const nodes: AppleNode[] = apples.map((def) => {
        let glow: InstanceType<typeof Sprite> | undefined;
        if (def.kind === "enchanted") {
          glow = new Sprite(glowTexture);
          glow.anchor.set(0.5);
          glow.alpha = 0.28;
          glow.position.set(def.x + APPLE_PX / 2, def.y + APPLE_PX / 2);
          tree.addChild(glow);
        }
        const sprite = new Sprite(
          def.kind === "red" ? textures.appleRed : def.kind === "golden" ? textures.appleGolden : enchFrames[0],
        );
        sprite.anchor.set(0.5);
        sprite.position.set(def.x + APPLE_PX / 2, def.y + APPLE_PX / 2);
        tree.addChild(sprite);
        return { def, sprite, glow };
      });

      let selected: string | null = null;
      let branch: string | null = activeBranch;
      let unit = stageUnit(unitOverride ?? unitFor(window.innerWidth), host.clientWidth || window.innerWidth);
      let elapsed = 0;
      const sway = new Map<string, number>();

      const applyStates = () => {
        for (const node of nodes) {
          const isSelected = node.def.slug === selected;
          const dimmed = branch !== null && node.def.branch !== branch;
          node.sprite.scale.set(isSelected ? HOVER_SCALE : 1);
          node.sprite.alpha = dimmed ? 0.4 : 1;
          node.sprite.x = node.def.x + APPLE_PX / 2 + (sway.get(node.def.slug) ?? 0);
          node.sprite.y = node.def.y + APPLE_PX / 2 - (isSelected ? HOVER_LIFT : 0);
          node.sprite.zIndex = isSelected ? 2 : 1;
          if (node.glow) {
            node.glow.x = node.sprite.x;
            node.glow.y = node.sprite.y;
            node.glow.visible = !dimmed;
          }
        }
      };
      tree.sortableChildren = true;

      const layout = () => {
        const hostWidth = host.clientWidth || window.innerWidth;
        unit = stageUnit(unitOverride ?? unitFor(window.innerWidth), hostWidth);
        const worldW = Math.max(TREE_W, Math.ceil(hostWidth / unit));
        const worldH = STAGE_H;
        app.renderer.resize(worldW * unit, worldH * unit);
        world.scale.set(unit);
        const ox = Math.floor((worldW - TREE_W) / 2);
        tree.position.set(ox, 0);
        ground.position.set(0, TREE_H - GROUND_OVERLAP);
        ground.width = worldW;
        // Centre the canvas when it is wider than the host (mobile crop).
        const cssW = worldW * unit;
        app.canvas.style.marginLeft = `${Math.floor((hostWidth - cssW) / 2)}px`;
        setGeom({
          unit,
          ox: ox * unit + Math.floor((hostWidth - cssW) / 2),
          oy: 0,
          width: hostWidth,
          height: worldH * unit,
        });
        applyStates();
      };

      const reduced = prefersReducedMotion();
      let shimmerFrame = 0;
      let shimmerAcc = 0;
      app.ticker.add((ticker) => {
        elapsed += ticker.deltaMS;
        shimmerAcc += ticker.deltaMS;
        if (shimmerAcc >= SHIMMER_MS) {
          shimmerAcc -= SHIMMER_MS;
          shimmerFrame = (shimmerFrame + 1) % enchFrames.length;
        }
        const glowAlpha = 0.2 + 0.15 * (0.5 + 0.5 * Math.sin((elapsed / GLOW_MS) * Math.PI * 2));
        for (const node of nodes) {
          const s = Math.sin((elapsed / SWAY_MS) * Math.PI * 2 + node.def.phase);
          sway.set(node.def.slug, s > 0.33 ? 1 : s < -0.33 ? -1 : 0);
          if (node.def.kind === "enchanted") {
            node.sprite.texture = enchFrames[shimmerFrame];
            if (node.glow) node.glow.alpha = glowAlpha;
          }
        }
        applyStates();
      });
      if (mode === "preview") app.ticker.maxFPS = 12;

      layout();
      const observer = new ResizeObserver(() => {
        layout();
        if (!app.ticker.started) app.render();
      });
      observer.observe(host);

      sceneRef.current = {
        setSelected: (slug) => {
          selected = slug;
          applyStates();
          if (!app.ticker.started) app.render();
        },
        setActiveBranch: (id) => {
          branch = id;
          applyStates();
          if (!app.ticker.started) app.render();
        },
      };

      app.render();
      setReady(true);
      if (reduced) app.ticker.stop();
      const gate = reduced ? undefined : visibilityGate(app.ticker, host, () => !prefersReducedMotion());

      cleanup = () => {
        gate?.();
        observer.disconnect();
        sceneRef.current = null;
        app.destroy(true, { children: true });
      };
    })().catch((error) => {
      console.error("[orchard] stage failed to start", error);
      setFailed(true);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
    // The scene is built once per mount; props below are pushed through sceneRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apples, signs, mode, unitOverride]);

  useEffect(() => {
    sceneRef.current?.setActiveBranch(activeBranch);
  }, [activeBranch, ready]);

  useEffect(() => {
    sceneRef.current?.setSelected(preview?.slug ?? returnedSlug);
  }, [preview?.slug, returnedSlug, ready]);

  // --------------------------------------------------------- preview machine
  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const anchorFor = useCallback((slug: string) => {
    const node = hostRef.current?.querySelector<HTMLElement>(`[data-apple="${slug}"]`);
    return node?.getBoundingClientRect() ?? null;
  }, []);

  /** The apple hit target under a viewport point (the sheet scrim covers the buttons). */
  const appleAt = useCallback((x: number, y: number) => {
    const nodes = hostRef.current?.querySelectorAll<HTMLElement>("[data-apple]") ?? [];
    for (const node of nodes) {
      if (node.dataset.dimmed !== undefined) continue;
      const r = node.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return node.dataset.apple ?? null;
    }
    return null;
  }, []);

  const closePreview = useCallback(() => {
    clearTimers();
    setPreviewOpen(false);
    setPreview(null);
  }, []);

  const show = useCallback(
    (slug: string, previewMode: PreviewState["mode"]) => {
      const anchor = anchorFor(slug);
      if (!anchor) return;
      clearTimers();
      setPreview({ slug, anchor, mode: previewMode });
      // Let the element mount at scale(0.55) before opening.
      requestAnimationFrame(() => setPreviewOpen(true));
    },
    [anchorFor],
  );

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => {
      if (overPreview.current) return;
      setPreviewOpen(false);
      setPreview(null);
    }, CLOSE_GRACE);
  }, []);

  const handleHoverStart = useCallback(
    (slug: string) => {
      clearTimers();
      if (preview && preview.slug !== slug) {
        // Swap content in place: no close/open flicker.
        show(slug, "hover");
        return;
      }
      openTimer.current = window.setTimeout(() => show(slug, "hover"), OPEN_DELAY);
    },
    [preview, show],
  );

  const navigate = useCallback(
    (slug: string) => {
      const project = bySlug.get(slug);
      const anchor = anchorFor(slug);
      if (!project) return;
      closePreview();
      if (!anchor || !geom) {
        router.push(project.href);
        return;
      }
      // Zoom from the sprite itself (centred in the ≥44 px hit area).
      const size = APPLE_PX * geom.unit;
      zoomTo({
        kind: "apple",
        href: project.href,
        slug,
        rect: {
          x: anchor.left + (anchor.width - size) / 2,
          y: anchor.top + (anchor.height - size) / 2,
          width: size,
          height: size,
        },
        colors: APPLE_COLORS[project.apple],
        sprite: APPLE_SPRITES[project.apple],
      });
    },
    [anchorFor, bySlug, closePreview, geom, router, zoomTo],
  );

  const handleActivate = useCallback(
    (slug: string, pointerType: string) => {
      if (pointerType === "touch") {
        if (preview?.slug === slug && preview.mode === "touch") {
          navigate(slug);
        } else {
          show(slug, "touch");
        }
        return;
      }
      navigate(slug);
    },
    [navigate, preview, show],
  );

  // Escape closes; tap/click outside closes; scroll re-anchors.
  useEffect(() => {
    if (!preview) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-apple-preview]") || target?.closest("[data-apple]")) return;
      closePreview();
    };
    const onScroll = () => {
      const anchor = anchorFor(preview.slug);
      if (anchor) setPreview((p) => (p ? { ...p, anchor } : p));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [preview, anchorFor, closePreview]);

  // Returning from a project: restore scroll and lift the apple once.
  useEffect(() => {
    if (!interactive) return;
    try {
      const raw = sessionStorage.getItem(TREE_RETURN_KEY);
      if (!raw) return;
      sessionStorage.removeItem(TREE_RETURN_KEY);
      const saved = JSON.parse(raw) as { slug?: string; scrollY?: number };
      if (typeof saved.scrollY === "number") window.scrollTo({ top: saved.scrollY, behavior: "instant" });
      if (saved.slug) {
        const slug = saved.slug;
        window.setTimeout(() => setReturnedSlug(slug), 0);
        window.setTimeout(() => setReturnedSlug(null), 1600);
      }
    } catch {
      /* ignore */
    }
  }, [interactive]);

  useEffect(() => () => clearTimers(), []);

  // ------------------------------------------------------------------ render
  const previewProject = preview ? bySlug.get(preview.slug) : null;
  const unit = geom?.unit ?? (unitOverride ?? 4);
  const stageHeight = STAGE_H * unit;

  const toCss = (ax: number, ay: number) => ({
    left: (geom?.ox ?? 0) + ax * unit,
    top: (geom?.oy ?? 0) + ay * unit,
  });

  return (
    <div
      className={`orchard-stage relative w-full overflow-hidden ${className}`}
      data-orchard-ready={ready ? "" : undefined}
      ref={hostRef}
      style={{
        // Before the stage measures itself, match its fitted size with CSS
        // (--stage-unit in pixel.css) so loading never shifts the layout.
        height: geom ? stageHeight : `calc(${STAGE_H}px * min(${unitOverride ?? 4}, var(--stage-unit)))`,
      }}
    >
      <div aria-hidden="true" className="absolute inset-0" ref={canvasHostRef} />
      {!ready ? <StagePlaceholder failed={failed} unit={geom ? unit : unitOverride ?? 4} /> : null}

      {/* Sign labels: decorative, the filter chips are the real controls. */}
      {geom
        ? signs.map((sign) => {
            const pos = toCss(sign.x, sign.y);
            return (
              <span
                aria-hidden="true"
                className="orchard-sign pointer-events-none absolute flex items-center justify-center font-label text-text-primary"
                key={sign.id}
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: SIGN_W * unit,
                  height: SIGN_H * unit,
                  fontSize: unit >= 4 ? 10 : unit === 3 ? 8 : 7,
                  paddingBottom: unit,
                }}
              >
                {sign.label.toUpperCase()}
              </span>
            );
          })
        : null}

      {/* Chibi Tri on the grass just right of the trunk; his watering can reaches the roots. */}
      {geom && ready ? (
        <Gardener
          // On the home card he stands in front of the caption fade so he isn't lost in it.
          className={interactive ? "" : "z-10"}
          unit={unit}
          {...toCss(GARDENER_X, GARDENER_FEET_Y - GARDENER_FEET_ROW)}
        />
      ) : null}

      {interactive && geom
        ? tabOrder.map((apple) => {
            const p = bySlug.get(apple.slug);
            if (!p) return null;
            const size = Math.max(HIT_MIN, APPLE_PX * unit + 8);
            const center = toCss(apple.x + APPLE_PX / 2, apple.y + APPLE_PX / 2);
            const dimmed = activeBranch !== null && apple.branch !== activeBranch;
            const style: CSSProperties = {
              left: center.left - size / 2,
              top: center.top - size / 2,
              width: size,
              height: size,
            };
            return (
              <button
                aria-label={`${p.title}${p.award ? `, ${p.award}` : ""}`}
                aria-expanded={preview?.slug === apple.slug}
                className="orchard-apple-hit absolute block cursor-pointer appearance-none bg-transparent p-0"
                data-apple={apple.slug}
                data-dimmed={dimmed ? "" : undefined}
                key={apple.slug}
                onBlur={() => scheduleClose()}
                onClick={(event) => {
                  // Act on click, not pointerdown: a sheet mounted on pointerdown would sit
                  // under the finger and swallow the click as a scrim tap (instant close).
                  // iOS Safari's click has no pointerType, so fall back to the last pointerdown.
                  const native = (event.nativeEvent as PointerEvent).pointerType;
                  const pointerType = native || lastPointerType.current || "keyboard";
                  lastPointerType.current = null;
                  handleActivate(apple.slug, pointerType);
                }}
                onFocus={() => show(apple.slug, "keyboard")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleActivate(apple.slug, "keyboard");
                  }
                }}
                onPointerDown={(event) => {
                  lastPointerType.current = event.pointerType;
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") handleHoverStart(apple.slug);
                }}
                onPointerLeave={() => scheduleClose()}
                style={style}
                type="button"
              />
            );
          })
        : null}

      {interactive && preview && previewProject ? (
        mobile ? (
          <AppleSheet
            key={preview.slug}
            onClose={closePreview}
            onScrimTap={(x, y) => {
              const hit = appleAt(x, y);
              if (!hit) closePreview();
              else if (hit === preview.slug) navigate(hit);
              else show(hit, "touch");
            }}
            onExplore={() => navigate(preview.slug)}
            open={previewOpen}
            project={previewProject}
          />
        ) : (
          <ApplePreview
            anchor={preview.anchor}
            key={preview.slug}
            mode={preview.mode}
            onExplore={() => navigate(preview.slug)}
            onPointerEnter={() => {
              overPreview.current = true;
              clearTimers();
            }}
            onPointerLeave={() => {
              overPreview.current = false;
              scheduleClose();
            }}
            open={previewOpen}
            project={previewProject}
          />
        )
      ) : null}
    </div>
  );
}

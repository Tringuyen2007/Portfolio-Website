"use client";

import type { KeyboardEvent, PointerEvent } from "react";

import { applePath, type FruitLayout } from "@/lib/tree/layout";

type FruitProps = {
  fruit: FruitLayout;
  label: string;
  interactive: boolean;
  selected: boolean;
  dimmed: boolean;
  onHoverStart?: (slug: string, pointerType: string) => void;
  onHoverEnd?: (slug: string) => void;
  onFocus?: (slug: string) => void;
  onBlur?: (slug: string) => void;
  onActivate?: (slug: string, pointerType: string) => void;
};

export function Fruit({
  fruit,
  label,
  interactive,
  selected,
  dimmed,
  onHoverStart,
  onHoverEnd,
  onFocus,
  onBlur,
  onActivate,
}: FruitProps) {
  const { position, anchor, radius, slug, seed } = fruit;
  const golden = fruit.fruit === "golden";
  const gradientId = `fruit-${fruit.fruit}`;
  const stemTop = { x: anchor.x, y: anchor.y };
  const stemBottom = { x: position.x, y: position.y - radius * 0.85 };
  const stemPath = `M${stemTop.x.toFixed(1)} ${stemTop.y.toFixed(1)} Q ${((stemTop.x + stemBottom.x) / 2 + 4).toFixed(1)} ${((stemTop.y + stemBottom.y) / 2).toFixed(1)}, ${stemBottom.x.toFixed(1)} ${stemBottom.y.toFixed(1)}`;

  const handleKey = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate?.(slug, "keyboard");
    }
  };

  const handlePointerDown = (event: PointerEvent<SVGGElement>) => {
    // Touch: the first tap opens the preview (handled in the stage); the
    // stage decides whether a second tap navigates.
    if (event.pointerType === "touch") {
      event.preventDefault();
      onActivate?.(slug, "touch");
    }
  };

  const handleClick = (event: React.MouseEvent<SVGGElement>) => {
    // Mouse/pen clicks navigate; touch already handled on pointerdown.
    if ((event as unknown as { nativeEvent: PointerEvent }).nativeEvent?.pointerType === "touch") return;
    onActivate?.(slug, "mouse");
  };

  return (
    <g
      className={`fruit-node transition-opacity duration-300 ${dimmed ? "opacity-40" : "opacity-100"} ${
        interactive ? "cursor-pointer outline-none" : ""
      }`}
      data-fruit={slug}
      data-selected={selected ? "" : undefined}
      aria-label={label}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : -1}
      onPointerEnter={(e) => interactive && e.pointerType !== "touch" && onHoverStart?.(slug, e.pointerType)}
      onPointerLeave={() => interactive && onHoverEnd?.(slug)}
      onFocus={() => interactive && onFocus?.(slug)}
      onBlur={() => interactive && onBlur?.(slug)}
      onKeyDown={interactive ? handleKey : undefined}
      onPointerDown={interactive ? handlePointerDown : undefined}
      onClick={interactive ? handleClick : undefined}
    >
      {/* stem */}
      <path d={stemPath} fill="none" stroke="var(--bark-deep)" strokeLinecap="round" strokeWidth={2.4} />

      <g
        className="fruit-body"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: selected ? "translateY(-4px) scale(1.14)" : "translateY(0) scale(1)",
          transition: "transform 260ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {golden ? (
          <circle
            className="gold-shimmer"
            cx={position.x}
            cy={position.y}
            fill="url(#fruit-gold-glow)"
            r={radius * 2.2}
            style={{ animationDelay: `${(seed * 3).toFixed(2)}s` }}
          />
        ) : null}
        {/* focus ring */}
        <circle
          className="fruit-focus-ring"
          cx={position.x}
          cy={position.y}
          fill="none"
          r={radius + 6}
          stroke="var(--accent-strong)"
          strokeWidth={2}
          style={{ opacity: 0 }}
        />
        <path
          d={applePath(radius)}
          fill={`url(#${gradientId})`}
          stroke={golden ? "rgba(255,230,160,0.55)" : "rgba(0,0,0,0.25)"}
          strokeWidth={golden ? 1.2 : 0.8}
          transform={`translate(${position.x.toFixed(1)} ${position.y.toFixed(1)})`}
        />
        {/* specular highlight */}
        <ellipse
          cx={position.x - radius * 0.35}
          cy={position.y - radius * 0.4}
          fill="rgba(255,255,255,0.35)"
          rx={radius * 0.28}
          ry={radius * 0.18}
          transform={`rotate(-25 ${position.x} ${position.y})`}
        />
        {/* leaf on the stem */}
        <ellipse
          cx={position.x + radius * 0.35}
          cy={position.y - radius * 0.95}
          fill="var(--leaf)"
          rx={radius * 0.42}
          ry={radius * 0.17}
          transform={`rotate(-28 ${position.x + radius * 0.35} ${position.y - radius * 0.95})`}
        />
      </g>

      {/* generous invisible hit target (≥44px CSS at mobile scale) */}
      {interactive ? (
        <circle cx={position.x} cy={position.y} fill="transparent" r={radius + 14} />
      ) : null}
    </g>
  );
}

"use client";

import { Fruit } from "@/components/tree/fruit";
import {
  cubicToSvg,
  leafRosette,
  type LeafCluster,
  type TreeLayout,
} from "@/lib/tree/layout";

type TreeSvgProps = {
  layout: TreeLayout;
  labels: Record<string, string>;
  interactive?: boolean;
  selectedSlug?: string | null;
  highlightedBranch?: string | null;
  showLabels?: boolean;
  className?: string;
  onHoverStart?: (slug: string, pointerType: string) => void;
  onHoverEnd?: (slug: string) => void;
  onFocus?: (slug: string) => void;
  onBlur?: (slug: string) => void;
  onActivate?: (slug: string, pointerType: string) => void;
};

function Leaves({ cluster, delay }: { cluster: LeafCluster; delay: number }) {
  const leaves = leafRosette(cluster);
  return (
    <g
      className="leaf-breathe"
      style={{ ["--leaf-delay" as string]: `${delay.toFixed(2)}s`, ["--leaf-duration" as string]: `${(6 + cluster.seed * 3).toFixed(2)}s` }}
    >
      {leaves.map((leaf, index) => (
        <ellipse
          cx={leaf.x.toFixed(1)}
          cy={leaf.y.toFixed(1)}
          fill={leaf.tone > 0.55 ? "var(--leaf)" : "var(--leaf-deep)"}
          key={index}
          opacity={0.9}
          rx={leaf.rx.toFixed(1)}
          ry={leaf.ry.toFixed(1)}
          transform={`rotate(${leaf.rotate.toFixed(1)} ${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)})`}
        />
      ))}
    </g>
  );
}

export function TreeSvg({
  layout,
  labels,
  interactive = true,
  selectedSlug = null,
  highlightedBranch = null,
  showLabels = true,
  className,
  onHoverStart,
  onHoverEnd,
  onFocus,
  onBlur,
  onActivate,
}: TreeSvgProps) {
  const { frame } = layout;

  return (
    <svg
      aria-hidden={interactive ? undefined : true}
      className={className}
      preserveAspectRatio="xMidYMax meet"
      role={interactive ? "group" : undefined}
      aria-label={interactive ? "Interactive tree of projects and events" : undefined}
      viewBox={`0 0 ${frame.width} ${frame.height}`}
    >
      <defs>
        <radialGradient id="fruit-golden" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f6dd8a" />
          <stop offset="55%" stopColor="#e2b94f" />
          <stop offset="100%" stopColor="#9a7322" />
        </radialGradient>
        <radialGradient id="fruit-ripe" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#e2695c" />
          <stop offset="60%" stopColor="#c23f36" />
          <stop offset="100%" stopColor="#7a2621" />
        </radialGradient>
        <radialGradient id="fruit-green" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#a1c484" />
          <stop offset="60%" stopColor="#6f9a5a" />
          <stop offset="100%" stopColor="#35502f" />
        </radialGradient>
        <radialGradient id="fruit-blossom" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f5d4dc" />
          <stop offset="60%" stopColor="#e8b4c0" />
          <stop offset="100%" stopColor="#a06a7c" />
        </radialGradient>
        <radialGradient id="fruit-gold-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d27a" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#f0d27a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f0d27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bark-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#4a3326" />
          <stop offset="45%" stopColor="#6b4a36" />
          <stop offset="100%" stopColor="#3b2a1f" />
        </linearGradient>
        <radialGradient id="ground-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lantern" cx="50%" cy="100%" r="80%">
          <stop offset="0%" stopColor="#d9b55a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#d9b55a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground */}
      <rect fill="url(#lantern)" height={frame.height} width={frame.width} x="0" y="0" />
      <ellipse
        cx={frame.trunkBase.x}
        cy={frame.trunkBase.y + 6}
        fill="url(#ground-shadow)"
        rx={frame.branchLength * 1.4}
        ry={frame.branchLength * 0.12}
      />

      {/* trunk */}
      <path
        d={cubicToSvg(layout.trunk)}
        fill="none"
        stroke="url(#bark-gradient)"
        strokeLinecap="round"
        strokeWidth={layout.trunkWidth}
      />
      <path
        d={cubicToSvg(layout.trunk)}
        fill="none"
        opacity={0.28}
        stroke="#2a1d15"
        strokeLinecap="round"
        strokeWidth={layout.trunkWidth * 0.16}
        transform={`translate(${(layout.trunkWidth * 0.28).toFixed(1)} 0)`}
      />
      {/* root flare */}
      <path
        d={`M${frame.trunkBase.x - layout.trunkWidth * 1.6} ${frame.trunkBase.y + 4} Q ${frame.trunkBase.x - layout.trunkWidth * 0.5} ${frame.trunkBase.y - 30}, ${frame.trunkBase.x} ${frame.trunkBase.y - 40} Q ${frame.trunkBase.x + layout.trunkWidth * 0.5} ${frame.trunkBase.y - 30}, ${frame.trunkBase.x + layout.trunkWidth * 1.6} ${frame.trunkBase.y + 4} Z`}
        fill="#4a3326"
      />

      {/* branches (behind canopy and fruits) */}
      {layout.branches.map((branch, index) => {
        const dim = highlightedBranch && highlightedBranch !== branch.id;
        return (
          <g
            className={`tree-sway transition-opacity duration-500 ${dim ? "opacity-35" : "opacity-100"}`}
            data-branch={branch.id}
            key={branch.id}
            style={{
              ["--sway" as string]: `${(branch.side === "left" ? -1 : 1) * (branch.young ? 1.1 : 0.7)}deg`,
              ["--sway-duration" as string]: `${(8 + index * 1.3).toFixed(1)}s`,
              ["--sway-delay" as string]: `${(-index * 2.1).toFixed(1)}s`,
              ["--sway-origin" as string]: branch.side === "left" ? "100% 100%" : "0% 100%",
            }}
          >
            <path
              d={cubicToSvg(branch.path)}
              fill="none"
              stroke="url(#bark-gradient)"
              strokeLinecap="round"
              strokeWidth={branch.width}
            />
            {branch.twigs.map((twig, twigIndex) => (
              <path
                d={cubicToSvg(twig.path)}
                fill="none"
                key={twigIndex}
                stroke="#5a3f2e"
                strokeLinecap="round"
                strokeWidth={twig.width}
              />
            ))}
            {branch.twigs.map((twig, twigIndex) => (
              <Leaves cluster={twig.leaves} delay={-(index * 1.7 + twigIndex)} key={`l${twigIndex}`} />
            ))}
            {branch.leaves.map((cluster, leafIndex) => (
              <Leaves cluster={cluster} delay={-(index + leafIndex * 2.3)} key={`c${leafIndex}`} />
            ))}

            {branch.fruits.map((fruit) => (
              <Fruit
                dimmed={Boolean(dim)}
                fruit={fruit}
                interactive={interactive}
                key={fruit.slug}
                label={labels[fruit.slug] ?? fruit.title}
                onActivate={onActivate}
                onBlur={onBlur}
                onFocus={onFocus}
                onHoverEnd={onHoverEnd}
                onHoverStart={onHoverStart}
                selected={selectedSlug === fruit.slug}
              />
            ))}

          </g>
        );
      })}

      {/* crown */}
      {layout.canopy.map((cluster, index) => (
        <Leaves cluster={cluster} delay={-index * 1.9} key={`crown${index}`} />
      ))}

      {/* branch labels sit above every leaf so they always read */}
      {showLabels
        ? layout.branches.map((branch) => {
            const dim = highlightedBranch && highlightedBranch !== branch.id;
            const label = branch.shortLabel.toUpperCase();
            const fontSize = frame.width > 900 ? 12 : 15;
            const width = label.length * fontSize * 0.78 + 28;
            const x = branch.side === "left" ? branch.labelPosition.x - width : branch.labelPosition.x;
            return (
              <g className={`transition-opacity duration-500 ${dim ? "opacity-35" : "opacity-100"}`} key={`label-${branch.id}`}>
                <rect
                  fill="var(--bg)"
                  fillOpacity={0.82}
                  height={fontSize + 16}
                  rx={(fontSize + 16) / 2}
                  stroke="var(--border)"
                  width={width}
                  x={x}
                  y={branch.labelPosition.y - fontSize - 6}
                />
                <text
                  className="font-mono"
                  fill={branch.young ? "var(--text-muted)" : "var(--text-secondary)"}
                  fontSize={fontSize}
                  letterSpacing="0.16em"
                  textAnchor="middle"
                  x={x + width / 2}
                  y={branch.labelPosition.y + 2}
                >
                  {label}
                </text>
              </g>
            );
          })
        : null}
    </svg>
  );
}

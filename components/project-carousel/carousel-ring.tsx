"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { ProjectCard } from "@/components/project-card";
import { useElementSize } from "@/components/project-carousel/use-element-size";
import type { Project } from "@/lib/content/projects";

const PERSPECTIVE = 1400;
const CARD_ASPECT_RATIO = 0.78; // width / height
const MIN_CARD_HEIGHT = 320;
const MAX_CARD_HEIGHT = 560;
const SIZE_SOLVE_ITERATIONS = 4;

const IDLE_SPEED = 6; // degrees per second
const MAX_EXTRA_SPEED = 5 * IDLE_SPEED;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// A card at translateZ(radius) inside the ring's perspective sits closer to
// the camera, so its rendered footprint is larger than its nominal height by
// a factor of PERSPECTIVE / (PERSPECTIVE - radius) — see the wrapperHeight
// comment in CarouselRing below. That factor itself depends on radius, which
// depends on cardWidth, which depends on cardHeight — so solving for the
// cardHeight whose PROJECTED footprint fits a given container height takes a
// few fixed-point iterations rather than one division.
function solveCardHeight(containerHeight: number, projectCount: number) {
  let height = clamp(containerHeight, MIN_CARD_HEIGHT, MAX_CARD_HEIGHT);

  for (let i = 0; i < SIZE_SOLVE_ITERATIONS; i++) {
    const width = height * CARD_ASPECT_RATIO;
    const radius = projectCount > 1 ? (width / 2 / Math.tan(Math.PI / projectCount)) * 1.5 : 0;
    const projectedScale = PERSPECTIVE / (PERSPECTIVE - radius);
    height = clamp(containerHeight / projectedScale, MIN_CARD_HEIGHT, MAX_CARD_HEIGHT);
  }

  return height;
}

function CarouselItem({
  project,
  itemAngle,
  radius,
  angle,
  cardWidth,
  cardHeight,
}: {
  project: Project;
  itemAngle: number;
  radius: number;
  angle: import("framer-motion").MotionValue<number>;
  cardWidth: number;
  cardHeight: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  const facing = useTransform(angle, (value) => {
    const effectiveAngleDeg = ((itemAngle + value) % 360 + 360) % 360;
    const signedAngle = effectiveAngleDeg > 180 ? effectiveAngleDeg - 360 : effectiveAngleDeg;
    return Math.cos((signedAngle * Math.PI) / 180);
  });

  // Front-facing (facing=1) is fully visible; anything past the side profile
  // (facing<=0, i.e. the back half of the ring) is fully blank, not just dim.
  const visibility = useTransform(facing, (value) => Math.max(value, 0));
  const opacity = useTransform(visibility, (value) => Math.pow(value, 0.6));
  const scale = useTransform(visibility, (value) => 0.72 + value * 0.28);

  // Framer Motion owns the `transform` CSS property as soon as any
  // motion-recognized transform key (scale, x, y, rotateY, ...) is set on the
  // same style object — it silently overwrites a manually-written `transform`
  // string with only what it recognizes, dropping everything else. So the
  // ring placement (self-centering translate + rotateY + translateZ) and the
  // scale must be composed into ONE motion-value-driven transform string
  // instead of splitting `scale` out as its own style prop.
  const transform = useTransform(
    scale,
    (value) =>
      `translate(-50%, -50%) rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${value})`,
  );

  // `inert` is a DOM attribute (not a CSS style), so it can't be driven by
  // useTransform's style output — it's applied imperatively via a ref instead,
  // and it keeps blanked-out back-half cards out of tab order / clicks.
  useMotionValueEvent(facing, "change", (value) => {
    const node = itemRef.current;
    if (!node) return;
    const isBack = value <= 0;
    node.inert = isBack;
    node.style.pointerEvents = isBack ? "none" : "auto";
  });

  return (
    <motion.div
      ref={itemRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: cardWidth,
        height: cardHeight,
        transform,
        opacity,
      }}
    >
      <ProjectCard project={project} />
    </motion.div>
  );
}

export function CarouselRing({ projects }: { projects: Project[] }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { height: containerHeight } = useElementSize(containerRef);

  const angle = useMotionValue(0);
  const extraSpeed = useMotionValue(0);

  const n = projects.length;
  const cardHeight = solveCardHeight(containerHeight || MIN_CARD_HEIGHT, n);
  const cardWidth = cardHeight * CARD_ASPECT_RATIO;
  const radius = n > 1 ? (cardWidth / 2 / Math.tan(Math.PI / n)) * 1.5 : 0;

  // A card at translateZ(radius) inside this perspective sits closer to the
  // camera, so the CSS 3D projection renders it larger than cardHeight by a
  // factor of PERSPECTIVE / (PERSPECTIVE - radius) — the same "pop toward
  // viewer" effect that makes the front card readable. solveCardHeight()
  // above already accounts for this so the projected footprint fits
  // containerHeight; wrapperHeight here is just that same projected size,
  // used to size the perspective box itself.
  const projectedScale = PERSPECTIVE / (PERSPECTIVE - radius);
  const wrapperHeight = containerHeight
    ? Math.min(Math.ceil(cardHeight * projectedScale), containerHeight)
    : Math.ceil(cardHeight * projectedScale);

  useAnimationFrame((_time, delta) => {
    if (prefersReducedMotion) return;

    // extraSpeed is signed so a user can scroll either direction to spin the
    // ring forward or backward; it always exponentially decays back toward 0,
    // so the ring eases back to its constant forward idle speed either way.
    const decayed = extraSpeed.get() * Math.pow(0.001, delta / 1000);
    extraSpeed.set(clamp(decayed, -MAX_EXTRA_SPEED, MAX_EXTRA_SPEED));

    const currentSpeed = IDLE_SPEED + extraSpeed.get();
    angle.set(angle.get() + currentSpeed * (delta / 1000));
  });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      extraSpeed.set(
        clamp(extraSpeed.get() + event.deltaX * 0.15, -MAX_EXTRA_SPEED, MAX_EXTRA_SPEED),
      );
    }

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, [prefersReducedMotion, extraSpeed]);

  return (
    <div className="h-full min-h-0" ref={containerRef}>
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          height: wrapperHeight,
          perspective: `${PERSPECTIVE}px`,
          overflow: "visible",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transformStyle: "preserve-3d",
            rotateY: angle,
          }}
        >
          {projects.map((project, index) => (
            <CarouselItem
              angle={angle}
              cardHeight={cardHeight}
              cardWidth={cardWidth}
              itemAngle={index * (360 / n)}
              key={project.slug}
              project={project}
              radius={radius}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

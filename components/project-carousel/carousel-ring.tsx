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
import { useCardSize } from "@/components/project-carousel/use-card-size";
import type { Project } from "@/lib/content/projects";

const PERSPECTIVE = 1400;

const IDLE_SPEED = 6; // degrees per second
const MAX_EXTRA_SPEED = 5 * IDLE_SPEED;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { cardWidth, cardHeight } = useCardSize();

  const angle = useMotionValue(0);
  const extraSpeed = useMotionValue(0);

  const n = projects.length;
  const radius = n > 1 ? (cardWidth / 2 / Math.tan(Math.PI / n)) * 1.5 : 0;

  // A card at translateZ(radius) inside this perspective sits closer to the
  // camera, so the CSS 3D projection renders it larger than cardHeight by a
  // factor of PERSPECTIVE / (PERSPECTIVE - radius) — the same "pop toward
  // viewer" effect that makes the front card readable. The wrapper's box
  // must be sized for that projected height (not the nominal cardHeight),
  // otherwise the magnified front card overflows into whatever sits above
  // or below this section.
  const projectedScale = PERSPECTIVE / (PERSPECTIVE - radius);
  const wrapperHeight = Math.ceil(cardHeight * projectedScale);

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
        clamp(extraSpeed.get() + event.deltaY * 0.15, -MAX_EXTRA_SPEED, MAX_EXTRA_SPEED),
      );
    }

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, [prefersReducedMotion, extraSpeed]);

  return (
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
  );
}

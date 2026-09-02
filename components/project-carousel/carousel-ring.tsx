"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/content/projects";

const PERSPECTIVE = 1400;
const CARD_ASPECT_RATIO = 0.78; // width / height
// Cards render at a fixed size regardless of viewport height — the page
// scrolls vertically instead of squeezing cards down to fit.
const CARD_HEIGHT = 390;

const IDLE_SPEED = 6; // degrees per second
const MAX_EXTRA_SPEED = 5 * IDLE_SPEED;
const DRAG_ROTATION_SENSITIVITY = 0.35; // degrees per pixel of pointer movement
const DRAG_THRESHOLD_PX = 6;

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

  const angle = useMotionValue(0);
  const extraSpeed = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);

  const n = projects.length;
  const cardHeight = CARD_HEIGHT;
  const cardWidth = cardHeight * CARD_ASPECT_RATIO;
  const radius = n > 1 ? (cardWidth / 2 / Math.tan(Math.PI / n)) * 1.5 : 0;

  // A card at translateZ(radius) inside this perspective sits closer to the
  // camera, so the CSS 3D projection renders it larger than cardHeight by a
  // factor of PERSPECTIVE / (PERSPECTIVE - radius) — the same "pop toward
  // viewer" effect that makes the front card readable. wrapperHeight is that
  // same projected size, used to size the perspective box itself so nothing
  // clips as the ring rotates.
  const projectedScale = PERSPECTIVE / (PERSPECTIVE - radius);
  const wrapperHeight = Math.ceil(cardHeight * projectedScale);

  useAnimationFrame((_time, delta) => {
    if (prefersReducedMotion) return;
    // While the user is dragging, pointermove drives `angle` directly —
    // the idle/extraSpeed animation must stand down or the two would fight
    // over the same motion value.
    if (isDraggingRef.current) return;

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

    // Deliberately not using setPointerCapture: Chromium retargets the
    // gesture's trailing click event to the capturing element when pointer
    // capture is active, which would swallow clicks on the "Full details" /
    // "Repository" links inside the cards. Tracking the drag with
    // window-level listeners instead avoids that.
    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      dragStartXRef.current = event.clientX;
      dragStartAngleRef.current = angle.get();
      extraSpeed.set(0);
      setIsDragging(true);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerCancel);
    }

    function handlePointerMove(event: PointerEvent) {
      const delta = event.clientX - dragStartXRef.current;
      if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
        hasDraggedRef.current = true;
      }
      // Dragging right (positive delta) rotates the ring the same direction
      // a rightward wheel-scroll does, so both controls feel consistent.
      angle.set(dragStartAngleRef.current + delta * DRAG_ROTATION_SENSITIVITY);
    }

    function endDrag() {
      isDraggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    }

    // pointerup fires before the gesture's click event, so hasDraggedRef
    // must survive into that click handler below — only pointercancel (which
    // has no click following it) is safe to reset it immediately.
    function handlePointerUp() {
      endDrag();
    }

    function handlePointerCancel() {
      hasDraggedRef.current = false;
      endDrag();
    }

    function handleClickCapture(event: MouseEvent) {
      if (hasDraggedRef.current) {
        event.preventDefault();
        event.stopPropagation();
        hasDraggedRef.current = false;
      }
    }

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    wrapper.addEventListener("pointerdown", handlePointerDown);
    wrapper.addEventListener("click", handleClickCapture, { capture: true });
    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
      wrapper.removeEventListener("pointerdown", handlePointerDown);
      wrapper.removeEventListener("click", handleClickCapture, { capture: true });
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [prefersReducedMotion, extraSpeed, angle]);

  return (
    <div
      className={
        prefersReducedMotion ? "" : isDragging ? "cursor-grabbing select-none" : "cursor-grab select-none"
      }
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

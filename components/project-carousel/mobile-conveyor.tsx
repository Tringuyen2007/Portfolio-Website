"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

import { ProjectCard } from "@/components/project-card";
import { useElementSize } from "@/components/project-carousel/use-element-size";
import type { Project } from "@/lib/content/projects";

const IDLE_SPEED_PX = 40; // pixels per second
const MAX_EXTRA_SPEED_PX = 5 * IDLE_SPEED_PX;
const DRAG_THRESHOLD_PX = 6;
// Matches the `gap-6` (1.5rem = 24px at the default root font size) Tailwind
// class on the track below.
const GAP_PX = 24;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// Keeps x within (-setWidth, 0] so that, with two identical copies of the
// project list rendered back-to-back, the track always shows valid card
// content and the loop point is invisible — a standard infinite-marquee
// technique. Guards setWidth <= 0 (not yet measured) by leaving x alone.
function wrapOffset(x: number, setWidth: number) {
  if (setWidth <= 0) return x;
  const wrapped = ((x % setWidth) + setWidth) % setWidth;
  return wrapped > 0 ? wrapped - setWidth : wrapped;
}

export function MobileConveyor({ projects }: { projects: Project[] }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { width: trackWidth } = useElementSize(trackRef);
  // With N cards per copy, trackWidth (border-box, via ResizeObserver) counts
  // 2N cards and (2N - 1) gaps, so trackWidth / 2 = N * cardWidth +
  // (2N - 1) / 2 * gap = truePeriod - gap / 2, where truePeriod is the real
  // spatial period of the repeating pattern, N * (cardWidth + gap) — the
  // distance from copy A's first card to copy B's first card, which is what
  // wrapOffset needs to wrap by. Adding back half a gap recovers truePeriod
  // exactly (adding a full gap would overshoot it by half a gap).
  const singleSetWidth = trackWidth > 0 ? trackWidth / 2 + GAP_PX / 2 : 0;

  const offsetX = useMotionValue(0);
  const extraSpeed = useMotionValue(0);

  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const isPausedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  useAnimationFrame((_time, delta) => {
    if (singleSetWidth <= 0) return;

    if (!prefersReducedMotion && !isDraggingRef.current && !isPausedRef.current) {
      const decayed = extraSpeed.get() * Math.pow(0.001, delta / 1000);
      extraSpeed.set(clamp(decayed, -MAX_EXTRA_SPEED_PX, MAX_EXTRA_SPEED_PX));

      const speed = IDLE_SPEED_PX + extraSpeed.get();
      offsetX.set(offsetX.get() - speed * (delta / 1000));
    }

    offsetX.set(wrapOffset(offsetX.get(), singleSetWidth));
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handlePointerDown(event: PointerEvent) {
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      dragStartXRef.current = event.clientX;
      dragStartOffsetRef.current = offsetX.get();
      container?.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDraggingRef.current) return;
      const delta = event.clientX - dragStartXRef.current;
      if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
        hasDraggedRef.current = true;
      }
      offsetX.set(dragStartOffsetRef.current + delta);
    }

    function handlePointerUp(event: PointerEvent) {
      isDraggingRef.current = false;
      releasePointerCaptureIfHeld(event);
    }

    // Separate from handlePointerUp: for a real drag-then-release, the
    // browser fires pointerup BEFORE the resulting click event for the same
    // gesture, so click's hasDraggedRef check must still see `true` when it
    // runs — resetting hasDraggedRef in the pointerup handler would clear it
    // too early and break drag-suppression (a drag over a link would
    // navigate). pointercancel, however, has no click event following it, so
    // it's the one place hasDraggedRef must be reset here — otherwise a
    // cancelled drag (e.g. the browser reinterpreting it as a vertical pan)
    // could leave hasDraggedRef stuck `true` with no click ever arriving to
    // reset it, incorrectly suppressing a later keyboard-triggered click.
    function handlePointerCancel(event: PointerEvent) {
      isDraggingRef.current = false;
      hasDraggedRef.current = false;
      releasePointerCaptureIfHeld(event);
    }

    function releasePointerCaptureIfHeld(event: PointerEvent) {
      // pointercancel can fire after the browser has already implicitly
      // released capture, in which case releasePointerCapture throws
      // NotFoundError.
      if (container?.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
    }

    function handleClickCapture(event: MouseEvent) {
      if (hasDraggedRef.current) {
        event.preventDefault();
        event.stopPropagation();
        hasDraggedRef.current = false;
      }
    }

    function handlePointerEnter() {
      isPausedRef.current = true;
    }

    function handlePointerLeave() {
      isPausedRef.current = false;
    }

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerCancel);
    container.addEventListener("click", handleClickCapture, { capture: true });
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointerleave", handlePointerLeave);
    container.addEventListener("focusin", handlePointerEnter);
    container.addEventListener("focusout", handlePointerLeave);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerCancel);
      container.removeEventListener("click", handleClickCapture, { capture: true });
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("focusin", handlePointerEnter);
      container.removeEventListener("focusout", handlePointerLeave);
    };
  }, [offsetX]);

  const trackProjects = [...projects, ...projects];

  return (
    <div className="h-full min-h-0 touch-pan-y overflow-clip" ref={containerRef}>
      <motion.div
        className="flex h-full items-stretch gap-6"
        ref={trackRef}
        style={{ x: offsetX, width: "max-content" }}
      >
        {trackProjects.map((project, index) => (
          <div
            aria-hidden={index >= projects.length ? true : undefined}
            className="aspect-[0.78] h-full min-h-[320px] max-h-[560px] shrink-0"
            inert={index >= projects.length}
            key={`${project.slug}-${index < projects.length ? "a" : "b"}`}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

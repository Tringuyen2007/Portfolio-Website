"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

import { ProjectCard } from "@/components/project-card";
import { useElementSize } from "@/components/project-carousel/use-element-size";
import type { Project } from "@/lib/content/projects";

type HorizontalScrollListProps = {
  projects: Project[];
};

const DRAG_THRESHOLD_PX = 6;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function HorizontalScrollList({ projects }: HorizontalScrollListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useElementSize(containerRef);
  const { width: trackWidth } = useElementSize(trackRef);
  // Negative-only range: 0 keeps the track's start pinned to the container's
  // left edge, and -(trackWidth - containerWidth) is how far it can slide so
  // the track's end lines up with the container's right edge.
  const minX = Math.min(0, containerWidth - trackWidth);

  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  useEffect(() => {
    x.set(clamp(x.get(), minX, 0));
  }, [minX, x]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Deliberately not using setPointerCapture: Chromium retargets the
    // gesture's trailing click event to the capturing element when pointer
    // capture is active, which would swallow clicks on the "Full details" /
    // "Repository" links inside the track. Tracking the drag with
    // window-level listeners instead avoids that, and still survives the
    // pointer moving faster than the container can track it.
    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      hasDraggedRef.current = false;
      dragStartXRef.current = event.clientX;
      dragStartOffsetRef.current = x.get();
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
      x.set(clamp(dragStartOffsetRef.current + delta, minX, 0));
    }

    function endDrag() {
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

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("click", handleClickCapture, { capture: true });

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("click", handleClickCapture, { capture: true });
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [minX, x]);

  return (
    <div
      className={`touch-pan-y select-none overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      ref={containerRef}
    >
      <motion.div
        className="flex items-stretch gap-6"
        ref={trackRef}
        style={{ x, width: "max-content" }}
      >
        {projects.map((project) => (
          <div className="aspect-[0.78] h-[360px] shrink-0" key={project.slug}>
            <ProjectCard project={project} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

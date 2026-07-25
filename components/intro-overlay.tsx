"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { siteConfig } from "@/lib/site";

const HOLD_MS = 900;
const EXIT_MS = 600;

export function IntroOverlay() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"visible" | "exiting" | "done">(
    "visible",
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }

    const exitTimer = setTimeout(() => setPhase("exiting"), HOLD_MS);
    const doneTimer = setTimeout(
      () => setPhase("done"),
      HOLD_MS + EXIT_MS,
    );

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          animate={{ opacity: phase === "exiting" ? 0 : 1 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: EXIT_MS / 1000, ease: "easeInOut" }}
        >
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm tracking-[0.3em] text-text-primary uppercase"
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {siteConfig.name}
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

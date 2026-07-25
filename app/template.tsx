"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {children}
    </motion.div>
  );
}

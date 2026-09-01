"use client";

import { useEffect } from "react";

export function ViewportLock() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("viewport-locked");
    return () => root.classList.remove("viewport-locked");
  }, []);

  return null;
}

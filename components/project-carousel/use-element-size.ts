"use client";

import { useEffect, useState, type RefObject } from "react";

export function useElementSize<T extends Element>(ref: RefObject<T | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { inlineSize, blockSize } = entry.borderBoxSize?.[0] ?? {
        inlineSize: entry.contentRect.width,
        blockSize: entry.contentRect.height,
      };
      setSize({ width: inlineSize, height: blockSize });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

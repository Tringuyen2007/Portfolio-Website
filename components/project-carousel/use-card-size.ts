"use client";

import { useEffect, useState } from "react";

const MIN_CARD_HEIGHT = 280;
const MAX_CARD_HEIGHT = 420;
const VIEWPORT_HEIGHT_RATIO = 0.42;
const CARD_ASPECT_RATIO = 0.78; // width / height

// SSR-safe default so the server-rendered markup matches the client's
// first render before the effect below can measure window.innerHeight.
const DEFAULT_CARD_HEIGHT = 378;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeCardHeight(viewportHeight: number) {
  return clamp(viewportHeight * VIEWPORT_HEIGHT_RATIO, MIN_CARD_HEIGHT, MAX_CARD_HEIGHT);
}

export function useCardSize() {
  const [cardHeight, setCardHeight] = useState(DEFAULT_CARD_HEIGHT);

  useEffect(() => {
    let frame = 0;

    function measure() {
      setCardHeight(computeCardHeight(window.innerHeight));
    }

    function handleResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { cardWidth: Math.round(cardHeight * CARD_ASPECT_RATIO), cardHeight: Math.round(cardHeight) };
}

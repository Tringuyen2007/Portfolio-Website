export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Tickable = { start(): void; stop(): void };

/**
 * Run a ticker only while the page is visible and the element is on screen.
 * Returns a cleanup function.
 */
export function visibilityGate(
  ticker: Tickable,
  element: Element,
  enabled: () => boolean,
): () => void {
  let visible = !document.hidden;
  let onScreen = true;

  const apply = () => {
    if (visible && onScreen && enabled()) ticker.start();
    else ticker.stop();
  };

  const onVisibility = () => {
    visible = !document.hidden;
    apply();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const observer = new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    apply();
  });
  observer.observe(element);

  apply();
  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    observer.disconnect();
    ticker.stop();
  };
}

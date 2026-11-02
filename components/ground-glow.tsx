/**
 * Static, paint-cheap atmospheric background: a warm horizon glow at the
 * bottom (lantern light under the tree) and a cool moss haze at the top.
 * Replaces the 70-span star field. Pure CSS, no animation, no JS.
 */
export function GroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[55vh]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 110%, rgba(217,181,90,0.16), rgba(217,181,90,0.05) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute -top-40 left-1/2 h-[60vh] w-[120vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(111,154,90,0.10), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

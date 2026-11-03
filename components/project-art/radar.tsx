export function RadarCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* house outline */}
      <polyline
        points="110,140 200,70 290,140"
        stroke="var(--text-secondary)"
        strokeOpacity="0.65"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="125" y="128" width="150" height="122" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="80" y1="250.5" x2="320" y2="250.5" stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />

      {/* camera with the shutter pulled aside */}
      <circle cx="200" cy="185" r="16" stroke="var(--accent-strong)" strokeOpacity="1" strokeWidth="1.5" />
      <circle cx="200" cy="185" r="5" stroke="var(--accent-strong)" strokeOpacity="0.9" strokeWidth="1.5" />
      <rect x="226" y="169" width="20" height="32" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Wi-Fi sensing waves */}
      <path d="M182 147.5 A25 25 0 0 1 218 147.5" stroke="var(--accent-strong)" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M168 137 A45 45 0 0 1 232 137" stroke="var(--accent-strong)" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />

      {/* watch receiving the alert */}
      <rect x="306" y="168" width="34" height="40" rx="8" stroke="var(--text-secondary)" strokeOpacity="0.6" strokeWidth="1.5" />
      <line x1="314" y1="182" x2="332" y2="182" stroke="var(--accent-strong)" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="314" y1="192" x2="326" y2="192" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

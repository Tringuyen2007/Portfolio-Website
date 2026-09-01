export function LeanifyCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* baseline for the weekly schedule */}
      <line
        x1="60"
        y1="220"
        x2="340"
        y2="220"
        stroke="var(--text-muted)"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* seven day-type bars: low / moderate / high carb cycling pattern */}
      <rect x="66" y="176" width="24" height="44" rx="4" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" />
      <rect x="106" y="150" width="24" height="70" rx="4" stroke="var(--text-secondary)" strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="146" y="176" width="24" height="44" rx="4" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" />
      <rect
        x="186"
        y="112"
        width="24"
        height="108"
        rx="4"
        stroke="var(--accent-strong)"
        strokeOpacity="0.95"
        strokeWidth="1.5"
      />
      <rect x="226" y="176" width="24" height="44" rx="4" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" />
      <rect x="266" y="150" width="24" height="70" rx="4" stroke="var(--text-secondary)" strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="306" y="176" width="24" height="44" rx="4" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" />

      {/* small sync/offline indicator, orbiting the highlighted high-carb day */}
      <path
        d="M 198 96 A 12 12 0 1 1 186 108"
        stroke="var(--accent-strong)"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

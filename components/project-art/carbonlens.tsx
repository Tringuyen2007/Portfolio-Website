export function CarbonLensCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ground line */}
      <line
        x1="60"
        y1="250"
        x2="340"
        y2="250"
        stroke="var(--text-muted)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* skyline */}
      <rect
        x="67"
        y="205"
        width="40"
        height="45"
        stroke="var(--text-muted)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="117"
        y="175"
        width="45"
        height="75"
        stroke="var(--text-muted)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="170"
        y="120"
        width="55"
        height="130"
        stroke="var(--text-secondary)"
        strokeOpacity="0.65"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="233"
        y="185"
        width="42"
        height="65"
        stroke="var(--text-muted)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="285"
        y="155"
        width="48"
        height="95"
        stroke="var(--text-muted)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* subtle floor dividers */}
      <line
        x1="67"
        y1="227"
        x2="107"
        y2="227"
        stroke="var(--text-muted)"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="285"
        y1="202"
        x2="333"
        y2="202"
        stroke="var(--text-muted)"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* emissions signal radiating from the monitored building */}
      <path
        d="M175.85 107.5 A25 25 0 0 1 219.15 107.5"
        stroke="var(--accent-strong)"
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M158.53 97.5 A45 45 0 0 1 236.47 97.5"
        stroke="var(--accent-strong)"
        strokeOpacity="0.65"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M141.21 87.5 A65 65 0 0 1 253.79 87.5"
        stroke="var(--accent-strong)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

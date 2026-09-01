export function PortfolioWebsiteCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer page/viewport frame */}
      <rect
        x="48"
        y="40"
        width="304"
        height="220"
        rx="10"
        stroke="var(--text-muted)"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />

      {/* Browser chrome dots */}
      <circle cx="66" cy="58" r="2.5" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1" />
      <circle cx="76" cy="58" r="2.5" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1" />
      <circle cx="86" cy="58" r="2.5" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1" />
      <line x1="48" y1="72" x2="352" y2="72" stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1" />

      {/* Header bar - focal element */}
      <rect
        x="70"
        y="90"
        width="260"
        height="34"
        rx="6"
        fill="var(--bg-soft)"
        fillOpacity="0.5"
        stroke="var(--accent-strong)"
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Content block: wide row */}
      <rect
        x="70"
        y="140"
        width="260"
        height="26"
        rx="5"
        stroke="var(--text-muted)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Content block: two-column row */}
      <rect
        x="70"
        y="180"
        width="150"
        height="46"
        rx="5"
        stroke="var(--text-muted)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Sidebar/card square */}
      <rect
        x="234"
        y="180"
        width="96"
        height="46"
        rx="5"
        stroke="var(--text-secondary)"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Footer line */}
      <line
        x1="70"
        y1="242"
        x2="330"
        y2="242"
        stroke="var(--text-muted)"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

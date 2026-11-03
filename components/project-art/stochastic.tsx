export function StochasticCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* two ledgers being merged */}
      <rect x="55" y="70" width="80" height="100" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="55" y="185" width="80" height="60" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />
      {[90, 110, 130, 150].map((y) => (
        <line key={`a-${y}`} x1="67" y1={y + 0.5} x2="123" y2={y + 0.5} stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
      ))}
      {[205, 225].map((y) => (
        <line key={`b-${y}`} x1="67" y1={y + 0.5} x2="123" y2={y + 0.5} stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
      ))}

      {/* flagged line that needs a human */}
      <line x1="67" y1="130.5" x2="123" y2="130.5" stroke="var(--accent-strong)" strokeOpacity="1" strokeWidth="1.5" strokeLinecap="round" />

      {/* merge paths */}
      <path d="M135 120 C 170 120, 170 158, 205 158" stroke="var(--text-secondary)" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M135 215 C 170 215, 170 158, 205 158" stroke="var(--text-secondary)" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />

      {/* consolidated ledger */}
      <rect x="205" y="98" width="85" height="120" stroke="var(--text-secondary)" strokeOpacity="0.65" strokeWidth="1.5" strokeLinejoin="round" />
      {[120, 140, 160, 180, 200].map((y) => (
        <line key={`c-${y}`} x1="217" y1={y + 0.5} x2="278" y2={y + 0.5} stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
      ))}

      {/* leverage under the limit */}
      <line x1="310" y1="110.5" x2="355" y2="110.5" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" />
      <rect x="322" y="150" width="20" height="68" stroke="var(--accent-strong)" strokeOpacity="0.9" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

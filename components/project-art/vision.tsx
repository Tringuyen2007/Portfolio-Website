export function VisionCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Roads cutting through the subdivided grid */}
      <line
        x1="200.5"
        y1="40"
        x2="200.5"
        y2="260"
        stroke="var(--text-secondary)"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <line
        x1="28"
        y1="115.5"
        x2="373"
        y2="115.5"
        stroke="var(--text-secondary)"
        strokeOpacity="0.55"
        strokeWidth="1"
      />

      {/* Subdivided land parcels: 4 columns x 3 rows, sparse grid */}
      <rect x="38" y="53" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="123" y="53" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="293" y="53" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1.5" strokeLinejoin="round" />

      <rect x="38" y="123" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="293" y="123" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round" />

      <rect x="38" y="193" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="123" y="193" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="208" y="193" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="293" y="193" width="70" height="55" stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Focal parcel: the lot under evaluation */}
      <rect
        x="208"
        y="123"
        width="70"
        height="55"
        stroke="var(--accent-strong)"
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Buildable structure sketched inside the focal parcel */}
      <rect
        x="226"
        y="152"
        width="34"
        height="19"
        stroke="var(--accent-strong)"
        strokeOpacity="1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polyline
        points="223,152 243,138 263,152"
        stroke="var(--accent-strong)"
        strokeOpacity="1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VendingMachineRobotCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* sensor sweep arc, emanating from bottom-left corner */}
      <path
        d="M 190.35 205.3 A 160 160 0 0 1 94.7 109.65"
        stroke="var(--text-muted)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* sensor origin */}
      <circle cx="40" cy="260" r="3.5" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.5" />

      {/* detection rays radiating within the sweep */}
      <line
        x1="40"
        y1="260"
        x2="150"
        y2="190"
        stroke="var(--text-muted)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 6"
      />
      <line
        x1="40"
        y1="260"
        x2="128"
        y2="140"
        stroke="var(--text-muted)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 6"
      />
      <line
        x1="40"
        y1="260"
        x2="98"
        y2="118"
        stroke="var(--text-muted)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 6"
      />

      {/* sparse point-cloud / navigation path dots */}
      <circle cx="150" cy="190" r="1.6" fill="var(--text-secondary)" fillOpacity="0.6" />
      <circle cx="128" cy="140" r="1.6" fill="var(--text-secondary)" fillOpacity="0.6" />
      <circle cx="98" cy="118" r="1.6" fill="var(--text-secondary)" fillOpacity="0.6" />
      <circle cx="70" cy="205" r="1.6" fill="var(--text-secondary)" fillOpacity="0.55" />
      <circle cx="185" cy="230" r="1.6" fill="var(--text-secondary)" fillOpacity="0.5" />

      {/* detected object bounding box — focal element */}
      <rect
        x="262"
        y="58"
        width="72"
        height="112"
        rx="8"
        stroke="var(--accent-strong)"
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

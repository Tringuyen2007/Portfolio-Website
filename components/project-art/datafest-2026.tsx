export function DataFest2026CoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* connections from the central patient node to scattered care providers */}
      <line x1="200" y1="150" x2="86" y2="64" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="150" x2="314" y2="52" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="150" x2="292" y2="248" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="150" x2="118" y2="256" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="150" x2="54" y2="164" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="150" x2="184" y2="42" stroke="var(--text-muted)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />

      {/* readmission loop: patient bouncing back to the same provider */}
      <path
        d="M200,150 C300,110 372,140 351,172 C336,196 300,180 292,248"
        stroke="var(--text-secondary)"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeDasharray="2 5"
        strokeLinecap="round"
      />

      {/* outlying provider / department nodes, scattered asymmetrically */}
      <circle cx="86" cy="64" r="4" stroke="var(--text-muted)" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="314" cy="52" r="5" stroke="var(--text-muted)" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="351" cy="172" r="4" stroke="var(--text-muted)" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="292" cy="248" r="5" stroke="var(--text-muted)" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="118" cy="256" r="3" stroke="var(--text-muted)" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="54" cy="164" r="4" stroke="var(--text-muted)" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="184" cy="42" r="3" stroke="var(--text-muted)" strokeOpacity="0.55" strokeWidth="1.5" />

      {/* central patient node — the focal point */}
      <circle cx="200" cy="150" r="7" fill="var(--accent-strong)" fillOpacity="0.9" stroke="var(--accent-strong)" strokeOpacity="1" strokeWidth="1.5" />
    </svg>
  );
}

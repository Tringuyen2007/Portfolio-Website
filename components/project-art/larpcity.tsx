export function LarpCityCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* isometric ground tile */}
      <polygon
        points="200,120 330,190 200,260 70,190"
        stroke="var(--text-muted)"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* small house */}
      <polygon points="115,190 145,174 175,190 145,206" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
      <polyline points="115,190 115,166 145,150 175,166 175,190" stroke="var(--text-muted)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="145" y1="150" x2="145" y2="174" stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1" />

      {/* tower that grows with net worth */}
      <polyline points="215,205 215,105 245,90 275,105 275,205" stroke="var(--text-secondary)" strokeOpacity="0.65" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="245" y1="90" x2="245" y2="220" stroke="var(--text-secondary)" strokeOpacity="0.45" strokeWidth="1" />
      <polyline points="215,205 245,220 275,205" stroke="var(--text-secondary)" strokeOpacity="0.65" strokeWidth="1.5" strokeLinejoin="round" />

      {/* net worth line climbing over the city */}
      <polyline
        points="70,95 110,108 140,85 170,100 200,70 235,62 270,40 330,30"
        stroke="var(--accent-strong)"
        strokeOpacity="0.9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="330" cy="30" r="4" stroke="var(--accent-strong)" strokeOpacity="1" strokeWidth="1.5" />
    </svg>
  );
}

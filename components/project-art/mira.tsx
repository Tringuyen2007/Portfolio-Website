export function MiraCoverArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* floor */}
      <line x1="70" y1="255.5" x2="330" y2="255.5" stroke="var(--text-muted)" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />

      {/* pose skeleton: limbs */}
      <polyline points="200,95 200,165" stroke="var(--text-secondary)" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="150,105 172,112 200,112 228,112 252,92" stroke="var(--text-secondary)" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="170,250 182,210 200,165 222,205 240,250" stroke="var(--text-secondary)" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="200" cy="78" r="15" stroke="var(--text-secondary)" strokeOpacity="0.65" strokeWidth="1.5" />

      {/* tracked joints */}
      {[
        [150, 105],
        [172, 112],
        [228, 112],
        [252, 92],
        [200, 165],
        [182, 210],
        [222, 205],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" stroke="var(--accent-strong)" strokeOpacity="1" strokeWidth="1.5" />
      ))}

      {/* range-of-motion arc at the raised arm */}
      <path d="M248 112 A20 20 0 0 0 242 98" stroke="var(--accent-strong)" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />

      {/* streaming signal to the right */}
      <polyline
        points="275,180 290,180 297,165 305,195 313,172 320,180 340,180"
        stroke="var(--accent-strong)"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

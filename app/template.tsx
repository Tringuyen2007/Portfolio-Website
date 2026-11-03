/**
 * Content-only crossfade on every route change; the sky behind it persists.
 * Plain CSS (see `.page-enter` in globals.css) so the server and client render the
 * same markup, content stays visible without JS, and reduced motion skips it entirely.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

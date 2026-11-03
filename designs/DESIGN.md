# Tri Nguyen — Portfolio redesign brief ("Night City")

## Who
Tri Nguyen. Computer science student at UT San Antonio. Builds AI / computer-vision / full-stack
projects, mostly at hackathons, and keeps winning them. Site = personal portfolio.
Links: GitHub @Tringuyen2007, LinkedIn, resume PDF.

## Mood / theme
A dark city at night, seen from a rooftop. Deep ink-navy sky (not neutral gray, not pure black),
a faint skyline silhouette with scattered lit windows low on the page, thin haze / light bloom,
a few stars. Lighting feels like sodium street lamps (warm amber) with one cooler electric accent
(cyan / ice blue) used sparingly for links, focus and live indicators. Think editorial and
cinematic, NOT cyberpunk-gamer: no magenta/green neon soup, no glitch effects, no scanlines.
Calm confidence. Lots of breathing room. Crisp 1px hairlines. Small mono labels (numbers,
years, coordinates) as a motif, like signage.

Typography: one characterful display face for headlines (serif or geometric display, your call),
a clean sans for body, a mono for labels/metadata.

## Pages to design (desktop 1440 wide; plus one mobile 390 frame of the home page)
1. Home — nav, hero (name, "CS + AI/ML", 1–2 line intro, CTA "View work" + GitHub), a
   "Selected work" section with 3–4 featured projects, a short "Currently" / stats strip
   (e.g. 4 hackathon wins, 10 projects, UTSA '27), footer with contact + socials.
2. Projects — REPLACE the current 3D carousel. Show all 10 projects at once, scannable:
   a featured block for the award winners + an indexed list/grid for the rest (numbered 01–10,
   title, one-line summary, year, award badge, stack tags, hover preview). Must work on mobile.
3. Project detail — case-study page for "Mira" (hero, award badge, stack, overview, what I
   built, links to repo).
4. Experience — timeline of roles + skills, resume button.

## Real content (use it, don't lorem)
Projects (year — award):
01 Mira (2026) — 1st Overall, CodeRED Orion. At-home physical therapy coach: webcam → live 3D
   patient model, real-time pose streaming, fall alerts, AI coaching. Python, FastAPI, CV, Swift.
02 Radar (2026) — VTHacks 14 Winner (Best UI/UX). Privacy-first home emergency system: Wi-Fi
   sensing, physical camera shutter, 7 AI agents brief 911. Python, CV, Swift, OpenVINO.
03 LarpCity (2026) — HackRice Track Winner (Capital One). Financial-life city sim, isometric.
   TypeScript, PixiJS, Gemini. Live at larpcity.club.
04 Vision (2026) — Nationally Recognized (UTSA news). Real-estate feasibility platform: zoning,
   cost models, live comps. Python, RAG, Gemini.
05 Stochastic (2026) — Cal Hacks 13.0. Four AI agents merge an acquired company's books.
   Python, FastAPI, Claude.
06 CarbonLens (2026) — EcoHack 2026. Urban carbon compliance platform, RAG analyst. Python, React.
07 DataFest 2026 (2026) — XGBoost hospital readmission model. Python, Data Science.
08 Leanify (2026) — Offline-first carb-cycling macro tracker PWA. Next.js, Drizzle, PostgreSQL.
09 Vending Machine Robot (2025) — Autonomous robot, real-time human detection. OpenVINO, Flask.
10 Personal Website (2026) — This site. Next.js, MDX, Tailwind.

Experience:
- Vorpex — Software Developer, May–Aug 2026, San Antonio. Next.js marketing site, Cal.com,
  Resend, Plausible.
- CooledTured LLC — Software Engineer Intern, Apr–Aug 2026. Auth, cloud infra (AWS, K8s,
  Docker), full-stack tournament features.
- ACM at UTSA — Secretary, Oct 2025–present. Events for 2000+ members.

## Constraints
- Must be buildable in Next.js + Tailwind: real HTML layout, no impossible 3D.
- Accessible contrast for body text on the dark background.
- The attached photo is Tri's portrait; use it (or a placeholder of the same shape) in the hero.

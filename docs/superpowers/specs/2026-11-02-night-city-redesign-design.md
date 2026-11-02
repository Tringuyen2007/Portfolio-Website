# Night City redesign — design spec (awaiting approval)

Date: 2026-11-02. Status: **proposed, not yet approved.**
Mockups: `designs/renders/*.png` (rendered from pen.dev exports in `designs/export/*.html`).
pen.dev canvas: https://app.pen.dev/s/vQS07y9K4extqWdHUvCEo1fmN4I6EUq5vTRH54dF20o

## Goal
Whole-site visual makeover with a dark "night city" theme, and replace the 3D project
carousel with a layout that shows all ten projects at once and foregrounds the awards.

## Visual system
- **Background** `#070B17` ink-navy (sections alternate with `#04060E`→`#0A1228` gradients).
- **Text** warm off-white `#EEE8DD`; secondary `#A7B1C6`; muted `#76829C`; hairlines `#1D2846` / `#2C3A60`.
- **Accent (amber, street-lamp)** `#F2A93B` for primary buttons, italic taglines, awards, numbering.
- **Accent (ice blue)** `#86DDF5` for links, "live"/current dots only.
- **Type**: Instrument Serif (display), Geist (body), JetBrains Mono (labels: N° 001, FIG. 01, coords, years).
- **Motifs**: numbered section labels with hairline rules; skyline silhouette with lit windows + amber
  horizon glow at page bottoms and under the hero; sparse star field. Pure HTML/CSS, no 3D.

## Pages
1. **Home**: nav (01 Work · 02 Projects · 03 Experience · 04 Resume, "Open to 2027 roles" pill) →
   hero (name, amber italic "CS + AI/ML, after dark.", intro, View work / GitHub / Résumé, portrait
   with FIG. 01 caption) → skyline → stats strip (4 wins · 10 projects · '27 · 2k+) →
   "Built over weekends, judged by strangers." selected work: Mira large + Radar/LarpCity/Vision
   cards → footer "Let's build something after dark." with GitHub/LinkedIn/Resume rows over skyline.
2. **Projects** (replaces carousel): header with counts (10 projects · 04 awards · '25–'26) + filter
   chips → A. Award winners 2×2 (Mira, Radar, LarpCity, Vision, each with award badge) →
   B. The rest of the index 05–10 as a table (No. / Project / Summary / Stack / Event / Year) with
   hover preview thumbnail → footer.
3. **Project detail** (Mira): breadcrumb, award badge, giant title + italic one-liner, facts table
   (Year/Event/Result/Platform), View repo / All projects, full-width image, Overview, "What I built"
   2×2, result band, next-project link, footer.
4. **Experience**: header + Download résumé → roles timeline (Vorpex, CooledTured, ACM current) →
   hackathon record table (4×) → toolkit columns → footer.
5. **Mobile home**: same system stacked; stats 2×2; Radar/LarpCity/Vision as thumbnail rows.

## Implementation notes (for the plan, after approval)
- Keep Next.js 16 / Tailwind 4 / content-collections. Replace tokens in `app/globals.css`;
  swap fonts in `app/layout.tsx` (Instrument Serif, Geist, JetBrains Mono).
- New components: Skyline (CSS/SVG), SectionLabel, AwardBadge, StackTag, FeaturedProjectCard,
  ProjectIndexTable (with hover preview), StatsStrip, Footer rewrite.
- Delete `components/project-carousel/*`; `/projects` uses featured grid + index table.
- Project cover images: AI stand-ins in the mockup → use real screenshots or keep generative art.
- Agent-added details to confirm: Mira "Web + iOS", CooledTured "Remote", Cal Hacks/EcoHack "Competed",
  "Open to 2027 roles" pill, stats numbers.

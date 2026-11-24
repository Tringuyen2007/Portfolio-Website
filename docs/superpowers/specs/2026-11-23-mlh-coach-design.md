# MLH Coach: experience vine + Community apple

**Date:** 2026-11-23
**Branch:** `new-ui`
**Status:** Approved by Tri ("begin")

## Goal

Add Tri's role as a **Major League Hacking Coach** to the two places that tell the
career story:

1. **Experience vines** (`/experience` and the homepage vine preview), driven by
   `content/experience.ts`.
2. **The apple tree** (`/projects`), driven by MDX in `content/projects/`.

No other surface changes. No component or layout code changes.

## Verified facts (from Tri, 2026-11-23)

| Fact | Value |
| --- | --- |
| Title | Major League Hacking Coach |
| Start | November 2026 |
| End | Present (ongoing) |
| Engagement | Contract (not shown on the site) |
| Event | HackUTA (UT Arlington, Arlington, TX) |
| Reach | Mentored 100+ hackers |
| Duties | Mentoring and debugging hacker projects; running the MLH table and sponsor challenges (Solana, Tiger Data, DEV prizes visible in photos); workshops and mini-events; judging and prize-submission support; onboarding first-time hackers |

Nothing beyond this table may be stated as fact.

## Design

### 1. Experience vine entry

New `ExperienceEntry` in `content/experience.ts`, inserted **first** (the list is
newest-first and November 2026 is the newest start date):

- `id: "mlh-coach"`, `kind: "leadership"`, `location: "Arlington, TX"`
- A recruiter-grade summary, five action-verb responsibilities, one quantified
  achievement (100+ hackers), and the three coach photos as `images`.
- `technologies: []`. Coaching isn't a tech-stack role, and the ACM entry follows
  the same pattern.

The page intro mentions "shipping production sites, working inside cloud
infrastructure, and keeping a 2000-member student organization running". Extend it
with hackathon mentoring so the header matches the vines.

### 2. Apple on the "Leadership & Community" branch

New `content/projects/mlh-coach.mdx` with `category: "leadership"`. That branch
(`content/branches.ts`) currently has no apples, so this becomes its first fruit.
There's no `award`, so it renders as a **red** apple (golden is reserved for
verified awards, enchanted for Vision only). `status: "ongoing"`.
`stack` must be non-empty (schema `min(1)`), so it lists the skills the role
exercises: Mentorship, Technical Debugging, Workshops, Developer Relations.

The body follows the house style of the other MDX files: Overview, What I do,
Takeaway.

### 3. Photos

Source: `img/Coach/` (git-ignored raw photos). Publish as web-sized JPEGs
(long edge 1600 px, matching the other galleries) to
`public/images/projects/mlh-coach/{1,2,3}.jpg`. Both the MDX gallery and the
experience `images` reference these files, so each photo ships once.

| File | Source | Alt |
| --- | --- | --- |
| `1.jpg` | `IMG_4426.PNG` | Tri and two fellow coaches at the Major League Hacking table at HackUTA |
| `2.jpg` | `IMG_4496.JPG` | The MLH coaching crew in laurel crowns and MLH shirts |
| `3.jpg` | `IMG_4431.JPG` | The coaching team at dinner during HackUTA weekend |

`IMG_4496.JPG` was shot tilted. Check the EXIF orientation when converting.

## Testing

- `npm test` (Vitest: layout, apple-kind, scene manifest) stays green. The layout
  test exercises branch placement, and the leadership branch is gaining its first apple.
- `npm run build` succeeds (content-collections validates the MDX schema).
- Visual check: `/experience` shows the MLH vine first. `/projects` shows a red apple
  on the Community branch, and `/projects/mlh-coach` renders with its gallery.

## Out of scope

Resume PDF, contact page, homepage copy beyond what the vine preview pulls
automatically, new apple kinds, award badges.

## Implementation notes (2026-11-23)

Two assumptions in this spec turned out wrong during the build:

- **Every apple needs a pixel scene.** `tests/scene-manifest.test.ts` requires
  `public/pixel/scene-<slug>-f{0,1}.png`. Added an `mlh-coach` scene to
  `scripts/pixel/scenes.mjs`: a coach behind a navy MLH table with red/blue/yellow
  blocks and a laptop, where an idea bulb lights up in frame 2. Regenerate with
  `npm run build:pixel`.
- **Experience `images` were never rendered.** `ExperienceDetails` counted them
  toward showing the "More from this role" drawer but only drew links. The drawer now
  renders them with `ProjectGallery`, so role photos get the same pixel frame and
  lightbox as project pages.
- The photos were re-encoded to roughly 240 KB each to match the other galleries.

Verified: `npm test` 16/16, `npm run lint` clean, `npm run build` passes. In the
browser, the MLH vine renders first with its three photos, the Community branch shows
one red apple linking to `/projects/mlh-coach`, and there are no console errors.

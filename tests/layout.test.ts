import { describe, expect, it } from "vitest";

import { buildTreeLayout, DESKTOP_FRAME, type TreeProjectInput } from "@/lib/tree/layout";

const projects: TreeProjectInput[] = [
  { slug: "mira", title: "Mira", category: "hackathon", fruit: "golden", year: 2026 },
  { slug: "radar", title: "Radar", category: "hackathon", fruit: "golden", year: 2026 },
  { slug: "carbonlens", title: "CarbonLens", category: "hackathon", fruit: "ripe", year: 2026 },
  { slug: "vision", title: "Vision", category: "ai-ml", fruit: "golden", year: 2026 },
  { slug: "leanify", title: "Leanify", category: "software", fruit: "ripe", year: 2026 },
  { slug: "portfolio-website", title: "Site", category: "software", fruit: "green", year: 2026 },
];

describe("buildTreeLayout", () => {
  it("is deterministic for the same input", () => {
    const a = buildTreeLayout(projects, DESKTOP_FRAME);
    const b = buildTreeLayout(projects, DESKTOP_FRAME);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("places every project exactly once", () => {
    const layout = buildTreeLayout(projects, DESKTOP_FRAME);
    const slugs = layout.fruits.map((fruit) => fruit.slug).sort();
    expect(slugs).toEqual(projects.map((p) => p.slug).sort());
  });

  it("keeps apples from overlapping", () => {
    const layout = buildTreeLayout(projects, DESKTOP_FRAME);
    for (const a of layout.fruits) {
      for (const b of layout.fruits) {
        if (a === b) continue;
        const d = Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y);
        expect(d).toBeGreaterThanOrEqual(a.radius + b.radius);
      }
    }
  });

  it("rounds coordinates to two decimals so SSR and client agree", () => {
    const layout = buildTreeLayout(projects, DESKTOP_FRAME);
    for (const fruit of layout.fruits) {
      expect(Math.round(fruit.position.x * 100) / 100).toBe(fruit.position.x);
      expect(Math.round(fruit.position.y * 100) / 100).toBe(fruit.position.y);
    }
  });

  it("keeps existing apples in place when a new project is added", () => {
    const before = buildTreeLayout(projects, DESKTOP_FRAME);
    const after = buildTreeLayout(
      [...projects, { slug: "new-one", title: "New", category: "research", fruit: "green", year: 2027 }],
      DESKTOP_FRAME,
    );
    const moved = before.fruits.filter((fruit) => {
      const next = after.fruits.find((f) => f.slug === fruit.slug);
      return !next || next.branchId !== fruit.branchId;
    });
    expect(moved).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";

import { snap, unitFor } from "@/lib/pixel/unit";

describe("pixel unit", () => {
  it("is 4 on desktop and 3 on mobile", () => {
    expect(unitFor(1440)).toBe(4);
    expect(unitFor(768)).toBe(4);
    expect(unitFor(767)).toBe(3);
    expect(unitFor(390)).toBe(3);
  });

  it("snaps to whole art pixels", () => {
    expect(snap(17, 4)).toBe(16);
    expect(snap(18, 3)).toBe(18);
  });
});

import { placeApples, stageUnit, TREE_W } from "@/lib/pixel/orchard";
import type { TreeProject } from "@/lib/tree/types";

const project = (slug: string, category: string, year = 2026): TreeProject => ({
  slug,
  title: slug,
  summary: "",
  category,
  fruit: "ripe",
  apple: "red",
  status: "completed",
  year,
  href: `/projects/${slug}`,
});

describe("stageUnit", () => {
  it("keeps the site unit when the tree fits", () => {
    expect(stageUnit(4, 1312)).toBe(4);
  });

  it("shrinks so the whole tree fits a phone, never below 2", () => {
    expect(stageUnit(3, 350) * TREE_W).toBeLessThanOrEqual(400);
    expect(stageUnit(3, 100)).toBe(2);
  });
});

describe("placeApples", () => {
  const projects = [
    ...["a", "b", "c", "d", "e", "f"].map((s) => project(`hack-${s}`, "hackathon")),
    project("ml-1", "ai-ml"),
    project("ml-2", "ai-ml"),
    project("sw-1", "software"),
    project("sw-2", "software"),
  ];

  it("never overlaps two apples", () => {
    const placed = placeApples(projects);
    for (const a of placed)
      for (const b of placed)
        if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(12);
  });

  it("keeps existing apples in place when a newer project is added", () => {
    const before = placeApples(projects);
    const after = placeApples([...projects, project("hack-new", "hackathon", 2027)]);
    for (const apple of before) {
      const same = after.find((a) => a.slug === apple.slug)!;
      expect([same.x, same.y]).toEqual([apple.x, apple.y]);
    }
  });
});

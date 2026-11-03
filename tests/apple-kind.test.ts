import { describe, expect, it } from "vitest";

import { appleKinds, ENCHANTED_SLUG } from "@/content-collections";

/** Mirrors the derivation in content-collections.ts transform. */
function deriveApple(doc: { slug: string; enchanted?: boolean; award?: string }) {
  if (doc.enchanted && doc.slug !== ENCHANTED_SLUG) {
    throw new Error(`Only "${ENCHANTED_SLUG}" may set enchanted: true (found on "${doc.slug}")`);
  }
  return doc.enchanted ? "enchanted" : doc.award ? "golden" : "red";
}

describe("apple classification", () => {
  it("exposes exactly three kinds", () => {
    expect([...appleKinds]).toEqual(["red", "golden", "enchanted"]);
  });

  it("gives golden only to projects with an award", () => {
    expect(deriveApple({ slug: "mira", award: "1st Overall" })).toBe("golden");
    expect(deriveApple({ slug: "leanify" })).toBe("red");
  });

  it("allows the enchanted apple on vision only", () => {
    expect(deriveApple({ slug: "vision", enchanted: true, award: "Finalist" })).toBe("enchanted");
    expect(() => deriveApple({ slug: "mira", enchanted: true })).toThrow(/Only "vision"/);
  });
});

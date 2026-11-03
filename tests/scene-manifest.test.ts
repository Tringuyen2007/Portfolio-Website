import { existsSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("pixel asset manifest", () => {
  const slugs = readdirSync("content/projects")
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  it("has two scene frames for every project", () => {
    for (const slug of slugs) {
      expect(existsSync(`public/pixel/scene-${slug}-f0.png`), slug).toBe(true);
      expect(existsSync(`public/pixel/scene-${slug}-f1.png`), slug).toBe(true);
    }
  });

  it("has the core world sprites", () => {
    for (const name of ["tree", "ground", "sky-desktop", "sky-mobile", "moon", "cloud-s", "cloud-m", "cloud-l", "apple-red", "apple-golden", "apple-enchanted", "apple-enchanted-f0", "apple-enchanted-f1", "apple-enchanted-f2", "shell-red", "shell-golden", "shell-enchanted", "sign-plank"]) {
      expect(existsSync(`public/pixel/${name}.png`), name).toBe(true);
    }
  });
});

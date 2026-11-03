import type { TreeProjectInput } from "@/lib/tree/layout";

export type AppleKind = "red" | "golden" | "enchanted";

/** Serializable project record passed from server pages into the client tree. */
export type TreeProject = TreeProjectInput & {
  summary: string;
  apple: AppleKind;
  award?: string;
  event?: string;
  status: "completed" | "in-progress" | "ongoing";
  href: string;
  /** External article link (kind "article"), shown on the enchanted preview. */
  articleHref?: string;
};

/** 1× sprite for an apple kind under public/pixel (scaled by --unit in CSS). */
export const APPLE_SPRITES: Record<AppleKind, string> = {
  red: "/pixel/apple-red.png",
  golden: "/pixel/apple-golden.png",
  enchanted: "/pixel/apple-enchanted.png",
};

export const FRUIT_COLORS: Record<TreeProjectInput["fruit"], [string, string]> = {
  golden: ["#f3d77a", "#a9822a"],
  ripe: ["#d9584c", "#8e2f2a"],
  green: ["#86b06c", "#3f5d38"],
  blossom: ["#f0c4ce", "#b0788a"],
};

export const FRUIT_LABELS: Record<TreeProjectInput["fruit"], { label: string; meaning: string }> = {
  golden: { label: "Golden apple", meaning: "A verified award or win" },
  ripe: { label: "Ripe apple", meaning: "A completed project" },
  green: { label: "Green apple", meaning: "Still growing: in progress or ongoing" },
  blossom: { label: "Blossom", meaning: "An event, milestone, or participation" },
};

export const APPLE_LABELS: Record<AppleKind, { label: string; meaning: string }> = {
  red: { label: "Red apple", meaning: "A project or hackathon build" },
  golden: { label: "Golden apple", meaning: "Came home with a verified award" },
  enchanted: {
    label: "Enchanted golden apple",
    meaning: "Red Bull Basement 2026 U.S. National Finalist (Vision only)",
  },
};

export const APPLE_COLORS: Record<AppleKind, [string, string]> = {
  red: ["#f07a6a", "#8e1f26"],
  golden: ["#ffd95a", "#a8771a"],
  enchanted: ["#e3a6ff", "#6a2f9c"],
};

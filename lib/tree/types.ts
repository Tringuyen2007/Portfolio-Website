import type { TreeProjectInput } from "@/lib/tree/layout";

/** Serializable project record passed from server pages into the client tree. */
export type TreeProject = TreeProjectInput & {
  summary: string;
  award?: string;
  event?: string;
  status: "completed" | "in-progress" | "ongoing";
  href: string;
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

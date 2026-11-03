export type BranchSide = "left" | "right";

export type BranchDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  /** Project categories that hang on this branch. */
  categories: string[];
  side: BranchSide;
  /** 0 = trunk base, 1 = trunk top. Where the branch leaves the trunk. */
  attach: number;
  /** Degrees from straight up, measured outward. 90 = horizontal. */
  angle: number;
  /** Multiplier on the frame's base branch length. */
  length: number;
};

/**
 * The branches are the categories of the journey. Adding a branch here grows
 * the tree; projects attach by `category` (or an explicit `tree.branch`).
 * Order matters for deterministic layout: keep it stable.
 */
export const branches: BranchDefinition[] = [
  {
    id: "hackathons",
    label: "Hackathons & Competitions",
    shortLabel: "Hackathons",
    description: "Weekend builds, judged by strangers. Where most of the golden apples grew.",
    categories: ["hackathon"],
    side: "right",
    attach: 0.55,
    angle: 62,
    length: 1.15,
  },
  {
    id: "ai-ml",
    label: "AI & Machine Learning",
    shortLabel: "AI / ML",
    description: "Computer vision, RAG pipelines, and models that have to be right.",
    categories: ["ai-ml"],
    side: "left",
    attach: 0.68,
    angle: 58,
    length: 1.0,
  },
  {
    id: "software",
    label: "Software Engineering",
    shortLabel: "Software",
    description: "Products built to be used: full-stack apps, PWAs, and this site.",
    categories: ["software"],
    side: "left",
    attach: 0.4,
    angle: 72,
    length: 0.95,
  },
  {
    id: "research",
    label: "Research & Innovation",
    shortLabel: "Research",
    description: "A young branch. The next season of work grows here.",
    categories: ["research"],
    side: "right",
    attach: 0.84,
    angle: 40,
    length: 0.6,
  },
  {
    id: "leadership",
    label: "Leadership & Community",
    shortLabel: "Community",
    description: "ACM at UTSA and the people side of building things.",
    categories: ["leadership"],
    side: "left",
    attach: 0.9,
    angle: 34,
    length: 0.55,
  },
];

export function getBranchForCategory(category: string) {
  return branches.find((branch) => branch.categories.includes(category)) ?? branches[0];
}

import type { ComponentType } from "react";

import { CarbonLensCoverArt } from "@/components/project-art/carbonlens";
import { DataFest2026CoverArt } from "@/components/project-art/datafest-2026";
import { LeanifyCoverArt } from "@/components/project-art/leanify";
import { PortfolioWebsiteCoverArt } from "@/components/project-art/portfolio-website";
import { VendingMachineRobotCoverArt } from "@/components/project-art/vending-machine-robot";
import { VisionCoverArt } from "@/components/project-art/vision";

export const projectCoverArt: Record<string, ComponentType<{ className?: string }>> = {
  carbonlens: CarbonLensCoverArt,
  "datafest-2026": DataFest2026CoverArt,
  leanify: LeanifyCoverArt,
  "portfolio-website": PortfolioWebsiteCoverArt,
  "vending-machine-robot": VendingMachineRobotCoverArt,
  vision: VisionCoverArt,
};

export function ProjectCoverArt({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Art = projectCoverArt[slug];

  if (!Art) {
    return null;
  }

  return <Art className={className} />;
}

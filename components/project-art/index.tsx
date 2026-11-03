import type { ComponentType } from "react";

import { CarbonLensCoverArt } from "@/components/project-art/carbonlens";
import { DataFest2026CoverArt } from "@/components/project-art/datafest-2026";
import { LarpCityCoverArt } from "@/components/project-art/larpcity";
import { LeanifyCoverArt } from "@/components/project-art/leanify";
import { MiraCoverArt } from "@/components/project-art/mira";
import { PortfolioWebsiteCoverArt } from "@/components/project-art/portfolio-website";
import { RadarCoverArt } from "@/components/project-art/radar";
import { StochasticCoverArt } from "@/components/project-art/stochastic";
import { VendingMachineRobotCoverArt } from "@/components/project-art/vending-machine-robot";
import { VisionCoverArt } from "@/components/project-art/vision";

export const projectCoverArt: Record<string, ComponentType<{ className?: string }>> = {
  carbonlens: CarbonLensCoverArt,
  "datafest-2026": DataFest2026CoverArt,
  larpcity: LarpCityCoverArt,
  leanify: LeanifyCoverArt,
  mira: MiraCoverArt,
  "portfolio-website": PortfolioWebsiteCoverArt,
  radar: RadarCoverArt,
  stochastic: StochasticCoverArt,
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

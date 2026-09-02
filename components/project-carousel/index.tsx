import type { Project } from "@/lib/content/projects";
import { CarouselRing } from "@/components/project-carousel/carousel-ring";
import { HorizontalScrollList } from "@/components/project-carousel/horizontal-scroll-list";
import { MobileConveyor } from "@/components/project-carousel/mobile-conveyor";

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  return (
    <div>
      <div className="hidden motion-safe:lg:block">
        <CarouselRing projects={projects} />
      </div>
      <div className="hidden motion-safe:max-lg:block">
        <MobileConveyor projects={projects} />
      </div>
      <div className="hidden motion-reduce:block">
        <HorizontalScrollList projects={projects} />
      </div>
    </div>
  );
}

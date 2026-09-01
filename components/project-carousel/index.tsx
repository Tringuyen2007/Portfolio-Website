import type { Project } from "@/lib/content/projects";
import { CarouselRing } from "@/components/project-carousel/carousel-ring";
import { HorizontalScrollList } from "@/components/project-carousel/horizontal-scroll-list";

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  return (
    <>
      <div className="hidden motion-safe:lg:block">
        <CarouselRing projects={projects} />
      </div>
      <div className="motion-safe:lg:hidden">
        <HorizontalScrollList projects={projects} />
      </div>
    </>
  );
}

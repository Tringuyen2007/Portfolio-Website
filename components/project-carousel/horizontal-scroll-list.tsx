import type { Project } from "@/lib/content/projects";
import { ProjectCard } from "@/components/project-card";

type HorizontalScrollListProps = {
  projects: Project[];
};

export function HorizontalScrollList({ projects }: HorizontalScrollListProps) {
  return (
    <div className="flex h-full snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {projects.map((project) => (
        <div className="aspect-[0.78] h-full min-h-[320px] max-h-[560px] shrink-0 snap-center" key={project.slug}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}

import { PortraitToggle } from "@/components/home/portrait-toggle";
import { SectionHeading } from "@/components/home/section-heading";
import { Sprite, type SpriteName } from "@/components/home/sprite";
import type { TreeProject } from "@/lib/tree/types";

function plural(count: number, one: string, many: string) {
  return count === 1 ? one : many;
}

/** Every stat is derived from the project data; nothing is hardcoded. */
export function aboutStats(projects: TreeProject[]) {
  const total = projects.length;
  const hackathonWins = projects.filter(
    (project) => Boolean(project.award) && project.category === "hackathon",
  ).length;
  const finalists = projects.filter((project) => project.apple === "enchanted").length;

  return [
    {
      value: total,
      label: plural(total, "project on the tree", "projects on the tree"),
      sprite: "apple-red" as SpriteName,
    },
    {
      value: hackathonWins,
      label: plural(hackathonWins, "hackathon win", "hackathon wins"),
      sprite: "apple-golden" as SpriteName,
    },
    {
      value: finalists,
      label: plural(finalists, "U.S. national finalist", "U.S. national finalists"),
      sprite: "apple-enchanted" as SpriteName,
    },
  ];
}

export function AboutSection({ projects }: { projects: TreeProject[] }) {
  const stats = aboutStats(projects);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-start lg:gap-16">
      <div className="space-y-10">
        <SectionHeading title="The gardener.">
          <p className="max-w-[640px] text-[17px] leading-[29px] text-text-secondary">
            He is growing an apple tree, check it out!
          </p>
        </SectionHeading>

        <dl className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div className="panel flex flex-col gap-3 p-5" key={stat.label}>
              <Sprite name={stat.sprite} scale={1} />
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-heading text-4xl font-bold leading-none text-text-primary">
                {stat.value}
              </dd>
              <dd className="text-[15px] leading-6 text-text-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figure className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
        <div className="panel p-[calc(var(--unit)*2)]">
          <div className="relative h-[260px] w-full overflow-hidden bg-bg-soft md:aspect-[4/5] md:h-auto">
            <PortraitToggle />
          </div>
        </div>
        <Sprite
          className="absolute -top-[calc(var(--unit)*3)] -left-[calc(var(--unit)*3)]"
          name="leaf"
          scale={2}
        />
        <Sprite
          className="absolute -right-[calc(var(--unit)*3)] -bottom-[calc(var(--unit)*3)] -scale-x-100"
          name="leaf"
          scale={2}
        />
        <figcaption className="sr-only">Tri Nguyen</figcaption>
      </figure>
    </div>
  );
}

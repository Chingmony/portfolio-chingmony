import { featuredProjects, projects } from "@/data/projects";
import { Section } from "@/components/section";
import { FeaturedProjects } from "@/components/featured-projects";
import { LinkButton } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion";
import { ArrowIcon } from "@/components/icons";

export function ProjectsSection() {
  const extra = projects.length - featuredProjects.length;
  return (
    <Section
      id="projects"
      index="01"
      eyebrow="Selected work"
      title={<>Things I have built and broken.</>}
      intro="Each project is a system I designed end to end — the architecture, the security model and the trade-offs are documented, not implied."
      containerSize="wide"
      headerAside={
        extra > 0 ? (
          <LinkButton href="/projects" variant="line" size="sm">
            View all projects
            <ArrowIcon className="text-sm" />
          </LinkButton>
        ) : undefined
      }
    >
      <FeaturedProjects projects={featuredProjects} />

      {extra > 0 && (
        <Reveal className="mt-12">
          <LinkButton
            href="/projects"
            variant="ghost"
            className="w-full justify-center border border-dashed border-line py-5 font-mono text-[13px]"
          >
            + {extra} more project{extra > 1 ? "s" : ""} in the archive →
          </LinkButton>
        </Reveal>
      )}
    </Section>
  );
}

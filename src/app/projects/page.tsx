import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Projects",
  description: "Security platforms, tools and research systems — built end to end.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${projects.length} projects`}
        title="Everything I have built."
        intro="Platforms, tools and research systems. Each entry documents the architecture, the stack and the security model."
        crumbs={[{ label: "~", href: "/" }, { label: "projects" }]}
      />
      <Container className="py-14 sm:py-20">
        <Stagger className="grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <StaggerItem key={p.slug}>
              <ProjectCard project={p} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </>
  );
}

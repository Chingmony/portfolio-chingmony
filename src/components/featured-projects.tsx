"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "@/components/project-preview";
import { ArrowIcon } from "@/components/icons";

function ShowcaseCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const category = project.category ?? project.kind;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/projects/${project.slug}`}
        data-cursor-label="case study"
        className="group block"
      >
        <ProjectPreview project={project} index={index} />

        {/* caption row */}
        <div className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-4">
          <div className="flex gap-4">
            <span className="font-display text-3xl leading-none text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="display-m text-ink transition-colors duration-300 group-hover:text-accent">
                {project.title}
              </h3>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                {category}
              </p>
            </div>
          </div>
          <span
            aria-hidden
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-dim transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-bg"
          >
            <ArrowIcon className="text-sm transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <ShowcaseCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import { Tag, CornerTicks } from "@/components/ui/primitives";
import { ArrowUpRight } from "@/components/icons";

const statusTone: Record<Project["status"], "accent" | "cyan" | "warn"> = {
  active: "accent",
  shipped: "cyan",
  archived: "warn",
};

const kindLabel: Record<Project["kind"], string> = {
  platform: "Platform",
  tool: "Tool",
  research: "Research",
  library: "Library",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Cursor-follow spotlight — written to CSS vars so it never triggers React
  // re-renders. The glow itself is a radial gradient gated to :hover in markup.
  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <Link
      ref={ref}
      href={`/projects/${project.slug}`}
      onPointerMove={onMove}
      className="group relative flex flex-col overflow-hidden rounded-[2px] border border-line bg-raise/50 p-6 transition-colors duration-200 hover:border-line-strong focus-visible:border-accent sm:p-7"
    >
      {/* cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--accent) 10%, transparent), transparent 70%)",
        }}
      />
      <CornerTicks className="opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <span className="font-mono text-[11px] tracking-widest text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <Tag tone={statusTone[project.status]}>{project.status}</Tag>
          <Tag>{kindLabel[project.kind]}</Tag>
        </div>
      </div>

      <h3 className="relative display-m mt-6 text-ink transition-colors group-hover:text-accent">
        {project.title}
      </h3>
      <p className="relative mt-2 font-mono text-[12px] text-faint">{project.tagline}</p>

      <p className="relative mt-4 flex-1 text-[14px] leading-relaxed text-dim">{project.summary}</p>

      {/* spec strip */}
      <dl className="relative mt-6 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line pt-5">
        {project.highlights.slice(0, 4).map((h) => (
          <div key={h.label} className="flex items-baseline justify-between gap-2">
            <dt className="truncate font-mono text-[10px] uppercase tracking-wider text-faint">
              {h.label}
            </dt>
            <dd className="shrink-0 font-mono text-[12px] text-ink">{h.value}</dd>
          </div>
        ))}
      </dl>

      <div className="relative mt-6 flex items-center justify-between">
        <span className="flex flex-wrap gap-1.5">
          {project.stack
            .flatMap((g) => g.items)
            .slice(0, 3)
            .map((t) => (
              <span key={t} className="font-mono text-[11px] text-faint">
                {t}
              </span>
            ))}
          <span className="font-mono text-[11px] text-faint">…</span>
        </span>
        <span className="flex items-center gap-1 font-mono text-[12px] text-dim transition-colors group-hover:text-accent">
          open
          <ArrowUpRight className="text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

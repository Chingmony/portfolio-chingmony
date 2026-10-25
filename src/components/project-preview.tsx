import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/* A generative "website preview" — a browser frame around a stylized mock
   landing page in the project's palette. It is deliberately abstract (not a
   fabricated screenshot of the real app), and the interior motif varies by
   index so no two previews read the same. */
export function ProjectPreview({ project, index }: { project: Project; index: number }) {
  const variant = index % 3;
  const host = hostFor(project);

  return (
    <div className="relative overflow-hidden rounded-[3px] border border-line bg-raise-2">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-bg/60 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full border border-line-strong" />
          <span className="h-2 w-2 rounded-full border border-line-strong" />
          <span className="h-2 w-2 rounded-full bg-accent/80" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-[2px] border border-line bg-sunken px-2 py-0.5 text-center font-mono text-[9px] text-faint">
          {host}
        </span>
      </div>

      {/* mock page */}
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden p-4 transition-transform duration-500 ease-out group-hover:scale-[1.03]",
          variant === 0 && "bg-[#0c0c0d]",
          variant === 1 && "bg-[#0a0a0b]",
          variant === 2 && "bg-[#0d0c0c]",
        )}
      >
        {/* motif */}
        {variant === 0 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, color-mix(in oklab, var(--accent) 16%, transparent) 0 2px, transparent 2px 26px)",
            }}
          />
        )}
        {variant === 1 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in oklab, var(--accent) 50%, transparent) 1.4px, transparent 1.4px)",
              backgroundSize: "22px 22px",
              maskImage: "linear-gradient(120deg, #000, transparent 75%)",
              WebkitMaskImage: "linear-gradient(120deg, #000, transparent 75%)",
            }}
          />
        )}
        {variant === 2 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex flex-wrap gap-x-2 overflow-hidden p-3 font-mono text-[8px] leading-[1.35] text-accent/25"
          >
            {Array.from({ length: 80 }).map((_, i) => (
              <span key={i}>{(i * 7 + 3).toString(16).padStart(2, "0")}</span>
            ))}
          </div>
        )}

        {/* mock nav */}
        <div className="relative flex items-center justify-between">
          <span className="h-2.5 w-2.5 rounded-[1px] bg-accent" />
          <div className="flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-line-strong" />
            <span className="h-1 w-6 rounded-full bg-line-strong" />
            <span className="h-3 w-10 rounded-[1px] bg-accent/80" />
          </div>
        </div>

        {/* mock hero */}
        <div className="relative mt-5">
          <div className="display-huge max-w-[85%] text-[clamp(1.3rem,3.2vw,2rem)] leading-[0.85] text-ink/90">
            {project.title}
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <span className="h-1.5 w-2/3 rounded-full bg-line-strong/80" />
            <span className="h-1.5 w-1/2 rounded-full bg-line-strong/60" />
          </div>
          <div className="mt-4 flex gap-2">
            {project.stack
              .flatMap((g) => g.items)
              .slice(0, 3)
              .map((t) => (
                <span
                  key={t}
                  className="rounded-[2px] border border-line bg-bg/50 px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-wider text-faint"
                >
                  {t}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function hostFor(project: Project): string {
  const repo = project.links.find((l) => l.kind === "repo");
  if (repo) return repo.href.replace(/^https?:\/\//, "");
  return `lab.local/${project.slug}`;
}

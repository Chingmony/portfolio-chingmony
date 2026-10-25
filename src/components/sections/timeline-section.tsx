import Link from "next/link";
import { sortedTimeline, type TimelineEntry } from "@/data/timeline";
import { Section } from "@/components/section";
import { Stagger, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";

const kindMeta: Record<TimelineEntry["kind"], { label: string; dot: string }> = {
  role: { label: "Role", dot: "bg-accent" },
  project: { label: "Project", dot: "bg-cyan" },
  research: { label: "Research", dot: "bg-accent" },
  milestone: { label: "Milestone", dot: "bg-warn" },
};

export function TimelineSection() {
  return (
    <Section
      id="timeline"
      index="06"
      eyebrow="Timeline"
      title={<>A chronology of work.</>}
      intro="Projects, research and milestones on one rail, most recent first."
      containerSize="narrow"
    >
      <Stagger className="relative">
        {/* the rail */}
        <span
          aria-hidden
          className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-line-strong via-line to-transparent"
        />
        <ul className="flex flex-col gap-8">
          {sortedTimeline.map((entry) => {
            const meta = kindMeta[entry.kind];
            const inner = (
              <>
                <div className="relative z-10 flex items-center gap-3">
                  <span className={cn("h-3.5 w-3.5 shrink-0 rounded-full border-2 border-bg", meta.dot)} />
                  <span className="font-mono text-[12px] text-faint">{entry.period}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-faint/70">
                    {meta.label}
                  </span>
                </div>
                <div className="mt-2 pl-[27px]">
                  <h3 className="display-m text-[1.3rem] text-ink">{entry.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-dim">{entry.detail}</p>
                </div>
              </>
            );
            return (
              <StaggerItem key={entry.date + entry.title} as="li">
                {entry.href ? (
                  <Link
                    href={entry.href}
                    className="group block rounded-[2px] transition-opacity hover:opacity-100"
                  >
                    {inner}
                    <span className="mt-1 block pl-[27px] font-mono text-[11px] text-accent/0 transition-colors group-hover:text-accent">
                      view project →
                    </span>
                  </Link>
                ) : (
                  <div>{inner}</div>
                )}
              </StaggerItem>
            );
          })}
        </ul>
      </Stagger>
    </Section>
  );
}

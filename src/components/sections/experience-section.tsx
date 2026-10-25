import { experience, education, languages } from "@/data/about";
import { skillDomains } from "@/data/skills";
import { Section } from "@/components/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  return (
    <Section
      id="about"
      index="03"
      eyebrow="Experience & skills"
      title={<>Background &amp; expertise.</>}
      intro="My training, team projects and education, and the tools I reach for — grouped by discipline."
      containerSize="wide"
    >
      <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12">
        {/* experience + education + languages */}
        <div className="lg:col-span-6">
          <SubLabel>Experience</SubLabel>
          <Stagger className="mt-6 flex flex-col">
            {experience.map((e) => (
              <StaggerItem key={e.role + e.period}>
                <div className="group border-t border-line py-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[1.05rem] font-semibold text-ink transition-colors group-hover:text-accent">
                      {e.role}
                    </h3>
                    <span className="shrink-0 font-mono text-[11px] tracking-wide text-accent">
                      {e.period}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[12px] uppercase tracking-wider text-faint">
                    {e.org}
                  </p>
                  <p className="mt-2.5 max-w-xl text-[13px] leading-relaxed text-dim">{e.detail}</p>
                  {e.tags && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-[2px] border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {education.length > 0 && (
            <>
              <SubLabel className="mt-14">Education</SubLabel>
              <div className="mt-6 flex flex-col">
                {education.map((ed) => (
                  <div
                    key={ed.credential}
                    className="flex items-baseline justify-between gap-4 border-t border-line py-4"
                  >
                    <div>
                      <h3 className="text-[0.98rem] font-semibold text-ink">{ed.credential}</h3>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-faint">
                        {ed.org}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-accent">{ed.year}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* skills + languages */}
        <div className="lg:col-span-6">
          <SubLabel>Skills</SubLabel>
          <Stagger className="mt-6 flex flex-col gap-7">
            {skillDomains.map((domain) => (
              <StaggerItem key={domain.id}>
                <div>
                  <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
                    <span className="text-accent">/</span> {domain.title}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {domain.skills.map((s) => (
                      <li
                        key={s}
                        className="rounded-[2px] border border-line bg-raise/40 px-3 py-1.5 font-mono text-[11.5px] text-dim transition-colors hover:border-accent hover:text-ink"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {languages.length > 0 && (
            <>
              <SubLabel className="mt-12">Languages</SubLabel>
              <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {languages.map((l) => (
                  <li key={l.name}>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-dim">{l.name}</span>
                    </div>
                    <div className="mt-2 flex gap-1" aria-hidden>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={cn(
                            "h-1 flex-1 rounded-[1px]",
                            n <= l.level ? "bg-accent" : "bg-line-strong",
                          )}
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

function SubLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Reveal className={className}>
      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-accent">{children}</span>
    </Reveal>
  );
}

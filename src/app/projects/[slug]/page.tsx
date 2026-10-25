import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projectSlugs, projects } from "@/data/projects";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/section";
import { Reveal } from "@/components/motion";
import { Tag, LinkButton, CornerTicks } from "@/components/ui/primitives";
import { ShieldIcon, ArrowIcon, GithubIcon, ArrowUpRight } from "@/components/icons";

// Every valid project is prerendered via generateStaticParams; the route reads
// `params` directly, so opt out of the instant shell (any other slug 404s).
export const instant = false;

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title,
    description: p.summary,
    openGraph: { title: p.title, description: p.summary, type: "article" },
  };
}

const linkIcon = { repo: GithubIcon, demo: ArrowUpRight, writeup: ArrowUpRight, docs: ArrowUpRight };

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <PageHeader
        eyebrow={`${project.kind} · ${project.year}`}
        title={project.title}
        intro={project.tagline}
        crumbs={[{ label: "~", href: "/" }, { label: "projects", href: "/projects" }, { label: project.slug }]}
        aside={
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="flex gap-2">
              <Tag tone={project.status === "active" ? "accent" : "cyan"}>{project.status}</Tag>
            </div>
            {project.links.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.links.map((l) => {
                  const Icon = linkIcon[l.kind];
                  return (
                    <LinkButton
                      key={l.href}
                      href={l.href}
                      external
                      variant={l.kind === "demo" ? "primary" : "line"}
                      size="sm"
                    >
                      <Icon className="text-sm" />
                      {l.label}
                    </LinkButton>
                  );
                })}
              </div>
            ) : (
              <span className="rounded-[2px] border border-line border-dashed px-3 py-1.5 font-mono text-[11px] text-faint">
                source available on request
              </span>
            )}
          </div>
        }
      />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-[1fr_300px]">
          {/* main column */}
          <div className="order-2 min-w-0 lg:order-1">
            <Reveal>
              <p className="text-[1.3rem] font-medium leading-snug text-ink sm:text-[1.5rem]">{project.summary}</p>
            </Reveal>

            <Section title="The problem" index="01">
              {project.problem.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Section>

            <Section title="Approach" index="02">
              {project.approach.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Section>

            {/* architecture */}
            <Reveal className="mt-16">
              <h2 className="mb-6 flex items-center gap-3 font-mono text-[13px] uppercase tracking-widest text-faint">
                <span className="text-accent">03</span>
                <span className="h-px w-6 bg-line-strong" />
                Architecture
              </h2>
              <ol className="relative flex flex-col gap-3">
                {project.architecture.map((node, i) => (
                  <li
                    key={node.label}
                    className="relative rounded-[2px] border border-line bg-raise/40 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 font-mono text-[11px] text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-mono text-[14px] text-accent">{node.label}</h3>
                          {node.tech && (
                            <div className="flex flex-wrap gap-1.5">
                              {node.tech.map((t) => (
                                <span key={t} className="font-mono text-[11px] text-faint">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-[13px] leading-relaxed text-dim">{node.detail}</p>
                      </div>
                    </div>
                    {i < project.architecture.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute -bottom-3 left-[30px] h-3 w-px bg-line-strong"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* security */}
            <Reveal className="mt-16">
              <h2 className="mb-6 flex items-center gap-3 font-mono text-[13px] uppercase tracking-widest text-faint">
                <span className="text-accent">04</span>
                <span className="h-px w-6 bg-line-strong" />
                Security model
              </h2>
              <ul className="flex flex-col gap-3">
                {project.security.map((s, i) => (
                  <li key={i} className="flex gap-3 rounded-[2px] border border-line bg-raise/30 p-4">
                    <ShieldIcon className="mt-0.5 shrink-0 text-base text-accent" />
                    <p className="text-[13px] leading-relaxed text-dim">{s}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* sidebar */}
          <aside className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">
              <div className="relative rounded-[2px] border border-line bg-raise/40 p-5">
                <CornerTicks />
                <h2 className="label-mono mb-4">Specs</h2>
                <dl className="flex flex-col gap-2.5">
                  {project.highlights.map((h) => (
                    <div key={h.label} className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-faint">
                        {h.label}
                      </dt>
                      <dd className="text-right font-mono text-[12px] text-ink">{h.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-[2px] border border-line bg-raise/40 p-5">
                <h2 className="label-mono mb-4">Stack</h2>
                <div className="flex flex-col gap-4">
                  {project.stack.map((group) => (
                    <div key={group.group}>
                      <div className="mb-2 font-mono text-[11px] text-faint">{group.group}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <Tag key={item}>{item}</Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* next project */}
        <div className="mt-20 border-t border-line pt-10">
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-between gap-4 rounded-[2px] border border-line bg-raise/40 p-6 transition-colors hover:border-line-strong hover:bg-raise"
          >
            <div>
              <span className="label-mono">Next project</span>
              <h3 className="display-m mt-2 text-ink transition-colors group-hover:text-accent">
                {next.title}
              </h3>
            </div>
            <ArrowIcon className="shrink-0 text-xl text-faint transition-all group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        </div>
      </Container>
    </>
  );
}

function Section({
  title,
  index,
  children,
}: {
  title: string;
  index: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mt-16">
      <h2 className="mb-5 flex items-center gap-3 font-mono text-[13px] uppercase tracking-widest text-faint">
        <span className="text-accent">{index}</span>
        <span className="h-px w-6 bg-line-strong" />
        {title}
      </h2>
      <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-dim">{children}</div>
    </Reveal>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/section";
import { MonoLabel } from "@/components/ui/primitives";
import { ChevronRight } from "@/components/icons";

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  aside?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pt-[calc(var(--nav-h)+3rem)]">
      <div className="grid-field grid-mask pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative pb-14">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 font-mono text-[12px] text-faint">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="text-xs text-line-strong" />}
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-accent">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-dim">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <MonoLabel>{eyebrow}</MonoLabel>
            <h1 className="display-l mt-5 text-ink">{title}</h1>
            {intro && <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dim">{intro}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </Container>
    </header>
  );
}

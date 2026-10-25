import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/scramble-text";

/* Page width container. One place controls the max width and gutters. */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  const sizes = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}>
      {children}
    </div>
  );
}

/* An editorial section: a masthead rule (eyebrow + index), an oversized serif
   title set asymmetrically against the intro, and a huge ghosted numeral as a
   graphic accent. The public API is unchanged, so every caller is untouched. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
  containerSize,
  headerAside,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  containerSize?: "default" | "wide" | "narrow";
  headerAside?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 overflow-hidden border-t border-line py-20 sm:py-28",
        className,
      )}
    >
      {/* oversized ghost numeral — graphic accent, clipped by the section */}
      <span
        aria-hidden
        className="ghost-index pointer-events-none absolute -top-8 right-2 text-[10rem] sm:right-6 sm:text-[16rem] lg:text-[20rem]"
      >
        {index}
      </span>

      <Container size={containerSize} className="relative">
        {/* masthead */}
        <div className="flex items-end justify-between gap-6 border-b border-line pb-4">
          <span className="label-mono inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-accent" aria-hidden />
            <ScrambleText text={eyebrow} trigger="view" speed={34} />
          </span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-faint">[{index}]</span>
        </div>

        {/* title / intro — asymmetric editorial split */}
        <header className="mt-8 grid gap-x-10 gap-y-6 sm:mt-10 md:grid-cols-12 md:items-end">
          <h2 className="display-l text-ink md:col-span-7 lg:col-span-8">{title}</h2>
          {(intro || headerAside) && (
            <div className="flex flex-col gap-5 md:col-span-5 md:items-start lg:col-span-4">
              {intro && (
                <p className="max-w-md text-[15px] leading-relaxed text-dim">{intro}</p>
              )}
              {headerAside}
            </div>
          )}
        </header>

        <div className="mt-12 sm:mt-16">{children}</div>
      </Container>
    </section>
  );
}

"use client";

import { useReducedMotion } from "motion/react";
import { techStack } from "@/data/skills";

/* A full-bleed, continuously scrolling band of technologies. When reduced
   motion is requested it falls back to a static, wrapped row — no animation,
   no horizontal scroll. The track is duplicated so the loop is seamless. */
export function TechMarquee() {
  const reduced = useReducedMotion();
  const items = [...new Set([...techStack, "OWASP", "WebCrypto", "Linux"])];

  if (reduced) {
    return (
      <div className="border-y border-line bg-sunken/40 py-5">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-2 px-4">
          {items.map((t) => (
            <li key={t} className="font-mono text-[12px] tracking-wide text-faint">
              {t}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-10">
          <span className="font-mono text-[13px] tracking-wide text-dim transition-colors hover:text-accent">
            {t}
          </span>
          <span className="h-1 w-1 rounded-full bg-accent/50" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-line bg-sunken/40 py-5">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
      <span className="sr-only">Technologies: {items.join(", ")}</span>
    </div>
  );
}

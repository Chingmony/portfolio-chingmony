"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HeaderAnalyzer } from "./header-analyzer";
import { JwtInspector } from "./jwt-inspector";
import { ShieldIcon, FlaskIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    id: "headers",
    name: "Header Analyzer",
    blurb: "Grade a site's HTTP security headers from a pasted response.",
    icon: ShieldIcon,
    Component: HeaderAnalyzer,
  },
  {
    id: "jwt",
    name: "JWT Inspector",
    blurb: "Decode a token locally, then verify its HS256 signature separately.",
    icon: FlaskIcon,
    Component: JwtInspector,
  },
] as const;

export function LabTools({ initial = "headers" }: { initial?: "headers" | "jwt" }) {
  const [active, setActive] = useState<string>(initial);
  const reduced = useReducedMotion();
  const current = TOOLS.find((t) => t.id === active) ?? TOOLS[0];
  const Active = current.Component;

  return (
    <div className="overflow-hidden rounded-[2px] border border-line bg-raise/40">
      {/* tool tabs */}
      <div
        role="tablist"
        aria-label="Lab tools"
        className="flex flex-col border-b border-line sm:flex-row"
      >
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "group relative flex flex-1 items-start gap-3 border-b border-line px-5 py-4 text-left transition-colors last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0",
                isActive ? "bg-raise" : "bg-transparent hover:bg-raise/50",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 shrink-0 text-lg transition-colors",
                  isActive ? "text-accent" : "text-faint group-hover:text-dim",
                )}
              />
              <span className="min-w-0">
                <span className={cn("block font-mono text-[13px]", isActive ? "text-ink" : "text-dim")}>
                  {t.name}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-faint">{t.blurb}</span>
              </span>
              {isActive && (
                <motion.span
                  layoutId={reduced ? undefined : "lab-underline"}
                  className="absolute inset-x-0 bottom-0 h-px bg-accent sm:top-0 sm:bottom-auto"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* active tool */}
      <div
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        className="p-5 sm:p-6"
      >
        <motion.div
          key={current.id}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Active />
        </motion.div>
      </div>

      {/* safety footer */}
      <div className="border-t border-line bg-sunken/50 px-5 py-3">
        <p className="font-mono text-[10px] leading-relaxed tracking-wide text-faint">
          All tools run entirely in your browser. Nothing you paste is transmitted, logged or
          stored. Use them only against systems you own or are explicitly authorised to test.
        </p>
      </div>
    </div>
  );
}

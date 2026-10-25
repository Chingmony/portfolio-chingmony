"use client";

import { useCallback, useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { ScrambleText } from "@/components/scramble-text";

type Phase = "idle" | "run" | "leaving" | "done";

const LINES = [
  "establishing secure context",
  "mounting lab modules",
  "verifying signatures",
  "decrypting identity",
];

/* A one-time "boot" intro. Shows only on the first visit of a session, is fully
   skippable, and is skipped outright under reduced-motion. Rendered client-only
   (phase starts "idle" → null, matching SSR) to avoid hydration mismatch. */
export function BootSequence() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const finish = useCallback(() => {
    setPhase((p) => (p === "run" ? "leaving" : p));
    window.setTimeout(() => setPhase("done"), 650);
  }, []);

  useEffect(() => {
    const ids: number[] = [];
    let raf = 0;
    // Decide inside a rAF callback (not synchronously in the effect body) so the
    // initial state transition isn't a cascading setState-in-effect.
    const start = requestAnimationFrame(() => {
      let seen = false;
      try {
        seen = sessionStorage.getItem("lab:booted") === "1";
      } catch {}
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (seen || reduced) {
        setPhase("done");
        return;
      }
      try {
        sessionStorage.setItem("lab:booted", "1");
      } catch {}

      setPhase("run");
      LINES.forEach((_, i) => {
        ids.push(window.setTimeout(() => setStep(i + 1), 240 + i * 260));
      });
      const t0 = performance.now();
      const dur = 1500;
      const tick = () => {
        const p = Math.min(1, (performance.now() - t0) / dur);
        setProgress(p);
        if (p < 1) raf = requestAnimationFrame(tick);
        else finish();
      };
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(raf);
      ids.forEach((t) => clearTimeout(t));
    };
  }, [finish]);

  // Allow skipping with any key or click.
  useEffect(() => {
    if (phase !== "run") return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [phase, finish]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-bg transition-transform duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ transform: phase === "leaving" ? "translateY(-100%)" : "translateY(0)" }}
      aria-hidden
    >
      <div className="grid-field-fine grid-mask pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative w-full max-w-md px-6">
        <ul className="mb-8 space-y-1.5 font-mono text-[12px]">
          {LINES.map((line, i) => (
            <li
              key={line}
              className="flex items-center gap-2 transition-opacity duration-300"
              style={{ opacity: step > i ? 1 : 0.15 }}
            >
              <span className="text-accent">{step > i ? "✓" : "·"}</span>
              <span className={step > i ? "text-dim" : "text-faint"}>{line}</span>
              {i === LINES.length - 1 && step > i && (
                <span className="ml-auto text-faint">ok</span>
              )}
            </li>
          ))}
        </ul>

        <div
          className="display-xl text-[clamp(2.5rem,12vw,5rem)] leading-none text-ink"
          style={{ opacity: step >= LINES.length ? 1 : 0, transition: "opacity 300ms" }}
        >
          <ScrambleText text={profile.name} speed={26} />
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 overflow-hidden bg-line">
            <div
              className="h-full origin-left bg-accent"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-faint">
            {String(Math.round(progress * 100)).padStart(3, "0")}%
          </span>
        </div>

        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
          press any key to skip
        </p>
      </div>
    </div>
  );
}

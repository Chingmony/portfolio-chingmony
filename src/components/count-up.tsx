"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* Counts a numeric value up when it scrolls into view. Any non-digit prefix or
   suffix in `value` (e.g. a leading "+") is preserved; purely non-numeric
   values render as-is. Reduced motion shows the final value immediately. */
export function CountUp({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const target = match ? parseInt(match[2].replace(/,/g, ""), 10) : null;
  const [n, setN] = useState(reduced || target === null ? target ?? 0 : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced || target === null) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        const run = (t: number) => {
          const p = Math.min(1, (t - start) / durationMs);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, target, durationMs]);

  if (target === null) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref} className="tabular-nums">
      {match![1]}
      {n.toLocaleString()}
      {match![3]}
    </span>
  );
}

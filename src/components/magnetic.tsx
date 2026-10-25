"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

/* Wraps an element so it drifts slightly toward the cursor while hovered — a
   subtle premium interaction. Pure transform writes, no React state, and a
   no-op under reduced motion or on coarse pointers. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }
  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  }

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ display: "inline-flex", transition: "transform 350ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </span>
  );
}

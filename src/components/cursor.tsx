"use client";

import { useEffect, useRef } from "react";

/* A targeting-reticle cursor — on-theme for a security site and a strong
   creative signature. It only activates on a fine pointer with motion allowed;
   touch and reduced-motion users keep the native cursor untouched. Over any
   interactive element the reticle locks on (corner ticks + a label), otherwise
   it's a crosshair dot. Movement is written straight to transforms via rAF, so
   it never triggers a React re-render. */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    // Coarse pointer or reduced motion: leave the native cursor alone and skip
    // all listeners. The (hidden) overlay nodes simply stay at opacity 0.
    if (!fine || !motionOk || !ring || !dot || !label) return;
    document.body.classList.add("has-reticle");

    // target (pointer) and smoothed ring position
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let raf = 0;
    let visible = false;

    const render = () => {
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [role='button'], input, textarea, label, [data-cursor]",
      );
      if (el) {
        ring.dataset.lock = "true";
        const custom = el.getAttribute("data-cursor-label");
        const fallback =
          el.tagName === "A" || el.getAttribute("role") === "button" || el.tagName === "BUTTON"
            ? "open"
            : "";
        const text = custom ?? fallback;
        label.textContent = text;
        label.style.opacity = text ? "1" : "0";
      } else {
        ring.dataset.lock = "false";
        label.style.opacity = "0";
      }
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const onDown = () => (ring.dataset.press = "true");
    const onUp = () => (ring.dataset.press = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.body.classList.remove("has-reticle");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300]">
      {/* center dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-accent opacity-0 transition-opacity duration-200"
      />
      {/* reticle ring */}
      <div
        ref={ringRef}
        data-lock="false"
        data-press="false"
        className="group absolute left-0 top-0 opacity-0 transition-opacity duration-200 [transition:opacity_200ms] data-[lock=true]:[--r:34px] [--r:13px] data-[press=true]:[--s:0.82] [--s:1]"
      >
        <div
          className="relative transition-[width,height] duration-200 ease-out"
          style={{
            width: "calc(var(--r) * 2)",
            height: "calc(var(--r) * 2)",
            transform: "translate(-50%, -50%) scale(var(--s))",
          }}
        >
          {/* ring (idle) */}
          <span className="absolute inset-0 rounded-full border border-accent/70 opacity-100 transition-opacity duration-200 group-data-[lock=true]:opacity-0" />
          {/* corner ticks (locked) */}
          <span className="absolute inset-0 opacity-0 transition-opacity duration-200 group-data-[lock=true]:opacity-100">
            <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-accent" />
            <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-accent" />
            <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-accent" />
            <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-accent" />
          </span>
          {/* label */}
          <span
            ref={labelRef}
            className="absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-accent opacity-0 transition-opacity duration-200"
          />
        </div>
      </div>
    </div>
  );
}

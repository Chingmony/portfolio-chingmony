"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&$?/<>=+*";

/* A "decrypting" reveal: each character resolves from random glyphs to the
   final letter, left to right. On-theme for a security site, and it respects
   reduced-motion (renders the final text immediately, no churn).

   Set `trigger="view"` to decrypt when scrolled into view, or "mount" for on
   mount. `startDelay` staggers multiple instances. */
export function ScrambleText({
  text,
  className,
  trigger = "mount",
  speed = 28,
  revealPerTick = 1,
  startDelay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  trigger?: "mount" | "view";
  speed?: number;
  revealPerTick?: number;
  startDelay?: number;
  as?: "span" | "h1" | "h2" | "div";
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState("");
  const [armed, setArmed] = useState(trigger === "mount");

  // Arm on view if requested.
  useEffect(() => {
    if (trigger !== "view" || reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger, reduced]);

  useEffect(() => {
    if (reduced || !armed) return;

    let revealed = 0;
    let raf = 0;
    let timer = 0;
    const start = () => {
      const tick = () => {
        const whole = Math.floor(revealed);
        let out = text.slice(0, whole);
        for (let i = whole; i < text.length; i++) {
          out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);
        if (whole < text.length) {
          revealed += revealPerTick;
          raf = window.setTimeout(tick, speed);
        } else {
          setDisplay(text);
        }
      };
      tick();
    };
    timer = window.setTimeout(start, startDelay);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(raf);
    };
  }, [armed, text, reduced, speed, revealPerTick, startDelay]);

  // Reduced motion (or before the scramble starts) shows the final text; this
  // is a pure render decision, so no effect writes state for it.
  const shown = reduced ? text : display || (armed ? "" : text);

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span aria-hidden>{shown || " "}</span>
    </Tag>
  );
}

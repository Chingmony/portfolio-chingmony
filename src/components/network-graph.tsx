"use client";

/* Signature hero visual: a slow, self-organising network of nodes with
   packets travelling along edges. It is decorative — aria-hidden — and it is
   disciplined about cost:
     - stops its RAF loop when the tab is hidden, when scrolled offscreen, and
       when prefers-reduced-motion is set (renders a single static frame then);
     - caps devicePixelRatio and the frame rate;
     - reacts gently to the pointer without per-move React state.                */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hub: boolean;
}

interface Packet {
  a: number;
  b: number;
  t: number;
  speed: number;
}

const ACCENT = "229, 27, 42";
const CYAN = "242, 240, 237";

export function NetworkGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let edges: Array<[number, number]> = [];
    let packets: Packet[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      const area = width * height;
      const count = Math.max(14, Math.min(42, Math.round(area / 22000)));
      nodes = Array.from({ length: count }, (_, i) => {
        const hub = i % 6 === 0;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: hub ? 2.8 : 1.5,
          hub,
        };
      });
      // Connect each node to its nearest few neighbours.
      edges = [];
      const maxDist = Math.max(120, Math.min(width, height) / 3.2);
      for (let i = 0; i < nodes.length; i++) {
        const dists: Array<[number, number]> = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < maxDist) dists.push([j, d]);
        }
        dists.sort((a, b) => a[1] - b[1]);
        const links = nodes[i].hub ? 3 : 2;
        for (let k = 0; k < Math.min(links, dists.length); k++) {
          const j = dists[k][0];
          if (!edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) {
            edges.push([i, j]);
          }
        }
      }
      packets = edges
        .filter(() => Math.random() < 0.3)
        .map((e) => ({ a: e[0], b: e[1], t: Math.random(), speed: 0.0015 + Math.random() * 0.0025 }));
    }

    function step(dt: number) {
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));

        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 120 && d > 0.1) {
            const f = (1 - d / 120) * 0.4;
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }
      }
      for (const p of packets) {
        p.t += p.speed * dt;
        if (p.t > 1) p.t -= 1;
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // edges
      for (const [i, j] of edges) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const alpha = Math.max(0, 0.22 - d / 1400);
        ctx!.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      // packets
      for (const p of packets) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx!.fillStyle = `rgba(${CYAN}, 0.9)`;
        ctx!.beginPath();
        ctx!.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx!.fill();
      }

      // nodes
      for (const n of nodes) {
        if (n.hub) {
          ctx!.fillStyle = `rgba(${ACCENT}, 0.14)`;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r * 3.2, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.fillStyle = n.hub ? `rgba(${ACCENT}, 0.95)` : `rgba(${ACCENT}, 0.5)`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const frameMs = 1000 / 30;
    let running = false;

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      const elapsed = now - last;
      last = now;
      acc += elapsed;
      if (acc < frameMs) return;
      const dt = Math.min(acc, 66) / 16.67;
      acc = 0;
      step(dt);
      draw();
    }

    function start() {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    draw(); // always paint at least one static frame

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    if (!reduced) {
      canvas.parentElement?.addEventListener("pointermove", onMove);
      canvas.parentElement?.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.parentElement?.removeEventListener("pointermove", onMove);
      canvas.parentElement?.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

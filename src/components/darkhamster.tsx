import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

/* A small pixel hamster running on a spinning wheel, next to the "darkhamster"
   handle and the personal quote. The wheel's spin is paused automatically under
   prefers-reduced-motion (handled globally in globals.css). */

const CX = 24;
const CY = 24;
const R_OUT = 16;
const R_IN = 12.5;
const RUNGS = 12;

function Wheel({ size = 46 }: { size?: number }) {
  const r2 = (n: number) => Math.round(n * 1000) / 1000;
  const rungs = Array.from({ length: RUNGS }, (_, k) => {
    const a = (k / RUNGS) * Math.PI * 2;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    return (
      <line
        key={k}
        x1={r2(CX + R_IN * cos)}
        y1={r2(CY + R_IN * sin)}
        x2={r2(CX + R_OUT * cos)}
        y2={r2(CY + R_OUT * sin)}
        stroke="var(--accent)"
        strokeWidth={1.4}
        strokeOpacity={0.55}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      shapeRendering="crispEdges"
      className="shrink-0"
    >
      {/* spinning wheel (spin origin set in CSS to keep SSR/client identical) */}
      <g className="wheel-spin">
        <circle cx={CX} cy={CY} r={R_OUT} stroke="var(--accent)" strokeWidth={2} strokeOpacity={0.85} />
        <circle cx={CX} cy={CY} r={R_IN} stroke="var(--accent)" strokeWidth={1} strokeOpacity={0.3} />
        {rungs}
      </g>
      {/* pixel hamster (static, running at the bottom) */}
      <g fill="var(--color-ink, #f2f0ed)">
        <rect x="19" y="30" width="10" height="6" />
        <rect x="18" y="32" width="1" height="3" />
        <rect x="29" y="31" width="2" height="4" />
        <rect x="27" y="28" width="3" height="3" />
        <rect x="29" y="27" width="2" height="2" />
        {/* legs */}
        <rect x="20" y="36" width="2" height="2" fill="var(--accent)" />
        <rect x="25" y="36" width="2" height="2" fill="var(--accent)" />
        {/* eye */}
        <rect x="28" y="29" width="1" height="1" fill="var(--bg, #080808)" />
      </g>
    </svg>
  );
}

export function Darkhamster({
  className,
  size = 46,
  align = "left",
}: {
  className?: string;
  size?: number;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center text-center",
        className,
      )}
    >
      <Wheel size={size} />
      <div className={cn(align === "center" && "text-left")}>
        <div className="pixel text-[11px] text-accent sm:text-[12px]">{profile.nickname}</div>
        <p className="mt-1.5 font-mono text-[11px] leading-snug text-faint">
          &ldquo;{profile.quote}&rdquo;
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Mono label — the recurring "01 / SECTION" eyebrow                          */
/* -------------------------------------------------------------------------- */
export function MonoLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("label-mono inline-flex items-center gap-2", className)}>
      {index && <span className="text-accent/70">{index}</span>}
      {index && <span className="h-px w-5 bg-line-strong" aria-hidden />}
      <span>{children}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Tag / chip                                                                 */
/* -------------------------------------------------------------------------- */
export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "cyan" | "warn";
  className?: string;
}) {
  const tones = {
    default: "border-line text-dim",
    accent: "border-accent-line text-accent",
    cyan: "border-cyan/40 text-cyan",
    warn: "border-warn/40 text-warn",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] border px-2 py-0.5 font-mono text-[11px] leading-tight tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Button / link button                                                       */
/* -------------------------------------------------------------------------- */
type ButtonBaseProps = {
  children: ReactNode;
  variant?: "primary" | "ghost" | "line";
  size?: "sm" | "md";
  className?: string;
};

const buttonClasses = ({
  variant = "line",
  size = "md",
}: Pick<ButtonBaseProps, "variant" | "size">) =>
  cn(
    "group inline-flex items-center justify-center gap-2 rounded-[2px] font-mono tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2.5 text-[13px]",
    variant === "primary" &&
      "bg-accent text-bg hover:bg-accent/90 font-medium",
    variant === "ghost" && "text-dim hover:text-ink hover:bg-raise-2",
    variant === "line" &&
      "border border-line-strong text-ink hover:border-accent hover:text-accent bg-raise/40",
  );

export function LinkButton({
  href,
  external,
  variant,
  size,
  className,
  children,
}: ButtonBaseProps & { href: string; external?: boolean }) {
  const classes = cn(buttonClasses({ variant, size }), className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  onClick,
  variant,
  size,
  className,
  children,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: ButtonBaseProps & {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(buttonClasses({ variant, size }), className)}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Panel — the bordered graphite surface used everywhere                      */
/* -------------------------------------------------------------------------- */
export function Panel({
  children,
  className,
  as: As = "div",
  interactive,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
  interactive?: boolean;
}) {
  return (
    <As
      className={cn(
        "relative rounded-[2px] border border-line bg-raise/60",
        interactive &&
          "transition-colors duration-200 hover:border-line-strong hover:bg-raise",
        className,
      )}
    >
      {children}
    </As>
  );
}

/* -------------------------------------------------------------------------- */
/* Corner ticks — subtle engineering-drawing crop marks                       */
/* -------------------------------------------------------------------------- */
export function CornerTicks({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {["left-0 top-0", "right-0 top-0", "left-0 bottom-0", "right-0 bottom-0"].map((pos, i) => (
        <span
          key={i}
          className={cn(
            "absolute h-2 w-2 border-accent/50",
            pos,
            i === 0 && "border-l border-t",
            i === 1 && "border-r border-t",
            i === 2 && "border-b border-l",
            i === 3 && "border-b border-r",
          )}
        />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Status dot                                                                 */
/* -------------------------------------------------------------------------- */
export function StatusDot({ tone = "accent" }: { tone?: "accent" | "warn" | "faint" }) {
  const tones = {
    accent: "bg-accent shadow-[0_0_8px_var(--accent)]",
    warn: "bg-warn",
    faint: "bg-faint",
  };
  return (
    <span className="relative inline-flex h-2 w-2">
      {tone === "accent" && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", tones[tone])} />
    </span>
  );
}

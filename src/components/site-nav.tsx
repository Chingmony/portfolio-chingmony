"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";
import { useTerminal } from "@/components/terminal/terminal-provider";
import { TerminalIcon } from "@/components/icons";

const links = [
  { href: "/#projects", label: "Work" },
  { href: "/#lab", label: "Lab" },
  { href: "/#about", label: "About" },
  { href: "/#research", label: "Research" },
  { href: "/#contact", label: "Contact" },
];

export function SiteNav() {
  const { openTerminal } = useTerminal();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reset the mobile menu when the route changes — the React-recommended
  // "adjust state during render" pattern, no effect required.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent",
      )}
      style={{ height: "var(--nav-h)" }}
    >
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Home">
          <span className="relative flex h-6 w-6 items-center justify-center rounded-[2px] border border-line-strong bg-raise font-mono text-[11px] text-accent transition-colors group-hover:border-accent">
            {"~"}
          </span>
          <span className="font-mono text-[13px] tracking-wide text-ink">
            {profile.handle}
            <span className="text-faint">/lab</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-[2px] px-3 py-1.5 font-mono text-[12px] tracking-wide text-dim transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openTerminal}
            data-cursor-label="terminal"
            className="group flex items-center gap-2 rounded-[2px] border border-line-strong bg-raise/50 px-2.5 py-1.5 font-mono text-[12px] text-dim transition-colors hover:border-accent hover:text-accent"
            aria-label="Open terminal"
          >
            <TerminalIcon className="text-sm" />
            <span className="hidden sm:inline">terminal</span>
            <kbd className="hidden rounded-[2px] border border-line bg-bg px-1 text-[10px] text-faint lg:inline">
              `
            </kbd>
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-line-strong text-dim md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="flex flex-col gap-1">
              <span className={cn("h-px w-4 bg-current transition", menuOpen && "translate-y-[5px] rotate-45")} />
              <span className={cn("h-px w-4 bg-current transition", menuOpen && "opacity-0")} />
              <span className={cn("h-px w-4 bg-current transition", menuOpen && "-translate-y-[5px] -rotate-45")} />
            </span>
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-line bg-bg/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden",
          menuOpen ? "max-h-80" : "max-h-0 border-b-transparent",
        )}
      >
        <div className="flex flex-col px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-line-soft py-3 font-mono text-sm text-dim last:border-0 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

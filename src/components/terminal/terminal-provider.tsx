"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";

/* The terminal surface is heavy-ish and never needed for first paint, so it is
   code-split and only mounted once opened. */
const TerminalSurface = dynamic(
  () => import("./terminal-surface").then((m) => m.TerminalSurface),
  { ssr: false },
);

interface TerminalContextValue {
  open: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used within TerminalProvider");
  return ctx;
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openTerminal = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);
  const closeTerminal = useCallback(() => setOpen(false), []);
  const toggleTerminal = useCallback(() => {
    setMounted(true);
    setOpen((o) => !o);
  }, []);

  // Global shortcut: Ctrl/Cmd + `  (backtick). Never hijack typing in inputs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        toggleTerminal();
        return;
      }
      if (e.key === "`" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleTerminal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTerminal]);

  // Lock scroll while open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const value = useMemo(
    () => ({ open, openTerminal, closeTerminal, toggleTerminal }),
    [open, openTerminal, closeTerminal, toggleTerminal],
  );

  return (
    <TerminalContext.Provider value={value}>
      {children}
      {mounted && <TerminalSurface open={open} onClose={closeTerminal} />}
    </TerminalContext.Provider>
  );
}

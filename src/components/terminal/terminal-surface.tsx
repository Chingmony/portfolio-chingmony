"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "@/data/profile";
import {
  commandNames,
  runInput,
  welcomeLines,
  type TermLine,
} from "./commands";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/icons";

interface Block {
  id: number;
  /** The echoed prompt line, if this block came from user input. */
  input?: string;
  lines: TermLine[];
}

const lineClass: Record<TermLine["kind"], string> = {
  out: "text-ink",
  dim: "text-faint",
  accent: "text-accent",
  cyan: "text-cyan",
  warn: "text-warn",
  error: "text-danger",
  head: "text-ink font-medium",
  gap: "",
};

let blockId = 0;

export function TerminalSurface({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [blocks, setBlocks] = useState<Block[]>(() => [
    { id: blockId++, lines: welcomeLines() },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const print = useCallback((input: string | undefined, lines: TermLine[]) => {
    setBlocks((prev) => [...prev, { id: blockId++, input, lines }]);
  }, []);

  const submit = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (trimmed) {
        setHistory((h) => [...h, trimmed]);
      }
      setHistoryIdx(-1);
      setValue("");

      const result = runInput(raw);

      if (result.clear) {
        setBlocks([]);
        return;
      }
      print(trimmed || " ", result.lines);

      if (result.close) {
        setTimeout(onClose, 120);
      }
      if (result.openUrl) {
        window.open(result.openUrl, "_blank", "noopener,noreferrer");
      }
      if (result.navigate) {
        setTimeout(() => {
          onClose();
          router.push(result.navigate!);
        }, 260);
      }
    },
    [onClose, print, router],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        submit(value);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const next = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(next);
        setValue(history[next]);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIdx === -1) return;
        const next = historyIdx + 1;
        if (next >= history.length) {
          setHistoryIdx(-1);
          setValue("");
        } else {
          setHistoryIdx(next);
          setValue(history[next]);
        }
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const token = value.trim().split(/\s+/)[0] ?? "";
        if (!token) return;
        const matches = commandNames().filter((n) => n.startsWith(token.toLowerCase()));
        if (matches.length === 1) {
          setValue(matches[0] + " ");
        } else if (matches.length > 1) {
          print(value, [{ kind: "dim", text: matches.join("   ") }]);
        }
        return;
      }
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setBlocks([]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [value, history, historyIdx, submit, print, onClose],
  );

  // Autoscroll to bottom and keep focus.
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [blocks]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Simulated terminal"
        >
          <button
            type="button"
            aria-label="Close terminal"
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[4px] border border-line-strong bg-sunken/95 shadow-2xl sm:h-[70vh] sm:rounded-[4px]"
            initial={{ y: reduced ? 0 : 24, opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: reduced ? 0 : 16, opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-line bg-raise/60 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full border border-line-strong" />
                  <span className="h-2.5 w-2.5 rounded-full border border-line-strong" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-faint">
                  {profile.handle}@lab — simulated shell
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close terminal"
                className="rounded-[2px] p-1 text-faint transition-colors hover:bg-raise-2 hover:text-ink"
              >
                <CloseIcon className="text-base" />
              </button>
            </div>

            {/* scrollback */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed"
            >
              {blocks.map((b) => (
                <div key={b.id} className="mb-2">
                  {b.input !== undefined && (
                    <div className="flex gap-2">
                      <span className="shrink-0 select-none text-accent">
                        {profile.handle}@lab<span className="text-faint">:~$</span>
                      </span>
                      <span className="text-ink">{b.input}</span>
                    </div>
                  )}
                  {b.lines.map((line, i) =>
                    line.kind === "gap" ? (
                      <div key={i} className="h-3" />
                    ) : line.href ? (
                      line.external ? (
                        <a
                          key={i}
                          href={line.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn("block underline decoration-accent-line underline-offset-2 hover:decoration-accent", lineClass[line.kind])}
                        >
                          {line.text}
                        </a>
                      ) : (
                        <Link
                          key={i}
                          href={line.href}
                          onClick={() => setTimeout(onClose, 50)}
                          className={cn("block underline decoration-accent-line underline-offset-2 hover:decoration-accent", lineClass[line.kind])}
                        >
                          {line.text}
                        </Link>
                      )
                    ) : (
                      <div key={i} className={cn("whitespace-pre-wrap break-words", lineClass[line.kind])}>
                        {line.text}
                      </div>
                    ),
                  )}
                </div>
              ))}

              {/* live prompt */}
              <div className="flex gap-2">
                <span className="shrink-0 select-none text-accent">
                  {profile.handle}@lab<span className="text-faint">:~$</span>
                </span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    aria-label="Terminal input"
                    className="w-full bg-transparent text-ink caret-transparent outline-none"
                  />
                  <span
                    className="caret pointer-events-none absolute top-0.5"
                    style={{ left: `${value.length}ch` }}
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            {/* hint bar */}
            <div className="border-t border-line bg-raise/40 px-4 py-2 font-mono text-[10px] tracking-wider text-faint">
              <span className="hidden sm:inline">
                help · Tab complete · ↑↓ history · Ctrl+L clear · Esc close
              </span>
              <span className="sm:hidden">help · ↑↓ history · Esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

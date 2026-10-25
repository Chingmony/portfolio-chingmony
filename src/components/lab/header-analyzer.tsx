"use client";

import { useMemo, useState } from "react";
import { Button, Tag } from "@/components/ui/primitives";
import { CheckIcon, AlertIcon, CopyIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   Security-header analyzer — 100% local.

   It analyses a block of HTTP response headers that YOU paste in. It never
   makes a request itself, so it cannot be turned into a scanner pointed at a
   third party, and there is no server-side fetch to be abused for SSRF. To get
   real headers, copy the provided `curl -sI` command and run it against a site
   you are authorised to test.
   ---------------------------------------------------------------------------- */

type Severity = "high" | "medium" | "low" | "info";

interface Check {
  id: string;
  header: string;
  title: string;
  severity: Severity;
  present: (headers: Map<string, string>) => "pass" | "warn" | "fail";
  pass: string;
  advice: string;
}

const CHECKS: Check[] = [
  {
    id: "hsts",
    header: "Strict-Transport-Security",
    title: "HTTP Strict Transport Security",
    severity: "high",
    present: (h) => {
      const v = h.get("strict-transport-security");
      if (!v) return "fail";
      const m = /max-age=(\d+)/.exec(v);
      return m && Number(m[1]) >= 15552000 ? "pass" : "warn";
    },
    pass: "HSTS is set with a long max-age — browsers will refuse to downgrade to HTTP.",
    advice: "Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` so a stripped-TLS downgrade cannot reach the origin.",
  },
  {
    id: "csp",
    header: "Content-Security-Policy",
    title: "Content Security Policy",
    severity: "high",
    present: (h) => {
      const v = h.get("content-security-policy");
      if (!v) return "fail";
      return /unsafe-inline|unsafe-eval|\*/.test(v) ? "warn" : "pass";
    },
    pass: "A CSP is present and does not obviously rely on unsafe-inline / unsafe-eval / wildcards.",
    advice: "Define a Content-Security-Policy. It is the strongest single mitigation against reflected and stored cross-site scripting. Avoid `unsafe-inline` and `unsafe-eval`.",
  },
  {
    id: "xcto",
    header: "X-Content-Type-Options",
    title: "MIME sniffing protection",
    severity: "medium",
    present: (h) => (h.get("x-content-type-options")?.toLowerCase() === "nosniff" ? "pass" : "fail"),
    pass: "nosniff is set — the browser will not second-guess declared content types.",
    advice: "Set `X-Content-Type-Options: nosniff` to stop the browser from MIME-sniffing a response into an executable type.",
  },
  {
    id: "xfo",
    header: "X-Frame-Options / frame-ancestors",
    title: "Clickjacking protection",
    severity: "medium",
    present: (h) => {
      const xfo = h.get("x-frame-options");
      const csp = h.get("content-security-policy") ?? "";
      if (/frame-ancestors/.test(csp)) return "pass";
      if (xfo && /deny|sameorigin/i.test(xfo)) return "pass";
      return "fail";
    },
    pass: "Framing is restricted, via frame-ancestors or X-Frame-Options.",
    advice: "Prevent clickjacking with `Content-Security-Policy: frame-ancestors 'none'` (preferred) or `X-Frame-Options: DENY`.",
  },
  {
    id: "refpol",
    header: "Referrer-Policy",
    title: "Referrer leakage",
    severity: "low",
    present: (h) => (h.get("referrer-policy") ? "pass" : "fail"),
    pass: "A referrer policy is declared.",
    advice: "Set `Referrer-Policy: strict-origin-when-cross-origin` (or stricter) so full URLs do not leak to third parties.",
  },
  {
    id: "perms",
    header: "Permissions-Policy",
    title: "Powerful feature access",
    severity: "low",
    present: (h) => (h.get("permissions-policy") ? "pass" : "fail"),
    pass: "A permissions policy limits access to powerful browser features.",
    advice: "Use `Permissions-Policy` to switch off features you do not use, e.g. `camera=(), microphone=(), geolocation=()`.",
  },
  {
    id: "server",
    header: "Server / X-Powered-By",
    title: "Version disclosure",
    severity: "info",
    present: (h) => {
      const s = h.get("server") ?? "";
      const p = h.get("x-powered-by");
      if (p) return "warn";
      return /\d/.test(s) ? "warn" : "pass";
    },
    pass: "No obvious software versions are advertised in Server / X-Powered-By.",
    advice: "Drop `X-Powered-By` and trim version numbers from `Server`. It is only fingerprinting value for an attacker.",
  },
];

const SAMPLE = `HTTP/2 200
content-type: text/html; charset=utf-8
strict-transport-security: max-age=63072000; includeSubDomains
x-content-type-options: nosniff
cache-control: no-store
server: nginx/1.25.3
x-powered-by: Express`;

function parseHeaders(raw: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of raw.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const name = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (!name) continue;
    map.set(name, map.has(name) ? `${map.get(name)}, ${value}` : value);
  }
  return map;
}

const sevWeight: Record<Severity, number> = { high: 3, medium: 2, low: 1, info: 0 };
const sevTone: Record<Severity, "warn" | "cyan" | "accent" | "default"> = {
  high: "warn",
  medium: "cyan",
  low: "accent",
  info: "default",
};

export function HeaderAnalyzer() {
  const [raw, setRaw] = useState(SAMPLE);
  const [analyzed, setAnalyzed] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const headers = parseHeaders(analyzed);
    if (headers.size === 0) return null;
    const rows = CHECKS.map((c) => ({ check: c, state: c.present(headers) }));
    const scorable = rows.filter((r) => r.check.severity !== "info");
    const earned = scorable.reduce((n, r) => {
      if (r.state === "pass") return n + sevWeight[r.check.severity];
      if (r.state === "warn") return n + sevWeight[r.check.severity] * 0.5;
      return n;
    }, 0);
    const total = scorable.reduce((n, r) => n + sevWeight[r.check.severity], 0);
    const pct = Math.round((earned / total) * 100);
    const grade = pct >= 85 ? "A" : pct >= 70 ? "B" : pct >= 50 ? "C" : pct >= 30 ? "D" : "F";
    return { rows, pct, grade, count: headers.size };
  }, [analyzed]);

  function copyCurl() {
    navigator.clipboard?.writeText("curl -sI https://example.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      {/* input */}
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="hdr-input" className="label-mono mb-2 block">
            Paste response headers
          </label>
          <textarea
            id="hdr-input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            rows={10}
            className="w-full resize-y rounded-[2px] border border-line bg-sunken px-3 py-2.5 font-mono text-[12px] leading-relaxed text-ink outline-none transition-colors focus:border-accent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={() => setAnalyzed(raw)}>
            Analyze
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setRaw(SAMPLE); setAnalyzed(SAMPLE); }}>
            Reset sample
          </Button>
        </div>

        <div className="rounded-[2px] border border-line border-dashed bg-raise/30 p-3">
          <p className="text-[12px] leading-relaxed text-faint">
            This tool makes no requests — it only reads what you paste, so it can never be aimed at
            a third party. To fetch real headers from a site you are authorised to test, run:
          </p>
          <div className="mt-2 flex items-center justify-between gap-2 rounded-[2px] border border-line bg-sunken px-3 py-2">
            <code className="font-mono text-[12px] text-cyan">curl -sI https://example.com</code>
            <button
              type="button"
              onClick={copyCurl}
              aria-label="Copy curl command"
              className="shrink-0 text-faint transition-colors hover:text-accent"
            >
              {copied ? <CheckIcon className="text-sm text-accent" /> : <CopyIcon className="text-sm" />}
            </button>
          </div>
        </div>
      </div>

      {/* results */}
      <div>
        {!results ? (
          <div className="flex h-full items-center justify-center rounded-[2px] border border-line bg-raise/30 p-8 text-center text-[13px] text-faint">
            Paste a set of HTTP response headers and press Analyze.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* score */}
            <div className="flex items-center gap-4 rounded-[2px] border border-line bg-raise/50 p-4">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] border font-mono text-2xl font-medium",
                  results.pct >= 70
                    ? "border-accent-line bg-accent/10 text-accent"
                    : results.pct >= 40
                      ? "border-warn/40 bg-warn/10 text-warn"
                      : "border-danger/40 bg-danger/10 text-danger",
                )}
              >
                {results.grade}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[13px] text-ink">Posture score</span>
                  <span className="font-mono text-[13px] text-dim">{results.pct}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      results.pct >= 70 ? "bg-accent" : results.pct >= 40 ? "bg-warn" : "bg-danger",
                    )}
                    style={{ width: `${results.pct}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-faint">
                  {results.count} headers parsed · {CHECKS.length} checks · info checks excluded from score
                </p>
              </div>
            </div>

            {/* checks */}
            <ul className="flex flex-col gap-2">
              {results.rows.map(({ check, state }) => (
                <li
                  key={check.id}
                  className="rounded-[2px] border border-line bg-sunken/60 p-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">
                      {state === "pass" ? (
                        <CheckIcon className="text-base text-accent" />
                      ) : (
                        <AlertIcon className={cn("text-base", state === "warn" ? "text-warn" : "text-danger")} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[13px] text-ink">{check.title}</span>
                        <Tag tone={sevTone[check.severity]}>{check.severity}</Tag>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
                        {state === "pass" ? check.pass : check.advice}
                      </p>
                      <code className="mt-1.5 block font-mono text-[10px] text-faint">{check.header}</code>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

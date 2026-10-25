"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Button, Tag } from "@/components/ui/primitives";
import { CheckIcon, AlertIcon, ShieldIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   JWT inspector — 100% local.

   DECODING and VERIFICATION are deliberately separated, because conflating them
   is the single most common JWT security bug. Decoding just reads Base64URL and
   tells you what a token *claims*. Verification checks the signature against a
   key you supply and tells you whether to *believe* it. The UI never lets one
   masquerade as the other.

   Verification here supports HS256 only, via the Web Crypto API, entirely in
   the browser. The secret is never sent anywhere.
   ---------------------------------------------------------------------------- */

const noopSubscribe = () => () => {};

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiJjaGluZ21vbnkiLCJyb2xlIjoicmVzZWFyY2hlciIsIm5hbWUiOiJTZWN1cml0eSBMYWIiLCJpYXQiOjE3MzU2ODMyMDAsImV4cCI6MjA1MTA0MzIwMH0." +
  "qА"; // intentionally not a valid signature; the sample is for decoding only

function b64urlToString(part: string): string {
  const pad = part.length % 4 === 0 ? "" : "=".repeat(4 - (part.length % 4));
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  // decode UTF-8
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

interface Decoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signaturePart: string;
  signingInput: string;
  error?: never;
}
interface DecodeError {
  error: string;
}

function decode(token: string): Decoded | DecodeError {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { error: "A JWT has three dot-separated parts: header.payload.signature." };
  }
  try {
    const header = JSON.parse(b64urlToString(parts[0]));
    const payload = JSON.parse(b64urlToString(parts[1]));
    return {
      header,
      payload,
      signaturePart: parts[2],
      signingInput: `${parts[0]}.${parts[1]}`,
    };
  } catch {
    return { error: "Could not decode — the header or payload is not valid Base64URL JSON." };
  }
}

function describeClaim(key: string): string | null {
  const map: Record<string, string> = {
    iss: "issuer",
    sub: "subject",
    aud: "audience",
    exp: "expires at",
    nbf: "not before",
    iat: "issued at",
    jti: "token id",
  };
  return map[key] ?? null;
}

function formatValue(key: string, value: unknown): string {
  if (["exp", "iat", "nbf"].includes(key) && typeof value === "number") {
    const d = new Date(value * 1000);
    return `${value}  →  ${d.toISOString().replace("T", " ").slice(0, 19)} UTC`;
  }
  return typeof value === "string" ? value : JSON.stringify(value);
}

type VerifyState =
  | { status: "idle" }
  | { status: "working" }
  | { status: "ok" }
  | { status: "fail" }
  | { status: "unsupported"; alg: string }
  | { status: "error"; message: string };

export function JwtInspector() {
  const [token, setToken] = useState(SAMPLE);
  const [secret, setSecret] = useState("");
  const [verify, setVerify] = useState<VerifyState>({ status: "idle" });

  const decoded = useMemo(() => decode(token), [token]);
  const ok = !("error" in decoded);

  // Current time is external, non-reactive state. useSyncExternalStore reads it
  // on the client (server snapshot is null), so render stays pure and there is
  // no hydration mismatch; the "expired" badge appears once mounted.
  const nowSec = useSyncExternalStore(
    noopSubscribe,
    () => Math.floor(Date.now() / 1000),
    () => null as number | null,
  );

  const expInfo = useMemo(() => {
    if (!ok || nowSec === null) return null;
    const exp = decoded.payload["exp"];
    if (typeof exp !== "number") return null;
    return { expired: exp < nowSec, exp };
  }, [decoded, ok, nowSec]);

  async function runVerify() {
    if (!ok) return;
    const alg = (decoded.header["alg"] as string) || "";
    if (alg !== "HS256") {
      setVerify({ status: "unsupported", alg: alg || "none" });
      return;
    }
    if (!secret) {
      setVerify({ status: "error", message: "Enter the shared secret to verify an HS256 signature." });
      return;
    }
    setVerify({ status: "working" });
    try {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const sig = await crypto.subtle.sign("HMAC", key, enc.encode(decoded.signingInput));
      const expected = btoa(String.fromCharCode(...new Uint8Array(sig)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      setVerify({ status: expected === decoded.signaturePart ? "ok" : "fail" });
    } catch (e) {
      setVerify({ status: "error", message: e instanceof Error ? e.message : "Verification failed." });
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* input column */}
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="jwt-input" className="label-mono mb-2 block">
            Token
          </label>
          <textarea
            id="jwt-input"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setVerify({ status: "idle" });
            }}
            spellCheck={false}
            rows={6}
            className="w-full resize-y rounded-[2px] border border-line bg-sunken px-3 py-2.5 font-mono text-[12px] leading-relaxed text-ink outline-none transition-colors focus:border-accent"
            placeholder="header.payload.signature"
          />
        </div>

        <div className="rounded-[2px] border border-line bg-raise/40 p-4">
          <div className="flex items-center gap-2">
            <ShieldIcon className="text-base text-accent" />
            <span className="font-mono text-[12px] text-ink">Signature verification</span>
            <Tag tone="warn" className="ml-auto">HS256 only</Tag>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-faint">
            Decoding above is automatic and proves nothing about authenticity. Verification is a
            separate step: it recomputes the HMAC with your secret and compares. The secret never
            leaves your browser.
          </p>
          <input
            type="text"
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              setVerify({ status: "idle" });
            }}
            placeholder="HS256 shared secret"
            spellCheck={false}
            autoComplete="off"
            className="mt-3 w-full rounded-[2px] border border-line bg-sunken px-3 py-2 font-mono text-[12px] text-ink outline-none focus:border-accent"
          />
          <Button variant="line" size="sm" onClick={runVerify} className="mt-3 w-full">
            Verify signature
          </Button>
          <VerifyBanner state={verify} />
        </div>
      </div>

      {/* output column */}
      <div className="flex flex-col gap-4">
        {!ok ? (
          <div className="flex items-start gap-3 rounded-[2px] border border-danger/40 bg-danger/5 p-4">
            <AlertIcon className="mt-0.5 shrink-0 text-base text-danger" />
            <p className="text-[13px] text-dim">{(decoded as DecodeError).error}</p>
          </div>
        ) : (
          <>
            <Segment title="Header" tone="cyan" data={decoded.header} />
            <Segment
              title="Payload"
              tone="accent"
              data={decoded.payload}
              annotate
              expiredNotice={expInfo?.expired}
            />
            <div>
              <span className="label-mono mb-2 block">Signature</span>
              <div className="break-all rounded-[2px] border border-line bg-sunken p-3 font-mono text-[12px] text-warn">
                {decoded.signaturePart || <span className="text-faint">(empty)</span>}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-faint">
                Shown as-is. A signature is meaningless until verified against a trusted key.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Segment({
  title,
  tone,
  data,
  annotate,
  expiredNotice,
}: {
  title: string;
  tone: "cyan" | "accent";
  data: Record<string, unknown>;
  annotate?: boolean;
  expiredNotice?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="label-mono">{title}</span>
        {expiredNotice && <Tag tone="warn">expired</Tag>}
      </div>
      <div className="overflow-hidden rounded-[2px] border border-line bg-sunken">
        <dl className="divide-y divide-line-soft">
          {Object.entries(data).map(([k, v]) => {
            const desc = annotate ? describeClaim(k) : null;
            return (
              <div key={k} className="grid grid-cols-[auto_1fr] gap-3 px-3 py-2">
                <dt className={cn("font-mono text-[12px]", tone === "cyan" ? "text-cyan" : "text-accent")}>
                  {k}
                  {desc && <span className="ml-1.5 text-[10px] text-faint">{desc}</span>}
                </dt>
                <dd className="break-all text-right font-mono text-[12px] text-ink">
                  {formatValue(k, v)}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}

function VerifyBanner({ state }: { state: VerifyState }) {
  if (state.status === "idle") return null;
  const map = {
    working: { tone: "dim", icon: null, text: "Computing HMAC…" },
    ok: { tone: "accent", icon: <CheckIcon />, text: "Signature valid — the secret matches." },
    fail: { tone: "danger", icon: <AlertIcon />, text: "Signature invalid — do not trust this token." },
    unsupported: {
      tone: "warn",
      icon: <AlertIcon />,
      text: `This token uses "${(state as { alg?: string }).alg}". This tool verifies HS256 only; the claims above are decoded but unverified.`,
    },
    error: { tone: "danger", icon: <AlertIcon />, text: (state as { message?: string }).message ?? "" },
  } as const;
  const info = map[state.status as keyof typeof map];
  if (!info) return null;
  const toneClass =
    info.tone === "accent"
      ? "border-accent-line bg-accent/5 text-accent"
      : info.tone === "danger"
        ? "border-danger/40 bg-danger/5 text-danger"
        : info.tone === "warn"
          ? "border-warn/40 bg-warn/5 text-warn"
          : "border-line bg-raise text-dim";
  return (
    <div className={cn("mt-3 flex items-start gap-2 rounded-[2px] border p-2.5 text-[12px]", toneClass)}>
      {info.icon && <span className="mt-0.5 shrink-0 text-sm">{info.icon}</span>}
      <span>{info.text}</span>
    </div>
  );
}

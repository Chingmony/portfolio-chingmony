"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/* Reads the wall clock on the client via useSyncExternalStore so the build
   stays statically prerenderable (a bare `new Date()` is non-deterministic at
   prerender) and there is no hydration mismatch: the server renders `fallback`,
   the client swaps in the live year on mount. */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <>{year}</>;
}

import Link from "next/link";
import { Container } from "@/components/section";
import { LinkButton } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <div className="grid-field-fine grid-mask pointer-events-none absolute inset-0 -z-10 opacity-30" />
      <p className="font-mono text-[13px] tracking-widest text-accent">404 — NO ROUTE</p>
      <h1 className="display-l mt-6 text-ink">
        This path <span className="serif-accent text-accent">resolves to nothing</span>.
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-dim">
        The page you asked for is not in the routing table. No shell was harmed in the process.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <LinkButton href="/" variant="primary">
          Return home
        </LinkButton>
        <LinkButton href="/projects" variant="line">
          Browse projects
        </LinkButton>
      </div>
      <p className="mt-10 font-mono text-[12px] text-faint">
        Tip: press <kbd className="rounded-[2px] border border-line bg-raise px-1.5 py-0.5 text-accent">`</kbd> to open the terminal and type <span className="text-dim">help</span>.
      </p>
      <Link href="/" className="sr-only">Home</Link>
    </Container>
  );
}

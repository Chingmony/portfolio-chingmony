import Link from "next/link";
import { profile } from "@/data/profile";
import { Container } from "@/components/section";
import { socialIcons, ArrowUpRight } from "@/components/icons";
import { CurrentYear } from "@/components/current-year";
import { Darkhamster } from "@/components/darkhamster";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-sunken/60">
      <div className="grid-field grid-mask pointer-events-none absolute inset-0 opacity-30" />

      <Container className="relative pt-20 pb-10">
        {/* call to action */}
        <div className="flex flex-col gap-8 border-b border-line pb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-mono inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-accent" aria-hidden />
              {profile.availability.open ? "Open to work" : "Currently engaged"}
            </span>
            <p className="display-l mt-5 max-w-2xl text-ink">
              Have a system worth <span className="serif-accent italic text-accent">breaking</span>?
            </p>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex shrink-0 items-center gap-3 font-mono text-sm text-dim transition-colors hover:text-accent"
          >
            <span className="break-all">{profile.email}</span>
            <ArrowUpRight className="text-base transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* columns */}
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="font-mono text-sm text-ink">
              {profile.handle}
              <span className="text-faint">/lab</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-dim">{profile.intro}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <span className="label-mono">Index</span>
            <ul className="flex flex-col gap-2 font-mono text-[13px]">
              <li><Link href="/#projects" className="text-dim transition-colors hover:text-accent">Projects</Link></li>
              <li><Link href="/#lab" className="text-dim transition-colors hover:text-accent">Cyber Lab</Link></li>
              <li><Link href="/#research" className="text-dim transition-colors hover:text-accent">Research</Link></li>
              <li><Link href="/#timeline" className="text-dim transition-colors hover:text-accent">Timeline</Link></li>
              <li><Link href="/#contact" className="text-dim transition-colors hover:text-accent">Contact</Link></li>
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="label-mono">Connect</span>
            <ul className="flex flex-col gap-2">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.icon];
                const external = s.href.startsWith("http");
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-2.5 font-mono text-[13px] text-dim transition-colors hover:text-accent"
                    >
                      <Icon className="text-base text-faint transition-colors group-hover:text-accent" />
                      {s.handle}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* oversized wordmark + alias */}
        <div className="relative select-none pt-4">
          <span aria-hidden className="display-huge block truncate text-[19vw] text-line-strong/40 md:text-[14rem]">
            {profile.name}
          </span>
          <div className="mt-2 flex justify-end">
            <Darkhamster size={40} />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] tracking-wide text-faint sm:flex-row sm:items-center">
          <span>© <CurrentYear fallback={2026} /> {profile.name}. All rights reserved.</span>
          <span className="text-faint/70">{profile.location} · all lab tools run client-side</span>
        </div>
      </Container>
    </footer>
  );
}

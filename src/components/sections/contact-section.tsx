"use client";

import { profile } from "@/data/profile";
import { Container } from "@/components/section";
import { Reveal } from "@/components/motion";
import { socialIcons, ArrowIcon, MailIcon } from "@/components/icons";
import { Magnetic } from "@/components/magnetic";
import { ScrambleText } from "@/components/scramble-text";

export function ContactSection() {
  const rows = [
    { icon: MailIcon, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    ...(profile.phone
      ? [
          {
            icon: PhoneGlyph,
            label: "Phone",
            value: profile.phone,
            href: `tel:${profile.phone.replace(/\s+/g, "")}`,
          },
        ]
      : []),
    ...profile.socials
      .filter((s) => s.icon !== "mail")
      .map((s) => ({ icon: socialIcons[s.icon], label: s.label, value: s.handle, href: s.href })),
    { icon: LocationGlyph, label: "Location", value: profile.location, href: null as string | null },
  ];

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-20 sm:py-28">
      <div className="grid-field grid-mask pointer-events-none absolute inset-0 opacity-25" />
      <Container className="relative">
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
          <span className="label-mono inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-accent" aria-hidden />
            <ScrambleText text="Get in touch" trigger="view" speed={34} />
          </span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-faint">[07]</span>
        </div>

        <div className="grid gap-14 md:grid-cols-12 md:items-start">
          {/* left — CTA */}
          <div className="md:col-span-6 lg:col-span-5">
            <Reveal>
              <h2 className="display-xl text-[clamp(2.75rem,7vw,5.5rem)] text-ink">
                Let&apos;s build
                <br />
                something that
                <br />
                <span className="text-accent">matters.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-md text-[15px] leading-relaxed text-dim">
                {profile.availability.note}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Magnetic>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor-label="email"
                  className="group mt-9 inline-flex items-center gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-ink"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-bg">
                    <ArrowIcon className="text-base transition-transform group-hover:translate-x-0.5" />
                  </span>
                  {profile.availability.open ? "Available for collaboration" : "Get in touch"}
                </a>
              </Magnetic>
            </Reveal>
          </div>

          {/* right — contact rows */}
          <div className="md:col-span-6 md:col-start-7">
            <ul className="border-t border-line">
              {rows.map((row) => {
                const Icon = row.icon;
                const external = row.href?.startsWith("http");
                const inner = (
                  <div className="group flex items-center gap-5 border-b border-line py-5 transition-colors">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-faint transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                      <Icon className="text-base" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                        {row.label}
                      </div>
                      <div className="mt-0.5 truncate text-[15px] text-ink transition-colors group-hover:text-accent">
                        {row.value}
                      </div>
                    </div>
                    {row.href && (
                      <ArrowIcon className="ml-auto shrink-0 text-base text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
                    )}
                  </div>
                );
                return (
                  <li key={row.label}>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        data-cursor-label="open"
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PhoneGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em" aria-hidden {...props}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function LocationGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} width="1em" height="1em" aria-hidden {...props}>
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

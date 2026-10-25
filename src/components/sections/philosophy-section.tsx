import { philosophy } from "@/data/about";
import { profile } from "@/data/profile";
import { Container } from "@/components/section";
import { Reveal } from "@/components/motion";

/* A full-bleed crimson manifesto panel — the one place colour takes over the
   whole field, for deliberate contrast against the black editorial pages. */
export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="relative overflow-hidden border-y border-accent-deep bg-accent-deep text-[#fbeceb]"
    >
      {/* texture + depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(120deg, #000 0 1px, transparent 1px 32px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 90% at 80% 10%, rgba(0,0,0,0.35), transparent 60%)" }}
      />

      <Container className="relative py-20 sm:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <span aria-hidden className="block font-display text-[6rem] leading-[0.6] text-black/25">
              &ldquo;
            </span>
            <Reveal>
              <blockquote className="mt-4 max-w-3xl text-balance text-[clamp(1.8rem,4.2vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-[#fdf3f2]">
                {philosophy.quote}
              </blockquote>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-[#f3d6d4]">
                {philosophy.body}
              </p>
            </Reveal>
            <div className="mt-8">
              <span className="script block text-4xl text-[#fdf3f2] sm:text-5xl">{profile.name}</span>
            </div>
          </div>

          {/* brand pillars */}
          <div className="md:col-span-4 md:border-l md:border-white/15 md:pl-8">
            <ul className="flex flex-col gap-6">
              {[
                { k: "Mission", v: profile.brand.mission },
                { k: "Mindset", v: profile.brand.mindset },
              ].map((item) => (
                <li key={item.k}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#f3b8b5]">
                    {item.k}
                  </span>
                  <p className="mt-2 text-[1.35rem] font-medium leading-tight text-[#fdf3f2]">
                    {item.v}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f3d6d4]">
              {philosophy.signoff}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

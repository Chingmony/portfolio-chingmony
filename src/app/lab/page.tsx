import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/section";
import { LabTools } from "@/components/lab/lab-tools";
import { Reveal } from "@/components/motion";
import { Tag } from "@/components/ui/primitives";
import { ShieldIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Cyber Lab",
  description:
    "Browser-based defensive security utilities — a security-header analyzer and a JWT inspector that decodes and verifies locally.",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cyber Lab"
        title="Browser-based security utilities."
        intro="Small, defensive tools that run entirely in your browser. Nothing you enter is transmitted or stored."
        crumbs={[{ label: "~", href: "/" }, { label: "lab" }]}
        aside={<Tag tone="accent">client-side only</Tag>}
      />

      <Container size="wide" className="py-14 sm:py-20">
        <Reveal>
          <LabTools />
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <div className="flex items-start gap-4 rounded-[2px] border border-line border-dashed bg-raise/30 p-6">
            <ShieldIcon className="mt-0.5 shrink-0 text-xl text-accent" />
            <div>
              <h2 className="font-mono text-[14px] text-ink">On scope and honesty</h2>
              <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-dim">
                These tools are deliberately limited. The header analyzer reads only what you paste
                — it makes no requests of its own, so it can never be aimed at a third party and has
                no server-side fetch to be abused. The JWT inspector keeps <strong className="text-ink">decoding</strong>{" "}
                and <strong className="text-ink">signature verification</strong> as separate, clearly labelled operations,
                because treating a decoded token as a trusted one is the most common JWT mistake.
                More utilities will be added the same way: defensive, local, and honest about what
                they can and cannot prove.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}

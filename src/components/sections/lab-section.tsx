import { Section } from "@/components/section";
import { LabTools } from "@/components/lab/lab-tools";
import { Reveal } from "@/components/motion";
import { Tag } from "@/components/ui/primitives";

export function LabSection() {
  return (
    <Section
      id="lab"
      index="02"
      eyebrow="Cyber Lab"
      title={<>Defensive utilities you can use right now.</>}
      intro="A growing set of browser-based security tools. Each one is defensive, runs fully client-side, and is honest about the difference between what it reads and what it proves."
      containerSize="wide"
      headerAside={
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Tag tone="accent">client-side only</Tag>
          <span className="font-mono text-[11px] text-faint">no data leaves your browser</span>
        </div>
      }
    >
      <Reveal>
        <LabTools />
      </Reveal>
    </Section>
  );
}

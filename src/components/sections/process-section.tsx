import { processSteps } from "@/data/about";
import { Section } from "@/components/section";
import { Stagger, StaggerItem } from "@/components/motion";

export function ProcessSection() {
  return (
    <Section
      id="process"
      index="04"
      eyebrow="Work process"
      title={<>How I approach a build.</>}
      intro="Five stages from first question to delivered result — the same loop whether it's a tool, a platform or a lesson."
    >
      <Stagger className="relative">
        {/* connecting rail */}
        <span
          aria-hidden
          className="absolute left-[1.15rem] top-4 bottom-4 w-px bg-gradient-to-b from-line-strong via-line to-transparent md:left-[1.4rem]"
        />
        <ol className="flex flex-col">
          {processSteps.map((step) => (
            <StaggerItem key={step.no} as="li">
              <div className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 border-b border-line py-7 md:grid-cols-[auto_14rem_1fr] md:items-baseline md:gap-x-10">
                {/* marker */}
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg font-mono text-[12px] text-accent transition-colors duration-300 group-hover:border-accent md:h-11 md:w-11 md:text-[13px]">
                  {step.no}
                </span>
                {/* title */}
                <h3 className="display-m self-center text-ink transition-colors duration-300 group-hover:text-accent md:self-baseline">
                  {step.title}
                </h3>
                {/* detail */}
                <p className="col-span-2 text-[14px] leading-relaxed text-dim md:col-span-1 md:max-w-xl">
                  {step.detail}
                </p>
              </div>
            </StaggerItem>
          ))}
        </ol>
      </Stagger>
    </Section>
  );
}

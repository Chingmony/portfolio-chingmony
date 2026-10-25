import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/tech-marquee";
import { ProjectsSection } from "@/components/sections/projects-section";
import { LabSection } from "@/components/sections/lab-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ResearchSection } from "@/components/sections/research-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <ProjectsSection />
      <LabSection />
      <ExperienceSection />
      <ProcessSection />
      <ResearchSection />
      <PhilosophySection />
      <TimelineSection />
      <ContactSection />
    </>
  );
}

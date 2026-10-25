import type { Metadata } from "next";
import { sortedArticles } from "@/data/research";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/section";
import { ArticleRow } from "@/components/sections/research-section";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Research",
  description: "Security research, CTF write-ups and engineering notes.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${sortedArticles.length} entries`}
        title="Research journal."
        intro="Architecture decisions, write-ups and experiments, written so the reasoning transfers."
        crumbs={[{ label: "~", href: "/" }, { label: "research" }]}
      />
      <Container className="py-14 sm:py-20">
        <Stagger className="flex flex-col gap-4">
          {sortedArticles.map((a) => (
            <StaggerItem key={a.slug}>
              <ArticleRow article={a} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </>
  );
}

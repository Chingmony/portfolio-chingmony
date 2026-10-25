import Link from "next/link";
import { featuredArticles, sortedArticles, type Article } from "@/data/research";
import { Section } from "@/components/section";
import { Tag } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/motion";
import { LinkButton } from "@/components/ui/primitives";
import { ArrowIcon, ArrowUpRight } from "@/components/icons";
import { formatDate, readingTime } from "@/lib/utils";

const kindTone: Record<Article["kind"], "accent" | "cyan" | "warn" | "default"> = {
  research: "accent",
  writeup: "cyan",
  experiment: "warn",
  note: "default",
};

export function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      href={`/research/${article.slug}`}
      data-cursor-label="read"
      className="group relative grid grid-cols-1 items-baseline gap-x-8 gap-y-4 border-t border-line py-8 transition-colors sm:grid-cols-[9rem_1fr_auto] sm:py-9"
    >
      {/* accent spine that grows on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-0 w-px bg-accent transition-all duration-500 group-hover:h-full"
      />

      {/* meta */}
      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
        <time className="font-mono text-[12px] text-faint">{formatDate(article.date)}</time>
        <Tag tone={kindTone[article.kind]}>{article.kind}</Tag>
      </div>

      {/* body */}
      <div className="min-w-0">
        <h3 className="display-m text-ink transition-colors duration-300 group-hover:text-accent">
          {article.title}
        </h3>
        <p className="mt-1.5 text-[1.05rem] leading-snug text-dim">{article.subtitle}</p>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-dim/90">{article.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((t) => (
            <span key={t} className="font-mono text-[11px] text-faint">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* trailing */}
      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-3">
        <span className="font-mono text-[11px] text-faint">{readingTime(article.body)} min</span>
        <ArrowUpRight className="text-lg text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </div>
    </Link>
  );
}

export function ResearchSection() {
  const extra = sortedArticles.length - featuredArticles.length;
  return (
    <Section
      id="research"
      index="05"
      eyebrow="Research journal"
      title={<>Notes from taking things apart.</>}
      intro="Architecture decisions, write-ups and experiments — written so the reasoning transfers, not just the result."
      headerAside={
        <LinkButton href="/research" variant="line" size="sm">
          All writing
          <ArrowIcon className="text-sm" />
        </LinkButton>
      }
    >
      <Stagger className="border-b border-line">
        {featuredArticles.map((a) => (
          <StaggerItem key={a.slug}>
            <ArticleRow article={a} />
          </StaggerItem>
        ))}
      </Stagger>
      {extra > 0 && (
        <p className="mt-8 font-mono text-[12px] text-faint">
          + {extra} more in the{" "}
          <Link href="/research" className="text-accent underline underline-offset-2">
            full journal
          </Link>
        </p>
      )}
    </Section>
  );
}

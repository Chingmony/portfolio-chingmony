import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticle, articleSlugs, sortedArticles } from "@/data/research";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/section";
import { Reveal } from "@/components/motion";
import { Tag } from "@/components/ui/primitives";
import { ArrowIcon } from "@/components/icons";
import { formatDate, readingTime } from "@/lib/utils";

// Every valid article is prerendered via generateStaticParams; the route reads
// `params` directly, so opt out of the instant shell (any other slug 404s).
export const instant = false;

export function generateStaticParams() {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Article not found" };
  return {
    title: a.title,
    description: a.summary,
    openGraph: {
      title: a.title,
      description: a.summary,
      type: "article",
      publishedTime: a.date,
      tags: a.tags,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const idx = sortedArticles.findIndex((a) => a.slug === slug);
  const next = sortedArticles[(idx + 1) % sortedArticles.length];

  return (
    <>
      <PageHeader
        eyebrow={`${article.kind} · ${formatDate(article.date)}`}
        title={article.title}
        intro={article.subtitle}
        crumbs={[{ label: "~", href: "/" }, { label: "research", href: "/research" }, { label: article.slug }]}
      />

      <Container size="narrow" className="py-14 sm:py-20">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-6 font-mono text-[12px] text-faint">
            <span>{readingTime(article.body)} min read</span>
            <span className="h-3 w-px bg-line-strong" />
            <div className="flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <Tag key={t}>#{t}</Tag>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <article className="prose-lab">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
          </article>
        </Reveal>

        <div className="mt-16 border-t border-line pt-10">
          <Link
            href={`/research/${next.slug}`}
            className="group flex items-center justify-between gap-4 rounded-[2px] border border-line bg-raise/40 p-6 transition-colors hover:border-line-strong hover:bg-raise"
          >
            <div>
              <span className="label-mono">Next in the journal</span>
              <h3 className="display-m mt-2 text-[1.3rem] text-ink transition-colors group-hover:text-accent">
                {next.title}
              </h3>
            </div>
            <ArrowIcon className="shrink-0 text-xl text-faint transition-all group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        </div>
      </Container>
    </>
  );
}

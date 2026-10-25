import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { projectSlugs } from "@/data/projects";
import { sortedArticles } from "@/data/research";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl.replace(/\/$/, "");
  // Deterministic build date keeps the sitemap statically prerenderable
  // under Cache Components. Bump it when you ship a content update.
  const now = new Date("2026-10-25T00:00:00Z");

  const staticRoutes = ["", "/projects", "/research", "/lab"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = projectSlugs.map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articleRoutes = sortedArticles.map((a) => ({
    url: `${base}/research/${a.slug}`,
    lastModified: new Date(`${a.date}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}

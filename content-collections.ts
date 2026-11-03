import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

export const projectCategories = [
  "software",
  "ai-ml",
  "hackathon",
  "research",
  "leadership",
] as const;

export const fruitTypes = ["golden", "ripe", "green", "blossom"] as const;
export const appleKinds = ["red", "golden", "enchanted"] as const;
/** The single project allowed to carry the Enchanted Golden Apple. */
export const ENCHANTED_SLUG = "vision";
export const projectStatuses = ["completed", "in-progress", "ongoing"] as const;
export const linkKinds = ["github", "devpost", "live", "article", "event", "other"] as const;

const linkSchema = z.object({
  label: z.string(),
  href: z.string().url(),
  kind: z.enum(linkKinds).default("other"),
});

const gallerySchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.mdx",
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    year: z.number(),
    date: z.string().optional(),
    stack: z.array(z.string()).min(1),
    category: z.enum(projectCategories).default("software"),
    status: z.enum(projectStatuses).default("completed"),
    fruit: z.enum(fruitTypes).optional(),
    award: z.string().optional(),
    /** Enchanted Golden Apple. Build fails unless slug === ENCHANTED_SLUG. */
    enchanted: z.boolean().default(false),
    event: z.string().optional(),
    location: z.string().optional(),
    role: z.string().optional(),
    team: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    archived: z.boolean().default(false),
    repo: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    articleUrl: z.string().url().optional(),
    devpostUrl: z.string().url().optional(),
    highlight: z.string().optional(),
    cover: z.string().optional(),
    gallery: z.array(gallerySchema).default([]),
    links: z.array(linkSchema).default([]),
    tree: z
      .object({
        branch: z.string().optional(),
        t: z.number().min(0).max(1).optional(),
        side: z.enum(["left", "right"]).optional(),
      })
      .optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document);

    // Legacy fields fold into the structured model so no MDX needs rewriting.
    const award = document.award ?? document.highlight;
    const links = [...document.links];
    const has = (href: string) => links.some((link) => link.href === href);
    if (document.repo && !has(document.repo)) {
      links.unshift({ label: "Repository", href: document.repo, kind: "github" });
    }
    if (document.liveUrl && !has(document.liveUrl)) {
      links.push({ label: "Live site", href: document.liveUrl, kind: "live" });
    }
    if (document.devpostUrl && !has(document.devpostUrl)) {
      links.push({ label: "Devpost", href: document.devpostUrl, kind: "devpost" });
    }
    if (document.articleUrl && !has(document.articleUrl)) {
      links.push({ label: "Article", href: document.articleUrl, kind: "article" });
    }

    if (document.enchanted && document.slug !== ENCHANTED_SLUG) {
      throw new Error(
        `Only "${ENCHANTED_SLUG}" may set enchanted: true (found on "${document.slug}")`,
      );
    }
    const apple: (typeof appleKinds)[number] = document.enchanted
      ? "enchanted"
      : award
        ? "golden"
        : "red";

    const fruit =
      document.fruit ??
      (award
        ? "golden"
        : document.status === "completed"
          ? "ripe"
          : "green");

    return {
      ...document,
      award,
      apple,
      fruit,
      links,
      body,
    };
  },
});

export default defineConfig({
  content: [projects],
});

import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.mdx",
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    year: z.number(),
    stack: z.array(z.string()).min(1),
    featured: z.boolean().default(false),
    archived: z.boolean().default(false),
    repo: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    cover: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document);

    return {
      ...document,
      body,
    };
  },
});

export default defineConfig({
  content: [projects],
});

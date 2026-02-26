import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const categories = [
  "blueberry-funded",
  "trading-strategy",
  "prop-firm-ops",
  "payment-guide",
  "trading-education",
  "ea-trading",
] as const;

const postSchema = s.object({
  title: s.string().max(120),
  slug: s.slug("posts"),
  description: s.string().max(300),
  date: s.isodate(),
  updated: s.isodate().optional(),
  category: s.enum(categories),
  tags: s.array(s.string()),
  published: s.boolean().default(true),
  image: s.string().optional(),
  source: s.enum(["original", "note"]).default("original"),
  noteUrl: s.string().optional(),
  noteId: s.string().optional(),
  isPaid: s.boolean().default(false),
  price: s.number().default(0),
  canonical: s.string().optional(),
  code: s.mdx(),
  metadata: s.metadata(),
  toc: s.toc(),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: postSchema,
});

const synced = defineCollection({
  name: "SyncedPost",
  pattern: "synced/**/*.mdx",
  schema: postSchema,
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, synced },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, { theme: "github-dark-dimmed" }],
    ],
    remarkPlugins: [remarkGfm],
  },
});

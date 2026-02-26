import type { MetadataRoute } from "next";
import { getAllPosts, getCategoryCounts } from "@/lib/content";
import { siteConfig } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getCategoryCounts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    lastModified: post.updated || post.date,
    changeFrequency: "monthly",
    priority: post.source === "original" ? 0.8 : 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = Object.keys(categories).map(
    (cat) => ({
      url: `${siteConfig.url}/category/${cat}`,
      changeFrequency: "weekly",
      priority: 0.5,
    })
  );

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...postEntries,
    ...categoryEntries,
  ];
}

import { posts, synced } from "#site-content";

export type Post = (typeof posts)[number] | (typeof synced)[number];

/** 全記事を統合して日付降順でソート */
export function getAllPosts(): Post[] {
  return [...posts, ...synced]
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** slugで記事を取得 */
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** カテゴリで絞り込み */
export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

/** タグで絞り込み */
export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

/** 全カテゴリと記事数を取得 */
export function getCategoryCounts(): Record<string, number> {
  const all = getAllPosts();
  const counts = new Map<string, number>();
  all.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
  return Object.fromEntries(counts);
}

/** 全タグと記事数を取得 */
export function getTagCounts(): Record<string, number> {
  const all = getAllPosts();
  const counts = new Map<string, number>();
  all.forEach((p) =>
    p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1))
  );
  return Object.fromEntries(counts);
}

/** 検索 (タイトル + 説明文) */
export function searchPosts(query: string): Post[] {
  const q = query.toLowerCase();
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

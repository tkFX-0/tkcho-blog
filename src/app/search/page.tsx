"use client";

import { useState, useMemo } from "react";
import { PostCard } from "@/components/post/PostCard";
import type { Post } from "@/lib/content";

// Content is imported at build time; for client search we pass it as props
// via a server component wrapper, but for simplicity we use a client-side approach
import { posts, synced } from "#site-content";

function getAllClientPosts(): Post[] {
  return [...posts, ...synced]
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const allPosts = useMemo(() => getAllClientPosts(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query, allPosts]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Search</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="記事を検索..."
        className="mb-6 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--color-primary)]"
        autoFocus
      />

      {query.trim() && (
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          {results.length} 件見つかりました
        </p>
      )}

      <div className="space-y-4">
        {results.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

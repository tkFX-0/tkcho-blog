"use client";

import { useState, useMemo } from "react";
import { PostCard } from "@/components/post/PostCard";
import type { Post } from "@/lib/content";

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
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <span className="inline-block h-6 w-1 rounded-full bg-[var(--color-accent)]" />
        記事を検索
      </h1>

      <div className="relative mb-6">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="キーワードを入力..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] py-3 pl-10 pr-4 text-[var(--foreground)] outline-none transition-colors focus:border-[var(--color-primary-light)]"
          autoFocus
        />
      </div>

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

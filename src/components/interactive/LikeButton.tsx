"use client";

import { useEffect, useState, useCallback } from "react";

interface LikeButtonProps {
  slug: string;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check localStorage for liked state
    const likedSlugs = JSON.parse(localStorage.getItem("liked") || "[]");
    if (likedSlugs.includes(slug)) setLiked(true);

    // Fetch current count
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setCount(d.count || 0))
      .catch(() => {});
  }, [slug]);

  const handleLike = useCallback(async () => {
    if (liked || loading) return;
    setLoading(true);

    // Optimistic update
    setCount((c) => c + 1);
    setLiked(true);

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        const likedSlugs = JSON.parse(localStorage.getItem("liked") || "[]");
        likedSlugs.push(slug);
        localStorage.setItem("liked", JSON.stringify(likedSlugs));
      } else {
        // Revert on error
        setCount((c) => c - 1);
        setLiked(false);
      }
    } catch {
      setCount((c) => c - 1);
      setLiked(false);
    } finally {
      setLoading(false);
    }
  }, [slug, liked, loading]);

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
        liked
          ? "border-pink-300 bg-pink-50 text-pink-600 dark:border-pink-700 dark:bg-pink-950 dark:text-pink-400"
          : "border-[var(--border)] hover:border-pink-300 hover:text-pink-600"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{count}</span>
    </button>
  );
}

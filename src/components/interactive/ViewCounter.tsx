"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  slug: string;
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Increment view and get count
    const key = `viewed:${slug}`;
    const alreadyViewed = sessionStorage.getItem(key);

    if (!alreadyViewed) {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
        .then((r) => r.json())
        .then((d) => {
          setViews(d.count || 0);
          sessionStorage.setItem(key, "1");
        })
        .catch(() => {});
    } else {
      fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
        .then((r) => r.json())
        .then((d) => setViews(d.count || 0))
        .catch(() => {});
    }
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="text-xs text-[var(--muted-foreground)]">
      {views.toLocaleString()} views
    </span>
  );
}

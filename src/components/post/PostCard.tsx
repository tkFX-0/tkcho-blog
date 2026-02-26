import Link from "next/link";
import type { Post } from "@/lib/content";
import { formatDate, getPostUrl } from "@/lib/utils";
import { categoryLabels } from "@/lib/constants";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <Link
          href={`/category/${post.category}`}
          className="rounded bg-[var(--muted)] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          {categoryLabels[post.category] || post.category}
        </Link>
        {post.source === "note" && (
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
            note
          </span>
        )}
        {post.isPaid && (
          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            &yen;{post.price.toLocaleString()}
          </span>
        )}
      </div>

      <Link href={getPostUrl(post.slug)}>
        <h2 className="mb-2 text-lg font-bold hover:text-[var(--color-primary)]">
          {post.title}
        </h2>
      </Link>

      <p className="mb-3 line-clamp-2 text-sm text-[var(--muted-foreground)]">
        {post.description}
      </p>

      <div className="flex items-center justify-between">
        <time
          dateTime={post.date}
          className="text-xs text-[var(--muted-foreground)]"
        >
          {formatDate(post.date)}
        </time>
        <div className="flex gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

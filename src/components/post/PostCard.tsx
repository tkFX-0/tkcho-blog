import Link from "next/link";
import type { Post } from "@/lib/content";
import { formatDate, getPostUrl } from "@/lib/utils";
import { categoryLabels } from "@/lib/constants";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="card-hover rounded-lg bg-[var(--card)] p-5">
      <div className="mb-3 flex items-center gap-2">
        <Link
          href={`/category/${post.category}`}
          className="badge badge-primary hover:opacity-80"
        >
          {categoryLabels[post.category] || post.category}
        </Link>
        {post.source === "note" && (
          <span className="badge badge-note">note</span>
        )}
        {post.isPaid && (
          <span className="badge badge-paid">
            &yen;{post.price.toLocaleString()}
          </span>
        )}
      </div>

      <Link href={getPostUrl(post.slug)}>
        <h2 className="mb-2 text-lg font-bold leading-snug text-[var(--foreground)] transition-colors hover:text-[var(--color-primary-light)]">
          {post.title}
        </h2>
      </Link>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
        {post.description}
      </p>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
        <time
          dateTime={post.date}
          className="text-xs text-[var(--muted-foreground)]"
        >
          {formatDate(post.date)}
        </time>
        <div className="flex gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--color-primary-light)]"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

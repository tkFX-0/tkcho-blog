import type { Post } from "@/lib/content";

export function PaidArticleTeaser({ post }: { post: Post }) {
  if (!post.isPaid || !post.noteUrl) return null;

  return (
    <div className="my-8 rounded-lg border-2 border-amber-300 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-950">
      <p className="mb-2 text-sm font-bold text-amber-700 dark:text-amber-300">
        この記事は note.com の有料記事です
      </p>
      <p className="mb-4 text-sm text-[var(--muted-foreground)]">
        全文は note.com でお読みいただけます（&yen;{post.price.toLocaleString()}）
      </p>
      <a
        href={post.noteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-md bg-[var(--color-primary)] px-6 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        note.com で読む &rarr;
      </a>
    </div>
  );
}

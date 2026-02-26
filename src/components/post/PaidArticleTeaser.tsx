import type { Post } from "@/lib/content";

export function PaidArticleTeaser({ post }: { post: Post }) {
  if (!post.isPaid || !post.noteUrl) return null;

  return (
    <div className="my-8 rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Teaser content if any */}
      {post.code && (
        <div className="prose p-6 border-b border-[var(--border)]">
          <div dangerouslySetInnerHTML={{ __html: "<!-- teaser -->" }} />
        </div>
      )}

      {/* CTA section */}
      <div className="bg-[var(--muted)] p-6 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-gold)]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-sm font-bold">
            この記事は note.com の有料記事です
          </span>
        </div>
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          全文は note.com でお読みいただけます（&yen;{post.price.toLocaleString()}）
        </p>
        <a
          href={post.noteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta"
        >
          note.com で続きを読む
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

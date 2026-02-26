import Link from "next/link";
import { getCategoryCounts, getTagCounts } from "@/lib/content";
import { categoryLabels, siteConfig } from "@/lib/constants";

export function Sidebar() {
  const categoryCounts = getCategoryCounts();
  const tagCounts = getTagCounts();

  return (
    <aside className="space-y-6">
      {/* Profile Card */}
      <div className="sidebar-widget">
        <div className="sidebar-widget-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          プロフィール
        </div>
        <div className="sidebar-widget-body">
          <p className="mb-1 text-base font-bold">{siteConfig.author.name}</p>
          <p className="mb-3 text-sm text-[var(--muted-foreground)]">
            プロップトレーダー / FX
          </p>
          <Link
            href={siteConfig.links.note}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex text-xs"
          >
            note.com で記事を読む
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="sidebar-widget">
        <div className="sidebar-widget-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          カテゴリ
        </div>
        <div className="sidebar-widget-body">
          <ul className="space-y-1">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <li key={cat}>
                <Link
                  href={`/category/${cat}`}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <span>{categoryLabels[cat] || cat}</span>
                  <span className="badge badge-primary text-[10px]">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tags */}
      {Object.keys(tagCounts).length > 0 && (
        <div className="sidebar-widget">
          <div className="sidebar-widget-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            タグ
          </div>
          <div className="sidebar-widget-body">
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(tagCounts).map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--color-primary-light)] hover:text-[var(--foreground)]"
                >
                  {tag} ({count})
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

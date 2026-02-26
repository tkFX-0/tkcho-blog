import Link from "next/link";
import { getCategoryCounts, getTagCounts } from "@/lib/content";
import { categoryLabels, siteConfig } from "@/lib/constants";

export function Sidebar() {
  const categoryCounts = getCategoryCounts();
  const tagCounts = getTagCounts();

  return (
    <aside className="space-y-8">
      {/* Profile Card */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <h3 className="mb-2 font-bold">{siteConfig.author.name}</h3>
        <p className="mb-3 text-sm text-[var(--muted-foreground)]">
          プロップトレーダー / FX
        </p>
        <Link
          href={siteConfig.links.note}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          note.com &rarr;
        </Link>
      </div>

      {/* Categories */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <h3 className="mb-3 font-bold">Categories</h3>
        <ul className="space-y-2">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <li key={cat}>
              <Link
                href={`/category/${cat}`}
                className="flex justify-between text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <span>{categoryLabels[cat] || cat}</span>
                <span className="text-xs">({count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      {Object.keys(tagCounts).length > 0 && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
          <h3 className="mb-3 font-bold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tagCounts).map(([tag, count]) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                {tag} ({count})
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

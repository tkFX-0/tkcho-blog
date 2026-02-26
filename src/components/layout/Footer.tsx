import Link from "next/link";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--heading-bg)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-sm font-bold">
                tk
              </span>
              <span className="font-bold">{siteConfig.name}</span>
            </div>
            <p className="text-sm text-white/70">
              {siteConfig.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
              カテゴリ
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/category/blueberry-funded" className="text-sm text-white/70 hover:text-white">
                  Blueberry Funded
                </Link>
              </li>
              <li>
                <Link href="/category/trading-strategy" className="text-sm text-white/70 hover:text-white">
                  トレード手法
                </Link>
              </li>
              <li>
                <Link href="/category/prop-firm-ops" className="text-sm text-white/70 hover:text-white">
                  プロップファーム運用
                </Link>
              </li>
              <li>
                <Link href="/category/ea-trading" className="text-sm text-white/70 hover:text-white">
                  EA運用
                </Link>
              </li>
            </ul>
          </div>

          {/* External */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
              リンク
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={siteConfig.links.note} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white">
                  note.com
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" className="text-sm text-white/70 hover:text-white">
                  RSS Feed
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/70 hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-6 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

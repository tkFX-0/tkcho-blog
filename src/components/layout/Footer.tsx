import Link from "next/link";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <div className="flex gap-4">
            <Link
              href={siteConfig.links.note}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              note.com
            </Link>
            <Link
              href="/feed.xml"
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              RSS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

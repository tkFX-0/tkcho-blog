import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx/MDXContent";
import { PaidArticleTeaser } from "@/components/post/PaidArticleTeaser";
import { LikeButton } from "@/components/interactive/LikeButton";
import { Comments } from "@/components/interactive/Comments";
import { ViewCounter } from "@/components/interactive/ViewCounter";
import { TableOfContents } from "@/components/post/TableOfContents";
import { formatDate, formatReadingTime } from "@/lib/utils";
import { categoryLabels, siteConfig } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: post.canonical || `${siteConfig.url}/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      locale: "ja_JP",
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <header className="mb-8">
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
        </div>

        <h1 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          {post.updated && (
            <span>(更新: {formatDate(post.updated)})</span>
          )}
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatReadingTime(post.metadata.readingTime)}
          </span>
          <ViewCounter slug={post.slug} />
        </div>

        {post.noteUrl && (
          <p className="mt-3">
            <a
              href={post.noteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--color-primary-light)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              note.com の元記事を見る
            </a>
          </p>
        )}
      </header>

      {/* TOC */}
      {!post.isPaid && post.toc.length > 0 && (
        <TableOfContents toc={post.toc} />
      )}

      {/* Body */}
      {post.isPaid ? (
        <PaidArticleTeaser post={post} />
      ) : (
        <article className="prose">
          <MDXContent code={post.code} />
        </article>
      )}

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2 border-t border-[var(--border)] pt-6">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag}`}
            className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--color-primary-light)] hover:text-[var(--foreground)]"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Like */}
      <div className="mt-6 flex justify-center">
        <LikeButton slug={post.slug} />
      </div>

      {/* Comments */}
      <Comments />

      {/* Back to Home */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-primary-light)] transition-colors hover:text-[var(--color-primary)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          記事一覧に戻る
        </Link>
      </div>
    </div>
  );
}

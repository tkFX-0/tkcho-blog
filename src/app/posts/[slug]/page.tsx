import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx/MDXContent";
import { PaidArticleTeaser } from "@/components/post/PaidArticleTeaser";
import { LikeButton } from "@/components/interactive/LikeButton";
import { Comments } from "@/components/interactive/Comments";
import { ViewCounter } from "@/components/interactive/ViewCounter";
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
            className="rounded bg-[var(--muted)] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            {categoryLabels[post.category] || post.category}
          </Link>
          {post.source === "note" && (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
              note
            </span>
          )}
        </div>

        <h1 className="mb-3 text-3xl font-bold">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updated && (
            <span>(更新: {formatDate(post.updated)})</span>
          )}
          <span>{formatReadingTime(post.metadata.readingTime)}</span>
          <ViewCounter slug={post.slug} />
        </div>

        {post.noteUrl && (
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            <a
              href={post.noteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground)]"
            >
              note.com の元記事を見る &rarr;
            </a>
          </p>
        )}
      </header>

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
            className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Like */}
      <div className="mt-6">
        <LikeButton slug={post.slug} />
      </div>

      {/* Comments */}
      <Comments />

      {/* Back to Home */}
      <div className="mt-8">
        <Link
          href="/"
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          &larr; 記事一覧に戻る
        </Link>
      </div>
    </div>
  );
}

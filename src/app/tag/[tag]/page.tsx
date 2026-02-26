import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByTag, getTagCounts } from "@/lib/content";
import { PostCard } from "@/components/post/PostCard";
import { Sidebar } from "@/components/layout/Sidebar";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const counts = getTagCounts();
  return Object.keys(counts).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `「${decoded}」タグの記事一覧`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-[var(--muted-foreground)]">
        <Link href="/" className="hover:text-[var(--foreground)]">ホーム</Link>
        <span className="mx-2">/</span>
        <span>#{decoded}</span>
      </nav>

      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <span className="inline-block h-6 w-1 rounded-full bg-[var(--color-accent)]" />
        #{decoded}
        <span className="text-base font-normal text-[var(--muted-foreground)]">
          ({posts.length}件)
        </span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

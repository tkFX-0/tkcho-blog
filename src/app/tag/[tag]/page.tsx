import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByTag, getTagCounts } from "@/lib/content";
import { PostCard } from "@/components/post/PostCard";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">#{decoded}</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

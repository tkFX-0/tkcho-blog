import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCategory, getCategoryCounts } from "@/lib/content";
import { PostCard } from "@/components/post/PostCard";
import { categoryLabels } from "@/lib/constants";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const counts = getCategoryCounts();
  return Object.keys(counts).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabels[category] || category;
  return {
    title: label,
    description: `${label}に関する記事一覧`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const label = categoryLabels[category] || category;

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{label}</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategory, getCategoryCounts } from "@/lib/content";
import { PostCard } from "@/components/post/PostCard";
import { Sidebar } from "@/components/layout/Sidebar";
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-[var(--muted-foreground)]">
        <Link href="/" className="hover:text-[var(--foreground)]">ホーム</Link>
        <span className="mx-2">/</span>
        <span>{label}</span>
      </nav>

      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <span className="inline-block h-6 w-1 rounded-full bg-[var(--color-accent)]" />
        {label}
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

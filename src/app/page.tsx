import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/post/PostCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { siteConfig } from "@/lib/constants";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">{siteConfig.name}</h1>
      <p className="mb-8 text-[var(--muted-foreground)]">
        {siteConfig.description}
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Article List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-[var(--muted-foreground)]">
              まだ記事がありません。
            </p>
          ) : (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

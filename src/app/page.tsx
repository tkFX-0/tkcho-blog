import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/post/PostCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { siteConfig } from "@/lib/constants";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero section */}
      <div className="mb-8 rounded-lg bg-[var(--heading-bg)] p-6 text-white sm:p-8">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
          {siteConfig.name}
        </h1>
        <p className="text-sm text-white/80 sm:text-base">
          {siteConfig.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Article List */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <span className="inline-block h-5 w-1 rounded-full bg-[var(--color-accent)]" />
            最新記事
          </h2>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-[var(--muted-foreground)]">
                まだ記事がありません。
              </p>
            ) : (
              posts.map((post) => <PostCard key={post.slug} post={post} />)
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

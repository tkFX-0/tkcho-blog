import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-6 text-[var(--muted-foreground)]">
        ページが見つかりませんでした。
      </p>
      <Link
        href="/"
        className="rounded-md bg-[var(--color-primary)] px-6 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}

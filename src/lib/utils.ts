/** 日付を "2026年2月27日" 形式にフォーマット */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 読了時間の表示 */
export function formatReadingTime(minutes: number): string {
  return `${Math.ceil(minutes)}分で読めます`;
}

/** slug をURLパスに変換 */
export function getPostUrl(slug: string): string {
  return `/posts/${slug}`;
}

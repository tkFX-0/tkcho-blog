/**
 * note.com 記事同期スクリプト
 * Usage: npx tsx scripts/sync-note.ts
 *
 * note.com API から記事を取得し、MDX ファイルとして content/synced/ に保存する。
 * - 無料記事: 全文を HTML → Markdown 変換
 * - 有料記事: ティーザーのみ生成 + note.com 購入リンク
 */

import fs from "fs";
import path from "path";
import TurndownService from "turndown";

const CREATOR_ID = process.env.NOTE_CREATOR_ID || "tkcho";
const SYNCED_DIR = path.resolve(process.cwd(), "content/synced");
const API_BASE = "https://note.com/api/v2";

// Category classification keywords
const CATEGORY_RULES: [string[], string][] = [
  [
    ["blueberry", "bbf", "blueberryfunded"],
    "blueberry-funded",
  ],
  [
    ["手法", "silver bullet", "kill zone", "po3", "ob", "インジケータ", "indicator"],
    "trading-strategy",
  ],
  [
    ["instant", "rapid", "prime", "チャレンジ", "プラン"],
    "prop-firm-ops",
  ],
  [
    ["rise", "出金", "送金", "payment"],
    "payment-guide",
  ],
  [
    ["ea", "自動売買"],
    "ea-trading",
  ],
];

interface NoteArticle {
  id: number;
  key: string;
  name: string;
  description?: string;
  body?: string;
  price: number;
  publishAt: string;
  noteUrl: string;
  eyecatch?: string;
  likeCount: number;
  hashtags?: { hashtag: { name: string } }[];
}

interface NoteApiResponse {
  data: {
    contents: NoteArticle[];
    isLastPage: boolean;
    totalCount: number;
  };
}

interface NoteDetailResponse {
  data: {
    body?: string;
    name: string;
    description?: string;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function classifyCategory(title: string, tags: string[]): string {
  const text = [title, ...tags].join(" ").toLowerCase();
  for (const [keywords, category] of CATEGORY_RULES) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }
  return "trading-education";
}

function slugify(title: string, key: string): string {
  // Use the note key as a stable slug prefix
  return key;
}

function extractTags(article: NoteArticle): string[] {
  if (!article.hashtags) return [];
  return article.hashtags.map((h) => h.hashtag.name).slice(0, 10);
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "tkcho-blog-sync/1.0",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Fetch articles from note.com
// ---------------------------------------------------------------------------

async function fetchAllArticles(): Promise<NoteArticle[]> {
  const articles: NoteArticle[] = [];
  let page = 1;

  while (true) {
    console.log(`Fetching page ${page}...`);
    const data = await fetchJson<NoteApiResponse>(
      `${API_BASE}/creators/${CREATOR_ID}/contents?kind=note&page=${page}`
    );
    articles.push(...data.data.contents);

    if (data.data.isLastPage) break;
    page++;
    await delay(1000); // Rate limiting
  }

  return articles;
}

async function fetchArticleBody(key: string): Promise<string | null> {
  try {
    const data = await fetchJson<NoteDetailResponse>(
      `https://note.com/api/v3/notes/${key}`
    );
    return data.data.body || null;
  } catch (e) {
    console.warn(`  Failed to fetch body for ${key}:`, e);
    return null;
  }
}

// ---------------------------------------------------------------------------
// HTML to Markdown conversion
// ---------------------------------------------------------------------------

function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  // Handle note.com embedded images
  turndown.addRule("noteImage", {
    filter: (node) =>
      node.nodeName === "IMG" && !!node.getAttribute("src"),
    replacement: (_content, node) => {
      const src = (node as HTMLElement).getAttribute("src") || "";
      const alt = (node as HTMLElement).getAttribute("alt") || "";
      return `\n![${alt}](${src})\n`;
    },
  });

  // Remove script tags
  turndown.addRule("removeScript", {
    filter: "script",
    replacement: () => "",
  });

  return turndown.turndown(html).trim();
}

// ---------------------------------------------------------------------------
// Generate MDX files
// ---------------------------------------------------------------------------

function generateFrontmatter(article: NoteArticle, tags: string[], category: string): string {
  const slug = slugify(article.name, article.key);
  const description = (article.description || article.name).slice(0, 300);
  const date = new Date(article.publishAt).toISOString().split("T")[0];
  const isPaid = article.price > 0;

  const fm: Record<string, unknown> = {
    title: article.name,
    slug,
    description,
    date,
    category,
    tags,
    published: true,
    source: "note",
    noteUrl: article.noteUrl,
    noteId: String(article.id),
    isPaid,
    price: article.price,
    canonical: article.noteUrl,
  };

  if (article.eyecatch) {
    fm.image = article.eyecatch;
  }

  const lines = ["---"];
  for (const [key, value] of Object.entries(fm)) {
    if (value === undefined) continue;
    if (typeof value === "string") {
      // Escape quotes in YAML strings
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        value.forEach((v) => lines.push(`  - "${String(v).replace(/"/g, '\\"')}"`));
      }
    } else {
      lines.push(`${key}: ${String(value)}`);
    }
  }
  lines.push("---");

  return lines.join("\n");
}

function generatePaidTeaser(article: NoteArticle): string {
  return [
    "",
    `この記事は note.com の有料記事です（\\${article.price.toLocaleString()}円）。`,
    "",
    article.description || "",
    "",
    `[note.com で全文を読む](${article.noteUrl})`,
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(SYNCED_DIR)) {
    fs.mkdirSync(SYNCED_DIR, { recursive: true });
  }

  // Get existing synced files
  const existingFiles = new Set(
    fs.readdirSync(SYNCED_DIR).filter((f) => f.endsWith(".mdx"))
  );

  console.log(`Fetching articles from note.com/${CREATOR_ID}...`);
  const articles = await fetchAllArticles();
  console.log(`Found ${articles.length} articles.`);

  let created = 0;
  let skipped = 0;

  for (const article of articles) {
    const filename = `${article.key}.mdx`;
    const filepath = path.join(SYNCED_DIR, filename);

    // Skip if already synced
    if (existingFiles.has(filename)) {
      console.log(`  [skip] ${article.name}`);
      skipped++;
      continue;
    }

    console.log(`  [sync] ${article.name}`);

    const tags = extractTags(article);
    const category = classifyCategory(article.name, tags);
    const frontmatter = generateFrontmatter(article, tags, category);

    let body: string;

    if (article.price > 0) {
      // Paid article: teaser only
      body = generatePaidTeaser(article);
    } else {
      // Free article: fetch full body
      await delay(1500); // Rate limiting
      const html = await fetchArticleBody(article.key);
      if (html) {
        body = "\n" + htmlToMarkdown(html) + "\n";
      } else {
        // Fallback to description
        body = "\n" + (article.description || article.name) + "\n";
      }
    }

    const mdxContent = frontmatter + "\n" + body;
    fs.writeFileSync(filepath, mdxContent, "utf-8");
    created++;
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});

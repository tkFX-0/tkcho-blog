/**
 * まとめ記事自動生成スクリプト
 * Usage: ANTHROPIC_API_KEY=sk-... npx tsx scripts/generate-summaries.ts
 *
 * content/synced/ の記事をカテゴリ別にグループ化し、
 * Claude API で要約・再構成した「まとめ記事」を content/posts/ に生成する。
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SYNCED_DIR = path.resolve(process.cwd(), "content/synced");
const POSTS_DIR = path.resolve(process.cwd(), "content/posts");
const SITE_URL = "https://tkcho-blog.vercel.app";
const MIN_ARTICLES_FOR_SUMMARY = 2;

const CATEGORY_CONFIG: Record<
  string,
  { label: string; slug: string; titleTemplate: string; description: string }
> = {
  "blueberry-funded": {
    label: "Blueberry Funded",
    slug: "blueberry-funded-guide",
    titleTemplate: "【2026年最新】Blueberry Funded 完全ガイド｜プラン比較・ルール・運用戦略まとめ",
    description:
      "Blueberry Fundedの全プラン（Instant/Rapid/Prime）を徹底比較。ルール、EA運用、出金戦略、注意点まで実体験ベースでまとめました。",
  },
  "trading-strategy": {
    label: "トレード手法",
    slug: "trading-strategy-summary",
    titleTemplate: "FXトレード手法まとめ｜SMC・ICTベースの実践テクニック",
    description:
      "Smart Money Concepts（SMC）やICT手法をベースにした実践的なFXトレードテクニックを体系的にまとめました。",
  },
  "prop-firm-ops": {
    label: "プロップファーム運用",
    slug: "prop-firm-ops-guide",
    titleTemplate: "プロップファーム運用戦略ガイド｜Instant Lite実践レポート",
    description:
      "プロップファームの具体的な運用戦略を比較解説。Instant Liteのクッション運用・使い捨て運用の実践データをまとめました。",
  },
  "ea-trading": {
    label: "EA運用",
    slug: "ea-trading-guide",
    titleTemplate: "プロップファームでのEA自動売買運用ガイド",
    description:
      "プロップファームでEA（自動売買）を運用する際のポイントと実践レポートをまとめました。",
  },
};

interface ParsedArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  isPaid: boolean;
  price: number;
  body: string;
}

// ---------------------------------------------------------------------------
// Frontmatter parser
// ---------------------------------------------------------------------------

function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fm: Record<string, string> = {};
  let currentKey = "";
  const lines = match[1].split("\n");

  for (const line of lines) {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      let value = kvMatch[2].trim();
      // Remove quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1).replace(/\\"/g, '"');
      }
      // Empty array "[]" → treat as empty string
      if (value === "[]") value = "";
      fm[currentKey] = value;
    } else if (line.trim().startsWith("- ") && currentKey) {
      // Array item
      const existing = fm[currentKey] || "";
      const item = line.trim().slice(2).replace(/^"|"$/g, "").replace(/\\"/g, '"');
      fm[currentKey] = existing ? `${existing}, ${item}` : item;
    }
  }

  return { frontmatter: fm, body: match[2] };
}

function readSyncedArticles(): ParsedArticle[] {
  if (!fs.existsSync(SYNCED_DIR)) return [];

  const files = fs.readdirSync(SYNCED_DIR).filter((f) => f.endsWith(".mdx"));
  const articles: ParsedArticle[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(SYNCED_DIR, file), "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    articles.push({
      slug: frontmatter.slug || file.replace(".mdx", ""),
      title: frontmatter.title || "",
      description: frontmatter.description || "",
      date: frontmatter.date || "",
      category: frontmatter.category || "",
      tags: (frontmatter.tags || "").split(", ").filter(Boolean),
      isPaid: frontmatter.isPaid === "true",
      price: parseInt(frontmatter.price || "0", 10),
      body: body.trim(),
    });
  }

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// ---------------------------------------------------------------------------
// Claude API
// ---------------------------------------------------------------------------

async function generateSummaryContent(
  client: Anthropic,
  category: string,
  config: (typeof CATEGORY_CONFIG)[string],
  articles: ParsedArticle[]
): Promise<string> {
  const articleSummaries = articles.map((a) => {
    const bodyPreview = a.isPaid
      ? `（有料記事: ¥${a.price}）\n${a.description}`
      : a.body.slice(0, 2000);
    return `### ${a.title}
- スラッグ: ${a.slug}
- 日付: ${a.date}
- タグ: ${a.tags.join(", ")}
- 有料: ${a.isPaid ? `はい (¥${a.price})` : "いいえ"}
- 概要: ${a.description}

本文（抜粋）:
${bodyPreview}
`;
  });

  const systemPrompt = `あなたはFXプロップファーム専門のWebライターです。
以下のルールに従って、高品質なまとめ記事を日本語で作成してください。

【文体】
- です/ます調で丁寧に
- 読者は日本人FXトレーダー
- 実体験ベースの信頼感のある記述

【構成ルール】
- Markdown (MDX) 形式で出力
- H2 (##) を主要セクションの区切りに使用
- H3 (###) をサブセクション用に使用
- 比較表を1つ以上含めること（◎○△× 等の評価記号を使用）
- 各元記事への内部リンクを含めること: [記事タイトル](/posts/{slug})
- 最後に「まとめ」セクションを入れること
- frontmatter は出力しないこと（本文のみ出力）
- HTMLタグは使わずMarkdownのみ`;

  const userPrompt = `以下は「${config.label}」カテゴリの ${articles.length} 本の記事です。
これらを要約・再構成して、読者が全体像を把握できる完全ガイド記事を作成してください。

タイトル: ${config.titleTemplate}

記事一覧:
${articleSummaries.join("\n---\n")}

要件:
1. 冒頭に概要（このカテゴリの全体像を2-3文で説明）
2. 比較表（該当する場合はプラン比較、手法比較など）
3. 各記事のポイントをセクション分けして要約
4. 有料記事は「詳細は有料記事をご覧ください」とリンク
5. 末尾に「まとめ」セクション
6. 各セクションに元記事へのリンクを自然に配置: [記事タイトル](/posts/{slug})`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}

// ---------------------------------------------------------------------------
// MDX generation
// ---------------------------------------------------------------------------

function sanitizeMdx(content: string): string {
  return content
    .replace(/<br\s*>/gi, "<br />") // Fix self-closing <br> tags for MDX
    .replace(/<hr\s*>/gi, "<hr />")
    .replace(/<img([^>]*[^/])>/gi, "<img$1 />"); // Fix self-closing <img> tags
}

function generateSummaryMdx(
  config: (typeof CATEGORY_CONFIG)[string],
  category: string,
  content: string,
  articles: ParsedArticle[]
): string {
  const today = new Date().toISOString().split("T")[0];
  const allTags = [...new Set(articles.flatMap((a) => a.tags))]
    .filter((t) => t && t !== "[]")
    .map((t) => t.replace(/^#/, "")) // Remove leading # from note.com hashtags
    .slice(0, 10);

  const lines = [
    "---",
    `title: "${config.titleTemplate.replace(/"/g, '\\"')}"`,
    `slug: "${config.slug}"`,
    `description: "${config.description.replace(/"/g, '\\"')}"`,
    `date: "${today}"`,
    `category: "${category}"`,
  ];

  if (allTags.length === 0) {
    lines.push("tags: []");
  } else {
    lines.push("tags:");
    allTags.forEach((t) => lines.push(`  - "${t.replace(/"/g, '\\"')}"`));
  }

  lines.push(
    "published: true",
    'source: "original"',
    "isPaid: false",
    "price: 0",
    `canonical: "${SITE_URL}/posts/${config.slug}"`,
    "---",
    "",
    sanitizeMdx(content),
    ""
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function generateSummaries(forceRegenerate = false): Promise<number> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("[summaries] ANTHROPIC_API_KEY not set, skipping summary generation.");
    return 0;
  }

  // Ensure output directory exists
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const client = new Anthropic({ apiKey });
  const articles = readSyncedArticles();

  // Group by category
  const grouped: Record<string, ParsedArticle[]> = {};
  for (const article of articles) {
    if (!article.category) continue;
    if (!grouped[article.category]) grouped[article.category] = [];
    grouped[article.category].push(article);
  }

  let generated = 0;

  for (const [category, categoryArticles] of Object.entries(grouped)) {
    if (categoryArticles.length < MIN_ARTICLES_FOR_SUMMARY) {
      console.log(
        `[summaries] Skipping "${category}" (${categoryArticles.length} articles, need ${MIN_ARTICLES_FOR_SUMMARY}+)`
      );
      continue;
    }

    const config = CATEGORY_CONFIG[category];
    if (!config) {
      console.log(`[summaries] No config for "${category}", skipping.`);
      continue;
    }

    const outputPath = path.join(POSTS_DIR, `${config.slug}.mdx`);

    // Skip if already exists and not forced
    if (!forceRegenerate && fs.existsSync(outputPath)) {
      console.log(`[summaries] "${config.slug}.mdx" already exists, skipping. Use --force to regenerate.`);
      continue;
    }

    console.log(
      `[summaries] Generating "${config.label}" summary from ${categoryArticles.length} articles...`
    );

    try {
      const content = await generateSummaryContent(
        client,
        category,
        config,
        categoryArticles
      );

      if (!content) {
        console.warn(`[summaries] Empty response for "${category}", skipping.`);
        continue;
      }

      const mdx = generateSummaryMdx(config, category, content, categoryArticles);
      fs.writeFileSync(outputPath, mdx, "utf-8");
      console.log(`[summaries] Created: ${config.slug}.mdx`);
      generated++;
    } catch (err) {
      console.error(`[summaries] Error generating "${category}":`, err);
    }
  }

  console.log(`[summaries] Done! Generated: ${generated} summary articles.`);
  return generated;
}

// CLI entry point
if (process.argv[1]?.endsWith("generate-summaries.ts")) {
  const force = process.argv.includes("--force");
  generateSummaries(force).catch((err) => {
    console.error("Summary generation failed:", err);
    process.exit(1);
  });
}

import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.author.name} について`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">About</h1>

      <div className="prose">
        <h2>tk</h2>
        <p>
          プロップファーム（主に Blueberry Funded）でトレードしている
          FXトレーダーです。
        </p>

        <h2>このブログについて</h2>
        <p>
          トレード経験をベースに、プロップファームの活用法やトレード手法、
          EA（自動売買）運用の実践記録などを発信しています。
        </p>
        <p>
          <a
            href={siteConfig.links.note}
            target="_blank"
            rel="noopener noreferrer"
          >
            note.com
          </a>
          でも記事を公開しています。
        </p>

        <h2>主な取り扱いテーマ</h2>
        <ul>
          <li>Blueberry Funded のプラン解説・ルールまとめ</li>
          <li>Instant / Rapid / Prime 各プランの運用実践</li>
          <li>EA 運用（Silver Bullet、NY Kill Zone）</li>
          <li>トレード手法（SMC / ICT ベース）</li>
          <li>出金・送金ガイド</li>
        </ul>
      </div>
    </div>
  );
}

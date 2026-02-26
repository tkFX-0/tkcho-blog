interface AffiliateCardProps {
  category: string;
}

const affiliateLinks: Record<
  string,
  { title: string; description: string; url: string }[]
> = {
  "blueberry-funded": [
    {
      title: "Blueberry Funded",
      description: "最大$200Kの資金提供。Instant / Rapid / Prime プラン対応。",
      url: "https://blueberryfunded.com",
    },
  ],
  "trading-strategy": [
    {
      title: "TradingView",
      description:
        "チャート分析ツール。インジケータ作成やバックテストに最適。",
      url: "https://www.tradingview.com",
    },
  ],
  "ea-trading": [
    {
      title: "VPS for MT5",
      description:
        "EA運用に必須の低レイテンシVPS。24時間安定稼働。",
      url: "#",
    },
  ],
};

export function AffiliateCard({ category }: AffiliateCardProps) {
  const links = affiliateLinks[category];
  if (!links || links.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
      <p className="mb-3 text-xs font-medium text-[var(--muted-foreground)]">
        PR
      </p>
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block hover:opacity-80"
        >
          <p className="font-bold">{link.title}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {link.description}
          </p>
        </a>
      ))}
    </div>
  );
}

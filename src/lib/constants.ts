export const siteConfig = {
  name: "tk Trading Blog",
  description:
    "プロップファーム（Blueberry Funded）でのトレード戦略、EA運用、出金ガイドなど、実体験ベースのFXトレード情報を発信",
  url: "https://tkcho-blog.vercel.app",
  author: {
    name: "tk",
    noteUrl: "https://note.com/tkcho",
    twitter: "",
  },
  noteCreatorId: "tkcho",
  links: {
    note: "https://note.com/tkcho",
  },
} as const;

export const categoryLabels: Record<string, string> = {
  "blueberry-funded": "Blueberry Funded",
  "trading-strategy": "トレード手法",
  "prop-firm-ops": "プロップファーム運用",
  "payment-guide": "出金・送金ガイド",
  "trading-education": "トレード教育",
  "ea-trading": "EA運用",
} as const;

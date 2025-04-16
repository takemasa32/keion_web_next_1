import "./globals.css";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata, Viewport } from "next";

// メタデータの定義（SEO最適化）
export const metadata: Metadata = {
  title: {
    template: "%s | 大学軽音楽部",
    default: "大学軽音楽部 | 音楽を楽しもう",
  },
  description: "大学の軽音楽部の公式サイト。バンド活動、ライブ情報、入部案内など",
  keywords: ["大学", "軽音楽部", "音楽", "バンド", "ライブ", "新歓", "大学生", "部活"],
  authors: [{ name: "大学軽音楽部" }],
  creator: "大学軽音楽部",
  publisher: "大学軽音楽部",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"), // 実際のドメインに変更してください
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "大学軽音楽部",
    description: "音楽を通じて仲間と成長しよう。ライブ情報や部活動の様子をご紹介します。",
    url: "https://your-domain.com",
    siteName: "大学軽音楽部",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/image/keionBackImage.JPG",
        width: 1200,
        height: 630,
        alt: "大学軽音楽部イメージ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "大学軽音楽部",
    description: "音楽を通じて仲間と成長しよう。ライブ情報や部活動の様子をご紹介します。",
    images: ["/image/keionBackImage.JPG"],
  },
};

// ビューポート設定
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className="antialiased text-slate-900 dark:text-white">
        <div
          id="__next"
          className="flex flex-col min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800"
          style={{
            paddingTop: "",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* ページ読み込み最適化のためにMain Content Layoutは早く表示 */}
          <div className="flex-1">{children}</div>

          {/* Analytics - パフォーマンス計測 */}
          <SpeedInsights />
          {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}

          {/* iOS SafariでPWA時のバー対応 */}
          <div id="safe-area-bottom" className="h-[env(safe-area-inset-bottom)]"></div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;

import "./globals.css";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";

export const metadata = {
  title: "島根大学 軽音楽部",
  description: "島根大学軽音楽部 紹介ページ",
  name: "島根大学 軽音楽部",
  content: "viewport-fit=cover",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content={metadata.content} />
      </Head>
      <body>
        <div
          id="__next"
          className="flex flex-col min-h-screen bg-white"
          style={{
            paddingTop: "",
            // paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <SpeedInsights />
          {children}
        </div>
        <GoogleAnalytics gaId={process.env.GA_ID ?? ""} />
      </body>
    </html>
  );
};

export default RootLayout;

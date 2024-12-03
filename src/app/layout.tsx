import "./globals.css";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "島根大学 軽音楽部",
  description: "島根大学軽音楽部の紹介ページ",
  name: "島根大学 軽音楽部",
  content: " viewport-fit=cover",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        {/* ICON */}
        <link rel="icon" href="./../favicon.ico" />
        <GoogleAnalytics gaId={process.env.GA_ID ?? ""} />
      </head>
      <body>
        <div
          id="__next"
          className="flex flex-col min-h-screen bg-white"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            // paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <SpeedInsights />
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;

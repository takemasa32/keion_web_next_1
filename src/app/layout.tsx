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
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

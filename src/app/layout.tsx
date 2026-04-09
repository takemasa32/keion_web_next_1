import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shimadaikeion.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
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

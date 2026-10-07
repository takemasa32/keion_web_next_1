import "./globals.css";
import { ReactNode } from "react";
import { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shimadaikeion.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    locale: "ja_JP",
    type: "website",
    siteName: "島根大学 軽音楽部",
    images: [{ url: "/image/root/live-performance.jpg" }],
  },
  twitter: { card: "summary_large_image", images: ["/image/root/live-performance.jpg"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#17252c",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <div id="__next" className="flex flex-col min-h-screen">
          <SpeedInsights />
          {children}
        </div>
        {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
      </body>
    </html>
  );
};

export default RootLayout;

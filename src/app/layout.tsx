import "./globals.css";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <body>
        <div
          id="__next"
          className="flex flex-col min-h-screen bg-white"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
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

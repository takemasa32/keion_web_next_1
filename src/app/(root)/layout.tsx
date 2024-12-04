import { ReactNode } from "react";
import Head from "next/head";
import Header from "@/app/(root)/components/Header";
import Footer from "@/app/(root)/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "島根大学 軽音楽部",
  description: "島根大学軽音楽部 紹介ページ",
  name: "島根大学 軽音楽部",
  content: "viewport-fit=cover",
};

const SubLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content={metadata.content} />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link rel="icon" href="./../favicon.ico" />
        <GoogleAnalytics gaId={process.env.GA_ID ?? ""} />
      </Head>
      <div
        id="__next"
        className="flex flex-col min-h-screen bg-white"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          // paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <Header />
        <SpeedInsights />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default SubLayout;

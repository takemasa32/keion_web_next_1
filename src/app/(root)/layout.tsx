import { ReactNode } from "react";
import Header from "@/app/(root)/components/Header";
import Footer from "@/app/(root)/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "島根大学 軽音楽部",
  description: "島根大学軽音楽部 紹介ページ",
  icons: {
    icon: "./../favicon.ico",
  },
  other: {
    "google-fonts": "https://fonts.googleapis.com/icon?family=Material+Icons",
    "font-awesome": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css",
    "material-symbols":
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional",
  },
};

export const viewport = {
  viewport: "viewport-fit=cover",
};

const SubLayout = ({ children }: { children: ReactNode }) => {
if (window.navigator.userAgent.includes("Instagram") || window.navigator.userAgent.includes("Twitter")) {
  alert("標準ブラウザでリンクを開いてください。");
}
  return (
    <div
      id="__next"
      className="flex flex-col min-h-screen bg-white"
      style={
        {
          // paddingTop: "env(safe-area-inset-top)",
          // paddingBottom: "env(safe-area-inset-bottom)",
        }
      }
    >
      <Header />
      <SpeedInsights />
      {children}
      <Footer />
    </div>
  );
};

export default SubLayout;

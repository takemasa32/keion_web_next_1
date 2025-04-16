import React, { ReactNode } from "react";
import { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
// FloatingNavのインポートを削除

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
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#4f46e5",
};

const SubLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-20">{children}</main>
      <Footer />
      {/* FloatingNavコンポーネントを削除 */}
    </div>
  );
};

export default SubLayout;

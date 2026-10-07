import { ReactNode } from "react";
import { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
export const metadata: Metadata = {
  title: "島根大学 軽音楽部",
  description:
    "島根大学軽音楽部の活動、ライブ・イベント情報、見学・入部のご案内。初心者も経験者も歓迎しています。",
};
export default function SubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a className="skip-link" href="#main-content">
        本文へ移動
      </a>
      <Header />
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

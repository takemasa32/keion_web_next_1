import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "🎵 | 島根大学軽音楽部",
  description: "特別なコンテンツページ",
};

export default function SecretLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-black">{children}</div>;
}

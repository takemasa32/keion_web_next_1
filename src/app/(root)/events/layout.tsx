import type { Metadata } from "next";
import type { ReactNode } from "react";
export const metadata: Metadata = {
  title: "イベント情報 | 島根大学 軽音楽部",
  description: "島根大学軽音楽部のライブ、定期演奏会、大学祭、部Tの情報と活動の記録。",
};
export default function EventsLayout({ children }: { children: ReactNode }) {
  return children;
}

import { Metadata } from "next";
import SNSClient from "./SNSClient";
import { faqItems } from "@/app/data/site";
export const metadata: Metadata = {
  title: "見学・お問い合わせ | 島根大学 軽音楽部",
  description: "島根大学軽音楽部の見学・入部の相談と、公式X・Instagramのご案内。",
  alternates: { canonical: "/sns" },
};
export default function SNSPage() {
  return <SNSClient faqItems={faqItems} />;
}

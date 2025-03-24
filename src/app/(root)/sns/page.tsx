import { Metadata } from "next";
import SNSClient from "./SNSClient";

// メタデータの設定
export const metadata: Metadata = {
  title: "お問い合わせ - 島根大学 軽音楽部",
  description:
    "島根大学軽音楽部へのお問い合わせ、入部に関する質問、SNS情報をご紹介します。公式LINE、Twitter、Instagramなど各種SNSからもご連絡いただけます。",
  openGraph: {
    title: "お問い合わせ・SNS - 島根大学軽音楽部",
    description:
      "島根大学軽音楽部へのお問い合わせ方法や入部に関する情報をご案内しています。お気軽にご連絡ください。",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "お問い合わせ - 島根大学軽音楽部",
    description: "島根大学軽音楽部へのお問い合わせ、SNS情報、入部方法のご案内",
    images: ["/image/ogp/sns-ogp.jpg"],
  },
  // 構造化データ用のスクリプト（検索エンジン向け）
  alternates: {
    canonical: "https://shimane-keion.vercel.app/sns",
  },
};

// FAQ項目の定義（サーバーコンポーネントで管理）
const faqItems = [
  {
    question: "部活の見学はできますか？",
    answer:
      "もちろん可能です！ぜひ気軽に部室に遊びに来てください。事前にSNSでご連絡いただくとスムーズです。",
  },
  {
    question: "楽器初心者でも入部できますか？",
    answer:
      "初心者大歓迎です！部員の半数近くが大学から楽器を始めています。仲間がたくさんいます。安心してください！もちろん練習は必要ですが、、、",
  },
  {
    question: "入部に必要なものはありますか？",
    answer:
      "特別な道具は必要ありません。入部時に部費（学期ごとに6,000円程度）をお願いしています。楽器は部のものなどを最初は使えます。",
  },
  {
    question: "演奏するジャンルは決まっていますか？",
    answer:
      "特に限定はありません！J-POP、ロック、メタル、アイドルなど様々なジャンルの音楽を楽しんでいます。",
  },
];

export default function SNSPage() {
  // FAQデータをクライアントコンポーネントに渡す
  return <SNSClient faqItems={faqItems} />;
}

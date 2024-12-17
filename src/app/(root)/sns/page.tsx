import React from "react";
import styles from "./page.module.css";
import SNSButton from "@/app/(root)/components/SNSButton";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "SNS | 島根大学軽音楽部",
  description: "お問い合わせ",
};
const SNS = () => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-black mb-8">お問い合わせ</h1>
        <SNSButton />
      </div>
    </div>
  );
};

export default SNS;

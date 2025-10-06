import React from "react";
import CustomImage from "../Components/CustomImage";
import ARTryOnSection from "../Components/ARTryOnSection";
import EventList from "../Components/EventList";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "2025年度 部T | 島根大学軽音楽部",
  description: "島根大学軽音楽部 2025年度 部Tシャツの紹介ページです。",
};

const BukatuTPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* 背景のやわらかなグラデーション */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
        <div className="absolute -top-24 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-14 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        {/* ヒーロー */}
        <section className="flex flex-col items-center gap-5 text-center sm:gap-6">
          <span className="rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
            bukatu t 2025
          </span>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            2025年度 部T完成
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            ブラックボディにロゴとエンブレムを合わせた2025年モデルが完成。
            <br />
            ライブでも日常でも映える一着です。
          </p>
        </section>

        {/* ギャラリー */}
        <section className="grid gap-8 sm:gap-10 md:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-3xl border border-white/12 bg-white/5 p-5 shadow-[0_8px_32px_rgba(20,20,40,0.35)] sm:p-7">
            <div className="overflow-hidden rounded-2xl bg-slate-900/60">
              <CustomImage
                src="/image/2025T/keionMiniLogo.JPG"
                alt="2025年 部T 左胸ロゴ"
                width={640}
                height={640}
                className="w-full rounded-2xl object-contain"
                priority
              />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl font-semibold sm:text-2xl">左胸ロゴ</h2>
              <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                K-ONとSHIMANE UNIVERSITIES
                2025の文字をホワイトでまとめ、胸元にワンポイントで配置しています。
              </p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">front logo</p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-3xl border border-white/12 bg-white/5 p-5 shadow-[0_8px_32px_rgba(20,20,40,0.35)] sm:p-7">
            <div className="overflow-hidden rounded-2xl bg-slate-900/60">
              <CustomImage
                src="/image/2025T/keionBackImage.JPG"
                alt="2025年 部T 背面デザイン"
                width={640}
                height={640}
                className="w-full rounded-2xl object-contain"
              />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl font-semibold sm:text-2xl">背面エンブレム</h2>
              <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                翼とクラウン、楽器のシルエットを組み合わせたエンブレムにオレンジのアクセントを加えています。
              </p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">back print</p>
            </div>
          </article>
        </section>

        <ARTryOnSection />

        {/* イベント情報 */}
        <EventList />
      </div>
    </div>
  );
};

export default BukatuTPage;

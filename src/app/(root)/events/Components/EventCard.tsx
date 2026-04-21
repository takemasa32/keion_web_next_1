"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaExternalLinkAlt, FaCalendarAlt, FaCaretDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface EventCardProps {
  event: {
    title: string;
    date: string;
    description: string;
    image?: string;
    link?: string;
    tags: string[];
  };
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAllDates, setShowAllDates] = useState(false);

  // 画像の読み込みエラー処理
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/icons/icon-512x512.png";
  };

  // カンマで区切られた日付を配列に変換
  const parseDateArray = (dateString: string): string[] => {
    if (dateString.includes(",")) {
      return dateString.split(",").map((d) => d.trim());
    }
    return [dateString];
  };

  const getExplicitYear = (dateString: string): number | null => {
    const yearMatch = dateString.match(/(\d{4})年/);
    if (yearMatch) {
      return parseInt(yearMatch[1], 10);
    }

    const isoMatch = dateString.match(/(\d{4})-\d{1,2}-\d{1,2}/);
    if (isoMatch) {
      return parseInt(isoMatch[1], 10);
    }

    return null;
  };

  const formatWithLocale = (date: Date) =>
    date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  // 日付の解析と整形
  const formatDate = (dateString: string) => {
    // カンマで区切られた複数の日付をチェック
    if (dateString.includes(",")) {
      const dates = dateString.split(",").map((d) => d.trim());
      let inferredYear = getExplicitYear(dates[0]);

      const formattedDates = dates.map((date) => {
        const explicitYear = getExplicitYear(date);
        if (explicitYear) {
          inferredYear = explicitYear;
        }
        return formatSingleDate(date, inferredYear ?? undefined);
      });

      // 3日以上の場合の表示
      if (dates.length > 2) {
        return `${formattedDates[0]} 〜 ${formattedDates[formattedDates.length - 1]} (${dates.length}日間)`;
      }

      // 2日の場合
      return `${formattedDates[0]}, ${formattedDates[1]}`;
    }

    // ハイフンで区切られた日付範囲をチェック
    if (dateString.includes("-")) {
      const [startDateStr, endDateStr] = dateString.split("-").map((d) => d.trim());
      const startYear = getExplicitYear(startDateStr) ?? undefined;

      // 同じ年月の場合は、終了日は日付のみ表示
      if (endDateStr.indexOf("年") === -1) {
        return `${formatSingleDate(startDateStr, startYear)} 〜 ${formatSingleDate(
          endDateStr,
          startYear
        )}`;
      }

      return `${formatSingleDate(startDateStr, startYear)} 〜 ${formatSingleDate(endDateStr)}`;
    }

    // 単一日付の場合
    return formatSingleDate(dateString);
  };

  // 単一の日付をフォーマットする補助関数
  const formatSingleDate = (dateString: string, fallbackYear?: number) => {
    try {
      // 「2024年12月21日」形式の日付を解析
      const matches = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (matches) {
        const [_, year, month, day] = matches;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return formatWithLocale(date);
      }

      // 「○月○日」形式の場合は文脈上の年を補完
      const shortMatches = dateString.match(/(\d{1,2})月(\d{1,2})日/);
      if (shortMatches) {
        const [_, month, day] = shortMatches;
        const year = fallbackYear ?? new Date().getFullYear();
        const date = new Date(year, parseInt(month) - 1, parseInt(day));
        return formatWithLocale(date);
      }

      // 標準的な日付形式の場合
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return formatWithLocale(date);
      }

      // どの形式にも合わない場合は元の文字列を返す
      return dateString;
    } catch {
      return dateString;
    }
  };

  // 複数日程かどうかを確認
  const hasMultipleDates = event.date.includes(",") && parseDateArray(event.date).length > 2;
  const expandedDates = parseDateArray(event.date).map((date, idx, dates) => {
    const fallbackYear = dates
      .slice(0, idx + 1)
      .map((value) => getExplicitYear(value))
      .filter((value): value is number => value !== null)
      .at(-1);

    return formatSingleDate(date, fallbackYear);
  });

  // リンクがあるかどうかのフラグ
  const hasLink = Boolean(event.link);

  // カードアニメーション
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * 0.035, 0.22),
      },
    },
  };

  // タグの色を一貫した控えめなパレットにする
  const tagColors = [
    "border-slate-200 bg-slate-50 text-slate-600",
    "border-indigo-100 bg-indigo-50 text-indigo-700",
    "border-emerald-100 bg-emerald-50 text-emerald-700",
    "border-sky-100 bg-sky-50 text-sky-700",
    "border-amber-100 bg-amber-50 text-amber-700",
  ];

  // タグごとに一貫した色を生成するためのハッシュ関数
  const getTagColorIndex = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % tagColors.length;
  };

  const cardContent = (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-[border-color,box-shadow,transform] duration-300
        ${
          hasLink
            ? "cursor-pointer border border-slate-200 hover:border-indigo-200 hover:shadow-md"
            : "border border-slate-200"
        }`}
      whileHover={hasLink ? { y: -3 } : undefined}
      whileTap={hasLink ? { scale: 0.995 } : undefined}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 sm:aspect-[16/10]">
        {/* リンク付きイベントの場合、左上にインジケータを表示 */}
        {hasLink && (
          <div className="absolute left-3 top-3 z-20 rounded-md bg-slate-950/88 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            詳細あり
          </div>
        )}

        {/* 複数日程のイベントにはバッジ表示 */}
        {hasMultipleDates && !hasLink && (
          <div className="absolute left-3 top-3 z-20 rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-800 backdrop-blur">
            複数日程
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin"></div>
          </div>
        )}
        <Image
          src={event.image || "/icons/icon-512x512.png"}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`h-full w-full object-cover transition-all duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={() => setIsLoading(false)}
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* 日付表示 - 複数日程対応 */}
        <div className="mb-2">
          <div className="flex items-center text-sm text-slate-600">
            <FaCalendarAlt className="mr-2 flex-shrink-0 text-indigo-600" />
            <time className="line-clamp-3 leading-snug">
              {formatDate(event.date)}
            </time>

            {/* 複数日程の場合は展開ボタン表示 */}
            {hasMultipleDates && (
              <button
                onClick={(e) => {
                  e.preventDefault(); // リンクの遷移を防止
                  setShowAllDates(!showAllDates);
                }}
                className="ml-2 rounded-md p-1 text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-800"
                aria-label={showAllDates ? "日程を折りたたむ" : "すべての日程を表示"}
              >
                <FaCaretDown
                  className={`transition-transform duration-300 ${
                    showAllDates ? "transform rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* 全日程の展開表示 */}
          <AnimatePresence>
            {showAllDates && hasMultipleDates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-6 mt-2 overflow-hidden"
              >
                <ul className="space-y-1 text-sm text-slate-600">
                  {expandedDates.map((date, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="mr-2 inline-block h-1 w-1 rounded-full bg-indigo-400"></span>
                      {date}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <h2
          className={`mb-2 text-base font-semibold leading-snug line-clamp-2 sm:text-lg ${
            hasLink ? "text-slate-950 group-hover:text-indigo-700" : "text-slate-900"
          }`}
        >
          {event.title}
        </h2>
        <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-slate-600 sm:line-clamp-3 sm:text-base sm:leading-relaxed">
          {event.description}
        </p>

        {/* タグ表示 */}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {event.tags.map((tag, i) => (
              <span
                key={i}
                className={`rounded-md border px-2 py-1 text-xs font-medium ${
                  tagColors[getTagColorIndex(tag)]
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* リンクがある場合はボタンを表示 */}
        {hasLink && (
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-end text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-700">
              詳細を見る
              <FaExternalLinkAlt className="ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* リンクがある場合はホバー時に表示されるオーバーレイ */}
      {hasLink && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </motion.div>
  );

  // アクセシビリティ向上のためaria属性を追加
  if (hasLink) {
    return (
      <Link
        href={event.link || "#"}
        className="block h-full group"
        aria-label={`${event.title}の詳細ページを開く`}
      >
        {cardContent}
      </Link>
    );
  }

  return <div className="h-full">{cardContent}</div>;
};

export default EventCard;

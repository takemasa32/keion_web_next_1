"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaExternalLinkAlt, FaCalendarAlt, FaCaretDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // 画像の読み込みエラー処理
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/image/keionMiniLogo.JPG";
  };

  // カンマで区切られた日付を配列に変換
  const parseDateArray = (dateString: string): string[] => {
    if (dateString.includes(",")) {
      return dateString.split(",").map((d) => d.trim());
    }
    return [dateString];
  };

  // 日付の解析と整形
  const formatDate = (dateString: string) => {
    // カンマで区切られた複数の日付をチェック
    if (dateString.includes(",")) {
      const dates = dateString.split(",").map((d) => d.trim());

      // 3日以上の場合の表示
      if (dates.length > 2) {
        // 省略表示用
        const firstDate = formatSingleDate(dates[0]);
        const lastDate = formatSingleDate(dates[dates.length - 1]);
        return `${firstDate} 〜 ${lastDate} (${dates.length}日間)`;
      }

      // 2日の場合
      const firstDate = formatSingleDate(dates[0]);
      const lastDate = formatSingleDate(dates[1]);
      return `${firstDate}, ${lastDate}`;
    }

    // ハイフンで区切られた日付範囲をチェック
    if (dateString.includes("-")) {
      const [startDateStr, endDateStr] = dateString.split("-").map((d) => d.trim());

      // 同じ年月の場合は、終了日は日付のみ表示
      if (endDateStr.indexOf("年") === -1) {
        return `${formatSingleDate(startDateStr)} 〜 ${endDateStr}`;
      }

      return `${formatSingleDate(startDateStr)} 〜 ${formatSingleDate(endDateStr)}`;
    }

    // 単一日付の場合
    return formatSingleDate(dateString);
  };

  // 単一の日付をフォーマットする補助関数
  const formatSingleDate = (dateString: string) => {
    try {
      // 「2024年12月21日」形式の日付を解析
      const matches = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (matches) {
        const [_, year, month, day] = matches;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        // 曜日も含めてフォーマット
        return date.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
        });
      }

      // 「○月○日」形式の場合は現在の年を補完
      const shortMatches = dateString.match(/(\d{1,2})月(\d{1,2})日/);
      if (shortMatches) {
        const [_, month, day] = shortMatches;
        const year = new Date().getFullYear();
        const date = new Date(year, parseInt(month) - 1, parseInt(day));

        return date.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
        });
      }

      // 標準的な日付形式の場合
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
        });
      }

      // どの形式にも合わない場合は元の文字列を返す
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  // 複数日程かどうかを確認
  const hasMultipleDates = event.date.includes(",") && parseDateArray(event.date).length > 2;

  // リンクがあるかどうかのフラグ
  const hasLink = Boolean(event.link);

  // カードアニメーション
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // カードごとに時間差表示
      },
    },
  };

  // タグの色をランダムに設定する（一貫性を保つために固定の色パレットを使用）
  const tagColors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-yellow-100 text-yellow-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
    "bg-red-100 text-red-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
    "bg-gray-100 text-gray-700",
    "bg-cyan-100 text-cyan-700",
    "bg-lime-100 text-lime-700",
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
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden h-full transform transition-all duration-300
        ${
          hasLink
            ? "cursor-pointer hover:shadow-xl hover:border-indigo-300 border-2 border-transparent"
            : "border border-gray-100"
        }`}
      whileHover={hasLink ? { scale: 1.02, y: -5 } : { scale: 1 }}
      whileTap={hasLink ? { scale: 0.98 } : { scale: 1 }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {/* リンク付きイベントの場合、左上にインジケータを表示 */}
        {hasLink && (
          <div className="absolute top-0 left-0 m-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-medium z-10 shadow-md">
            詳細あり
          </div>
        )}

        {/* 複数日程のイベントにはバッジ表示 */}
        {hasMultipleDates && !hasLink && (
          <div className="absolute top-0 left-0 m-2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium z-10 shadow-md">
            複数日程
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={event.image || "/image/keionMiniLogo.JPG"}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>

      <div className="p-5">
        {/* 日付表示 - 複数日程対応 */}
        <div className="mb-2">
          <div className="flex items-center text-gray-700 text-sm">
            <FaCalendarAlt className="mr-2 flex-shrink-0 text-indigo-600" />
            <time dateTime={event.date} className="line-clamp-2">
              {formatDate(event.date)}
            </time>

            {/* 複数日程の場合は展開ボタン表示 */}
            {hasMultipleDates && (
              <button
                onClick={(e) => {
                  e.preventDefault(); // リンクの遷移を防止
                  setShowAllDates(!showAllDates);
                }}
                className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
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
                className="overflow-hidden mt-2 ml-6"
              >
                <ul className="text-sm text-gray-600 space-y-1">
                  {parseDateArray(event.date).map((date, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"></span>
                      {formatSingleDate(date)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <h2
          className={`text-xl font-bold mb-2 line-clamp-2 ${
            hasLink ? "text-indigo-800 group-hover:text-indigo-600" : "text-gray-800"
          }`}
        >
          {event.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

        {/* タグ表示 */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.map((tag, i) => (
              <span
                key={i}
                className={`text-xs font-medium px-2 py-1 rounded-full ${
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
            <div className="flex items-center justify-end text-indigo-600 font-medium text-sm">
              詳細を見る
              <FaExternalLinkAlt className="ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* リンクがある場合はホバー時に表示されるオーバーレイ */}
      {hasLink && (
        <motion.div
          className="absolute inset-0 bg-indigo-600 bg-opacity-0 flex items-center justify-center transition-all duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <span className="flex items-center text-indigo-700 font-medium">
              詳細ページへ
              <FaExternalLinkAlt className="ml-2" />
            </span>
          </div>
        </motion.div>
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

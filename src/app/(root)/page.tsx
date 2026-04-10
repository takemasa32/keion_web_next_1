"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SNSButton from "./components/SNSButton";
import FAQItem from "./components/FAQItems";
import TopLoading from "./components/TopLoading";
import InfoBlock from "./components/InfoBlock";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import ParallaxSection from "./components/ParallaxSection";
import FadeInSection from "./components/FadeInSection";
import { useAnimations } from "./hooks/useAnimations";
import { useSecretFeature } from "./toSecrets/useSecretFeature";
import SecretEffectWrapper from "./toSecrets/SecretEffectWrapper";
import Image from "next/image";
import { events as eventData, type Event as KeionEvent } from "@/app/data/events";

import {
  FaGuitar,
  FaMoneyBillWave,
  FaUsers,
  FaMusic,
  FaTools,
  FaCalendarAlt,
  FaSmile,
} from "react-icons/fa";
import { MdOutlineSchool, MdOutlineContactSupport, MdOutlineThumbUp } from "react-icons/md";
import ActivityCard from "./events/Components/ActivityCard";

const POPUP_AUTO_OPEN_DELAY_MS = 3000;
const POPUP_AUTO_OPEN_COOLDOWN_MS = 1000 * 60 * 10;
const POPUP_DISPLAY_WINDOW_DAYS = 30;
const POPUP_SCROLL_THRESHOLD_PX = 160;

const formatPopupDate = (date: Date): string =>
  new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);

const buildPopupStorageKey = (event: KeionEvent): string =>
  `home-popup:${event.title}:${event.date}:${event.link ?? "events"}`;

const buildPopupStorageKeys = (storageKey: string) => ({
  sessionSeenKey: `${storageKey}:session-seen`,
  dismissedAtKey: `${storageKey}:dismissed-at`,
});

const isWithinPopupWindow = (date: Date): boolean => {
  const now = new Date();
  const start = new Date(date.getTime() - 1000 * 60 * 60 * 24 * POPUP_DISPLAY_WINDOW_DAYS);
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  return now >= start && now <= end;
};

const hasSeenPopupThisVisit = (storageKey: string): boolean => {
  const { sessionSeenKey } = buildPopupStorageKeys(storageKey);
  return sessionStorage.getItem(sessionSeenKey) === "true";
};

const isPopupCoolingDown = (storageKey: string): boolean => {
  const { dismissedAtKey } = buildPopupStorageKeys(storageKey);
  const dismissedAt = Number(localStorage.getItem(dismissedAtKey) ?? "0");
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < POPUP_AUTO_OPEN_COOLDOWN_MS;
};

const markPopupSeenThisVisit = (storageKey: string): void => {
  const { sessionSeenKey } = buildPopupStorageKeys(storageKey);
  sessionStorage.setItem(sessionSeenKey, "true");
};

const markPopupDismissed = (storageKey: string): void => {
  const { dismissedAtKey } = buildPopupStorageKeys(storageKey);
  localStorage.setItem(dismissedAtKey, Date.now().toString());
};

// ポップアップモーダルコンポーネント
const PopupModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  contentLabel,
  event,
  eventDate,
  daysUntilDate,
  cancelText,
  confirmText,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  contentLabel: string;
  event: KeionEvent;
  eventDate: Date;
  daysUntilDate: number;
  cancelText?: string;
  confirmText?: string;
}) => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      Modal.setAppElement(document.body);
    }
  }, []);

  const statusLabel =
    daysUntilDate === 0
      ? "本日開催"
      : daysUntilDate === 1
        ? "明日開催"
        : `開催まであと${daysUntilDate}日`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className="relative z-[10001] mx-auto flex w-full max-w-lg items-end focus:outline-none md:items-center"
      overlayClassName="fixed inset-0 z-[10000] flex items-end justify-center bg-[#020817]/72 p-3 backdrop-blur-sm md:items-center md:p-6"
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f] text-white shadow-[0_28px_90px_rgba(2,6,23,0.58)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.1),transparent_30%)]" />
        <button
          onClick={onRequestClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-lg text-white/72 transition hover:bg-white/10 hover:text-white"
          aria-label="ポップアップを閉じる"
        >
          ×
        </button>

        <div className="relative p-6 sm:p-8">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-sky-200/72">Next Event</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {event.title}
          </h2>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/78">
            <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2">
              {formatPopupDate(eventDate)}
            </span>
            <span className="text-white/60">{statusLabel}</span>
          </div>
          <p className="mt-5 text-sm leading-7 text-white/68">
            直近のイベントです。詳細ページから日程を確認できます。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRequestClose}
              className="rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-medium text-white/86 transition hover:bg-white/10"
            >
              {cancelText ?? "閉じる"}
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-slate-100"
            >
              {confirmText ?? "詳細を見る"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

// 特定の日付までの日数を計算する関数
const calculateDaysUntil = (targetDate: Date): number => {
  const currentDate = new Date();
  const midnightTarget = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );
  const midnightCurrent = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const timeDifference = midnightTarget.getTime() - midnightCurrent.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return Math.max(0, daysDifference);
};

const extractCandidateDates = (dateText: string): Date[] => {
  const now = new Date();
  const rawTokens = dateText
    .replace(/\s+/g, "")
    .split(/[、,〜～]/)
    .flatMap((token) => token.split("-"))
    .filter(Boolean);

  let lastKnownYear: number | null = null;
  const candidates: Date[] = [];

  rawTokens.forEach((token) => {
    const fullMatch = token.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (fullMatch) {
      const year = parseInt(fullMatch[1], 10);
      const month = parseInt(fullMatch[2], 10) - 1;
      const day = parseInt(fullMatch[3], 10);
      lastKnownYear = year;
      candidates.push(new Date(year, month, day));
      return;
    }

    const monthDayMatch = token.match(/(\d{1,2})月(\d{1,2})日/);
    if (monthDayMatch) {
      const month = parseInt(monthDayMatch[1], 10) - 1;
      const day = parseInt(monthDayMatch[2], 10);
      const baseYear = lastKnownYear ?? now.getFullYear();
      let candidate = new Date(baseYear, month, day);
      if (!lastKnownYear && candidate < now) {
        candidate = new Date(baseYear + 1, month, day);
      }
      candidates.push(candidate);
      return;
    }

    const yearMonthMatch = token.match(/(\d{4})年(\d{1,2})月/);
    if (yearMonthMatch) {
      const year = parseInt(yearMonthMatch[1], 10);
      const month = parseInt(yearMonthMatch[2], 10) - 1;
      lastKnownYear = year;
      candidates.push(new Date(year, month, 1));
      return;
    }

    const isoMatch = token.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      lastKnownYear = year;
      candidates.push(new Date(year, month, day));
    }
  });

  return candidates;
};

const findUpcomingEvent = (): { event: KeionEvent; date: Date } | null => {
  const now = new Date();
  let nextEvent: { event: KeionEvent; date: Date } | null = null;

  eventData.forEach((eventItem) => {
    const candidateDates = extractCandidateDates(eventItem.date);
    const futureDates = candidateDates.filter((date) => date >= now);
    if (futureDates.length === 0) return;

    futureDates.sort((a, b) => a.getTime() - b.getTime());
    const earliest = futureDates[0];

    if (!nextEvent || earliest < nextEvent.date) {
      nextEvent = { event: eventItem, date: earliest };
    }
  });

  return nextEvent;
};

const Home = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasScrolledForPopup, setHasScrolledForPopup] = useState(false);
  const initialLoadingText = "ようこそ軽音楽部へ";
  const loadingTime = 2000; // ローディング時間を設定
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const eventListLink = "/events";
  const navigateToEventListPage = () => {
    router.push(eventListLink);
  };

  // スムーズスクロールとアニメーション効果を初期化
  useAnimations();

  const upcomingEvent = useMemo<{ event: KeionEvent; date: Date } | null>(findUpcomingEvent, []);
  const popupStorageKey = useMemo(
    () => (upcomingEvent ? buildPopupStorageKey(upcomingEvent.event) : null),
    [upcomingEvent]
  );

  // シークレット機能のカスタムフックを使用
  const secret = useSecretFeature({
    keyNumber: 7,
    redirectPath: "/secret",
  });

  useEffect(() => {
    const updateScrollState = () => {
      if (window.scrollY >= POPUP_SCROLL_THRESHOLD_PX) {
        setHasScrolledForPopup(true);
      }
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    if (
      !upcomingEvent ||
      !popupStorageKey ||
      !isWithinPopupWindow(upcomingEvent.date) ||
      !hasScrolledForPopup
    ) {
      setIsModalOpen(false);
      return;
    }

    if (hasSeenPopupThisVisit(popupStorageKey) || isPopupCoolingDown(popupStorageKey)) {
      setIsModalOpen(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsModalOpen(true);
      markPopupSeenThisVisit(popupStorageKey);
    }, POPUP_AUTO_OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [hasScrolledForPopup, popupStorageKey, upcomingEvent]);

  const closeModal = () => {
    if (popupStorageKey) {
      markPopupDismissed(popupStorageKey);
    }
    setIsModalOpen(false);
  };

  const eventLink = upcomingEvent?.event?.link ?? "/events";
  const navigateToEventPage = () => {
    if (popupStorageKey) {
      markPopupDismissed(popupStorageKey);
    }
    router.push(eventLink);
  };

  const eventDate = upcomingEvent?.date ?? null;
  const daysUntilDate = eventDate ? calculateDaysUntil(eventDate) : null;
  const modalShouldRender = Boolean(upcomingEvent && eventDate);
  const heroHighlights = ["初心者歓迎", "部室で練習可"];
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <SecretEffectWrapper secretClassName={secret.getSecretClassNames()}>
      {/* ポップアップモーダル */}
      {modalShouldRender && eventDate && upcomingEvent && (
        <PopupModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onConfirm={navigateToEventPage}
          contentLabel="最新イベントのお知らせ"
          event={upcomingEvent.event}
          eventDate={eventDate}
          daysUntilDate={daysUntilDate ?? 0}
          cancelText="閉じる"
          confirmText="詳細を見る"
        />
      )}

      {/* ローディング画面 - シークレット機能のトリガー1つ目 */}
      <div
        onClick={secret.incrementFirstCounter}
        className={`${secret.firstStageCompleted ? "pulse-effect" : ""}`}
      >
        <TopLoading
          time={loadingTime}
          text={secret.firstStageCompleted ? "" : initialLoadingText}
        />
      </div>

      {/* 新しいヒーローセクション */}
      <motion.section
        ref={heroRef}
        className="relative -mt-24 md:-mt-28 flex min-h-[100svh] items-end overflow-hidden bg-[#07111f] text-white"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 right-0 w-full md:w-[62%]">
            <Image
              src="/image/root/live-performance.jpg"
              alt="ライブで演奏する島根大学軽音楽部の部員"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[30%_center]"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(244,114,182,0.18),transparent_26%),radial-gradient(circle_at_84%_18%,rgba(56,189,248,0.14),transparent_24%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/92 via-40% to-[#07111f]/25 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-transparent to-[#07111f]/28" />
          <motion.div
            className="absolute left-[10%] top-[18%] h-24 w-24 rounded-full border border-white/10"
            animate={{ y: [0, 10, 0], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[8%] h-40 w-40 rounded-full border border-white/10"
            animate={{ y: [0, -12, 0], opacity: [0.18, 0.32, 0.18] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-x-6 bottom-8 hidden border-t border-white/15 md:block lg:inset-x-14" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-screen-2xl items-end px-6 pb-14 pt-36 md:px-10 md:pb-16 lg:px-14 lg:pt-40">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,38rem)_1fr] lg:items-end">
            <div className="max-w-2xl">
              <motion.p
                className="mb-5 text-[0.7rem] font-medium uppercase tracking-[0.35em] text-white/60"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
              >
                Shimane University Keion Club
              </motion.p>

              <motion.h1
                className="max-w-[12ch] text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                音楽と
                <br />
                大学生活。
              </motion.h1>
              <motion.p
                className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.82, duration: 0.8 }}
              >
                せっかくの大学生活、楽しみを増やしませんか？
                <br className="hidden sm:block" />
                部室で音を合わせ、学内ライブや大学祭、
                <br className="hidden sm:block" />
                年末の定期演奏会へつながっていく。それが軽音部です。
                <br className="hidden lg:block" />
                初心者も経験者も、それぞれのペースで続けられます。
              </motion.p>
              <motion.ul
                className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/84"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {heroHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    {highlight}
                  </li>
                ))}
              </motion.ul>
              <motion.div
                className="mt-10 flex flex-col gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.8 }}
              >
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#07111f] shadow-[0_16px_40px_rgba(7,17,31,0.3)]"
                  onClick={scrollToFeatures}
                >
                  部活について知る
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-full border border-white/22 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm"
                  onClick={navigateToEventListPage}
                >
                  活動を見る
                </motion.button>
              </motion.div>
              <motion.div
                className="mt-10 max-w-xl border-t border-white/18 pt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/50">
                  {upcomingEvent ? "Next Open Event" : "Club Activity"}
                </p>
                {upcomingEvent ? (
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xl font-semibold text-white">
                        {upcomingEvent.event.title}
                      </p>
                      <p className="mt-1 text-sm text-white/68">
                        {upcomingEvent.event.date}
                        {daysUntilDate !== null && ` / 開催まであと${daysUntilDate}日`}
                      </p>
                    </div>
                    <button
                      onClick={navigateToEventPage}
                      className="w-fit text-sm font-medium text-white/88 underline decoration-white/30 underline-offset-4 transition hover:text-white"
                    >
                      詳細を見る
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    年間を通して部内ライブ、大学祭、定期演奏会などのイベントを開催しています。
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div
              className="hidden self-end justify-self-end lg:block"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <div className="max-w-[18rem] border-t border-white/18 pt-4 text-right">
                <p className="text-[0.68rem] uppercase tracking-[0.35em] text-white/50">
                  Clubroom To Stage
                </p>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  普段の練習から本番のステージまで、同じ場所で積み上げた音がつながっていきます。
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-5 left-6 hidden items-center gap-3 text-xs uppercase tracking-[0.28em] text-white/44 md:flex lg:left-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.55, duration: 0.8 }}
          >
            <span className="h-px w-10 bg-white/30" />
            Scroll
          </motion.div>
        </div>
      </motion.section>

      {/* 特徴紹介セクション - シークレット機能のトリガー2つ目 */}
      <div
        onClick={secret.incrementSecondCounter}
        id="features"
        className={`${
          secret.firstStageCompleted && !secret.secondStageCompleted ? "cursor-pointer" : ""
        }`}
      >
        <section className="apple-section bg-indigo-50 py-24">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="mb-10 md:mb-16 text-center">
              <FadeInSection>
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                  島根大学
                  <br />
                  軽音楽部の特徴
                </h2>
              </FadeInSection>
              <FadeInSection delay={0.2}>
                <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
                  私達はこんな団体です！
                </p>
              </FadeInSection>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:gap-12 xl:grid-cols-4 stagger-fade">
              <div className="flex flex-col h-full rounded-lg border bg-white shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="bg-indigo-500 text-white p-6 flex items-center justify-center">
                  <MdOutlineSchool className="text-4xl" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-gray-800 text-xl font-semibold">初心者歓迎</h3>
                  <p className="text-gray-600">
                    実際部員の中でもほぼ半数が初心者です。実際のバンド活動を通じて一緒に成長していきましょう！
                  </p>
                </div>
              </div>

              <div className="flex flex-col h-full rounded-lg border bg-white shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="bg-indigo-500 text-white p-6 flex items-center justify-center">
                  <FaTools className="text-4xl" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-gray-800 text-xl font-semibold">設備が充実</h3>
                  <p className="text-gray-600">
                    大学内にアンプやドラムセットなど練習できる環境が揃っています。わざわざ外部のスタジオを借りなくても練習が可能です！
                  </p>
                </div>
              </div>

              <div className="flex flex-col h-full rounded-lg border bg-white shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="bg-indigo-500 text-white p-6 flex items-center justify-center">
                  <FaUsers className="text-4xl" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-gray-800 text-xl font-semibold">部員が多い</h3>
                  <p className="text-gray-600">
                    &quot;実際に活動をしている&quot;部員数がとても多い部活です。各学部内外大学内で友達を作るならもってこいです！！
                  </p>
                </div>
              </div>

              <div className="flex flex-col h-full rounded-lg border bg-white shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="bg-indigo-500 text-white p-6 flex items-center justify-center">
                  <FaMusic className="text-4xl" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-gray-800 text-xl font-semibold">様々なジャンル</h3>
                  <p className="text-gray-600">
                    部員数が多いため、様々なジャンルの音楽に触れることができます。自分の知らないアーティストを見つける機会がたくさんあります。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 画像ギャラリーセクション */}
        <section className="apple-section bg-white py-24">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <FadeInSection>
              <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
                活動の様子
              </h2>
              <p className="mx-auto max-w-3xl text-center text-gray-600 mb-12">
                島根大学軽音楽部では、練習からライブまで様々な活動を行っています。
                先輩後輩の垣根を越えて、音楽を通じた絆を深めています。
              </p>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-up">
              {/* バンド練習カード */}
              <ActivityCard
                imageUrl="/image/root/band-practice.jpg"
                imageAlt="バンドメンバーが練習室で演奏している様子"
                title="日々の練習"
                description="大学内の部室で日々練習に励んでいます。部内では様々な話題も飛び交います。"
                hoverText="部内バンドの練習風景。初心者も経験者も一緒に音を重ねます。"
                delay={0}
              />

              {/* ライブパフォーマンスカード */}
              <ActivityCard
                imageUrl="/image/root/live-performance.jpg"
                imageAlt="部員がステージでライブ演奏をしている様子"
                title="ライブ演奏"
                description="学内外の様々なイベントで演奏する機会があります。人前での演奏経験を積むことができます。"
                hoverText="実際のステージでの熱いパフォーマンスは一生の思い出になります。"
                delay={0.2}
              />

              {/* 定期演奏会カード */}
              <ActivityCard
                imageUrl="/image/root/concert.jpg"
                imageAlt="定期演奏会での集合写真"
                title="定期演奏会"
                description="毎年12月に開催される最大のイベント。多くの観客の前で日頃の練習の成果を披露します。"
                hoverText="部員全員で作り上げる年に一度の大イベントです。"
                delay={0.4}
              />
            </div>

            {/* 写真ギャラリーリンクボタン */}
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={navigateToEventListPage}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <span>もっと活動を見る</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </section>

        {/* よくある質問セクション */}
        <section className="apple-section bg-indigo-50 py-24">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="mb-10 md:mb-16">
              <FadeInSection>
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                  よくある質問
                </h2>
              </FadeInSection>
              <FadeInSection delay={0.2}>
                <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
                  気になる疑問点について回答します！
                </p>
              </FadeInSection>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 sm:gap-y-10 xl:grid-cols-3">
              <FadeInSection delay={0.1} className="h-full">
                <div className="relative rounded-lg bg-white p-5 pt-8 shadow-md h-full">
                  <FAQItem
                    question="部費はありますか？"
                    answer="半年で6000円の部費を徴収しています.<br/>その中からイベントの運営や機材の購入に充てています．"
                    additional="※部Tの代金など,別途費用がかかることもあります．"
                    icon={<FaMoneyBillWave />}
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={0.2} className="h-full">
                <div className="relative rounded-lg bg-white p-5 pt-8 shadow-md h-full">
                  <FAQItem
                    question="イベントはどんなものがありますか？"
                    answer="新歓ライブや学際でのライブ、定期演奏会など,年間を通して様々なイベントがあります．詳細はSNSなどをご覧ください．"
                    icon={<FaCalendarAlt />}
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={0.3} className="h-full">
                <div className="relative rounded-lg bg-white p-5 pt-8 shadow-md h-full">
                  <FAQItem
                    question="初心者でも大丈夫ですか？"
                    answer="もちろんです！例年ほぼ半数が入部時は初心者です．<br/>初心者の方も大歓迎ですので、一緒に成長していきましょう！"
                    icon={<FaSmile />}
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={0.4} className="h-full">
                <div className="relative rounded-lg bg-white p-5 pt-8 shadow-md h-full">
                  <FAQItem
                    question="楽器は自分で買わないといけない？"
                    answer="パートにもよりますが、家での練習のためにも、購入することをおすすめします。<br/>入部後に部や先輩から借りて体験などすることも可能ですので、気軽にご相談ください！"
                    icon={<FaGuitar />}
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={0.5} className="h-full">
                <div className="relative rounded-lg bg-white p-5 pt-8 shadow-md h-full">
                  <FAQItem
                    question="続けられるか不安です..."
                    answer="物は試し、楽器の演奏は生活を豊かにする一生の趣味となると思います。<br/>まずは挑戦してみることをおすすめします！どの楽器も最初は大変ですが、こつこつ臆さずに練習し、ライブへの出演を続けることで誰でも上達できると信じています！"
                    icon={<MdOutlineThumbUp />}
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={0.6} className="h-full">
                <div className="relative rounded-lg bg-white p-5 pt-8 shadow-md h-full">
                  <FAQItem
                    question="わからないことがあるのですが..."
                    answer="どんな些細なことでも結構です！SNSの方までご連絡ください！"
                    icon={<MdOutlineContactSupport />}
                  />
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* コンタクトセクション */}
        <section className="bg-white py-16">
          <div className="m-5">
            <FadeInSection>
              <h2 className="text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                次は部室で会いましょう！
              </h2>
            </FadeInSection>
            <FadeInSection delay={0.3}>
              <SNSButton />
            </FadeInSection>
          </div>
        </section>
      </div>
    </SecretEffectWrapper>
  );
};

export default Home;

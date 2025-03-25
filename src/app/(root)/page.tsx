"use client";
import React, { useState, useEffect, useRef } from "react";
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

import {
  FaGuitar,
  FaMoneyBillWave,
  FaUsers,
  FaMusic,
  FaTools,
  FaCalendarAlt,
  FaSmile,
  FaChevronDown,
} from "react-icons/fa";
import { MdOutlineSchool, MdOutlineContactSupport, MdOutlineThumbUp } from "react-icons/md";
import ActivityCard from "./events/Components/ActivityCard";

// ポップアップモーダルコンポーネント
const PopupModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  contentLabel,
  children,
  startDate,
  endDate,
  cancelText,
  confirmText,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  contentLabel: string;
  children: React.ReactNode;
  startDate: Date;
  endDate: Date;
  cancelText?: string;
  confirmText?: string;
}) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    } else {
      console.error("App element not found");
    }
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    if (currentDate >= startDate && currentDate <= endDate) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }

    // デバイスの種類を判別
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsPC(mediaQuery.matches);

    const handleResize = () => {
      setIsPC(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [startDate, endDate]);

  return (
    <Modal
      isOpen={isOpen && shouldShow}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className="fixed inset-0 flex items-center justify-center z-50 transition-transform duration-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
      closeTimeoutMS={300}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-6 rounded-lg shadow-lg max-w-md mx-auto"
      >
        {children}
        <div className="flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRequestClose}
            className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-400 transition-colors duration-200"
          >
            {cancelText ? cancelText : "キャンセル"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
          >
            {confirmText ? confirmText : "移動する"}
          </motion.button>
        </div>
      </motion.div>
    </Modal>
  );
};

// 特定の日付までの日数を計算する関数
const calculateDaysUntil = (targetDate: Date): number => {
  const currentDate = new Date();
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return daysDifference;
};

const MusicWave = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden opacity-80">
      <svg viewBox="0 0 1440 320" className="absolute bottom-0 left-0">
        <motion.path
          fill="#4F46E5"
          fillOpacity="0.3"
          initial={{
            d: "M0,160L48,186.7C96,213,192,267,288,266.7C384,267,480,213,576,186.7C672,160,768,160,864,181.3C960,203,1056,245,1152,250.7C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          }}
          animate={{
            d: [
              "M0,160L48,186.7C96,213,192,267,288,266.7C384,267,480,213,576,186.7C672,160,768,160,864,181.3C960,203,1056,245,1152,250.7C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,96L48,128C96,160,192,224,288,234.7C384,245,480,203,576,160C672,117,768,75,864,69.3C960,64,1056,96,1152,133.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,186.7C96,213,192,267,288,266.7C384,267,480,213,576,186.7C672,160,768,160,864,181.3C960,203,1056,245,1152,250.7C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          fill="#6366F1"
          fillOpacity="0.4"
          initial={{
            d: "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,218.7C672,203,768,117,864,80C960,43,1056,53,1152,74.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          }}
          animate={{
            d: [
              "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,218.7C672,203,768,117,864,80C960,43,1056,53,1152,74.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,128L48,154.7C96,181,192,235,288,218.7C384,203,480,117,576,85.3C672,53,768,75,864,106.7C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,218.7C672,203,768,117,864,80C960,43,1056,53,1152,74.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        {/* 追加の波形レイヤー */}
        <motion.path
          fill="#818CF8"
          fillOpacity="0.15"
          initial={{
            d: "M0,320L48,304C96,288,192,256,288,240C384,224,480,224,576,240C672,256,768,288,864,282.7C960,277,1056,235,1152,208C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
          }}
          animate={{
            d: [
              "M0,320L48,304C96,288,192,256,288,240C384,224,480,224,576,240C672,256,768,288,864,282.7C960,277,1056,235,1152,208C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,320L48,298.7C96,277,192,235,288,224C384,213,480,235,576,250.7C672,267,768,277,864,272C960,267,1056,245,1152,229.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,320L48,304C96,288,192,256,288,240C384,224,480,224,576,240C672,256,768,288,864,282.7C960,277,1056,235,1152,208C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </svg>
    </div>
  );
};

// 浮遊する音符コンポーネント
const FloatingNotes = () => {
  const notes = [
    { delay: 0, x: "10%", y: "20%", size: 1.2 },
    { delay: 2, x: "25%", y: "15%", size: 1 },
    { delay: 1, x: "75%", y: "25%", size: 1.5 },
    { delay: 3, x: "85%", y: "15%", size: 0.8 },
    { delay: 2.5, x: "65%", y: "60%", size: 1.3 },
    { delay: 1.5, x: "35%", y: "70%", size: 0.9 },
    { delay: 4, x: "15%", y: "40%", size: 1.1 },
    { delay: 3.5, x: "90%", y: "50%", size: 1 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {notes.map((note, index) => (
        <motion.div
          key={index}
          className="absolute text-white/70"
          initial={{ opacity: 0, x: note.x, y: -20 }}
          animate={{
            opacity: [0, 0.7, 0],
            y: ["-10%", note.y],
            rotate: [0, 10, -10, 5, 0],
            filter: [
              "drop-shadow(0px 0px 0px rgba(255,255,255,0))",
              "drop-shadow(0px 0px 5px rgba(255,255,255,0.5))",
              "drop-shadow(0px 0px 0px rgba(255,255,255,0))",
            ],
          }}
          transition={{
            duration: 15 + Math.random() * 5,
            repeat: Infinity,
            delay: note.delay,
            ease: "easeInOut",
          }}
          style={{
            left: note.x,
            fontSize: `${(24 + Math.random() * 16) * note.size}px`,
          }}
        >
          {index % 4 === 0 ? "♪" : index % 4 === 1 ? "♫" : index % 4 === 2 ? "♩" : "♬"}
        </motion.div>
      ))}
    </div>
  );
};

const Home = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialLoadingText = "ようこそ軽音楽部へ";
  const loadingTime = 2000; // ローディング時間を設定
  const heroRef = useRef<HTMLDivElement>(null);

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

  // シークレット機能のカスタムフックを使用
  const secret = useSecretFeature({
    keyNumber: 7,
    redirectPath: "/secret",
  });

  useEffect(() => {
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    }

    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, loadingTime + 1000);

    return () => clearTimeout(timer); // クリーンアップ
  }, [loadingTime]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const eventLink = "/events/2024teikiensoukai";
  const navigateToEventPage = () => {
    router.push(eventLink);
  };

  const eventDate = new Date(Date.UTC(2024, 11, 21)); // 2024/12/21
  const daysUntilDate = calculateDaysUntil(eventDate);

  return (
    <SecretEffectWrapper secretClassName={secret.getSecretClassNames()}>
      {/* ポップアップモーダル */}
      <PopupModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onConfirm={navigateToEventPage}
        contentLabel="定期演奏会のお知らせ"
        startDate={new Date(Date.UTC(2024, 10, 1))} // 2024/11/1
        endDate={eventDate}
        cancelText="閉じる"
        confirmText="特設ページへ"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotateZ: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          >
            <FaGuitar className="text-6xl h-12 w-12 my-2" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-white">お知らせ</h2>
        <p className="mb-4 text-center text-white">
          {daysUntilDate
            ? `今年の定期演奏会があと${daysUntilDate}日で開催されます！`
            : "今年も定期演奏会が開催されます！"}
          <br />
          特設ページに移動しますか？
        </p>
      </PopupModal>

      {/* ローディング画面 - シークレット機能のトリガー1つ目 */}
      <div onClick={secret.incrementFirstCounter}>
        <TopLoading
          time={loadingTime}
          text={secret.firstStageCompleted ? "" : initialLoadingText}
        />
      </div>

      {/* 新しいヒーローセクション */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900"
        style={{ opacity, scale }}
      >
        {/* 背景レイヤー - より多層的な表現 */}
        <div className="absolute inset-0 bg-[url('/image/texture-overlay.png')] opacity-10 mix-blend-overlay"></div>
        <MusicWave />
        <FloatingNotes />

        {/* 追加の装飾要素 */}
        <motion.div
          className="absolute top-[20%] left-[15%] w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[25%] right-[10%] w-40 h-40 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 中央のコンテンツ */}
        <div className="container relative z-10 mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-medium mb-6 border border-white/10">
              島根大学 軽音楽部
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <span className="block mb-2">共に音楽を</span>
            <motion.span
              className="relative inline-block"
              animate={{
                color: ["#ffffff", "#a3e635", "#ffffff"],
                textShadow: [
                  "0 0 7px rgba(255,255,255,0.3)",
                  "0 0 15px rgba(163,230,53,0.7)",
                  "0 0 7px rgba(255,255,255,0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              楽しみましょう！
            </motion.span>
          </motion.h1>

          <motion.p
            className="max-w-lg mx-auto text-xl text-indigo-100 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            初心者から経験者まで、音楽を通じて繋がるコミュニティ。
            <br />
            <span className="font-medium text-white">あなたの大学生活を彩る最高の仲間</span>
            がここにいます。
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-white to-indigo-50 text-indigo-900 font-bold rounded-full transform transition-all shadow-xl hover:shadow-2xl"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              部活について知る
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full backdrop-blur-sm transform transition-all"
              onClick={navigateToEventListPage}
            >
              活動を見る
            </motion.button>
          </motion.div>
        </div>

        {/* 装飾的な要素をより強化 */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-500/30 backdrop-blur-xl"></div>
        <div className="absolute top-16 -right-8 w-40 h-40 rounded-full bg-indigo-300/20 backdrop-blur-lg"></div>

        <motion.div
          className="absolute bottom-32 right-10 w-16 h-16"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0px 0px 0px rgba(255,255,255,0.2)",
                "0px 0px 20px rgba(255,255,255,0.6)",
                "0px 0px 0px rgba(255,255,255,0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full"
          >
            <Image
              src="/icons/icon-192x192.png"
              alt="Logo"
              width={64}
              height={64}
              className="rounded-full shadow-lg opacity-80"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 特徴紹介セクション - シークレット機能のトリガー2つ目 */}
      <div onClick={secret.incrementSecondCounter} id="features">
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
                <div className="bg-indigo-500 text-white p-6 flex items中心にしている">
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
                title="ライブパフォーマンス"
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
                <div className="relative rounded-lg bg白 p-5 pt-8 shadow-md h-full">
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

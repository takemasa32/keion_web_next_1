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

// デザインシステムのコンポーネントをインポート
import Section from "../components/ui/Section";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ThemeToggle from "../components/ThemeToggle";

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

// 3D視差効果用のコンポーネント
const Parallax3DElement = ({
  children,
  depth = 1,
  className = "",
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const lastUpdate = useRef(0);
  const positionRef = useRef({ x: 0, y: 0 });

  // 実際の位置更新をRAFにより最適化
  useEffect(() => {
    let rafId: number | undefined;

    const updatePosition = () => {
      if (
        Math.abs(positionRef.current.x - position.x) > 0.1 ||
        Math.abs(positionRef.current.y - position.y) > 0.1
      ) {
        setPosition(positionRef.current);
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);
    return () => {
      if (rafId !== undefined) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(window.innerWidth < 768);
    };

    const checkReducedMotion = () => {
      setIsReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    // Define interface for position tracking
    interface Position {
      x: number;
      y: number;
    }

    // Define interface for mouse event
    interface MouseEvent {
      clientX: number;
      clientY: number;
    }

    const handleMouseMove = (e: MouseEvent): void => {
      if (isMobile || isReduced) return; // モバイルデバイスまたは省モーション設定では無効化

      // スロットリングを適用（パフォーマンス向上）
      const now: number = Date.now();
      if (now - lastUpdate.current < 16) return; // 約60fpsに制限
      lastUpdate.current = now;

      const { clientX, clientY } = e;
      const x: number = (clientX / windowSize.width - 0.5) * depth * 20;
      const y: number = (clientY / windowSize.height - 0.5) * depth * 20;
      positionRef.current = { x, y };
    };

    // モバイル向けのジャイロセンサー対応 (最適化)
    // Define interface for device orientation event
    interface DeviceOrientationEvent {
      beta: number | null;
      gamma: number | null;
    }

    const handleDeviceOrientation = (e: DeviceOrientationEvent): void => {
      if (!isMobile || isReduced) return; // PCまたは省モーション設定では無効化

      // スロットリングを適用
      const now: number = Date.now();
      if (now - lastUpdate.current < 50) return; // モバイルは50msごとに更新（約20fps）
      lastUpdate.current = now;

      if (e.beta !== null && e.gamma !== null) {
        // 値の範囲を制限し、移動量を調整（バッテリー消費を抑制）
        const x: number = (Math.min(Math.max(e.gamma, -15), 15) / 15) * depth * 8;
        const y: number = (Math.min(Math.max(e.beta, -15), 15) / 15) * depth * 8;
        positionRef.current = { x, y };
      }
    };

    handleResize();
    checkReducedMotion();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    // 省モーション設定の変更を監視
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionQuery.addEventListener("change", checkReducedMotion);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      reducedMotionQuery.removeEventListener("change", checkReducedMotion);
    };
  }, [depth, windowSize.width, windowSize.height, isMobile, isReduced]);

  // 省モーション設定の場合や低性能デバイスでは効果を無効化
  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: `transform ${isMobile ? "0.3s" : "0.15s"} cubic-bezier(0.33, 1, 0.68, 1)`,
        willChange: "transform", // GPUアクセラレーションを活用
      }}
    >
      {children}
    </motion.div>
  );
};

// 改良された浮遊する音符コンポーネント
const FloatingNotes = () => {
  const notes = [
    { delay: 0, x: "10%", y: "20%", size: 1.2, depth: 0.5 },
    { delay: 2, x: "25%", y: "15%", size: 1, depth: 1.2 },
    { delay: 1, x: "75%", y: "25%", size: 1.5, depth: 0.8 },
    { delay: 3, x: "85%", y: "15%", size: 0.8, depth: 1.5 },
    { delay: 2.5, x: "65%", y: "60%", size: 1.3, depth: 0.7 },
    { delay: 1.5, x: "35%", y: "70%", size: 0.9, depth: 1.3 },
    { delay: 4, x: "15%", y: "40%", size: 1.1, depth: 0.9 },
    { delay: 3.5, x: "90%", y: "50%", size: 1, depth: 1 },
    { delay: 2.2, x: "45%", y: "30%", size: 1.2, depth: 1.1 },
    { delay: 3.7, x: "20%", y: "80%", size: 1.3, depth: 0.6 },
    { delay: 1.8, x: "70%", y: "10%", size: 0.7, depth: 1.4 },
    { delay: 4.2, x: "55%", y: "65%", size: 1.4, depth: 0.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {notes.map((note, index) => (
        <Parallax3DElement key={index} depth={note.depth}>
          <motion.div
            className="absolute text-white/70"
            initial={{ opacity: 0, x: note.x, y: -20 }}
            animate={{
              opacity: [0, 0.7, 0],
              y: ["-10%", note.y],
              rotate: [0, 10, -10, 5, 0],
              filter: [
                "drop-shadow(0px 0px 0px rgba(255,255,255,0))",
                "drop-shadow(0px 0px 8px rgba(255,255,255,0.8))",
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
            {index % 5 === 0
              ? "♪"
              : index % 5 === 1
              ? "♫"
              : index % 5 === 2
              ? "♩"
              : index % 5 === 3
              ? "♬"
              : "𝄞"}
          </motion.div>
        </Parallax3DElement>
      ))}
    </div>
  );
};

// 改良された音楽波コンポーネント
const MusicWave = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden opacity-80">
      <svg viewBox="0 0 1440 320" className="absolute bottom-0 left-0">
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="wave-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <motion.path
          fill="url(#wave-gradient-1)"
          filter="url(#glow)"
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
          fill="url(#wave-gradient-2)"
          filter="url(#glow)"
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
        <motion.path
          fill="url(#wave-gradient-3)"
          filter="url(#glow)"
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

// 背景球体コンポーネント
const BackgroundSpheres = () => {
  const spheres = [
    { x: "15%", y: "20%", size: 180, depth: 0.5, color: "from-indigo-600/20 to-purple-500/20" },
    { x: "85%", y: "60%", size: 240, depth: 0.8, color: "from-violet-600/20 to-indigo-500/20" },
    { x: "70%", y: "25%", size: 160, depth: 0.6, color: "from-blue-500/20 to-indigo-500/20" },
    { x: "30%", y: "65%", size: 200, depth: 0.7, color: "from-purple-500/20 to-fuchsia-500/20" },
  ];

  return (
    <>
      {spheres.map((sphere, index) => (
        <Parallax3DElement key={index} depth={sphere.depth}>
          <motion.div
            className={`absolute rounded-full bg-gradient-to-br ${sphere.color} blur-3xl`}
            style={{
              left: sphere.x,
              top: sphere.y,
              width: sphere.size,
              height: sphere.size,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </Parallax3DElement>
      ))}
    </>
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
      <div
        onClick={secret.incrementFirstCounter}
        className={`${secret.firstStageCompleted ? "pulse-effect" : ""}`}
      >
        <TopLoading
          time={loadingTime}
          text={secret.firstStageCompleted ? "" : initialLoadingText}
        />
      </div>

      {/* 新しいデザインシステムを使ったヒーローセクション */}
      <motion.div
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900"
        style={{ opacity, scale }}
      >
        {/* 背景レイヤー */}
        <div className="absolute inset-0 bg-[url('/image/texture-overlay.png')] opacity-10 mix-blend-overlay"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        ></div>
        <BackgroundSpheres />
        <MusicWave />
        <FloatingNotes />

        {/* 中央のコンテンツ - 新デザインシステムのコンポーネントを使用 */}
        <div className="container relative z-10 mx-auto px-4 py-24 text-center flex flex-col items-center justify-center min-h-screen">
          <Parallax3DElement depth={0.3} className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.span
                className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-medium mb-6 border border-white/10"
                animate={{
                  boxShadow: [
                    "0px 0px 0px rgba(255,255,255,0)",
                    "0px 0px 20px rgba(255,255,255,0.2)",
                    "0px 0px 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                島根大学 軽音楽部
              </motion.span>
            </motion.div>
          </Parallax3DElement>

          <Parallax3DElement depth={0.5}>
            <Typography
              variant="h1"
              className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
              animate={true}
            >
              <motion.span
                className="block mb-2"
                animate={{
                  filter: [
                    "drop-shadow(0px 0px 0px rgba(255,255,255,0))",
                    "drop-shadow(0px 0px 10px rgba(255,255,255,0.5))",
                    "drop-shadow(0px 0px 0px rgba(255,255,255,0))",
                  ],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                共に音楽を
              </motion.span>
              <motion.span
                className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  textShadow: [
                    "0 0 7px rgba(255,255,255,0.3)",
                    "0 0 15px rgba(163,230,53,0.7)",
                    "0 0 7px rgba(255,255,255,0.3)",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                楽しみましょう！
              </motion.span>
            </Typography>
          </Parallax3DElement>

          <Parallax3DElement depth={0.2}>
            <Typography
              variant="subtitle1"
              className="max-w-lg mx-auto text-xl text-indigo-100 mb-12"
            >
              初心者から経験者まで、音楽を通じて繋がるコミュニティ。
              <br />
              <motion.span
                className="font-medium text-white"
                animate={{
                  textShadow: [
                    "0px 0px 0px rgba(255,255,255,0)",
                    "0px 0px 10px rgba(255,255,255,0.8)",
                    "0px 0px 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                あなたの大学生活を彩る最高の仲間
              </motion.span>
              がここにいます。
            </Typography>
          </Parallax3DElement>

          <Parallax3DElement depth={0.4}>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600"
              >
                部活について知る
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={navigateToEventListPage}
                className="px-8 py-4 border-white text-white backdrop-blur-sm"
              >
                活動を見る
              </Button>
            </motion.div>
          </Parallax3DElement>
        </div>

        {/* 装飾的な要素 */}
        <Parallax3DElement depth={1.2}>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-500/30 backdrop-blur-xl"></div>
        </Parallax3DElement>
        <Parallax3DElement depth={1.5}>
          <div className="absolute top-16 -right-8 w-40 h-40 rounded-full bg-indigo-300/20 backdrop-blur-lg"></div>
        </Parallax3DElement>

        {/* ロゴアニメーション */}
        <Parallax3DElement depth={0.8} className="absolute bottom-32 right-10 w-16 h-16">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0px 0px 0px rgba(255,255,255,0.2)",
                  "0px 0px 30px rgba(255,255,255,0.6)",
                  "0px 0px 0px rgba(255,255,255,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full rounded-full relative"
            >
              <Image
                src="/icons/icon-192x192.png"
                alt="Logo"
                width={64}
                height={64}
                className="rounded-full shadow-lg opacity-80"
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  background: [
                    "radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(99,102,241,0) 100%)",
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(99,102,241,0.1) 100%)",
                    "radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(99,102,241,0) 100%)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </Parallax3DElement>

        {/* スクロールダウン指示 */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Typography variant="body2" className="text-sm font-medium mb-2 text-white/80">
            スクロールして続きを見る
          </Typography>
          <FaChevronDown className="mx-auto text-xl text-white/80" />
        </motion.div>
      </motion.div>

      {/* 特徴紹介セクション - シークレット機能のトリガー2つ目 */}
      <div
        onClick={secret.incrementSecondCounter}
        id="features"
        className={`${
          secret.firstStageCompleted && !secret.secondStageCompleted ? "cursor-pointer" : ""
        }`}
      >
        <Section background="light" paddingY="xl" animate={true}>
          <div className="mb-10 md:mb-16 text-center">
            <Typography variant="h2" className="mb-4 text-center relative inline-block">
              <span className="relative z-10">
                島根大学
                <br />
                軽音楽部の特徴
              </span>
              <motion.span
                className="absolute -z-10 bottom-0 left-0 w-full h-3 bg-indigo-200 opacity-70"
                animate={{ width: ["0%", "100%"], x: ["-50%", "0%"] }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </Typography>

            <Typography
              variant="body1"
              className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"
            >
              私達はこんな団体です！
            </Typography>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12 xl:grid-cols-4 stagger-fade">
            {/* 特徴カード - ここから既存スタイルでカードが続く */}
            <motion.div
              className="feature-card flex flex-col h-full rounded-xl border bg-white shadow-lg overflow-hidden transform transition-all duration-300"
              whileHover={{
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                scale: 1.02,
              }}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-indigo-400 opacity-0"
                  whileHover={{ opacity: 0.2, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative z-10">
                  <MdOutlineSchool className="text-5xl" />
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-gray-800 text-xl font-semibold">初心者歓迎</h3>
                <p className="text-gray-600">
                  実際部員の中でもほぼ半数が入部時は初心者です。実際のバンド活動を通じて一緒に成長していきましょう！
                </p>
              </div>
            </motion.div>

            <motion.div
              className="feature-card flex flex-col h-full rounded-xl border bg-white shadow-lg overflow-hidden transform transition-all duration-300"
              whileHover={{
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                scale: 1.02,
              }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-purple-400 opacity-0"
                  whileHover={{ opacity: 0.2, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative z-10">
                  <FaTools className="text-5xl" />
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-gray-800 text-xl font-semibold">設備が充実</h3>
                <p className="text-gray-600">
                  大学内にアンプやドラムセットなど練習できる環境が揃っています。わざわざ外部のスタジオを借りなくても練習が可能です！
                </p>
              </div>
            </motion.div>

            <motion.div
              className="feature-card flex flex-col h-full rounded-xl border bg-white shadow-lg overflow-hidden transform transition-all duration-300"
              whileHover={{
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                scale: 1.02,
              }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-blue-400 opacity-0"
                  whileHover={{ opacity: 0.2, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative z-10">
                  <FaUsers className="text-5xl" />
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-gray-800 text-xl font-semibold">部員が多い</h3>
                <p className="text-gray-600">
                  &quot;実際に活動をしている&quot;部員数がとても多い部活です。各学部内外大学内で友達を作るならもってこいです！！
                </p>
              </div>
            </motion.div>

            <motion.div
              className="feature-card flex flex-col h-full rounded-xl border bg-white shadow-lg overflow-hidden transform transition-all duration-300"
              whileHover={{
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                scale: 1.02,
              }}
            >
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-violet-400 opacity-0"
                  whileHover={{ opacity: 0.2, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative z-10">
                  <FaMusic className="text-5xl" />
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-gray-800 text-xl font-semibold">様々なジャンル</h3>
                <p className="text-gray-600">
                  部員数が多いため、様々なジャンルの音楽に触れることができます。自分の知らないアーティストを見つける機会がたくさんあります。
                </p>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* 画像ギャラリーセクション */}
        <section className="apple-section bg-white py-24 relative overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute inset-0 bg-pattern opacity-5"></div>
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-indigo-200/30 to-purple-200/30 rounded-full filter blur-3xl"
            animate={{
              x: [50, -50, 50],
              y: [-50, 50, -50],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-blue-200/30 to-indigo-200/30 rounded-full filter blur-3xl"
            animate={{
              x: [-50, 50, -50],
              y: [50, -50, 50],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="mx-auto max-w-screen-xl px-4 md:px-8 relative z-10">
            <FadeInSection>
              <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl relative inline-block">
                <span className="relative z-10">活動の様子</span>
                <motion.span
                  className="absolute -z-10 bottom-0 left-0 w-full h-3 bg-indigo-200 opacity-70"
                  animate={{ width: ["0%", "100%"], x: ["-50%", "0%"] }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </h2>
              <p className="mx-auto max-w-3xl text-center text-gray-600 mb-12">
                島根大学軽音楽部では、練習からライブまで様々な活動を行っています。
                先輩後輩の垣根を越えて、音楽を通じた絆を深めています。
              </p>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-up">
              {/* 改良されたカード */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group activity-card rounded-xl overflow-hidden shadow-lg bg-white relative"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src="/image/root/band-practice.jpg"
                    alt="バンドメンバーが練習室で演奏している様子"
                    width={600}
                    height={450}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    initial={{ y: 100 }}
                    whileHover={{ y: 0 }}
                  >
                    <p className="text-white text-sm font-medium">
                      部内バンドの練習風景。初心者も経験者も一緒に音を重ねます。
                    </p>
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    日々の練習
                  </h3>
                  <p className="text-gray-600">
                    大学内の部室で日々練習に励んでいます。部内では様々な話題も飛び交います。
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group activity-card rounded-xl overflow-hidden shadow-lg bg-white relative"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src="/image/root/live-performance.jpg"
                    alt="部員がステージでライブ演奏をしている様子"
                    width={600}
                    height={450}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    initial={{ y: 100 }}
                    whileHover={{ y: 0 }}
                  >
                    <p className="text-white text-sm font-medium">
                      実際のステージでの熱いパフォーマンスは一生の思い出になります。
                    </p>
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    ライブ演奏
                  </h3>
                  <p className="text-gray-600">
                    学内外の様々なイベントで演奏する機会があります。人前での演奏経験を積むことができます。
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group activity-card rounded-xl overflow-hidden shadow-lg bg-white relative"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src="/image/root/concert.jpg"
                    alt="定期演奏会での集合写真"
                    width={600}
                    height={450}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    initial={{ y: 100 }}
                    whileHover={{ y: 0 }}
                  >
                    <p className="text-white text-sm font-medium">
                      部員全員で作り上げる年に一度の大イベントです。
                    </p>
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    定期演奏会
                  </h3>
                  <p className="text-gray-600">
                    毎年12月に開催される最大のイベント。多くの観客の前で日頃の練習の成果を披露します。
                  </p>
                </div>
              </motion.div>
            </div>

            {/* 写真ギャラリーリンクボタン */}
            <div className="text-center mt-16">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={navigateToEventListPage}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow-lg overflow-hidden"
              >
                <span className="relative z-10">もっと活動を見る</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
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
                </motion.span>
                <motion.div
                  className="absolute inset-0 -z-10"
                  initial={{ x: "-100%", opacity: 0.5 }}
                  whileHover={{ x: "100%", opacity: 0.3 }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="absolute inset-0 bg-white/20" />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </section>

        {/* よくある質問セクション - デザインシステムのコンポーネント使用 */}
        <Section
          background="light"
          paddingY="xl"
          animate={true}
          className="relative overflow-hidden"
          id="faq"
        >
          {/* 背景装飾 */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="music-pattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M10 10 Q15 5, 20 10 T30 10"
                    stroke="#4F46E5"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle cx="20" cy="15" r="2" fill="#6366F1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#music-pattern)" />
            </svg>
          </div>

          <motion.div
            className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-indigo-300/10 to-purple-300/10 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-20 w-80 h-80 bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full filter blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="mb-10 md:mb-16">
            <Typography
              variant="h2"
              className="mb-4 text-center relative inline-block"
              animate={true}
            >
              <span className="relative z-10">よくある質問</span>
              <motion.span
                className="absolute -z-10 bottom-0 left-0 w-full h-3 bg-indigo-200 opacity-70"
                animate={{ width: ["0%", "100%"], x: ["-50%", "0%"] }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </Typography>

            <Typography
              variant="body1"
              className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"
            >
              気になる疑問点について回答します！
            </Typography>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 sm:gap-y-10 xl:grid-cols-3">
            <Card className="faq-card h-full" interactive={true} hover3D={true} bordered={true}>
              <div className="relative pt-8">
                <motion.div
                  className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 to-purple-600"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <FAQItem
                  question="部費はありますか？"
                  answer="半年で6000円の部費を徴収しています.<br/>その中からイベントの運営や機材の購入に充てています．"
                  additional="※部Tの代金など,別途費用がかかることもあります．"
                  icon={
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaMoneyBillWave className="text-indigo-500" size={28} />
                    </motion.div>
                  }
                />
              </div>
            </Card>

            {/* その他のFAQカードも同様に更新 */}
            <Card className="faq-card h-full" interactive={true} hover3D={true} bordered={true}>
              <div className="relative pt-8">
                <motion.div
                  className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <FAQItem
                  question="イベントはどんなものがありますか？"
                  answer="新歓ライブや学際でのライブ、定期演奏会など,年間を通して様々なイベントがあります．詳細はSNSなどをご覧ください．"
                  icon={
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaCalendarAlt className="text-blue-500" size={28} />
                    </motion.div>
                  }
                />
              </div>
            </Card>

            {/* 残りのFAQカード */}
            <Card className="faq-card h-full" interactive={true} hover3D={true} bordered={true}>
              <div className="relative pt-8">
                <motion.div
                  className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-blue-500"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <FAQItem
                  question="初心者でも大丈夫ですか？"
                  answer="もちろんです！例年ほぼ半数が初心者です．<br/>初心者の方も大歓迎ですので、一緒に成長していきましょう！"
                  icon={
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaSmile className="text-green-500" size={28} />
                    </motion.div>
                  }
                />
              </div>
            </Card>
          </div>
        </Section>

        {/* コンタクトセクション - デザインシステムのコンポーネント使用 */}
        <Section
          background="white"
          paddingY="xl"
          animate={true}
          className="relative overflow-hidden"
          id="contact"
        >
          <div className="absolute inset-0 bg-pattern opacity-5"></div>

          {/* 装飾的な背景要素 */}
          <motion.div
            className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-indigo-300/20 to-purple-300/20 filter blur-xl"
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 0.6, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[15%] w-40 h-40 rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-300/20 filter blur-xl"
            animate={{
              y: [0, 30, 0],
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 0.9, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 装飾的な楽器シルエット */}
          <motion.div
            className="absolute top-[15%] left-[5%] text-indigo-200/20 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 3H22v2h-1.59l-4.21 4.21C16.73 9.14 17 9.55 17 10c0 .55-.45 1-1 1s-1-.45-1-1c0-.55.45-1 1-1 .22 0 .41.08.59.21L20.79 5H19.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h.09zM5.76 15.96l1.41 1.41-.25.25c-.29.29-.29.77 0 1.06.29.29.77.29 1.06 0l.25-.25 1.41 1.41C8.54 20.94 7.29 21.2 6 21.2c-1.67 0-3.24-.74-4.35-2.03-.31-.36-.31-.9 0-1.25 1.27-1.46 2.74-2.43 4.11-1.96zm1.62-10.4c.73.19 1.3.75 1.64 1.19l2.31-2.31c.65-.65 1.89-.59 2.37.26.64 1.14.22 2.42-.85 2.85C11.77 8.08 10.6 10 9.43 12.25c-1.55 3-3.44 5.55-7 8.77L1 19.59c3.19-2.62 5.46-5.55 7.92-9.36 1.04-1.61 2.28-3.5 3.31-4.79-1.21 2.08-3.77 8.38-5.42 9.53-.8.56-1.85.84-2.77.62-.7-.16-1.16-.55-1.59-.97l5.93-8.59zm12.74-3.13c-.4.28-.95.59-1.11 1.28V4c0 1.1-.9 2-2 2h-.01c-.54.01-.96.46-.96 1s.42.99.96 1H17c1.1 0 2 .9 2 2v10.99h-.01c.01.54.46.96 1 .96s.99-.42.99-.96V10c0-1.1.9-2 2-2v-.96c0-.27-.02-.52-.14-.76-.22-.43-.65-.76-1.36-.93z"></path>
            </svg>
          </motion.div>
          <motion.div
            className="absolute bottom-[20%] right-[7%] text-indigo-200/20 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 15 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path>
            </svg>
          </motion.div>

          <Typography variant="h2" className="text-center font-bold mb-8" animate={true}>
            次は部室で会いましょう！
          </Typography>

          <Card
            className="p-6 max-w-lg mx-auto transform hover:scale-[1.02] transition-all duration-300"
            interactive={true}
            bordered={true}
            shadow="lg"
          >
            <Card.Body>
              <Typography variant="body1" className="text-center text-gray-600 mb-8">
                ご質問やお問い合わせは各SNSからお気軽にどうぞ。
                <br />
                見学や体験も随時受け付けています！
              </Typography>

              <SNSButton />

              <div className="mt-8 text-center">
                <motion.div
                  className="inline-flex items-center text-indigo-600 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">みんなで音楽を楽しもう</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              </div>
            </Card.Body>
          </Card>
        </Section>
      </div>
    </SecretEffectWrapper>
  );
};

export default Home;

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLock, FaHome, FaGuitar, FaMusic, FaMagic, FaStar } from "react-icons/fa";
import VirtualKeyboard from "./VirtualKeyboard";
import MusicVisualizer from "./MusicVisualizer";
import AudioPlayer from "./AudioPlayer";

const Contents: React.FC = () => {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [easterEggFound, setEasterEggFound] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [selectedSoundId, setSelectedSoundId] = useState("wii");

  // 3秒後にウェルカム画面を非表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // イースターエッグのための隠しクリックカウンター
  const handleLogoClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 5) {
        // イースターエッグ発動
        setEasterEggFound(true);
      }
      return newCount;
    });
  };

  // 音源選択時の処理（AudioPlayerから呼び出される）
  const handleSoundChange = (soundId: string) => {
    setSelectedSoundId(soundId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* ウェルカム画面 - スマホ向けにテキストサイズ調整 */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showWelcome ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${
          showWelcome ? "block" : "pointer-events-none"
        }`}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center px-4"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: 1 }}
            className="mb-6"
          >
            <FaGuitar className="text-6xl sm:text-8xl mx-auto text-purple-500" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">シークレットモード</h1>
          <p className="text-sm sm:text-base text-gray-300">
            特別なページを発見しました！音楽を奏でて楽しんでください
          </p>
        </motion.div>
      </motion.div>

      {/* ヘッダー - モバイル向けに調整 */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.5 }}
        className="bg-black/30 backdrop-blur-md shadow-lg p-3 sm:p-4 sticky top-0 z-30"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              onClick={handleLogoClick}
              className="cursor-pointer"
            >
              <FaMusic className="text-2xl sm:text-3xl text-purple-400" />
            </motion.div>
            <h1 className="text-lg sm:text-xl font-bold text-white">軽音部 シークレット</h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="flex items-center space-x-1 sm:space-x-2 py-1.5 px-3 sm:py-2 sm:px-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xs sm:text-sm"
          >
            <FaHome />
            <span>ホームへ</span>
          </motion.button>
        </div>
      </motion.header>

      {/* メインコンテンツ - パディング調整 */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
        className="flex-1 container mx-auto p-3 sm:p-4 md:p-6"
      >
        {/* イースターエッグ効果 */}
        {easterEggFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 sm:p-6 rounded-xl shadow-lg mb-6 text-center"
          >
            <FaMagic className="text-3xl sm:text-4xl text-white mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">隠し要素を発見！</h2>
            <p className="text-sm text-white/90">
              おめでとうございます！あなたは隠し機能を発見しました。
            </p>
          </motion.div>
        )}

        {/* 音楽ビジュアライザー */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text白 mb-3 flex items-center">
            <FaStar className="mr-2 text-yellow-400" /> 音の視覚化
          </h2>
          <MusicVisualizer />
        </div>

        {/* バーチャルキーボード */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text白 mb-3">音楽を奏でる</h2>
          <VirtualKeyboard currentSoundId={selectedSoundId} />
        </div>

        {/* オーディオプレイヤー */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text白 mb-3">サウンドエフェクト</h2>
          <AudioPlayer onSoundChange={handleSoundChange} />
        </div>
      </motion.main>

      {/* フッター - モバイル用に調整 */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.8, duration: 0.5 }}
        className="bg-black/40 backdrop-blur-sm py-4 px-3 sm:p-6"
      >
        <div className="container mx-auto text-center">
          <p className="text-white/50 text-xs sm:text-sm">
            島根大学軽音楽部 - シークレットページ © {new Date().getFullYear()}
          </p>
          <p className="text白/30 text-xs mt-1 sm:mt-2">音楽の力で世界を変えよう</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Contents;

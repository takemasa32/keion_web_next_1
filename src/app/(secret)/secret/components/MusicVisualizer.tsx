"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AudioContextManager from "../utils/AudioContextManager";

const MusicVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let hue = 0;
    const audioManager = AudioContextManager.getInstance();

    // ユーザーインタラクションを待つ
    const handleUserInteraction = () => {
      // 既にアクティブな場合は処理をスキップ
      if (isActive) return;

      // オーディオコンテキストを初期化
      audioManager.getContext();
      setIsActive(true);

      // イベントリスナーを削除
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    // キャンバスサイズをウィンドウに合わせる
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // アニメーションループ
    const animate = () => {
      // 背景をクリア（透明度を持たせて軌跡を残す）
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const analyser = audioManager.getAnalyser();

      if (analyser) {
        // 周波数データを取得
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // ビジュアライザーの幅とバーのギャップを計算
        const barWidth = (canvas.width / bufferLength) * 2.5;
        const barGap = 2;

        // 周波数データに基づいて棒グラフを描画
        for (let i = 0; i < bufferLength; i++) {
          const height = (dataArray[i] / 255) * canvas.height * 0.8;

          // 変化するグラデーションカラー
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - height);
          gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
          gradient.addColorStop(1, `hsl(${hue + 60}, 100%, 70%)`);

          ctx.fillStyle = gradient;

          // バーを描画（中央から対称に）
          const x = canvas.width / 2 + i * (barWidth + barGap);
          ctx.fillRect(x, canvas.height - height, barWidth, height);

          // 左側（鏡像）
          ctx.fillRect(canvas.width - x - barWidth, canvas.height - height, barWidth, height);
        }
      } else {
        // アナライザーがない場合はデモ表示
        const bars = 30;
        const barWidth = canvas.width / bars;

        for (let i = 0; i < bars; i++) {
          // デモ表示用のランダムな高さ（音声入力なしの場合）
          const height = Math.random() * canvas.height * 0.3 + 5;

          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - height);
          gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
          gradient.addColorStop(1, `hsl(${hue + 60}, 100%, 70%)`);

          ctx.fillStyle = gradient;
          ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height);
        }
      }

      hue = (hue + 0.5) % 360; // 色相を徐々に変化させる
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // クリーンアップ
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, [isActive]);

  return (
    <motion.div
      className="w-full h-36 sm:h-48 rounded-lg overflow-hidden shadow-lg border border-purple-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full bg-black/50" style={{ display: "block" }} />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <p className="text-white/70 text-xs sm:text-sm px-4 text-center">
            音を鳴らすと波形が表示されます
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MusicVisualizer;

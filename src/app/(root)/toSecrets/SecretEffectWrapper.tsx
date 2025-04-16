"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SecretEffectWrapperProps = {
  children: ReactNode;
  secretClassName: string;
};

// シークレットエフェクトを全画面に適用するためのラッパーコンポーネント
const SecretEffectWrapper = ({ children, secretClassName }: SecretEffectWrapperProps) => {
  const [particlesVisible, setParticlesVisible] = useState(false);
  const [pulseOpacity, setPulseOpacity] = useState(0);

  useEffect(() => {
    // secretClassNameに基づいて状態を更新
    if (secretClassName.includes("secret-first-completed")) {
      setParticlesVisible(true);

      // パルスエフェクト用のアニメーション
      let timeout: NodeJS.Timeout;
      const pulse = () => {
        setPulseOpacity(0.4);
        timeout = setTimeout(() => {
          setPulseOpacity(0);
        }, 500);
      };

      const interval = setInterval(pulse, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    if (secretClassName.includes("secret-all-completed")) {
      setParticlesVisible(true);
    }
  }, [secretClassName]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${secretClassName}`}>
      {/* 秘密のアクティベーションエフェクト */}
      <AnimatePresence>
        {particlesVisible && (
          <>
            {/* 浮遊する音符 */}
            <div className="absolute inset-0 z-[100] pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-indigo-500/30"
                  initial={{
                    opacity: 0,
                    left: `${Math.random() * 100}%`,
                    top: "100%",
                    rotate: Math.random() * 360,
                    scale: 0.5 + Math.random() * 1.5,
                  }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    top: ["100%", `${Math.random() * 50}%`, "-10%"],
                    rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 20,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: Math.random() * 10,
                  }}
                  style={{
                    fontSize: `${24 + Math.random() * 24}px`,
                  }}
                >
                  {i % 5 === 0
                    ? "♪"
                    : i % 5 === 1
                    ? "♫"
                    : i % 5 === 2
                    ? "♩"
                    : i % 5 === 3
                    ? "♬"
                    : "𝄞"}
                </motion.div>
              ))}
            </div>

            {/* 全画面グローワイヤーフレームオーバーレイ */}
            <motion.div
              className={`absolute inset-0 z-[99] pointer-events-none border border-indigo-500/20 ${
                secretClassName.includes("secret-all-completed") ? "backdrop-blur-sm" : ""
              }`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: secretClassName.includes("secret-all-completed") ? 0.2 : pulseOpacity,
                boxShadow: secretClassName.includes("secret-all-completed")
                  ? [
                      "inset 0 0 20px rgba(79, 70, 229, 0)",
                      "inset 0 0 50px rgba(79, 70, 229, 0.3)",
                      "inset 0 0 20px rgba(79, 70, 229, 0)",
                    ]
                  : [
                      "inset 0 0 0px rgba(79, 70, 229, 0)",
                      "inset 0 0 20px rgba(79, 70, 229, 0.2)",
                      "inset 0 0 0px rgba(79, 70, 229, 0)",
                    ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            </motion.div>

            {/* 背景パルスエフェクト - 第2段階がアクティブになった場合 */}
            {secretClassName.includes("secret-all-completed") && (
              <motion.div
                className="absolute inset-0 z-[98] pointer-events-none bg-gradient-to-r from-indigo-900/10 to-purple-900/10"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {children}

      {/* 全段階完了時の演出 */}
      <AnimatePresence>
        {secretClassName.includes("secret-all-completed") && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold"
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: [0, 1, 0], scale: [2, 1, 0] }}
              transition={{ duration: 1.5 }}
            >
              SECRET MODE ACTIVATED
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecretEffectWrapper;

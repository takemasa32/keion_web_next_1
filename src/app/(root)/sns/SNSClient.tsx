"use client";
import React, { useState, useEffect } from "react";
import SNSButton from "@/app/(root)/components/SNSButton";
import { motion } from "framer-motion";
import { FaComments, FaEnvelope, FaMusic, FaHandshake, FaQuestion } from "react-icons/fa";

// FAQ項目の型定義
interface FAQItem {
  question: string;
  answer: string;
}

interface SNSClientProps {
  faqItems: FAQItem[];
}

const SNSClient: React.FC<SNSClientProps> = ({ faqItems }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("main");

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // スクロール位置に基づいてアクティブセクションを設定
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight / 2 && sectionTop > -window.innerHeight / 2) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // アニメーション用バリアント
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      {/* メインビジュアルセクション - インラインSVG背景パターン */}
      <section
        id="main"
        className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden"
      >
        {/* 直接SVGを埋め込み */}
        <div className="absolute inset-0 opacity-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            className="w-full h-full"
          >
            <defs>
              <pattern
                id="musical-pattern"
                patternUnits="userSpaceOnUse"
                width="200"
                height="200"
                patternTransform="rotate(10)"
              >
                <g fill="#444">
                  {/* 音符パターン1 */}
                  <path d="M40,30 L40,80 C40,88 32,94 24,90 C16,86 16,74 24,70 C28,68 34,70 36,72 L36,30 L60,20 L60,70 C60,78 52,84 44,80 C36,76 36,64 44,60 C48,58 54,60 56,62 L56,20 L40,30" />

                  {/* 音符パターン2 */}
                  <path
                    d="M120,50 L120,100 C120,108 112,114 104,110 C96,106 96,94 104,90 C108,88 114,90 116,92 L116,50 L140,40 L140,90 C140,98 132,104 124,100 C116,96 116,84 124,80 C128,78 134,80 136,82 L136,40 L120,50"
                    transform="translate(-30,20)"
                  />

                  {/* リズム記号 */}
                  <circle cx="160" cy="40" r="5" />
                  <circle cx="180" cy="40" r="5" />
                  <circle cx="160" cy="60" r="5" />
                  <circle cx="180" cy="60" r="5" />
                  <line x1="165" y1="40" x2="195" y2="40" stroke="#444" strokeWidth="2" />
                  <line x1="165" y1="60" x2="195" y2="60" stroke="#444" strokeWidth="2" />

                  {/* 譜線 */}
                  <line
                    x1="0"
                    y1="130"
                    x2="200"
                    y2="130"
                    stroke="#444"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="0"
                    y1="140"
                    x2="200"
                    y2="140"
                    stroke="#444"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="0"
                    y1="150"
                    x2="200"
                    y2="150"
                    stroke="#444"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="0"
                    y1="160"
                    x2="200"
                    y2="160"
                    stroke="#444"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="0"
                    y1="170"
                    x2="200"
                    y2="170"
                    stroke="#444"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />

                  {/* 装飾 */}
                  <path
                    d="M10,110 Q30,70 50,110 Q70,150 90,110 Q110,70 130,110 Q150,150 170,110 Q190,70 210,110"
                    stroke="#444"
                    strokeWidth="1"
                    fill="none"
                    strokeOpacity="0.2"
                  />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#musical-pattern)" />
          </svg>
        </div>

        {/* コンテンツ */}
        <motion.div
          className="container relative z-10 mx-auto px-6 py-12 text-center text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            お問い合わせ
          </motion.h1>
          <motion.p
            className="text-xl max-w-2xl mx-auto mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            島根大学軽音楽部に興味をお持ちいただき、ありがとうございます。
            <br className="hidden md:block" />
            お気軽に各種SNSからご連絡ください。
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8"
          >
            <SNSButton />
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <FaComments className="text-gray-900 text-3xl opacity-70" />
          </motion.div>
        </motion.div>
      </section>

      {/* コンタクト情報セクション */}
      <section id="contact-info" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              className="text-3xl font-bold text-center text-gray-900 mb-12"
              variants={itemVariants}
            >
              お問い合わせ方法
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white rounded-lg p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-2xl text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">SNS</h3>
                <p className="text-gray-600 mb-4">
                  各種SNSのDMからお気軽にご連絡ください。最も早く返信が可能です。
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaMusic className="text-2xl text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">ライブ</h3>
                <p className="text-gray-600 mb-4">
                  学内の演奏会や各種イベント時に直接お声がけください。部員が対応します。
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaHandshake className="text-2xl text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">知り合い・友達</h3>
                <p className="text-gray-600 mb-4">
                  部員の友人や知り合いを通じて連絡をとることもできます。気軽に紹介してもらってください。
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQセクション - 背景パターンを追加 */}
      <section id="faq" className="py-16 bg-gray-50 relative overflow-hidden">
        {/* FAQセクションの背景パターン */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="faq-pattern"
                patternUnits="userSpaceOnUse"
                width="60"
                height="60"
                patternTransform="rotate(45)"
              >
                <circle cx="10" cy="10" r="2" fill="#4F46E5" />
                <rect x="25" y="25" width="10" height="10" rx="2" fill="#4F46E5" />
                <path d="M50,10 L55,15 L50,20 L45,15 Z" fill="#4F46E5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#faq-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <h2 className="text-3xl text-black font-bold">よくある質問</h2>
              <p className="text-gray-600 mt-4">
                入部に関する疑問や質問への回答です。その他の疑問はSNSからお問い合わせください。
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  variants={itemVariants}
                >
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaQuestion className="text-gray-900 text-sm" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: 0 }}
                        variants={{
                          open: { rotate: 180 },
                          closed: { rotate: 0 },
                        }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 flex items-center border border-gray-300 rounded-full w-6 h-6 justify-center"
                      >
                        <svg
                          className="w-3 h-3 text-gray-900 group-open:rotate-180 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.div>
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600 border-t border-gray-100 pt-4">{item.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* スクロール連動フローティングナビゲーション - 位置とスタイルを変更 */}
      <motion.div
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30"
        initial={{ x: 100, opacity: 0 }}
        animate={{
          x: scrolled ? 0 : 100,
          opacity: scrolled ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-gray-300/90 backdrop-blur-md rounded-lg shadow-lg py-4 px-2 flex flex-col space-y-4">
          <a
            href="#main"
            className={`p-2 rounded-md text-center transition-colors ${
              activeSection === "main"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-900/80 hover:text-gray-900 hover:bg-gray-200"
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("main")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            aria-label="トップへスクロール"
            title="トップへスクロール"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mx-auto text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </a>
          <a
            href="#contact-info"
            className={`p-2 rounded-md text-center transition-colors ${
              activeSection === "contact-info"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-900/80 hover:text-gray-900 hover:bg-gray-200"
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact-info")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            aria-label="お問い合わせセクションへ"
            title="お問い合わせセクションへ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mx-auto text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
          <a
            href="#faq"
            className={`p-2 rounded-md text-center transition-colors ${
              activeSection === "faq"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-900/80 hover:text-gray-900 hover:bg-gray-200"
            }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("faq")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            aria-label="FAQセクションへ"
            title="FAQセクションへ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mx-auto text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </a>
        </div>
      </motion.div>
    </>
  );
};

export default SNSClient;

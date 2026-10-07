"use client";
import React, { useState, useEffect } from "react";
import Contents from "./components/Contents";
import NotFound from "./components/NotFound";

const SecretPage: React.FC = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const checkAccess = () => {
      try {
        const accessAllowed = sessionStorage.getItem("accessAllowed");
        const accessTime = sessionStorage.getItem("secretAccessTime");

        // アクセス許可があるか確認
        if (accessAllowed === "true" && accessTime) {
          const timestamp = Number(accessTime);
          const duration =
            Number(sessionStorage.getItem("secretExpirationMinutes") ?? "60") * 60 * 1000;
          const currentTime = new Date().getTime();
          // 60分以内のアクセスであれば許可
          if (
            Number.isFinite(timestamp) &&
            duration > 0 &&
            currentTime >= timestamp &&
            currentTime - timestamp < duration
          ) {
            setHasAccess(true);
          }
        }
      } catch (e) {
        console.error("セッションストレージへのアクセスエラー", e);
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="secret-studio flex items-center justify-center" role="status">
        <p className="text-sm text-[#bdc9c8]">入口を確認しています…</p>
      </div>
    );
  }

  // アクセス権があればコンテンツを表示、なければNotFoundを表示
  return hasAccess ? <Contents /> : <NotFound />;
};

export default SecretPage;

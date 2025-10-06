"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import CustomImage from "./CustomImage";

type DesignKey = "front" | "back";

const designAssets: Record<
  DesignKey,
  { label: string; description: string; src: string }
> = {
  front: {
    label: "フロントロゴ",
    description: "胸元のワンポイントロゴをTシャツの位置に自動で重ね合わせます。",
    src: "/image/2025T/keionMiniLogo.JPG",
  },
  back: {
    label: "バックプリント",
    description: "背面エンブレムの配置サイズを自動調整します。",
    src: "/image/2025T/keionBackImage.JPG",
  },
};

const overlayPresets: Record<DesignKey, { width: number; offsetX: number; offsetY: number }> = {
  front: {
    width: 62,
    offsetX: 0,
    offsetY: -12,
  },
  back: {
    width: 68,
    offsetX: 0,
    offsetY: -4,
  },
};

const ARTryOnSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [design, setDesign] = useState<DesignKey>("front");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const handleStop = useCallback(() => {
    stopStream();
    setIsActive(false);
  }, [stopStream]);

  const attachStreamToVideo = useCallback(async (stream: MediaStream) => {
    if (!videoRef.current) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    const videoElement = videoRef.current;
    videoElement.srcObject = stream;
    streamRef.current = stream;

    const ensurePlay = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.warn("動画の自動再生に失敗しました。", playError);
        }
      }
    };

    if (videoElement.readyState >= 2) {
      await ensurePlay();
    } else {
      const onLoadedMetadata = async () => {
        videoElement.removeEventListener("loadedmetadata", onLoadedMetadata);
        await ensurePlay();
      };
      videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
    }

    setIsActive(true);
    setErrorMessage(null);
  }, []);

  const handleStart = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("お使いのブラウザではカメラ機能に対応していません。");
      return;
    }

    const requestStream = async (facingMode: "user" | "environment") => {
      return navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
    };

    try {
      const stream = await requestStream("user");
      await attachStreamToVideo(stream);
    } catch (primaryError) {
      console.warn("フロントカメラ取得に失敗しました。バックカメラを試行します。", primaryError);
      try {
        const fallbackStream = await requestStream("environment");
        await attachStreamToVideo(fallbackStream);
      } catch (fallbackError) {
        console.error(fallbackError);
        setErrorMessage("カメラへのアクセスが拒否されました。設定を確認してください。");
      }
    }
  }, [attachStreamToVideo]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  const overlayStyle = useMemo(() => {
    const preset = overlayPresets[design];
    return {
      width: `${preset.width}%`,
      transform: `translate(-50%, -50%) translate(${preset.offsetX}px, ${preset.offsetY}px)`,
    };
  }, [design]);

  return (
    <section className="rounded-3xl border border-white/12 bg-white/8 backdrop-blur-lg">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10">
        <div className="space-y-4 sm:space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
            ar fitting
          </span>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
            カメラを使ってその場で試着
          </h2>
          <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
            スマートフォンやタブレットでカメラを起動すれば、胸元・背中にデザインを重ね合わせてサイズ感が確認できます。
            周囲の明るい場所で使用すると、よりシルエットが見やすくなります。
          </p>

          <div className="rounded-2xl border border-white/15 bg-slate-900/50 p-4 text-sm text-slate-300">
            <p className="font-medium text-slate-100">使い方</p>
            <ul className="mt-2 space-y-2">
              <li>1. 「ARを開始」ボタンを押してカメラを許可します。</li>
              <li>2. 表示したいデザインを選ぶと、Tシャツの位置に自動で重ねます。</li>
              <li>3. 端末を肩から胸にかざすだけで、ロゴ位置を確認できます。</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70">
            {isActive ? (
              <>
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <CustomImage
                  src={designAssets[design].src}
                  alt={designAssets[design].label}
                  width={640}
                  height={640}
                  priority={design === "front"}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none drop-shadow-[0_8px_24px_rgba(15,15,40,0.45)]"
                  style={overlayStyle}
                  draggable={false}
                  unoptimized
                />
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-300">
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-white/80">
                  preview
                </div>
                <p className="text-sm leading-relaxed">
                  カメラを起動するとデザインがリアルタイムで重なります。
                  <br />
                  室内では照明に背を向けると見やすくなります。
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(designAssets) as DesignKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDesign(key)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    design === key
                      ? "border-white bg-white text-slate-950"
                      : "border-white/20 text-slate-200 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {designAssets[key].label}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-300">{designAssets[design].description}</p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={isActive ? handleStop : handleStart}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                  isActive
                    ? "bg-rose-500 text-white hover:bg-rose-400"
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                }`}
              >
                {isActive ? "ARを終了" : "ARを開始"}
              </button>
            </div>

            {errorMessage && (
              <p className="mt-3 text-xs leading-relaxed text-rose-300">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ARTryOnSection;

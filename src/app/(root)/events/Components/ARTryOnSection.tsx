"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import CustomImage from "./CustomImage";

type DesignKey = "front" | "back";

type OverlayState = {
  widthPercent: number;
  centerXPercent: number;
  centerYPercent: number;
};

type CapturedPhoto = {
  dataUrl: string;
  width: number;
  height: number;
  design: DesignKey;
};

type CameraOption = {
  deviceId: string;
  label: string;
};

const FALLBACK_ASPECT_RATIO = 3 / 4; // portrait baseline

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const designAssets: Record<
  DesignKey,
  {
    label: string;
    description: string;
    src: string;
    naturalWidth: number;
    naturalHeight: number;
    defaultOverlay: OverlayState;
  }
> = {
  front: {
    label: "フロントロゴ",
    description: "右下ウォーターマークで自撮りをスタイリング。",
    src: "/image/2025T/keionMiniLogo.JPG",
    naturalWidth: 640,
    naturalHeight: 640,
    defaultOverlay: {
      widthPercent: 32,
      centerXPercent: 82,
      centerYPercent: 84,
    },
  },
  back: {
    label: "バックプリント",
    description: "背面ショットに映える中央ビッグロゴ。",
    src: "/image/2025T/keionBackImage.JPG",
    naturalWidth: 640,
    naturalHeight: 640,
    defaultOverlay: {
      widthPercent: 54,
      centerXPercent: 50,
      centerYPercent: 52,
    },
  },
};

const overlaySizeRange: Record<DesignKey, { min: number; max: number }> = {
  front: { min: 18, max: 48 },
  back: { min: 34, max: 82 },
};

const createOverlayState = (state: OverlayState): OverlayState => ({
  widthPercent: state.widthPercent,
  centerXPercent: state.centerXPercent,
  centerYPercent: state.centerYPercent,
});

const ARTryOnSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    designKey: DesignKey;
    deltaXPercent: number;
    deltaYPercent: number;
  } | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [design, setDesign] = useState<DesignKey>("front");
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const [availableCameras, setAvailableCameras] = useState<CameraOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const [overlayStates, setOverlayStates] = useState<Record<DesignKey, OverlayState>>(() => ({
    front: createOverlayState(designAssets.front.defaultOverlay),
    back: createOverlayState(designAssets.back.defaultOverlay),
  }));
  const [showCaptureFeedback, setShowCaptureFeedback] = useState(false);

  const savedCardRef = useRef<HTMLDivElement | null>(null);
  const captureToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentOverlay = overlayStates[design];

  const scrollToSavedShot = useCallback(() => {
    if (!savedCardRef.current) {
      return;
    }
    savedCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const triggerCaptureFeedback = useCallback(() => {
    if (captureToastTimeoutRef.current) {
      clearTimeout(captureToastTimeoutRef.current);
    }
    setShowCaptureFeedback(true);
    captureToastTimeoutRef.current = setTimeout(() => {
      setShowCaptureFeedback(false);
      captureToastTimeoutRef.current = null;
    }, 1000);
  }, []);

  const computeHeightPercent = useCallback(
    (widthPercent: number, designKey: DesignKey) => {
      const asset = designAssets[designKey];
      const naturalRatio = asset.naturalHeight / asset.naturalWidth;
      const aspect = videoAspectRatio ?? FALLBACK_ASPECT_RATIO;
      return widthPercent * aspect * naturalRatio;
    },
    [videoAspectRatio]
  );

  const clampOverlayState = useCallback(
    (state: OverlayState, designKey: DesignKey) => {
      const range = overlaySizeRange[designKey];
      const widthPercent = clamp(state.widthPercent, range.min, range.max);
      const heightPercent = computeHeightPercent(widthPercent, designKey);
      const centerXPercent = clamp(state.centerXPercent, widthPercent / 2, 100 - widthPercent / 2);
      const centerYPercent = clamp(
        state.centerYPercent,
        heightPercent / 2,
        100 - heightPercent / 2
      );
      return { widthPercent, centerXPercent, centerYPercent };
    },
    [computeHeightPercent]
  );

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVideoAspectRatio(null);
  }, []);

  const handleStop = useCallback(() => {
    stopStream();
    setIsActive(false);
    setIsLoadingCamera(false);
    setErrorMessage(null);
    if (captureToastTimeoutRef.current) {
      clearTimeout(captureToastTimeoutRef.current);
      captureToastTimeoutRef.current = null;
    }
    setShowCaptureFeedback(false);
  }, [stopStream]);

  const updateAspectRatio = useCallback(() => {
    const element = videoRef.current;
    if (element && element.videoWidth && element.videoHeight) {
      setVideoAspectRatio(element.videoWidth / element.videoHeight);
    }
  }, []);

  const refreshCameraList = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return [];
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices
      .filter((device) => device.kind === "videoinput")
      .map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `カメラ ${index + 1}`,
      }));
    setAvailableCameras(cameras);
    return cameras;
  }, []);

  const attachStreamToVideo = useCallback(
    async (stream: MediaStream) => {
      if (!videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      const videoElement = videoRef.current;
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.srcObject = stream;
      streamRef.current = stream;

      const ensurePlay = async () => {
        if (videoRef.current) {
          try {
            updateAspectRatio();
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
          updateAspectRatio();
          await ensurePlay();
        };
        videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
      }

      setIsActive(true);
      setErrorMessage(null);
    },
    [updateAspectRatio]
  );

  const startCamera = useCallback(
    async (deviceId?: string): Promise<boolean> => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMessage("お使いのブラウザではカメラ機能に対応していません。");
        return false;
      }

      setIsLoadingCamera(true);
      try {
        const tryConstraints = async (constraints: MediaTrackConstraints) => {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: constraints,
            audio: false,
          });
          stopStream();
          await attachStreamToVideo(stream);

          const cameras = await refreshCameraList();
          const trackDeviceId = stream.getVideoTracks()[0]?.getSettings().deviceId || "";
          const activeId =
            trackDeviceId ||
            deviceId ||
            cameras.find((camera) =>
              constraints.facingMode === "environment"
                ? camera.label.toLowerCase().includes("back")
                : camera.label.toLowerCase().includes("front")
            )?.deviceId ||
            cameras[0]?.deviceId ||
            "";

          if (activeId) {
            setSelectedDeviceId(activeId);
          }

          setCapturedPhoto(null);
          return true;
        };

        if (deviceId) {
          await tryConstraints({
            deviceId: { exact: deviceId },
            width: { ideal: 1280 },
            height: { ideal: 1706 },
          });
          return true;
        }

        try {
          await tryConstraints({
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 1706 },
          });
          return true;
        } catch (frontError) {
          console.warn("Front camera unavailable, trying environment.", frontError);
          await tryConstraints({
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 1706 },
          });
          return true;
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          deviceId
            ? "選択したカメラにアクセスできませんでした。別のカメラを選んでください。"
            : "カメラへのアクセスが拒否されました。設定を確認してください。"
        );
        return false;
      } finally {
        setIsLoadingCamera(false);
      }
    },
    [attachStreamToVideo, refreshCameraList, stopStream]
  );

  const handleStart = useCallback(() => {
    startCamera(selectedDeviceId || undefined);
  }, [selectedDeviceId, startCamera]);

  const handleCapture = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || !isActive) {
      setErrorMessage("カメラを起動してから撮影してください。");
      return;
    }

    if (videoElement.readyState < 2) {
      setErrorMessage("カメラの初期化中です。少し待ってから再度お試しください。");
      return;
    }

    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    if (!width || !height) {
      setErrorMessage("カメラ映像の取得に失敗しました。再読み込みしてください。");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      setErrorMessage("写真の生成に失敗しました。");
      return;
    }

    context.drawImage(videoElement, 0, 0, width, height);

    try {
      const overlayImage = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = designAssets[design].src;
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("ロゴ画像の読み込みに失敗しました。"));
      });

      const overlayConfig = overlayStates[design];
      const overlayWidth = (overlayConfig.widthPercent / 100) * width;
      const overlayHeight = (overlayWidth / overlayImage.naturalWidth) * overlayImage.naturalHeight;

      const centerX = (overlayConfig.centerXPercent / 100) * width;
      const centerY = (overlayConfig.centerYPercent / 100) * height;

      const drawX = centerX - overlayWidth / 2;
      const drawY = centerY - overlayHeight / 2;

      context.drawImage(overlayImage, drawX, drawY, overlayWidth, overlayHeight);

      const dataUrl = canvas.toDataURL("image/png");
      setCapturedPhoto({
        dataUrl,
        width,
        height,
        design,
      });
      triggerCaptureFeedback();
      setErrorMessage(null);
    } catch (captureError) {
      console.error(captureError);
      setErrorMessage("写真の生成に失敗しました。通信環境をご確認ください。");
    }
  }, [design, isActive, overlayStates, triggerCaptureFeedback]);

  const handleRetake = useCallback(() => {
    if (captureToastTimeoutRef.current) {
      clearTimeout(captureToastTimeoutRef.current);
      captureToastTimeoutRef.current = null;
    }
    setCapturedPhoto(null);
    setErrorMessage(null);
    setShowCaptureFeedback(false);
  }, []);

  const handleDownload = useCallback(() => {
    if (!capturedPhoto) {
      return;
    }

    const link = document.createElement("a");
    link.href = capturedPhoto.dataUrl;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `keion-2025-logo-shot-${capturedPhoto.design}-${timestamp}.png`;
    link.click();
  }, [capturedPhoto]);

  const handleResetOverlay = useCallback(() => {
    const resetState = clampOverlayState(
      createOverlayState(designAssets[design].defaultOverlay),
      design
    );
    setOverlayStates((prev) => ({
      ...prev,
      [design]: resetState,
    }));
    setCapturedPhoto(null);
    if (captureToastTimeoutRef.current) {
      clearTimeout(captureToastTimeoutRef.current);
      captureToastTimeoutRef.current = null;
    }
    setShowCaptureFeedback(false);
  }, [clampOverlayState, design]);

  const handleSizeChange = useCallback(
    (value: number) => {
      let updated = false;
      const newWidth = value;
      setOverlayStates((prev) => {
        const current = prev[design];
        if (!current) {
          return prev;
        }
        const nextState = clampOverlayState({ ...current, widthPercent: newWidth }, design);
        if (
          nextState.widthPercent === current.widthPercent &&
          nextState.centerXPercent === current.centerXPercent &&
          nextState.centerYPercent === current.centerYPercent
        ) {
          return prev;
        }
        updated = true;
        return {
          ...prev,
          [design]: nextState,
        };
      });
      if (updated) {
        setCapturedPhoto(null);
      }
    },
    [clampOverlayState, design]
  );

  const updateOverlayPosition = useCallback(
    (designKey: DesignKey, targetCenterX: number, targetCenterY: number) => {
      let updated = false;
      setOverlayStates((prev) => {
        const current = prev[designKey];
        if (!current) {
          return prev;
        }
        const heightPercent = computeHeightPercent(current.widthPercent, designKey);
        const nextState: OverlayState = {
          ...current,
          centerXPercent: clamp(
            targetCenterX,
            current.widthPercent / 2,
            100 - current.widthPercent / 2
          ),
          centerYPercent: clamp(targetCenterY, heightPercent / 2, 100 - heightPercent / 2),
        };
        if (
          nextState.centerXPercent === current.centerXPercent &&
          nextState.centerYPercent === current.centerYPercent
        ) {
          return prev;
        }
        updated = true;
        return {
          ...prev,
          [designKey]: nextState,
        };
      });
      if (updated) {
        setCapturedPhoto(null);
      }
    },
    [computeHeightPercent]
  );

  const handleOverlayPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!frameRef.current) {
        return;
      }
      event.preventDefault();
      const rect = frameRef.current.getBoundingClientRect();
      const pointerXPercent = ((event.clientX - rect.left) / rect.width) * 100;
      const pointerYPercent = ((event.clientY - rect.top) / rect.height) * 100;
      const current = overlayStates[design];
      dragStateRef.current = {
        pointerId: event.pointerId,
        designKey: design,
        deltaXPercent: current.centerXPercent - pointerXPercent,
        deltaYPercent: current.centerYPercent - pointerYPercent,
      };
      setIsDraggingOverlay(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [design, overlayStates]
  );

  const handleOverlayPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId || !frameRef.current) {
        return;
      }
      event.preventDefault();
      const rect = frameRef.current.getBoundingClientRect();
      const pointerXPercent = ((event.clientX - rect.left) / rect.width) * 100;
      const pointerYPercent = ((event.clientY - rect.top) / rect.height) * 100;
      const targetX = pointerXPercent + dragState.deltaXPercent;
      const targetY = pointerYPercent + dragState.deltaYPercent;
      updateOverlayPosition(dragState.designKey, targetX, targetY);
    },
    [updateOverlayPosition]
  );

  const endOverlayDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }
    dragStateRef.current = null;
    setIsDraggingOverlay(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const handleCameraChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newId = event.target.value;
      if (newId === selectedDeviceId) {
        return;
      }
      const success = await startCamera(newId);
      if (!success) {
        // revert selection if failed
        event.target.value = selectedDeviceId;
      }
    },
    [selectedDeviceId, startCamera]
  );

  useEffect(() => {
    return () => {
      if (captureToastTimeoutRef.current) {
        clearTimeout(captureToastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!capturedPhoto) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      scrollToSavedShot();
    }, 350);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [capturedPhoto, scrollToSavedShot]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  useEffect(() => {
    if (!videoAspectRatio) {
      return;
    }
    setOverlayStates((prev) => {
      let nextState = prev;
      (Object.keys(prev) as DesignKey[]).forEach((key) => {
        const clamped = clampOverlayState(prev[key], key);
        if (
          clamped.widthPercent !== prev[key].widthPercent ||
          clamped.centerXPercent !== prev[key].centerXPercent ||
          clamped.centerYPercent !== prev[key].centerYPercent
        ) {
          if (nextState === prev) {
            nextState = { ...prev };
          }
          nextState[key] = clamped;
        }
      });
      return nextState;
    });
  }, [clampOverlayState, videoAspectRatio]);

  const overlayStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: `${currentOverlay.widthPercent}%`,
      left: `${currentOverlay.centerXPercent}%`,
      top: `${currentOverlay.centerYPercent}%`,
      transform: "translate(-50%, -50%)",
      touchAction: "none",
    };
  }, [currentOverlay]);

  const sizeRange = overlaySizeRange[design];

  return (
    <section className="rounded-3xl border border-white/12 bg-white/8 backdrop-blur-lg">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-10">
        <div className="space-y-4 sm:space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
            logo photo
          </span>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
            スマホで作る軽音ロゴフォトブース
          </h2>
          <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
            ロゴ付き写真をワンタップで保存。
            ロゴは長押しドラッグで移動、スライダーでサイズ調整できます。
          </p>

          <div className="rounded-2xl border border-white/15 bg-slate-900/50 p-4 text-sm text-slate-300">
            <p className="font-medium text-slate-100">撮影の流れ</p>
            <ul className="mt-2 space-y-2">
              <li>1. 「カメラを開く」をタップしてアクセスを許可します。</li>
              <li>2. ロゴをドラッグで位置調整、スライダーでサイズを決めます。</li>
              <li>3. 自撮りはフロントロゴ、背中ショットはバックプリントを選択。</li>
              <li>4. ロゴ位置が決まったら「シャッター」をタップして保存。</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            ref={frameRef}
            className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70"
            style={{ aspectRatio: videoAspectRatio ?? FALLBACK_ASPECT_RATIO }}
          >
            <video
              ref={videoRef}
              className={`h-full w-full object-cover transition-opacity duration-200 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              autoPlay
              playsInline
              muted
            />

            {showCaptureFeedback && (
              <div className="absolute inset-x-0 top-4 z-30 flex justify-center px-4 sm:justify-end sm:px-6">
                <div className="pointer-events-auto flex flex-col items-center gap-2 rounded-2xl bg-emerald-400/95 px-4 py-3 text-slate-950 shadow-[0_18px_36px_rgba(16,185,129,0.35)] sm:flex-row">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                    撮影完了
                  </span>
                </div>
              </div>
            )}

            {isActive && (
              <div
                className={`pointer-events-auto absolute z-10 select-none ${
                  isDraggingOverlay ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={overlayStyle}
                onPointerDown={handleOverlayPointerDown}
                onPointerMove={handleOverlayPointerMove}
                onPointerUp={endOverlayDrag}
                onPointerCancel={endOverlayDrag}
              >
                <CustomImage
                  src={designAssets[design].src}
                  alt={designAssets[design].label}
                  width={designAssets[design].naturalWidth}
                  height={designAssets[design].naturalHeight}
                  unoptimized
                  draggable={false}
                  className="pointer-events-none w-full select-none drop-shadow-[0_8px_24px_rgba(15,15,40,0.45)]"
                />
                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-[2px] text-[10px] font-medium uppercase tracking-[0.28em] text-white/80">
                  drag
                </span>
              </div>
            )}

            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-slate-300">
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-white/80">
                  ready
                </div>
                <p className="text-sm leading-relaxed">
                  スマートフォンでご利用ください。
                  <br />
                  カメラを開くとロゴがリアルタイムで重なります。
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-col items-center gap-2 sm:hidden">
            <div className="flex w-full max-w-[22rem] items-center justify-center gap-4 rounded-2xl border border-white/12 bg-slate-950/85 p-4 shadow-[0_18px_36px_rgba(15,23,42,0.45)] backdrop-blur">
              <button
                type="button"
                onClick={isActive ? handleStop : handleStart}
                className={`flex h-11 flex-1 items-center justify-center rounded-full border border-white/20 bg-black/40 px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition ${
                  isLoadingCamera
                    ? "opacity-50"
                    : "hover:border-white/60 hover:bg-black/55 hover:text-white"
                }`}
                disabled={isLoadingCamera}
              >
                {isActive ? "停止" : "起動"}
              </button>
              <button
                type="button"
                onClick={handleCapture}
                className={`group relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 ${
                  !isActive || isLoadingCamera
                    ? "opacity-40 cursor-not-allowed"
                    : "active:scale-90 hover:scale-105"
                }`}
                disabled={!isActive || isLoadingCamera}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* Outer glow ring */}
                <span
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isActive
                      ? "border-[3px] border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] group-active:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                      : "border-2 border-white/30"
                  }`}
                />

                {/* Inner shutter button */}
                <span
                  className={`absolute left-1/2 top-1/2 block h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-white shadow-[0_4px_20px_rgba(255,255,255,0.4)] group-active:bg-emerald-400 group-active:h-12 group-active:w-12"
                      : "bg-white/50"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(designAssets) as DesignKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setDesign(key);
                    setCapturedPhoto(null);
                  }}
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

            {availableCameras.length > 1 && (
              <label className="mt-4 flex flex-col gap-1 text-xs text-slate-200">
                <span className="font-medium uppercase tracking-[0.16em] text-slate-100">
                  カメラ切替
                </span>
                <select
                  value={selectedDeviceId}
                  onChange={handleCameraChange}
                  className="rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  disabled={isLoadingCamera}
                >
                  {availableCameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="mt-4 space-y-3 text-xs text-slate-200">
              <label className="flex flex-col gap-2">
                <span className="font-medium uppercase tracking-[0.16em] text-slate-100">
                  ロゴサイズ
                </span>
                <input
                  type="range"
                  min={sizeRange.min}
                  max={sizeRange.max}
                  step={1}
                  value={Math.round(currentOverlay.widthPercent)}
                  onChange={(event) => handleSizeChange(Number(event.target.value))}
                  className="w-full accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  <span>small</span>
                  <span>{Math.round(currentOverlay.widthPercent)}%</span>
                  <span>large</span>
                </div>
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleResetOverlay}
                  className="rounded-full border border-white/25 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 hover:border-white/40 hover:text-white"
                >
                  位置をリセット
                </button>
                <span className="self-center text-[11px] text-slate-400">
                  ロゴを長押ししたまま指を動かすと位置を変えられます。
                </span>
              </div>
            </div>

            <div className="mt-5 hidden flex-col gap-2 sm:flex sm:flex-row">
              <button
                type="button"
                onClick={isActive ? handleStop : handleStart}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                  isActive
                    ? "bg-rose-500 text-white hover:bg-rose-400"
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                }`}
                disabled={isLoadingCamera}
              >
                {isActive ? "カメラを閉じる" : "カメラを開く"}
              </button>
              <button
                type="button"
                onClick={handleCapture}
                className="flex-1 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!isActive || isLoadingCamera}
              >
                シャッター
              </button>
            </div>

            {isLoadingCamera && (
              <p className="mt-3 text-xs leading-relaxed text-slate-300">カメラを起動しています…</p>
            )}

            {errorMessage && (
              <p className="mt-3 text-xs leading-relaxed text-rose-300">{errorMessage}</p>
            )}
          </div>

          {capturedPhoto && (
            <div
              ref={savedCardRef}
              className={`space-y-3 rounded-2xl border border-white/12 bg-slate-900/70 p-4 transition ${
                showCaptureFeedback
                  ? "ring-2 ring-emerald-400/70 ring-offset-2 ring-offset-slate-950"
                  : ""
              }`}
            >
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-200">saved shot</p>
              <CustomImage
                src={capturedPhoto.dataUrl}
                alt={`Captured ${capturedPhoto.design} shot`}
                width={capturedPhoto.width}
                height={capturedPhoto.height}
                unoptimized
                className="w-full rounded-xl border border-white/10 object-contain"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 hover:bg-slate-100"
                >
                  写真を保存
                </button>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-200 hover:border-white/40 hover:text-white"
                >
                  撮り直す
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ARTryOnSection;

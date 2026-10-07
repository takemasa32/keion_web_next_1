"use client";
import { useEffect, useRef, useState } from "react";
import AudioContextManager from "../utils/AudioContextManager";

export default function MusicVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const audioManager = AudioContextManager.getInstance();
    const data = new Uint8Array(128);
    let frame = 0;
    const draw = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (
        canvas.width !== Math.round(width * ratio) ||
        canvas.height !== Math.round(height * ratio)
      ) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = "#111e25";
      context.fillRect(0, 0, width, height);
      const analyser = audioManager.getAnalyser();
      data.fill(0);
      if (analyser && !paused && !reducedMotion) analyser.getByteFrequencyData(data);
      const count = 48;
      const gap = 3;
      const barWidth = Math.max(1, (width - gap * (count - 1)) / count);
      for (let i = 0; i < count; i++) {
        const level = data[Math.floor((i * data.length) / count)] / 255;
        const barHeight = Math.max(2, level * (height - 32));
        context.fillStyle = level > 0.7 ? "#e7b477" : "#d4e785";
        context.fillRect(i * (barWidth + gap), height - 16 - barHeight, barWidth, barHeight);
      }
      if (!paused && !reducedMotion && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      draw();
    };
    const observer = new ResizeObserver(() => {
      if (paused || reducedMotion || document.hidden) draw();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused, reducedMotion]);

  return (
    <div className="studio-monitor">
      <canvas ref={canvasRef} role="img" aria-label="再生中の音の周波数を表示するバー" />
      <div>
        <p>
          {reducedMotion
            ? "動きを抑える設定に合わせて表示を停止しています。"
            : paused
              ? "表示を停止中。音はそのまま再生できます。"
              : "音を鳴らすとバーが動きます。"}
        </p>
        {!reducedMotion && (
          <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {paused ? "表示を再開" : "表示を停止"}
          </button>
        )}
      </div>
    </div>
  );
}

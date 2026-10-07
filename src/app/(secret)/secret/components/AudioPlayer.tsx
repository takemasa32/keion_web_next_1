"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import AudioContextManager from "../utils/AudioContextManager";

const soundSamples = [
  {
    id: "baikinman",
    label: "バイキンマン",
    description: "アニメキャラクターの名称",
    file: "/secret/audio/baikinman.mp3",
  },
  {
    id: "burudo-za-",
    label: "ブルドーザー",
    description: "建設機械の名称",
    file: "/secret/audio/burudo-za-.mp3",
  },
  {
    id: "dosu",
    label: "ドス",
    description: "効果音",
    file: "/secret/audio/dosu.mp3",
  },
  {
    id: "meow",
    label: "ニャー",
    description: "猫の鳴き声",
    file: "/secret/audio/meow.mp3",
  },
  {
    id: "wii",
    label: "Wii",
    description: "ゲーム機の名称",
    file: "/secret/audio/wii.mp3",
  },
];

// 音源リストをエクスポートして他のコンポーネントから参照できるようにする
export { soundSamples };

interface AudioPlayerProps {
  onSoundChange?: (soundId: string) => void;
}
export default function AudioPlayer({ onSoundChange }: AudioPlayerProps) {
  const [currentSound, setCurrentSound] = useState("wii");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const requestRef = useRef(0);

  const stopSound = useCallback(() => {
    requestRef.current++;
    const source = sourceRef.current;
    if (source) {
      source.onended = null;
      try {
        source.stop();
      } catch {}
      source.disconnect();
      sourceRef.current = null;
    }
    setPlayingSound(null);
    setLoading(false);
  }, []);

  useEffect(
    () => () => {
      stopSound();
    },
    [stopSound]
  );
  useEffect(() => {
    AudioContextManager.getInstance().setVolume(muted ? 0 : volume);
  }, [muted, volume]);
  useEffect(() => {
    onSoundChange?.(currentSound);
  }, [currentSound, onSoundChange]);

  const playSound = async (id: string) => {
    stopSound();
    const request = ++requestRef.current;
    setCurrentSound(id);
    setError("");
    setLoading(true);
    try {
      const manager = AudioContextManager.getInstance();
      const context = manager.getContext();
      if (context.state === "suspended") await context.resume();
      if (request !== requestRef.current) return;
      const sample = soundSamples.find((sound) => sound.id === id);
      if (!sample) throw new Error("Unknown sound");
      const buffer = await manager.loadAudioFile(sample.file);
      if (request !== requestRef.current) return;
      const source = context.createBufferSource();
      source.buffer = buffer;
      manager.connectSource(source);
      sourceRef.current = source;
      source.onended = () => {
        source.disconnect();
        if (sourceRef.current !== source) return;
        sourceRef.current = null;
        setPlayingSound(null);
      };
      source.start();
      setPlayingSound(id);
    } catch (cause) {
      if (request !== requestRef.current) return;
      console.error("音源の再生に失敗しました", cause);
      setError("音源を再生できませんでした。もう一度お試しください。");
      setPlayingSound(null);
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  };

  const busy = playingSound !== null || loading;
  const selected = soundSamples.find((sound) => sound.id === currentSound);
  const control =
    "min-h-11 border border-[#435158] px-4 py-2 text-sm text-[#f2f4ee] hover:bg-[#34444c] disabled:opacity-40";
  return (
    <section
      className="border border-[#435158] bg-[#202d34] p-4 sm:p-6"
      aria-labelledby="sound-bank-title"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="sound-bank-title" className="text-lg font-semibold text-[#f2f4ee]">
          サウンドバンク
        </h3>
        <p className="text-xs text-[#bdc8cd]" aria-live="polite">
          {loading
            ? "読み込み中…"
            : playingSound
              ? "再生中：" + selected?.label
              : "選択中：" + selected?.label}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {soundSamples.map((sound) => (
          <button
            key={sound.id}
            type="button"
            aria-pressed={currentSound === sound.id}
            onClick={() =>
              busy && currentSound === sound.id ? stopSound() : void playSound(sound.id)
            }
            className={
              "min-h-20 border p-3 text-left " +
              (currentSound === sound.id
                ? "border-[#d4e785] bg-[#d4e785] text-[#17252c]"
                : "border-[#435158] text-[#f2f4ee] hover:bg-[#34444c]")
            }
          >
            <span className="block text-sm font-semibold">{sound.label}</span>
            <span
              className={
                "mt-1 block text-xs " +
                (currentSound === sound.id ? "text-[#334337]" : "text-[#bdc8cd]")
              }
            >
              {sound.description}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#435158] pt-5">
        <button
          type="button"
          className={control}
          onClick={() => (busy ? stopSound() : void playSound(currentSound))}
        >
          {busy ? "停止 ■" : "再生 ▶"}
        </button>
        <button
          type="button"
          className={control}
          onClick={() =>
            void playSound(soundSamples[Math.floor(Math.random() * soundSamples.length)].id)
          }
        >
          ランダム
        </button>
        <button
          type="button"
          className={control}
          aria-pressed={muted}
          onClick={() => setMuted((value) => !value)}
        >
          {muted ? "ミュート解除" : "ミュート"}
        </button>
        <label className="flex min-h-11 flex-1 items-center gap-3 text-sm text-[#bdc8cd]">
          <span className="whitespace-nowrap">音量 {Math.round(volume * 100)}%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="min-w-20 flex-1 accent-[#d4e785]"
          />
        </label>
      </div>
      <p className="mt-3 text-xs text-[#bdc8cd]">
        音源を押すと再生されます。音量とミュートは鍵盤にも反映されます。
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#f4d39d]">
          {error}
        </p>
      )}
    </section>
  );
}

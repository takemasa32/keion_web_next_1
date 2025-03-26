"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaRandom, FaMusic, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import AudioContextManager from "../utils/AudioContextManager";

// 利用可能な音源ファイルの定義
const soundSamples = [
  {
    id: "baikinman",
    label: "バイキンマン",
    description: "アニメキャラクターの名称",
    color: "from-purple-500 to-pink-400",
    file: "/secret/audio/baikinman.mp3",
  },
  {
    id: "burudo-za-",
    label: "ブルドーザー",
    description: "建設機械の名称",
    color: "from-yellow-500 to-orange-400",
    file: "/secret/audio/burudo-za-.mp3",
  },
  {
    id: "dosu",
    label: "ドス",
    description: "効果音",
    color: "from-red-500 to-orange-400",
    file: "/secret/audio/dosu.mp3",
  },
  {
    id: "meow",
    label: "ニャー",
    description: "猫の鳴き声",
    color: "from-green-500 to-emerald-400",
    file: "/secret/audio/meow.mp3",
  },
  {
    id: "wii",
    label: "Wii",
    description: "ゲーム機の名称",
    color: "from-blue-500 to-cyan-400",
    file: "/secret/audio/wii.mp3",
  },
];

// 音源リストをエクスポートして他のコンポーネントから参照できるようにする
export { soundSamples };

interface AudioPlayerProps {
  onSoundChange?: (soundId: string) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onSoundChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string>("wii");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBuffersRef = useRef<Record<string, AudioBuffer>>({});

  // 特定の音源IDを指定して再生
  const playSpecificSound = async (soundId: string) => {
    try {
      // 既存の音源を停止
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }

      // AudioContextManagerを取得
      const audioManager = AudioContextManager.getInstance();
      const ctx = audioManager.getContext();

      // ユーザーインタラクションに応じてAudioContextを再開
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // 指定された音声ファイルの取得
      const selectedSound = soundSamples.find((sound) => sound.id === soundId);
      if (!selectedSound) return;

      console.log(`Loading sound: ${selectedSound.file}`);

      // AudioBufferを取得または作成
      let buffer: AudioBuffer;
      if (audioBuffersRef.current[soundId]) {
        buffer = audioBuffersRef.current[soundId];
      } else {
        try {
          // 音声ファイルの読み込み
          const response = await fetch(selectedSound.file);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch sound file: ${response.status} ${response.statusText}`
            );
          }
          const arrayBuffer = await response.arrayBuffer();
          buffer = await ctx.decodeAudioData(arrayBuffer);
          audioBuffersRef.current[soundId] = buffer;
        } catch (err) {
          console.error(`Error loading sound file: ${selectedSound.file}`, err);
          return;
        }
      }

      // 音源を作成
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // AudioContextManagerを通して接続
      audioManager.connectSource(source);
      sourceNodeRef.current = source;

      // 再生完了時の処理
      source.onended = () => {
        setIsPlaying(false);
        setPlayingSound(null);
        sourceNodeRef.current = null;
      };

      // 再生開始
      source.start(0);
      setIsPlaying(true);
      setPlayingSound(soundId);

      // 状態更新
      if (currentSound !== soundId) {
        setCurrentSound(soundId);
      }

      // 親コンポーネントに選択した音源を通知
      if (onSoundChange) {
        onSoundChange(soundId);
      }
    } catch (e) {
      console.error("音声再生エラー", e);
      setIsPlaying(false);
      setPlayingSound(null);
    }
  };

  // 現在選択中の音源を再生
  const playSound = async () => {
    await playSpecificSound(currentSound);
  };

  // 再生を停止
  const stopSound = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        console.error("音声停止エラー", e);
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    setPlayingSound(null);
  };

  // サウンドを選択して自動再生
  const selectSound = (soundId: string) => {
    if (isPlaying && currentSound === soundId) {
      // 既に再生中の場合は停止
      stopSound();
    } else {
      // 新しい音源を直接再生（非同期処理の問題を回避）
      playSpecificSound(soundId);
    }
  };

  // ランダムなサウンドを選択
  const selectRandomSound = () => {
    const randomIndex = Math.floor(Math.random() * soundSamples.length);
    const newSoundId = soundSamples[randomIndex].id;

    // ランダムに選んだ音源を直接再生
    playSpecificSound(newSoundId);
  };

  // 音量調整
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    const audioManager = AudioContextManager.getInstance();
    audioManager.setVolume(isMuted ? 0 : newVolume);
  };

  // ミュート切り替え
  const toggleMute = () => {
    const audioManager = AudioContextManager.getInstance();
    if (isMuted) {
      audioManager.setVolume(volume);
    } else {
      audioManager.setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  // 初期音量設定と初期音源通知
  useEffect(() => {
    const audioManager = AudioContextManager.getInstance();
    audioManager.setVolume(volume);

    // 初期音源を親コンポーネントに通知
    if (onSoundChange) {
      onSoundChange(currentSound);
    }
  }, []);

  // コンポーネントのアンマウント時にリソースを解放
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* サウンドコントロール - モバイル向けにレイアウト調整 */}
      <motion.div
        className="bg-black/20 backdrop-blur-sm rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1">
          <h3 className="text-white text-sm font-medium mb-1">サウンドエフェクト</h3>
          <p className="text-white/60 text-xs">
            現在: {soundSamples.find((s) => s.id === currentSound)?.label || currentSound}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-2">
          {/* 音量コントロール - モバイル向けに調整 */}
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={toggleMute}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              {isMuted ? (
                <FaVolumeMute className="text-white/70 text-lg" />
              ) : (
                <FaVolumeUp className="text-white/70 text-lg" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full sm:w-24 accent-purple-500"
            />
          </div>

          {/* 再生コントロールボタン - タップしやすく調整 */}
          <div className="flex items-center gap-3 sm:gap-2 w-full sm:w-auto justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={selectRandomSound}
              className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-purple-600/50 flex items-center justify-center text-white"
            >
              <FaRandom className="text-lg sm:text-base" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isPlaying ? stopSound : playSound}
              className={`w-14 h-14 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white ${
                isPlaying ? "bg-red-600" : "bg-indigo-600"
              }`}
            >
              {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* サウンドサンプルグリッド - モバイルでも見やすく調整 */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
        {soundSamples.map((sound) => (
          <motion.button
            key={sound.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectSound(sound.id)}
            className={`p-4 rounded-lg bg-gradient-to-br ${sound.color} relative overflow-hidden
              ${currentSound === sound.id ? "ring-2 ring-white" : "opacity-80"}`}
          >
            {playingSound === sound.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1.8] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 bg-white/20 rounded-full mx-auto my-auto w-8 h-8"
                style={{ left: "calc(50% - 1rem)", top: "calc(50% - 1rem)" }}
              />
            )}
            <div className="relative z-10">
              <FaMusic className="mb-1 mx-auto text-white/90 text-lg" />
              <p className="text-sm font-medium text-white mb-1">{sound.label}</p>
              <p className="text-xs text-white/80">{sound.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;

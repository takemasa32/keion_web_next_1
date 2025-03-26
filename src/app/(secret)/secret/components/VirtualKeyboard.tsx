"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AudioContextManager from "../utils/AudioContextManager";
import { soundSamples } from "./AudioPlayer";
import {
  FaMusic,
  FaGuitar,
  FaToggleOn,
  FaWaveSquare,
  FaSlidersH,
  FaTools,
  FaTimes,
} from "react-icons/fa";

// ピアノキーの配置データ
type PianoKey = {
  note: string;
  color: "white" | "black";
  label: string;
  frequency: number;
  keyboardKey?: string; // キーボードショートカット
};

// キーボードレイアウト定義
const keyboardLayout: PianoKey[] = [
  { note: "C4", color: "white", label: "ド", frequency: 261.63, keyboardKey: "a" },
  { note: "C#4", color: "black", label: "ド#", frequency: 277.18, keyboardKey: "w" },
  { note: "D4", color: "white", label: "レ", frequency: 293.66, keyboardKey: "s" },
  { note: "D#4", color: "black", label: "レ#", frequency: 311.13, keyboardKey: "e" },
  { note: "E4", color: "white", label: "ミ", frequency: 329.63, keyboardKey: "d" },
  { note: "F4", color: "white", label: "ファ", frequency: 349.23, keyboardKey: "f" },
  { note: "F#4", color: "black", label: "ファ#", frequency: 369.99, keyboardKey: "t" },
  { note: "G4", color: "white", label: "ソ", frequency: 392.0, keyboardKey: "g" },
  { note: "G#4", color: "black", label: "ソ#", frequency: 415.3, keyboardKey: "y" },
  { note: "A4", color: "white", label: "ラ", frequency: 440.0, keyboardKey: "h" },
  { note: "A#4", color: "black", label: "ラ#", frequency: 466.16, keyboardKey: "u" },
  { note: "B4", color: "white", label: "シ", frequency: 493.88, keyboardKey: "j" },
];

// 再生モードを定義
type PlayMode = "combined" | "effectOnly" | "pianoOnly";

// 波形タイプを定義
type WaveformType = "sine" | "square" | "sawtooth" | "triangle";

// 音色の定義
const waveforms: { type: WaveformType; label: string; color: string }[] = [
  { type: "sine", label: "サイン波", color: "bg-blue-600" },
  { type: "square", label: "矩形波", color: "bg-purple-600" },
  { type: "triangle", label: "三角波", color: "bg-green-600" },
  { type: "sawtooth", label: "ノコギリ波", color: "bg-red-600" },
];

// 波形パラメータの型定義
interface WaveformParams {
  attack: number; // アタック時間 (0.0-2.0秒)
  decay: number; // ディケイ時間 (0.0-2.0秒)
  sustain: number; // サスティンレベル (0.0-1.0)
  release: number; // リリース時間 (0.0-5.0秒)
  detune: number; // デチューン (-100 to 100 セント)
  filterFreq: number; // フィルター周波数 (50-10000Hz)
  filterQ: number; // フィルターQ (0.1-20.0)
  filterType: BiquadFilterType; // フィルタータイプ
  vibratoRate: number; // ビブラート速度 (0.0-20.0Hz)
  vibratoDepth: number; // ビブラート深さ (0-50セント)
}

interface VirtualKeyboardProps {
  currentSoundId?: string;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ currentSoundId = "wii" }) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [playMode, setPlayMode] = useState<PlayMode>("combined"); // 再生モード
  const [waveformType, setWaveformType] = useState<WaveformType>("sine"); // 波形タイプ
  const [showWaveformMenu, setShowWaveformMenu] = useState(false); // 波形メニューの表示状態
  const [showEditor, setShowEditor] = useState(false);
  const [waveformParams, setWaveformParams] = useState<WaveformParams>({
    attack: 0.01,
    decay: 0.1,
    sustain: 0.7,
    release: 0.2,
    detune: 0,
    filterFreq: 5000,
    filterQ: 1,
    filterType: "lowpass",
    vibratoRate: 5,
    vibratoDepth: 10,
  });
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const soundBuffersRef = useRef<Record<string, AudioBuffer>>({});
  const keyMappingRef = useRef<Map<string, PianoKey>>(new Map());
  const waveformMenuRef = useRef<HTMLDivElement>(null);

  // キーボードマッピングを設定
  useEffect(() => {
    const mapping = new Map<string, PianoKey>();
    keyboardLayout.forEach((key) => {
      if (key.keyboardKey) {
        mapping.set(key.keyboardKey, key);
      }
    });
    keyMappingRef.current = mapping;
  }, []);

  // 現在選択されているサウンドIDが変更されたときにバッファをロード
  useEffect(() => {
    if (!currentSoundId) return;

    const loadSelectedSound = async () => {
      const selectedSound = soundSamples.find((s) => s.id === currentSoundId);
      if (!selectedSound) return;

      try {
        const audioManager = AudioContextManager.getInstance();

        // バッファが既にロードされているか確認
        if (!soundBuffersRef.current[currentSoundId]) {
          console.log(`Loading keyboard sound: ${selectedSound.file}`);
          const response = await fetch(selectedSound.file);
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          const ctx = audioManager.getContext();
          const buffer = await ctx.decodeAudioData(arrayBuffer);
          soundBuffersRef.current[currentSoundId] = buffer;
        }

        audioBufferRef.current = soundBuffersRef.current[currentSoundId];
      } catch (err) {
        console.error("サウンドファイルのロードエラー:", err);
      }
    };

    loadSelectedSound();
  }, [currentSoundId]);

  // 波形メニュー外のクリックを検知してメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (waveformMenuRef.current && !waveformMenuRef.current.contains(event.target as Node)) {
        setShowWaveformMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // キーボードイベントを監視
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // キーリピートを防ぐ

      const key = keyMappingRef.current.get(e.key.toLowerCase());
      if (key) {
        playNote(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSoundId, playMode, waveformType]); // waveformTypeの変更もトラッキング

  // モードを切り替える関数
  const toggleMode = () => {
    setPlayMode((prev) => {
      // モードを循環させる: combined -> effectOnly -> pianoOnly -> combined
      if (prev === "combined") return "effectOnly";
      if (prev === "effectOnly") return "pianoOnly";
      return "combined";
    });
  };

  // 波形メニューの表示を切り替える
  const toggleWaveformMenu = () => {
    setShowWaveformMenu((prev) => !prev);
  };

  // 波形タイプを変更する
  const changeWaveformType = (type: WaveformType) => {
    setWaveformType(type);
    setShowWaveformMenu(false);
  };

  // 波形エディターの表示/非表示を切り替え
  const toggleEditor = () => {
    setShowEditor((prev) => !prev);
  };

  // 波形パラメータを更新する関数
  const updateWaveformParam = (param: keyof WaveformParams, value: number | BiquadFilterType) => {
    setWaveformParams((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const playNote = (key: PianoKey) => {
    setActiveKey(key.note);
    setTimeout(() => setActiveKey(null), 300);

    try {
      // AudioContextManagerを使用
      const audioManager = AudioContextManager.getInstance();
      const ctx = audioManager.getContext();

      // コンテキストが停止していたら再開
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // ピアノ音を再生（combined モードまたは pianoOnly モードの場合）
      if (playMode !== "effectOnly") {
        // オシレーターとゲインノードの作成
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // フィルター作成
        const filter = ctx.createBiquadFilter();
        filter.type = waveformParams.filterType;
        filter.frequency.value = waveformParams.filterFreq;
        filter.Q.value = waveformParams.filterQ;

        // 基本設定
        osc.frequency.value = key.frequency;
        osc.type = waveformType;
        osc.detune.value = waveformParams.detune;

        // ビブラート効果（LFO）を追加
        if (waveformParams.vibratoDepth > 0) {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();

          lfo.frequency.value = waveformParams.vibratoRate;
          lfoGain.gain.value = waveformParams.vibratoDepth;

          lfo.connect(lfoGain);
          lfoGain.connect(osc.detune);
          lfo.start();

          // 再生終了時にLFOを停止
          setTimeout(() => {
            lfo.stop();
            lfo.disconnect();
            lfoGain.disconnect();
          }, (waveformParams.attack + waveformParams.decay + waveformParams.release) * 1000 + 100);
        }

        // ADSRエンベロープを適用
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(1, now + waveformParams.attack); // Attack
        gainNode.gain.linearRampToValueAtTime(
          waveformParams.sustain,
          now + waveformParams.attack + waveformParams.decay
        ); // Decay to Sustain
        gainNode.gain.setValueAtTime(
          waveformParams.sustain,
          now + waveformParams.attack + waveformParams.decay
        ); // Sustain
        gainNode.gain.linearRampToValueAtTime(
          0,
          now + waveformParams.attack + waveformParams.decay + waveformParams.release
        ); // Release

        // ノードを接続
        osc.connect(filter);
        filter.connect(gainNode);
        audioManager.connectSource(gainNode);

        // 再生開始と停止
        osc.start();
        osc.stop(now + waveformParams.attack + waveformParams.decay + waveformParams.release + 0.1);

        // 再生完了時にリソースを解放
        setTimeout(() => {
          osc.disconnect();
          filter.disconnect();
          gainNode.disconnect();
        }, (waveformParams.attack + waveformParams.decay + waveformParams.release) * 1000 + 200);
      }

      // サンプル音源を再生（combined モードまたは effectOnly モードの場合）
      if (playMode !== "pianoOnly" && audioBufferRef.current) {
        const sampleSource = ctx.createBufferSource();
        sampleSource.buffer = audioBufferRef.current;

        // ピッチをキーボードの音に合わせて調整
        const noteIndex = keyboardLayout.findIndex((k) => k.note === key.note);
        // ミドルCを基準にピッチを変える
        const pitchOffset = (noteIndex - 0) / 12; // 0はC4を基準とする
        sampleSource.playbackRate.value = Math.pow(2, pitchOffset);

        // 音量調整と接続
        const sampleGain = ctx.createGain();
        // エフェクトのみモードの場合は音量を上げる
        sampleGain.gain.value = playMode === "effectOnly" ? 0.7 : 0.5;

        // ビジュアライザーに接続するためAudioContextManagerを使用
        sampleSource.connect(sampleGain);
        audioManager.connectSource(sampleGain);

        sampleSource.start();
        sampleSource.onended = () => {
          sampleSource.disconnect();
        };
      }
    } catch (e) {
      console.error("音声再生エラー", e);
    }
  };

  // モードに応じたボタン表示を取得
  const getModeButton = () => {
    switch (playMode) {
      case "effectOnly":
        return (
          <>
            <FaGuitar className="text-white" />
            <span className="text-xs text-white">エフェクトのみ</span>
          </>
        );
      case "pianoOnly":
        return (
          <>
            <FaMusic className="text-white" />
            <span className="text-xs text-white">ピアノ音のみ</span>
          </>
        );
      default:
        return (
          <>
            <FaMusic className="text-white" />
            <span className="text-xs text-white">ピアノ+エフェクト</span>
          </>
        );
    }
  };

  // モードに応じた背景色を取得
  const getModeColor = () => {
    switch (playMode) {
      case "effectOnly":
        return "bg-purple-600";
      case "pianoOnly":
        return "bg-blue-600";
      default:
        return "bg-gray-700";
    }
  };

  // モードに応じたヘルプテキストを取得
  const getModeHelpText = () => {
    switch (playMode) {
      case "effectOnly":
        return "サウンドエフェクトのみモード：ピアノ音なしでエフェクトサウンドを演奏します";
      case "pianoOnly":
        return "ピアノ音のみモード：純粋なピアノ音だけで演奏します";
      default:
        return "キーボードのキー（A, S, D...）でも演奏できます";
    }
  };

  // 現在選択中の波形タイプを取得
  const getCurrentWaveform = () => {
    return waveforms.find((w) => w.type === waveformType) || waveforms[0];
  };

  return (
    <div className="w-full bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-white/10">
      {/* ヘッダー部分 - モバイル向けに調整 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-white text-lg font-medium">バーチャルピアノ</h3>

        {/* コントロールボタン - モバイル用に横スクロール可能に */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {/* 波形エディターボタン */}
          <motion.button
            onClick={toggleEditor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-md ${
              showEditor ? "bg-emerald-600" : "bg-gray-700"
            }`}
          >
            <FaTools className="text-white" />
            <span className="text-xs text-white whitespace-nowrap">波形エディタ</span>
          </motion.button>

          {/* 波形タイプ選択ボタン */}
          <div className="relative flex-shrink-0">
            <motion.button
              onClick={toggleWaveformMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1 px-3 py-2 rounded-md ${
                getCurrentWaveform().color
              }`}
            >
              <FaWaveSquare className="text-white" />
              <span className="text-xs text-white whitespace-nowrap">
                {getCurrentWaveform().label}
              </span>
              <FaSlidersH className="text-white/70 ml-1" />
            </motion.button>

            {/* 波形選択メニュー - z-indexを上げて最前面に表示 */}
            {showWaveformMenu && (
              <motion.div
                ref={waveformMenuRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-1 bg-gray-800 rounded-md shadow-lg z-[9999] min-w-[120px]"
                style={{ position: "absolute", zIndex: 9999 }}
              >
                {waveforms.map((waveform) => (
                  <button
                    key={waveform.type}
                    onClick={() => changeWaveformType(waveform.type)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md text-white hover:bg-gray-700 flex items-center justify-between ${
                      waveformType === waveform.type ? "bg-gray-700" : ""
                    }`}
                  >
                    {waveform.label}
                    <div
                      className={`w-2 h-2 rounded-full ${waveform.color.replace("bg-", "bg-")}`}
                    ></div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* 再生モード切替ボタン */}
          <motion.button
            onClick={toggleMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${getModeColor()}`}
          >
            {getModeButton()}
            <FaToggleOn className="text-white ml-1" />
          </motion.button>
        </div>
      </div>

      {/* 波形エディターパネル - モバイル向けにスクロール可能に */}
      {showEditor && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 bg-gray-800/80 rounded-lg p-3 sm:p-4 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white/90 text-sm font-medium">波形エディター</h4>
            <button onClick={toggleEditor} className="text-white/60 hover:text-white p-2">
              <FaTimes />
            </button>
          </div>

          {/* パラメーター部分をスクロール可能に */}
          <div className="max-h-[50vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4">
              {/* エンベロープ設定 */}
              <div className="space-y-3">
                <h5 className="text-white/80 text-xs font-medium mb-2">エンベロープ (ADSR)</h5>
                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    アタック
                    <span>{waveformParams.attack.toFixed(2)}秒</span>
                  </label>
                  <input
                    type="range"
                    min="0.001"
                    max="2"
                    step="0.01"
                    value={waveformParams.attack}
                    onChange={(e) => updateWaveformParam("attack", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    ディケイ
                    <span>{waveformParams.decay.toFixed(2)}秒</span>
                  </label>
                  <input
                    type="range"
                    min="0.001"
                    max="2"
                    step="0.01"
                    value={waveformParams.decay}
                    onChange={(e) => updateWaveformParam("decay", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    サスティン
                    <span>{waveformParams.sustain.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={waveformParams.sustain}
                    onChange={(e) => updateWaveformParam("sustain", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    リリース
                    <span>{waveformParams.release.toFixed(2)}秒</span>
                  </label>
                  <input
                    type="range"
                    min="0.001"
                    max="5"
                    step="0.01"
                    value={waveformParams.release}
                    onChange={(e) => updateWaveformParam("release", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* 効果設定 */}
              <div className="space-y-3">
                <h5 className="text-white/80 text-xs font-medium mb-2">エフェクト</h5>

                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    デチューン
                    <span>{waveformParams.detune}セント</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={waveformParams.detune}
                    onChange={(e) => updateWaveformParam("detune", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    フィルター周波数
                    <span>{waveformParams.filterFreq}Hz</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="10000"
                    step="10"
                    value={waveformParams.filterFreq}
                    onChange={(e) => updateWaveformParam("filterFreq", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    フィルターQ
                    <span>{waveformParams.filterQ.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={waveformParams.filterQ}
                    onChange={(e) => updateWaveformParam("filterQ", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="flex space-x-2 items-center">
                  <label className="text-white/70 text-xs">フィルタータイプ</label>
                  <select
                    value={waveformParams.filterType}
                    onChange={(e) =>
                      updateWaveformParam("filterType", e.target.value as BiquadFilterType)
                    }
                    className="bg-gray-900 text-white/90 text-xs rounded px-2 py-1 border border-gray-700"
                  >
                    <option value="lowpass">ローパス</option>
                    <option value="highpass">ハイパス</option>
                    <option value="bandpass">バンドパス</option>
                    <option value="notch">ノッチ</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    ビブラート速度
                    <span>{waveformParams.vibratoRate}Hz</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={waveformParams.vibratoRate}
                    onChange={(e) => updateWaveformParam("vibratoRate", parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/70 text-xs flex justify-between">
                    ビブラート深さ
                    <span>{waveformParams.vibratoDepth}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={waveformParams.vibratoDepth}
                    onChange={(e) =>
                      updateWaveformParam("vibratoDepth", parseFloat(e.target.value))
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-white/60 text-xs mb-4 text-center">
        {currentSoundId && playMode !== "pianoOnly"
          ? `現在の音源: ${
              soundSamples.find((s) => s.id === currentSoundId)?.label || currentSoundId
            }, 音色: ${getCurrentWaveform().label}`
          : `音色: ${getCurrentWaveform().label}`}
        {showEditor && " - 波形エディターモード"}
      </p>

      {/* キーボード - タッチ操作向けに最適化 */}
      <div className="touch-manipulation overflow-x-auto pb-2">
        <div className="flex min-w-[600px] relative h-32 sm:h-40 md:h-48 rounded-md overflow-hidden">
          {keyboardLayout.map((key) => {
            const isActive = activeKey === key.note;
            const isWhiteKey = key.color === "white";

            return (
              <motion.div
                key={key.note}
                className={`relative ${isWhiteKey ? "white-key z-0" : "black-key z-10"}`}
                animate={{
                  backgroundColor: isActive
                    ? isWhiteKey
                      ? "rgba(147, 51, 234, 0.9)"
                      : "rgba(236, 72, 153, 0.9)"
                    : isWhiteKey
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(0, 0, 0, 0.9)",
                  y: isActive ? 4 : 0,
                }}
                transition={{ duration: 0.1 }}
                onClick={() => playNote(key)}
                style={{
                  flex: isWhiteKey ? 1 : "none",
                  height: isWhiteKey ? "100%" : "60%",
                  width: isWhiteKey ? "auto" : "30px",
                  marginLeft: isWhiteKey ? 0 : "-15px",
                  marginRight: isWhiteKey ? 0 : "-15px",
                  borderRadius: isWhiteKey ? "0 0 6px 6px" : "0 0 4px 4px",
                  border: isWhiteKey ? "1px solid rgba(0,0,0,0.2)" : "none",
                  boxShadow: isWhiteKey
                    ? "0 2px 5px rgba(0,0,0,0.15)"
                    : "0 2px 3px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                }}
              >
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                  <span
                    className={`text-xs sm:text-sm ${
                      isWhiteKey ? "text-gray-500" : "text-gray-300"
                    }`}
                  >
                    {key.label}
                  </span>
                  {key.keyboardKey && (
                    <span
                      className={`hidden sm:inline-block text-xs mt-1 px-1.5 py-0.5 rounded-sm bg-black/20
                      ${isWhiteKey ? "text-gray-500" : "text-gray-300"}`}
                    >
                      {key.keyboardKey}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-white/40 text-xs mt-4">
        {showEditor ? "波形パラメータを調整して独自の音色を作成してください" : getModeHelpText()}
      </p>
    </div>
  );
};

export default VirtualKeyboard;

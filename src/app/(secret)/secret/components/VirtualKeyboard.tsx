"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

// ピアノキーの配置データ型定義
type PianoKey = {
  note: string;
  color: "white" | "black";
  label: string;
  frequency: number;
  keyboardKey?: string; // キーボードショートカット
};

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

// 音名とオクターブを取得する関数
const getNoteAndOctave = (fullNote: string): { note: string; octave: number } => {
  const noteMatch = fullNote.match(/^([A-G][#]?)(\d+)$/);
  if (noteMatch) {
    return { note: noteMatch[1], octave: parseInt(noteMatch[2]) };
  }
  return { note: "", octave: 4 };
};

// 基準の周波数マッピング（オクターブ4の周波数）
const baseFrequencies: { [key: string]: number } = {
  C: 261.63,
  "C#": 277.18,
  D: 293.66,
  "D#": 311.13,
  E: 329.63,
  F: 349.23,
  "F#": 369.99,
  G: 392.0,
  "G#": 415.3,
  A: 440.0,
  "A#": 466.16,
  B: 493.88,
};

// オクターブに基づいて周波数を計算する関数
const calculateFrequency = (note: string, octave: number): number => {
  const { note: noteName } = getNoteAndOctave(`${note}4`);
  if (!noteName || !baseFrequencies[noteName]) return 440;

  const baseFreq = baseFrequencies[noteName];
  const octaveDiff = octave - 4;
  return baseFreq * Math.pow(2, octaveDiff);
};

// 鍵盤レイアウトを動的に生成する関数
const generateKeyboardLayout = (
  baseOctave: number,
  keyboardMapping: boolean = true
): PianoKey[] => {
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const keyLabels = [
    "ド",
    "ド#",
    "レ",
    "レ#",
    "ミ",
    "ファ",
    "ファ#",
    "ソ",
    "ソ#",
    "ラ",
    "ラ#",
    "シ",
  ];

  // コンピューターキーボードのマッピング
  const keyboardKeys = keyboardMapping
    ? ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j"]
    : [];

  // 低いオクターブから高いオクターブまでの音を生成
  const layout: PianoKey[] = [];

  // 2つのオクターブ分の鍵盤を生成
  [baseOctave, baseOctave + 1].forEach((octave, octaveIndex) => {
    notes.forEach((note, index) => {
      const fullNote = `${note}${octave}`;
      const frequency = calculateFrequency(note, octave);
      layout.push({
        note: fullNote,
        color: note.includes("#") ? "black" : "white",
        label: `${keyLabels[index]}${octave}`,
        frequency,
        keyboardKey:
          octaveIndex === 0 && index < keyboardKeys.length ? keyboardKeys[index] : undefined,
      });
    });
  });

  return layout;
};

interface VirtualKeyboardProps {
  currentSoundId?: string;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ currentSoundId = "wii" }) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [playMode, setPlayMode] = useState<PlayMode>("combined"); // 再生モード
  const [waveformType, setWaveformType] = useState<WaveformType>("sine"); // 波形タイプ
  const [showWaveformMenu, setShowWaveformMenu] = useState(false); // 波形メニューの表示状態
  const [showEditor, setShowEditor] = useState(false); // エディター表示状態
  const [baseOctave, setBaseOctave] = useState(3); // 基本オクターブ（C3〜B4を表示）
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

  // キーボードレイアウトの状態
  const [keyboardLayout, setKeyboardLayout] = useState<PianoKey[]>([]);

  // スクロール操作に関する状態
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollStartX, setScrollStartX] = useState(0);
  const keyboardContainerRef = useRef<HTMLDivElement>(null);

  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const soundBuffersRef = useRef<Record<string, AudioBuffer>>({});
  const keyMappingRef = useRef<Map<string, PianoKey>>(new Map());
  const waveformMenuRef = useRef<HTMLDivElement>(null);

  // オクターブに基づいてキーボードレイアウトを更新
  useEffect(() => {
    const newLayout = generateKeyboardLayout(baseOctave);
    setKeyboardLayout(newLayout);

    // キーマッピングを更新
    const mapping = new Map<string, PianoKey>();
    newLayout.forEach((key) => {
      if (key.keyboardKey) {
        mapping.set(key.keyboardKey, key);
      }
    });
    keyMappingRef.current = mapping;
  }, [baseOctave]);

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
      } else if (e.key === "ArrowUp") {
        handleOctaveChange(1);
      } else if (e.key === "ArrowDown") {
        handleOctaveChange(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [baseOctave, currentSoundId, playMode, waveformType, playNote, handleOctaveChange]); // オクターブの変更もトラッキング

  // オクターブを変更する関数
  const handleOctaveChange = useCallback((change: number) => {
    setBaseOctave((prev) => {
      const newOctave = prev + change;
      // オクターブの範囲を1〜7に制限
      return Math.max(0, Math.min(7, newOctave));
    });
  }, []);

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

  // スクロール開始の処理
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScrolling(true);
    setScrollStartX(e.touches[0].clientX);
  };

  // スクロール中の処理
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScrolling || !keyboardContainerRef.current) return;

    const touchDeltaX = e.touches[0].clientX - scrollStartX;
    if (Math.abs(touchDeltaX) > 50) {
      // 左にスワイプ: オクターブアップ
      if (touchDeltaX < 0) {
        handleOctaveChange(1);
      }
      // 右にスワイプ: オクターブダウン
      else {
        handleOctaveChange(-1);
      }
      setIsScrolling(false);
    }
  };

  // スクロール終了の処理
  const handleTouchEnd = () => {
    setIsScrolling(false);
  };

  const playNote = useCallback(
    (key: PianoKey) => {
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
        // ピッチ計算の基準を変更
        const basePitch = calculateFrequency("C", 4);
        const targetPitch = key.frequency;
        const pitchRatio = targetPitch / basePitch;

        sampleSource.playbackRate.value = pitchRatio;

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
    },
    [playMode, waveformParams, waveformType]
  );

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

      {/* オクターブ切り替えコントロール */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => handleOctaveChange(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={baseOctave <= 0}
            className={`p-2 rounded-md ${
              baseOctave <= 0 ? "bg-gray-700 text-gray-500" : "bg-indigo-700 text-white"
            }`}
          >
            <FaArrowDown className="text-sm" />
          </motion.button>

          <div className="bg-black/30 px-3 py-1 rounded-md">
            <span className="text-white text-xs">
              オクターブ: {baseOctave}-{baseOctave + 1}
            </span>
          </div>

          <motion.button
            onClick={() => handleOctaveChange(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={baseOctave >= 7}
            className={`p-2 rounded-md ${
              baseOctave >= 7 ? "bg-gray-700 text-gray-500" : "bg-indigo-700 text-white"
            }`}
          >
            <FaArrowUp className="text-sm" />
          </motion.button>
        </div>

        <div className="text-white/50 text-xs hidden sm:flex items-center">
          <FaArrowLeft className="mr-1" />
          <span>スワイプで音域変更</span>
          <FaArrowRight className="ml-1" />
        </div>
      </div>

      <p className="text-white/60 text-xs mb-4 text-center">
        {currentSoundId && playMode !== "pianoOnly"
          ? `現在の音源: ${
              soundSamples.find((s) => s.id === currentSoundId)?.label || currentSoundId
            }, 音色: ${getCurrentWaveform().label}`
          : `音色: ${getCurrentWaveform().label}`}
        {showEditor && " - 波形エディターモード"}
      </p>

      {/* キーボード - タッチ操作とスワイプ向けに最適化 */}
      <div
        className="touch-manipulation overflow-x-auto pb-2"
        ref={keyboardContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex min-w-[600px] relative h-32 sm:h-40 md:h-48 rounded-md overflow-hidden">
          {keyboardLayout.map((key) => {
            const isActive = activeKey === key.note;
            const isWhiteKey = key.color === "white";
            const { note, octave } = getNoteAndOctave(key.note);

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
                    {note}
                    <sub className="text-[0.6em]">{octave}</sub>
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
      <div className="sm:hidden flex justify-center mt-3 bg-black/30 py-2 rounded-md">
        {/* スマホ向けスワイプガイド */}
        <div className="sm:hidden flex justify-center mt-3 bg-black/30 py-2 rounded-md">
          <div className="flex items-center text-white/50 text-xs">
            <FaArrowLeft className="mr-2 text-white/50" />
            <span>左右にスワイプして音域を変更</span>
            <FaArrowRight className="ml-2 text-white/50" />
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-4">
          {showEditor ? "波形パラメータを調整して独自の音色を作成してください" : getModeHelpText()}
        </p>
      </div>
    </div>
  );
};

export default VirtualKeyboard;

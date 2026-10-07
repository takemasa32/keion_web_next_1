"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import AudioContextManager from "../utils/AudioContextManager";
import { soundSamples } from "./AudioPlayer";

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
const waveforms: { type: WaveformType; label: string }[] = [
  { type: "sine", label: "サイン波" },
  { type: "square", label: "矩形波" },
  { type: "triangle", label: "三角波" },
  { type: "sawtooth", label: "ノコギリ波" },
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

const defaultParams: WaveformParams = {
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
};
const modes: { value: PlayMode; label: string }[] = [
  { value: "combined", label: "シンセ＋音源" },
  { value: "pianoOnly", label: "シンセのみ" },
  { value: "effectOnly", label: "音源のみ" },
];
type NumericParam = Exclude<keyof WaveformParams, "filterType">;
const sliders: {
  key: NumericParam;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: "attack", label: "アタック", min: 0.01, max: 2, step: 0.01, unit: "秒" },
  { key: "decay", label: "ディケイ", min: 0.01, max: 2, step: 0.01, unit: "秒" },
  { key: "sustain", label: "サスティン", min: 0, max: 1, step: 0.01, unit: "" },
  { key: "release", label: "リリース", min: 0.01, max: 5, step: 0.01, unit: "秒" },
  { key: "detune", label: "デチューン", min: -100, max: 100, step: 1, unit: "セント" },
  { key: "filterFreq", label: "フィルター周波数", min: 50, max: 10000, step: 10, unit: "Hz" },
  { key: "filterQ", label: "フィルターQ", min: 0.1, max: 20, step: 0.1, unit: "" },
  { key: "vibratoRate", label: "ビブラート速度", min: 0, max: 20, step: 0.1, unit: "Hz" },
  { key: "vibratoDepth", label: "ビブラート深さ", min: 0, max: 50, step: 1, unit: "セント" },
];

export default function VirtualKeyboard({ currentSoundId = "wii" }: { currentSoundId?: string }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [playMode, setPlayMode] = useState<PlayMode>("combined");
  const [waveformType, setWaveformType] = useState<WaveformType>("sine");
  const [showEditor, setShowEditor] = useState(false);
  const [baseOctave, setBaseOctave] = useState(3);
  const [params, setParams] = useState<WaveformParams>(defaultParams);
  const [soundLoading, setSoundLoading] = useState(true);
  const [error, setError] = useState("");
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const sources = useRef<Set<AudioScheduledSourceNode>>(new Set());
  const keyTimer = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useRef(true);
  const noteGeneration = useRef(0);
  const layout = generateKeyboardLayout(baseOctave);

  useEffect(() => {
    mounted.current = true;
    const activeSources = sources.current;
    const generation = noteGeneration;
    return () => {
      mounted.current = false;
      generation.current++;
      clearTimeout(keyTimer.current);
      activeSources.forEach((source) => {
        try {
          source.stop();
        } catch {}
      });
      activeSources.clear();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    audioBuffer.current = null;
    setSoundLoading(true);
    setError("");
    const sample = soundSamples.find((sound) => sound.id === currentSoundId);
    if (!sample) {
      setSoundLoading(false);
      return;
    }
    AudioContextManager.getInstance()
      .loadAudioFile(sample.file)
      .then((buffer) => {
        if (!cancelled) audioBuffer.current = buffer;
      })
      .catch((cause) => {
        if (!cancelled) {
          console.error("鍵盤の音源読み込みに失敗しました", cause);
          setError(
            "選択した音源を読み込めませんでした。別の音源を選ぶか、シンセのみでお試しください。"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setSoundLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentSoundId]);

  const playNote = useCallback(
    async (key: PianoKey) => {
      const generation = noteGeneration.current;
      clearTimeout(keyTimer.current);
      setActiveKey(key.note);
      keyTimer.current = setTimeout(() => setActiveKey(null), 300);
      try {
        const manager = AudioContextManager.getInstance();
        const context = manager.getContext();
        if (context.state === "suspended") await context.resume();
        if (!mounted.current || generation !== noteGeneration.current) return;
        const start = context.currentTime;
        const track = (source: AudioScheduledSourceNode, nodes: AudioNode[] = []) => {
          sources.current.add(source);
          source.onended = () => {
            sources.current.delete(source);
            source.disconnect();
            nodes.forEach((node) => node.disconnect());
          };
        };
        if (playMode !== "effectOnly") {
          const oscillator = context.createOscillator();
          const envelope = context.createGain();
          const filter = context.createBiquadFilter();
          oscillator.type = waveformType;
          oscillator.frequency.value = key.frequency;
          oscillator.detune.value = params.detune;
          filter.type = params.filterType;
          filter.frequency.value = params.filterFreq;
          filter.Q.value = params.filterQ;
          const peak = 0.18;
          const attackEnd = start + params.attack;
          const decayEnd = attackEnd + params.decay;
          const releaseStart = decayEnd + 0.2;
          const end = releaseStart + params.release;
          envelope.gain.setValueAtTime(0, start);
          envelope.gain.linearRampToValueAtTime(peak, attackEnd);
          envelope.gain.linearRampToValueAtTime(peak * params.sustain, decayEnd);
          envelope.gain.setValueAtTime(peak * params.sustain, releaseStart);
          envelope.gain.linearRampToValueAtTime(0, end);
          oscillator.connect(filter);
          filter.connect(envelope);
          manager.connectSource(envelope);
          track(oscillator, [filter, envelope]);
          if (params.vibratoDepth > 0 && params.vibratoRate > 0) {
            const vibrato = context.createOscillator();
            const depth = context.createGain();
            vibrato.frequency.value = params.vibratoRate;
            depth.gain.value = params.vibratoDepth;
            vibrato.connect(depth);
            depth.connect(oscillator.detune);
            track(vibrato, [depth]);
            vibrato.start(start);
            vibrato.stop(end + 0.02);
          }
          oscillator.start(start);
          oscillator.stop(end + 0.02);
        }
        if (playMode !== "pianoOnly" && audioBuffer.current) {
          const sample = context.createBufferSource();
          sample.buffer = audioBuffer.current;
          sample.playbackRate.value = key.frequency / calculateFrequency("C", 3);
          manager.connectSource(sample);
          track(sample);
          sample.start(start);
        }
      } catch (cause) {
        console.error("鍵盤の再生に失敗しました", cause);
        if (mounted.current) setError("音を再生できませんでした。もう一度お試しください。");
      }
    },
    [playMode, waveformType, params]
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey)
        return;
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("input, select, textarea, [contenteditable], [role=slider]")
      )
        return;
      const key = generateKeyboardLayout(baseOctave).find(
        (note) => note.keyboardKey === event.key.toLowerCase()
      );
      if (key) {
        event.preventDefault();
        void playNote(key);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        setBaseOctave((octave) =>
          Math.max(0, Math.min(7, octave + (event.key === "ArrowUp" ? 1 : -1)))
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [baseOctave, playNote]);

  const stopNotes = () => {
    noteGeneration.current++;
    clearTimeout(keyTimer.current);
    setActiveKey(null);
    sources.current.forEach((source) => {
      try {
        source.stop();
      } catch {}
    });
  };

  const control =
    "min-h-11 border border-[#435158] bg-[#202d34] px-3 py-2 text-sm text-[#f2f4ee] hover:bg-[#34444c] disabled:opacity-40";
  return (
    <section
      className="min-w-0 border border-[#435158] bg-[#202d34] p-4 sm:p-6"
      aria-labelledby="keyboard-title"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="keyboard-title" className="text-lg font-semibold text-[#f2f4ee]">
          バーチャル鍵盤
        </h3>
        <p className="text-xs text-[#bdc8cd]">
          C{baseOctave} — B{baseOctave + 1}
        </p>
      </div>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="再生モード">
        {modes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            aria-pressed={mode.value === playMode}
            onClick={() => setPlayMode(mode.value)}
            className={
              control +
              (playMode === mode.value ? " !border-[#d4e785] !bg-[#d4e785] !text-[#17252c]" : "")
            }
          >
            {mode.label}
          </button>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[#bdc8cd]">
          音色
          <select
            value={waveformType}
            onChange={(event) => setWaveformType(event.target.value as WaveformType)}
            className={control}
          >
            {waveforms.map((wave) => (
              <option key={wave.type} value={wave.type}>
                {wave.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={control}
          aria-expanded={showEditor}
          aria-controls="waveform-editor"
          onClick={() => setShowEditor((value) => !value)}
        >
          音色を調整 {showEditor ? "−" : "＋"}
        </button>
      </div>
      {showEditor && (
        <div id="waveform-editor" className="mb-6 border-y border-[#435158] py-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-[#f2f4ee]">波形エディター</h4>
            <button
              type="button"
              className="min-h-11 px-2 text-xs text-[#d4e785]"
              onClick={() => setParams({ ...defaultParams })}
            >
              設定を戻す
            </button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sliders.map((slider) => (
              <label key={slider.key} className="block text-xs text-[#bdc8cd]">
                <span className="mb-2 flex justify-between gap-2">
                  <span>{slider.label}</span>
                  <span>
                    {params[slider.key]}
                    {slider.unit}
                  </span>
                </span>
                <input
                  type="range"
                  value={params[slider.key]}
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  onChange={(event) =>
                    setParams((value) => ({ ...value, [slider.key]: Number(event.target.value) }))
                  }
                  className="w-full accent-[#d4e785]"
                />
              </label>
            ))}
            <label className="block text-xs text-[#bdc8cd]">
              <span className="mb-2 block">フィルタータイプ</span>
              <select
                value={params.filterType}
                onChange={(event) =>
                  setParams((value) => ({
                    ...value,
                    filterType: event.target.value as BiquadFilterType,
                  }))
                }
                className={control + " w-full"}
              >
                <option value="lowpass">ローパス</option>
                <option value="highpass">ハイパス</option>
                <option value="bandpass">バンドパス</option>
                <option value="notch">ノッチ</option>
              </select>
            </label>
          </div>
        </div>
      )}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={control}
            onClick={() => setBaseOctave((value) => Math.max(0, value - 1))}
            disabled={baseOctave === 0}
            aria-label="オクターブを下げる"
          >
            −
          </button>
          <span className="text-xs text-[#bdc8cd]">
            音域 {baseOctave}–{baseOctave + 1}
          </span>
          <button
            type="button"
            className={control}
            onClick={() => setBaseOctave((value) => Math.min(7, value + 1))}
            disabled={baseOctave === 7}
            aria-label="オクターブを上げる"
          >
            ＋
          </button>
        </div>
        <button type="button" className={control} onClick={stopNotes}>
          鍵盤の音を止める ■
        </button>
        <p className="text-xs text-[#bdc8cd]" aria-live="polite">
          {playMode !== "pianoOnly"
            ? soundLoading
              ? "音源を読み込み中…"
              : "音源：" + soundSamples.find((sound) => sound.id === currentSoundId)?.label
            : "シンセ音で演奏"}
        </p>
      </div>
      <div
        className="overflow-x-auto pb-2"
        style={{ touchAction: "pan-x pan-y" }}
        tabIndex={0}
        role="region"
        aria-label="左右にスクロールできる鍵盤"
      >
        <div className="relative flex h-40 min-w-[600px] sm:h-48">
          {layout.map((key) => {
            const white = key.color === "white";
            const active = activeKey === key.note;
            const note = getNoteAndOctave(key.note);
            return (
              <button
                key={key.note}
                type="button"
                aria-label={key.label + "を鳴らす"}
                aria-keyshortcuts={key.keyboardKey}
                onClick={() => void playNote(key)}
                className={"relative flex-shrink-0 " + (white ? "z-0" : "z-10")}
                style={{
                  flex: white ? 1 : "none",
                  height: white ? "100%" : "60%",
                  width: white ? "auto" : 30,
                  marginLeft: white ? 0 : -15,
                  marginRight: white ? 0 : -15,
                  background: active ? "#d4e785" : white ? "#f2f2e9" : "#111b20",
                  color: active || white ? "#17252c" : "#dde4df",
                  border: "1px solid " + (white ? "#82908b" : "#060d10"),
                  borderRadius: "0 0 3px 3px",
                  transform: active ? "translateY(3px)" : undefined,
                }}
              >
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs">
                  <span className="block">
                    {note.note}
                    <sub>{note.octave}</sub>
                  </span>
                  {key.keyboardKey && (
                    <span className="mt-1 block text-[10px]">{key.keyboardKey.toUpperCase()}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-xs text-[#bdc8cd]">
        鍵盤を押すと音が鳴ります。PCでは
        A・W・S・E…、↑↓で音域を変更できます。スマートフォンでは鍵盤を左右にスクロールできます。
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#f4d39d]">
          {error}
        </p>
      )}
    </section>
  );
}

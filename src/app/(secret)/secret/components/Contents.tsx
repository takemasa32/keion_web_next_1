"use client";
import { useState } from "react";
import Link from "next/link";
import { FaMusic, FaArrowLeft } from "react-icons/fa";
import VirtualKeyboard from "./VirtualKeyboard";
import MusicVisualizer from "./MusicVisualizer";
import AudioPlayer from "./AudioPlayer";

export default function Contents() {
  const [clickCount, setClickCount] = useState(0);
  const [selectedSoundId, setSelectedSoundId] = useState("wii");
  const easterEggFound = clickCount >= 5;

  return (
    <div className="secret-studio">
      <header className="studio-header">
        <div className="studio-brand">
          <button
            type="button"
            aria-label="音楽のロゴ"
            onClick={() => setClickCount((count) => Math.min(count + 1, 5))}
          >
            <FaMusic aria-hidden="true" />
          </button>
          <span>
            島根大学 軽音楽部 <small>SECRET ROOM</small>
          </span>
        </div>
        <Link href="/">
          <FaArrowLeft aria-hidden="true" /> ホームへ
        </Link>
      </header>
      <main className="studio-main">
        <div className="studio-intro">
          <p className="studio-eyebrow">部室の、もうひとつ奥。</p>
          <h1>ちょっと、音で遊ぼう。</h1>
          <p>
            好きな音を選んで、鍵盤を鳴らしてみてください。
            <br />
            いつもの軽音部とは少し違う、小さな音の実験室です。
          </p>
        </div>
        {easterEggFound && (
          <aside className="studio-discovery" role="status">
            <FaMusic aria-hidden="true" />
            <div>
              <strong>隠し要素を発見！</strong>
              <p>ここまで見つけたあなたも、今日から部室の常連です。</p>
            </div>
          </aside>
        )}
        <section className="studio-section" aria-labelledby="studio-sounds">
          <div className="studio-section-title">
            <span>01</span>
            <div>
              <h2 id="studio-sounds">音を選ぶ</h2>
              <p>音源を押すと再生します。選んだ音は鍵盤にも反映されます。</p>
            </div>
          </div>
          <AudioPlayer onSoundChange={setSelectedSoundId} />
        </section>
        <section className="studio-section" aria-labelledby="studio-keys">
          <div className="studio-section-title">
            <span>02</span>
            <div>
              <h2 id="studio-keys">鍵盤で遊ぶ</h2>
              <p>鍵盤をタップ、または表示されたキーで演奏できます。</p>
            </div>
          </div>
          <VirtualKeyboard currentSoundId={selectedSoundId} />
        </section>
        <section className="studio-section" aria-labelledby="studio-monitor">
          <div className="studio-section-title">
            <span>03</span>
            <div>
              <h2 id="studio-monitor">音を眺める</h2>
              <p>鳴らした音の強さが、バーの動きに変わります。</p>
            </div>
          </div>
          <MusicVisualizer />
        </section>
      </main>
      <footer className="studio-footer">
        <span>島根大学 軽音楽部 / SECRET ROOM</span>
        <Link href="/">ホームに戻る ↗</Link>
      </footer>
    </div>
  );
}

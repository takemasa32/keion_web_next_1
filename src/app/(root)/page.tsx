"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { events } from "@/app/data/events";
import { isUpcoming, sortEvents } from "@/app/lib/event-dates";
import { useSecretFeature } from "./toSecrets/useSecretFeature";
import FAQ from "./components/FAQ";
import SNSButton from "./components/SNSButton";
import PhotoViewer from "./components/PhotoViewer";
const features = [
  [
    "初心者歓迎",
    "大学から楽器を始める部員もいます。実際のバンド活動を通じて、一緒に成長していきましょう。",
  ],
  [
    "設備が充実",
    "大学内の部室にはアンプやドラムセットなどを備えています。外部のスタジオを借りずに練習できます。",
  ],
  [
    "部員が多い",
    "学部や学年を越えて、音楽の好きな仲間と出会えます。練習の合間に、好きな曲の話で盛り上がることも。",
  ],
  [
    "様々なジャンル",
    "好きな音楽を持ち寄ってバンドを組んでいます。自分の知らなかったアーティストに出会う機会もあります。",
  ],
];
const activities = [
  {
    image: "band-practice",
    title: "日々の練習",
    text: "大学内の部室で日々練習しています。初心者も経験者も、一緒に音を重ねます。",
    alt: "部室でバンド練習をする部員",
  },
  {
    image: "live-performance",
    title: "ライブ演奏",
    text: "学内外のイベントで演奏する機会があります。仲間と練習した曲を、ステージで披露します。",
    alt: "ライブステージで演奏する部員",
  },
  {
    image: "concert",
    title: "定期演奏会",
    text: "毎年12月に開催する、軽音部の大きなイベント。演奏も運営も、部員で力を合わせてつくり上げます。",
    alt: "定期演奏会の集合写真",
  },
];
export default function Home() {
  const secret = useSecretFeature();
  const [upcoming, setUpcoming] = useState<typeof events>([]);
  useEffect(() => {
    setUpcoming(sortEvents(events.filter((event) => isUpcoming(event))).reverse());
  }, []);
  const recent = sortEvents(events).slice(0, 3);
  return (
    <div className={secret.getSecretClassNames()}>
      <section className="home-hero">
        <Image
          src="/image/root/live-performance.jpg"
          alt="ライブで演奏する島根大学軽音楽部の部員"
          fill
          priority
          sizes="100vw"
          className="hero-photo"
        />
        <div className="hero-shade" />
        <div className="site-container hero-content">
          <p className="eyebrow">島根大学 軽音楽部</p>
          <h1>
            <button onClick={secret.incrementFirstCounter} className="secret-title">
              音楽と
            </button>
            <br />
            大学生活。
          </h1>
          <p className="hero-description">
            部室で音を合わせ、学内ライブや大学祭、
            <br className="desktop-break" />
            年末の定期演奏会へ。
            <br />
            初心者も経験者も、それぞれのペースで楽しめます。
          </p>
          <div className="button-row">
            <a href="#features" className="button button-lime">
              部活について知る <span>↓</span>
            </a>
            <Link href="/events" className="button button-outline">
              活動を見る <span>↗</span>
            </Link>
          </div>
          <div className="hero-bottom">
            <span>初心者歓迎 / 部室で練習可</span>
            <span className="hero-scroll">SCROLL ↓</span>
          </div>
        </div>
      </section>
      <div className="news-strip">
        <div className="site-container">
          <span className="small-label">お知らせ</span>
          <p>
            {upcoming[0]
              ? upcoming[0].date + " ｜ " + upcoming[0].title
              : "最新の活動予定は、公式SNSでお知らせしています。"}
          </p>
          <Link href={upcoming[0]?.link ?? "/sns"}>
            {upcoming[0] ? "イベントを見る ↗" : "公式SNSへ ↗"}
          </Link>
        </div>
      </div>
      <section id="features" className="section-space">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ABOUT</p>
              <h2>
                <button className="secret-title" onClick={secret.incrementSecondCounter}>
                  島根大学
                  <br />
                  軽音楽部の特徴
                </button>
              </h2>
            </div>
            <p>
              せっかくの大学生活、楽しみを増やしませんか？
              <br />
              音楽を通じて、仲間と一緒に成長する部活です。
            </p>
          </div>
          <div className="feature-grid">
            {features.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          {secret.firstStageCompleted && (
            <p className="secret-hint" role="status">
              なにかが響いた。もうひとつの見出しにも、リズムを。
            </p>
          )}
        </div>
      </section>
      <section className="section-space activity-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ACTIVITY</p>
              <h2>活動の様子</h2>
            </div>
            <p>
              普段の練習から本番のステージまで。
              <br />
              部員と一緒につくる、軽音部の日々。
            </p>
          </div>
          <div className="activity-grid">
            {activities.map((item) => (
              <article key={item.image}>
                <div className="activity-photo">
                  <PhotoViewer src={"/image/root/" + item.image + ".jpg"} alt={item.alt} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="section-end">
            <Link className="text-link" href="/events">
              もっと活動を見る ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EVENTS</p>
              <h2>{upcoming.length ? "これからのイベント" : "これまでのイベント"}</h2>
            </div>
            <Link className="text-link" href="/events">
              すべてのイベント ↗
            </Link>
          </div>
          <div className="event-preview">
            {(upcoming.length ? upcoming.slice(0, 3) : recent).map((event) => (
              <Link key={event.title + event.date} href={event.link ?? "/events"}>
                <span className="small-label">{event.date}</span>
                <h3>{event.title}</h3>
                <span className="preview-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space faq-section">
        <div className="site-container faq-layout">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2>よくある質問</h2>
            <p>
              入部や活動について、
              <br />
              気になる疑問にお答えします。
            </p>
          </div>
          <FAQ />
        </div>
      </section>
      <section className="section-space contact-section">
        <div className="site-container">
          <p className="eyebrow">CONTACT</p>
          <h2>次は部室で会いましょう！</h2>
          <p>
            見学や入部の相談は、公式SNSのDMから。
            <br />
            質問だけでも、お気軽にご連絡ください。
          </p>
          <SNSButton />
        </div>
      </section>
    </div>
  );
}

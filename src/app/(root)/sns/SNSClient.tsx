import SNSButton from "../components/SNSButton";
import FAQ from "../components/FAQ";
import Link from "next/link";
import type { faqItems } from "@/app/data/site";
export default function SNSClient({ faqItems: items }: { faqItems: typeof faqItems }) {
  return (
    <div>
      <section className="page-intro site-container">
        <p className="eyebrow">CONTACT & SNS</p>
        <h1>見学・お問い合わせ</h1>
        <p>
          入部の相談も、楽器のことも。
          <br />
          公式SNSのDMから、気軽にお声がけください。
        </p>
      </section>
      <section className="site-container contact-body">
        <SNSButton />
        <p className="contact-note">
          各リンクは新しいタブで開きます。返信には時間がかかる場合があります。
        </p>
        <div className="contact-steps">
          <h2>部室を見学したい方へ</h2>
          <ol>
            <li>
              <strong>DMで連絡</strong>
              <p>見学したいことと、希望する日時をお知らせください。</p>
            </li>
            <li>
              <strong>日時・場所を相談</strong>
              <p>部員が見学できる時間と、部室までの行き方をご案内します。</p>
            </li>
            <li>
              <strong>部室へ</strong>
              <p>練習の雰囲気を見たり、楽器について相談したりできます。</p>
            </li>
          </ol>
        </div>
        <div className="contact-alternatives">
          <h2>直接話したいときは</h2>
          <p>
            学内ライブやイベントで部員に声をかけることも、部員の友人を通じて相談することもできます。
          </p>
          <Link href="/events" className="text-link">
            イベント情報を見る ↗
          </Link>
        </div>
      </section>
      <section className="section-space faq-section">
        <div className="site-container faq-layout">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2>よくある質問</h2>
            <p>入部前に気になることはこちらへ。</p>
          </div>
          <FAQ items={items} />
        </div>
      </section>
    </div>
  );
}

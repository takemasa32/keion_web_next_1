import Link from "next/link";
import { socialLinks } from "@/app/data/site";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div>
            <p className="eyebrow">SHIMANE UNIVERSITY KEION</p>
            <p className="footer-title">島根大学 軽音楽部</p>
            <p>初心者も経験者も、一緒に音楽を楽しもう。</p>
          </div>
          <nav aria-label="フッターナビゲーション">
            <Link href="/">ホーム</Link>
            <Link href="/events">イベント</Link>
            <Link href="/sns">見学・お問い合わせ</Link>
          </nav>
          <div className="footer-socials">
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.name} ↗<span className="sr-only">（新しいタブで開きます）</span>
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} 島根大学 軽音楽部</small>
          <span>音楽と、大学生活。</span>
        </div>
      </div>
    </footer>
  );
}

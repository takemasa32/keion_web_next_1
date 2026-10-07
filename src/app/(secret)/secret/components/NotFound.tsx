import Link from "next/link";
import { FaMusic } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <main className="secret-studio studio-locked">
      <FaMusic aria-hidden="true" />
      <p className="studio-eyebrow">SECRET ROOM</p>
      <h1>まだ、扉は閉まっています。</h1>
      <p>
        ホームに隠れた入口を見つけると、この部屋で遊べます。
        <br />
        以前に入った方は、ホームからもう一度お入りください。
      </p>
      <Link href="/">ホームに戻る ↗</Link>
    </main>
  );
}

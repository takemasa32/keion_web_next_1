import Link from "next/link";
export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-lg">
        <p className="eyebrow">404 / PAGE NOT FOUND</p>
        <h1 className="mb-5 text-3xl font-bold">ページが見つかりません</h1>
        <p className="mb-8 text-sm text-slate-600">
          URLが変更されたか、ページが存在しない可能性があります。
        </p>
        <Link className="button button-lime" href="/">
          ホームへ戻る →
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Metadata } from "next/types";
import { FaGuitar } from "react-icons/fa";

export const metadata: Metadata = {
  title: "404 - ページが見つかりません",
  description: "お探しのページが見つかりません",
};
const NotFoundPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
        <FaGuitar className="text-6xl mb-4 animate-bounce" />
        <h1 className="text-5xl font-bold mb-4">404 - ページが見つかりません</h1>
        <p className="text-lg mb-8 text-center">
          お探しのページは存在しないか、移動された可能性があります。
          <br />
          代わりに、曲を演奏しましょう！
        </p>
        <Link href="/">
          <p className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200">
            ホームに戻る
          </p>
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;

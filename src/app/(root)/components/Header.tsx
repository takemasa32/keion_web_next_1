import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/">
          <p className="flex items-center title-font font-medium text-white mb-4 md:mb-0">
            <Image
              src="/image/keionMiniLogo.JPG"
              alt="軽音楽部ロゴ"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="ml-3 text-xl">島根大学 軽音楽部</span>
          </p>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link
            href="/"
            className="mr-5 hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
          >
            ホーム
          </Link>
          <Link
            href="/events"
            className="mr-5 hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
          >
            イベント
          </Link>
          <Link
            href="/sns"
            className="mr-5 hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
          >
            お問い合わせ
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

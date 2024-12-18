"use client";
import React, { useState, useEffect } from "react";
import SNSButton from "./components/SNSButton";
import FAQItem from "./components/FAQItems";
import TopLoading from "./components/TopLoading";
import ScrollReveal from "./components/ScrollReveal";
import InfoBlock from "./components/InfoBlock";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import {
  FaGuitar,
  FaMoneyBillWave,
  FaUsers,
  FaMusic,
  FaQuestionCircle,
  FaTools,
  FaCalendarAlt,
  FaSmile,
} from "react-icons/fa";
import {
  MdOutlineSchool,
  MdOutlineSportsEsports,
  MdOutlineMusicNote,
  MdOutlineHelpOutline,
  MdOutlineContactSupport,
  MdOutlineEventNote,
  MdOutlineThumbUp,
  MdOutlineMusicVideo,
} from "react-icons/md";

// ポップアップモーダルコンポーネント
const PopupModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  contentLabel,
  children,
  startDate,
  endDate,
  cancelText,
  confirmText,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  contentLabel: string;
  children: React.ReactNode;
  startDate: Date;
  endDate: Date;
  cancelText?: string;
  confirmText?: string;
}) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    } else {
      console.error("App element not found");
    }
  }, []);
  useEffect(() => {
    const currentDate = new Date();
    if (currentDate >= startDate && currentDate <= endDate) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }

    // デバイスの種類を判別
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsPC(mediaQuery.matches);

    const handleResize = () => {
      setIsPC(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [startDate, endDate]);

  return (
    <Modal
      isOpen={isOpen && shouldShow}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className={`fixed inset-0 flex items-center justify-center z-50 transition-transform duration-300"
      }`}
      overlayClassName={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
      }`}
      closeTimeoutMS={300}
    >
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-6 rounded-lg shadow-lg max-w-md mx-auto">
        {children}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-400 transition-colors duration-200"
          >
            {cancelText ? cancelText : "キャンセル"}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
          >
            {confirmText ? confirmText : "移動する"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// 特定の日付までの日数を計算する関数
const calculateDaysUntil = (targetDate: Date): number => {
  const currentDate = new Date();
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return daysDifference;
};

const Home = () => {
  const router = useRouter();
  const [secretPass, setSecretPass] = useState(0);
  const [secretPass2, setSecretPass2] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialLoadingText = "ようこそ軽音楽部へ";
  const keyNum = 7;
  const loadingTime = 2000; // ローディング時間を設定

  useEffect(() => {
    const appElement = document.getElementById("__next");
    if (appElement) {
      Modal.setAppElement(appElement);
    }

    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, loadingTime + 1000);

    return () => clearTimeout(timer); // クリーンアップ
  }, [loadingTime]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const eventLink = "/events/2024teikiensoukai";
  const navigateToEventPage = () => {
    router.push(eventLink);
  };

  const eventDate = new Date(Date.UTC(2024, 11, 21)); // 2024/12/21

  const daysUntilDate = calculateDaysUntil(eventDate);

  return (
    <>
      {/* ポップアップモーダル */}
      <PopupModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onConfirm={navigateToEventPage}
        contentLabel="定期演奏会のお知らせ"
        startDate={new Date(Date.UTC(2024, 10, 1))} // 2024/11/1
        endDate={eventDate}
        cancelText="閉じる"
        confirmText="特設ページへ"
      >
        <div className="flex justify-center mb-4">
          <FaGuitar className="text-6xl h-12 w-12 my-2 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-white">お知らせ</h2>
        <p className="mb-4 text-center text-white">
          {daysUntilDate
            ? `今年の定期演奏会があと${daysUntilDate}日で開催されます！`
            : "今年も定期演奏会が開催されます！"}
          <br />
          特設ページに移動しますか？
        </p>
      </PopupModal>
      <div
        onClick={() => {
          setSecretPass(secretPass + 1);
        }}
      >
        <TopLoading time={loadingTime} text={secretPass == keyNum ? "" : initialLoadingText} />
      </div>
      <div className={secretPass == keyNum && secretPass2 < keyNum ? " animate-pulse" : ""}>
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <p className="mb-4 font-semibold text-indigo-500 md:mb-6 md:text-lg xl:text-xl">
                はじめまして！こんにちは！島根大学 軽音楽部です！
              </p>

              <div
                onClick={() => {
                  if (secretPass === keyNum && secretPass2 === keyNum) {
                    sessionStorage.setItem("accessAllowed", "true");
                    sessionStorage.setItem("setTime", new Date().getTime().toString());
                    router.push("/secret");
                  }
                }}
                className={secretPass2 === keyNum ? " animate-bounce" : ""}
              >
                <h1 className="mb-8 text-3xl font-bold text-black sm:text-4xl md:mb-12 md:text-5xl">
                  共に音楽を
                  <br />
                  楽しみましょう！
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setSecretPass2(secretPass2 + 1);
          }}
        >
          <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <div className="mb-10 md:mb-16">
                <h2 className="anm_mod left full fast mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                  島根大学
                  <br />
                  軽音楽部の特徴
                </h2>
                <p className="anm_mod left full mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
                  私達はこんな団体です！
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-3">
                <div className="divide-x rounded-lg border bg-gray-50">
                  <InfoBlock
                    icon={<MdOutlineSchool />}
                    title="初心者歓迎"
                    description="実際部員の中でもほぼ半数が初心者です．\n実際のバンド活動を通じて一緒に成長していきましょう！"
                  />
                </div>
                <div className="divide-x rounded-lg border bg-gray-50">
                  <InfoBlock
                    icon={<FaTools />}
                    title="設備が充実"
                    description="大学内にアンプやドラムセットなど練習できる環境が揃っています．\nわざわざ外部のスタジオを借りなくても練習が可能です！"
                  />
                </div>
                <div className="divide-x rounded-lg border bg-gray-50">
                  <InfoBlock
                    icon={<FaUsers />}
                    title="部員が多い"
                    description="”実際に活動をしている”部員数がとても多い部活です．\n各学部内外大学内で友達を作るならもってこいです！！"
                  />
                </div>
                <div className="divide-x rounded-lg border bg-gray-50">
                  <InfoBlock
                    icon={<FaMusic />}
                    title="様々なジャンル"
                    description="部員数が多いため，様々なジャンルの音楽に触れることができます．\n自分の知らないアーティストを見つける機会がたくさんあります．"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <div className="left fast mb-10 md:mb-16">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                  よくある質問
                </h2>
                <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
                  気になる疑問点について回答します！
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-y-10 xl:grid-cols-3">
                <div className=" relative rounded-lg bg-gray-100 p-5 pt-8">
                  <FAQItem
                    question="部費はありますか？"
                    answer="半年で6000円の部費を徴収しています.<br/>その中からイベントの運営や機材の購入に充てています．"
                    additional="※部Tの代金など,別途費用がかかることもあります．"
                    icon={<FaMoneyBillWave />}
                  />
                </div>
                <div className=" relative rounded-lg bg-gray-100 p-5 pt-8">
                  <FAQItem
                    question="イベントはどんなものがありますか？"
                    answer="新歓ライブや学際でのライブ、定期演奏会など,年間を通して様々なイベントがあります．詳細はSNSなどをご覧ください．"
                    icon={<FaCalendarAlt />}
                  />
                </div>
                <div className=" relative rounded-lg bg-gray-100 p-5 pt-8">
                  <FAQItem
                    question="初心者でも大丈夫ですか？"
                    answer="もちろんです！例年ほぼ半数が入部時は初心者です．<br/>初心者の方も大歓迎ですので、一緒に成長していきましょう！"
                    icon={<FaSmile />}
                  />
                </div>
                <div className=" relative rounded-lg bg-gray-100 p-5 pt-8">
                  <FAQItem
                    question="楽器は自分で買わないといけない？"
                    answer="パートにもよりますが、家での練習のためにも、購入することをおすすめします。<br/>入部後に部や先輩から借りて体験などすることも可能ですので、気軽にご相談ください！"
                    icon={<FaGuitar />}
                  />
                </div>
                <div className=" relative rounded-lg bg-gray-100 p-5 pt-8">
                  <FAQItem
                    question="続けられるか不安です..."
                    answer="物は試し、楽器の演奏は生活を豊かにする一生の趣味となると思います。<br/>まずは挑戦してみることをおすすめします！どの楽器も最初は大変ですが、こつこつ臆さずに練習し、ライブへの出演を続けることで"
                    icon={<MdOutlineThumbUp />}
                  />
                </div>
                <div className=" relative rounded-lg bg-gray-100 p-5 pt-8">
                  <FAQItem
                    question="わからないことがあるのですが..."
                    answer="どんな些細なことでも結構です！SNSの方までご連絡ください！"
                    icon={<MdOutlineContactSupport />}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="m-5">
            <h2 className="text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              次は部室で会いましょう！
            </h2>
            <SNSButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

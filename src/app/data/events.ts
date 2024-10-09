export type Event = {
  title: string;
  date: string;
  description: string;
  image?: string;
  link?: string;
};

export const events: Event[] = [
  {
    title: "2024年島根大学 大学祭",
    date: "2024年10月13日-10月14日",
    description: "大学祭が開催されます。ステージと室内2箇所で行われます。詳細はこちらから",
    image: "/image/keionBackImage.JPG",
    link: "/events/2024daigakusai",
  },
  {
    title: "2024年度 定期演奏会",
    date: "2024年12月21日",
    description:
      "今年度の定期演奏会の日時が決定されました。年に一度の最大のイベントへ是非お越しください",
  },
];

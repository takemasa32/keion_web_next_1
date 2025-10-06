export type Event = {
  title: string;
  date: string;
  description: string;
  image?: string;
  link?: string;
  tags: string[];
};

export const events: Event[] = [
      {
    title: "七夕ライブ",
    date: "2025年7月27日, 8月1日,8月2日",
    description:
      "前期最後の部内ライブとなります！ぜひ会場でお待ちしております。",
    image: "/icons/icon-512x512.png",
    tags: [ "定期ライブ", "ライブ"],
  },
    {
    title: "お手並み拝見ライブ",
    date: "2025年6月21日, 6月22日",
    description:
      "新入部員の初舞台！ぜひ会場でお待ちしております。",
    image: "/icons/icon-512x512.png",
    tags: ["定期ライブ", "ライブ"],
  },
  {
    title: "2025年島根大学 大学祭",
    date: "2025年10月12日-10月13日",
    description: "大学祭が開催されます。ステージと室内2箇所で行われます。", //詳細はこちらから",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["大学祭", "ライブ"], //"詳細あり",
  },
  {
    title: "2025年 部T完成",
    date: "2025年10月",
    description: "2025年度、島根大学軽音部の部Tが完成しました！。詳細はこちらから",
    image: "/image/2025T/keionBackImage.JPG",
    link: "/events/2025BukatuT",
    tags: ["詳細あり", "グッズ", "大学祭"],
  },
  {
    title: "OS争奪ライブ",
    date: "2025年9月19日, 9月20日, 9月21日",
    description:
      "大学祭の大ステージに立てるバンドを決める熱いライブとなりました！ご観覧くださった方々,ありがとうございました！",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["大学祭", "定期ライブ", "ライブ"],
  },
  {
    title: "1,2回生ライブ",
    date: "2025年8月28日",
    description: "1,2回生のみが出演するライブでした!ご観覧くださった方々,ありがとうございました！",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ", "新歓"],
  },
  {
    title: "七夕ライブ",
    date: "2025年7月27日, 8月1日,8月2日",
    description: "前期最後の部内ライブとなります！ぜひ会場でお待ちしております。",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ"],
  },
  {
    title: "お手並み拝見ライブ",
    date: "2025年6月21日, 6月22日",
    description: "新入部員の初舞台！ぜひ会場でお待ちしております。",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ"],
  },
  {
    title: "2025年島根大学 大学祭",
    date: "2025年10月12日-10月13日",
    description: "大学祭が開催されます。ステージと室内2箇所で行われます。", //詳細はこちらから",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["大学祭", "ライブ"], //"詳細あり",
  },
  {
    title: "2025年 部T完成",
    date: "2025年10月",
    description: "2025年度、島根大学軽音部の部Tが完成しました！。詳細はこちらから",
    image: "/image/2025T/keionBackImage.JPG",
    link: "/events/2025BukatuT",
    tags: ["詳細あり", "グッズ", "大学祭"],
  },
  {
    title: "OS争奪ライブ",
    date: "2025年9月19日, 9月20日, 9月21日",
    description:
      "大学祭の大ステージに立てるバンドを決める熱いライブとなりました！ご観覧くださった方々,ありがとうございました！",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["大学祭", "定期ライブ", "ライブ"],
  },
  {
    title: "1,2回生ライブ",
    date: "2025年8月28日",
    description: "1,2回生のみが出演するライブでした!ご観覧くださった方々,ありがとうございました！",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ", "新歓"],
  },
  {
    title: "七夕ライブ",
    date: "2025年7月27日, 8月1日,8月2日",
    description: "前期最後の部内ライブとなります！ぜひ会場でお待ちしております。",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ"],
  },
  {
    title: "お手並み拝見ライブ",
    date: "2025年6月21日, 6月22日",
    description: "新入部員の初舞台！ぜひ会場でお待ちしております。",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ"],
  },
  {
    title: "新歓ライブ",
    date: "2025年4月29日, 5月3日, 5月4日",
    description:
      "部活動選びの参考としていただけたら幸いです。ご観覧いただくこと心よりお待ちしております。",
    image: "/image/2025T/keionMiniLogo.JPG",
    tags: ["新歓", "定期ライブ", "ライブ"],
  },
  {
    title: "2024年度 定期演奏会",
    date: "2024年12月21日",
    description:
      "2024年年度の12月21日はぜひアルテピアへ!年に一度、選りすぐりのバンドが集う島大軽音最大のイベントへ是非お越しください.詳細はこちらから",
    image: "/image/2024keionMiniLogo.JPG",
    link: "/events/2024teikiensoukai",
    tags: ["詳細あり", "定期演奏会", "定期ライブ", "ライブ"],
  },
  {
    title: "クリスマスライブ",
    date: "2024年11月30日",
    description:
      "楽しいお祭ライブでした!1日開催となり長丁場となりましたが、ご観覧くださった方々,ありがとうございました！",
    image: "/image/2024keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ"],
  },
  {
    title: "定期演奏会争奪ライブ",
    date: "2024年11月3日",
    description:
      "定期演奏会への出場バンドを決める選りすぐりのバンドが出演するライブでした！ご観覧くださった方々,ありがとうございました！",
    image: "/image/2024keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ"],
  },
  {
    title: "2024年島根大学 大学祭",
    date: "2024年10月13日-10月14日",
    description: "大学祭が開催されます。ステージと室内2箇所で行われます。詳細はこちらから",
    image: "/image/2024keionMiniLogo.JPG",
    link: "/events/2024daigakusai",
    tags: ["詳細あり", "大学祭", "ライブ"],
  },
  {
    title: "2024年 部T完成",
    date: "2024年10月",
    description: "2024年度、島根大学軽音部の部Tが完成しました！。詳細はこちらから",
    image: "/image/2024T/keionBackImage.JPG",
    link: "/events/2024BukatuT",
    tags: ["詳細あり", "グッズ", "大学祭"],
  },
  {
    title: "OS争奪ライブ",
    date: "2024年9月15日, 9月16日, 9月18日",
    description:
      "大学祭の大ステージに立てるバンドを決める熱いライブとなりました！ご観覧くださった方々,ありがとうございました！",
    image: "/image/2024keionMiniLogo.JPG",
    tags: ["大学祭", "定期ライブ", "ライブ"],
  },
  {
    title: "1,2回生ライブ",
    date: "2024年8月25日, 8月26日",
    description: "1,2回生のみが出演するライブでした!ご観覧くださった方々,ありがとうございました！",
    image: "/image/2024keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ", "新歓"],
  },
  {
    title: "七夕ライブ",
    date: "2024年7月20日, 8月1日, 8月2日",
    description: "ご観覧くださった方々,ありがとうございました！",
    image: "/image/2024keionMiniLogo.JPG",
    tags: ["定期ライブ", "ライブ"],
  },
  {
    title: "お手並み拝見ライブ",
    date: "2024年6月15日, 6月22日, 6月23日",
    description:
      "新入生も出演し始めるライブとなりました！ご観覧くださった方々,ありがとうございました！",
    image: "/image/2024keionMiniLogo.JPG",
    tags: ["新歓", "定期ライブ", "ライブ"],
  },
  {
    title: "新歓ライブ",
    date: "2024年5月3日, 5月4日",
    description:
      "部活動選びの参考となりましたでしょうか？ご観覧くださった方々,ありがとうございました！",
    image: "/image/2024keionMiniLogo.JPG",
    tags: ["新歓", "定期ライブ", "ライブ"],
  },
  {
    title: "2023年度 定期演奏会",
    date: "2023年12月16日",
    description:
      "2023年年度の12月16日はぜひアルテピアへ!年に一度、選りすぐりのバンドが集う島大軽音最大のイベントへ是非お越しください.詳細はこちらから",
    image: "/image/2023T/2023Tシャツ.jpg",
    link: "/events/2023teikiensoukai",
    tags: ["詳細あり", "定期演奏会", "定期ライブ", "ライブ"],
  },
  {
    title: "2023年 部T",
    date: "2023年10月",
    description: "島根大学軽音部2023年度の部Tが完成しました！。詳細はこちらから",
    image: "/image/2023T/2023TシャツMain.jpg",
    link: "/events/2023BukatuT",
    tags: ["詳細あり", "グッズ", "大学祭"],
  },
];

// 全タグのリストを抽出（重複なし）
export const getAllTags = (): string[] => {
  const allTags = new Set<string>();

  events.forEach((event) => {
    event.tags.forEach((tag) => allTags.add(tag));
  });

  return Array.from(allTags).sort();
};

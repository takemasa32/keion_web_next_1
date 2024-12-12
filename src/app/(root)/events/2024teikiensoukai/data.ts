export const bandScheduleData = [
  { date: "2024-12-21", name: "部長挨拶", start: "15:30", end: "15:35" },
  { date: "2024-12-21", name: "JAY-RISYUMISS", start: "15:35", end: "16:00" },
  { date: "2024-12-21", name: "Wii", start: "16:10", end: "16:35" },
  { date: "2024-12-21", name: "クロレキシ団", start: "16:45", end: "17:10" },
  { date: "2024-12-21", name: "いけだまん帝国", start: "17:20", end: "17:45" },
  { date: "2024-12-21", name: "🎱s", start: "17:55", end: "18:20" },
  { date: "2024-12-21", name: "本当に変", start: "18:30", end: "18:55" },
  { date: "2024-12-21", name: "ikelikelteruvasu", start: "19:05", end: "19:30" },
  { date: "2024-12-21", name: "なでたいコーギー", start: "19:40", end: "20:05" },
  { date: "2024-12-21", name: "1回生オールスターズ", start: "20:15", end: "20:25" },
  { date: "2024-12-21", name: "副部長挨拶", start: "20:25", end: "20:30" },
];

export type BandData = {
  name: string;
  copyFrom: string;
  comment: string;
  photo: string;
  order: number;
};
export const bandData = [
  {
    name: "JAY-RISYUMISS",
    copyFrom: "HEY-SMITH",
    comment:
      "こんにちは！HEY-SMITHのコピーバンドJAY-RISYUMISSです。\nこのバンドはパンクにホーン隊を加えたパンクロックバンドです！\nみんな、履修ミスには気をつけろよ！\n俺たち最強バンド卍",
    photo: "/image/2024teien/jayA-sya.jpg",
    order: 1,
  },
  {
    name: "Wii",
    copyFrom: "NEE",
    comment:
      "はじめまして。2024年度定期演奏会に出演いたします。Wiiです。\n長雨の続く６月に出演に続き、この度は雪の暦となる折りでの出演となり、嬉しく思います。\n我々Wiiのコピー元であるNEEのエキゾチックでミステリアスな雰囲気は、神々に由縁のある島根にぴったりなのではないでしょうか。\n雰囲気もさながら、バンドメンバーそれぞれが持つ個性的で巧みな演奏も我々Wiiの魅力的な部分です。\n定期演奏会当日は、是非ともご高覧ください。",
    photo: "/image/2024teien/wiiA-sya.jpg",
    order: 2,
  },
  {
    name: "クロレキシ団",
    copyFrom: "カゲロウプロジェクト/じん",
    comment:
      "定演バンド？強いよね。序盤、中盤、終盤、隙がないと思うよ。だけど、おれはまけないよ。えー、こまたっ、こまたちが躍動する俺のバンドを、皆さんに見せたいね\n\n\n8バンドあたり3バンド目ってとこか。 それが俺たちが定演に出演できる順番だ。俺たちのレベルは78。HPは14500。 バトルヒーリングスキルによる自動回復が10秒で600ポイントある。 何時間攻撃しても俺は倒せないよ。",
    photo: "/image/2024teien/kurorekishiA-sya.jpg",
    order: 3,
  },
  {
    name: "いけだまん帝国",
    copyFrom: "きのこ帝国",
    comment:
      "いけだまん帝国です！！\nいよいよ定期演奏会ですね\n大きな舞台で演奏できることに感謝し\n積み上げてきたものを発揮して\nパワフルな演奏をお届けします！\nいけだまん帝国でした！！11081！",
    photo: "/image/2024teien/ikedamanA-sya.jpg",
    order: 4,
  },
  {
    name: "🎱s",
    copyFrom: "ZAZEN BOYS",
    comment:
      "快活CLUBからやって参りました🎱sです。\nビリヤードメンバーを紹介します。\nguitar 岸本琉鳩\nbass 太田圭駿\non the drums 元ビリヤードキング 川端颯太\nそして私がThis is 宮原和志。\n過去の幾度とない努力、ビリヤード、飲みに遊び\nそして1つになった私たちの音, kimochiあなたに伝えたい。\nアルテピアでずっとずっとずっとずっと待ってます。\n快活CLUBからやって参りました🎱sでした。",
    photo: "/image/2024teien/8sA-sya.jpg",
    order: 5,
  },

  {
    name: "本当に変",
    copyFrom: "東京事変",
    comment:
      "こんにちは！東京事変のコピーバンド、本当に変です！\n\n私たちは、9月のOS争奪ライブから、メンバーみんなで息を合わせながら練習に励んできました！\n定期演奏会では、我々の集大成となるような演奏目指して頑張ります✊🏻\n会場であるアルテピア大ホールの雰囲気にぴったりな、大人っぽく、余韻あるセトリを用意しているので、ぜひ聴きに来てください😌✨",
    photo: "/image/2024teien/hontounihenA-sya.jpg",
    order: 6,
  },
  {
    name: "ikelikelteruvasu",
    copyFrom: "go!go!vanillas",
    comment:
      // " 「音楽で一つになる!」\n僕たち「ike! ike! teruyasu」は、情熱とエネルギーをもって音楽の楽しさを全力で表現します!\nバンドメンバーの息を合わせ、観てくれるすべての人を巻き込むような熱いライブを届けることを目指します。\n音楽を通じて「ike! ike! teruyasu」らしい唯一無二のパフォーマンスを作り上げ、みんなで最高の瞬間を共有します!",
      "",
    photo: "/image/2024teien/ikeikeA-sya.jpg",
    order: 7,
  },
  {
    name: "なでたいコーギー",
    copyFrom: "ネクライトーキー",
    comment:
      // "こんにちは！ネクライトーキーのコピーバンド、なでたいコーギー🐶です！\n私たちは、遊び心を大切にしながら、聴き手の方々と一緒に楽しめる演奏を心がけてきました!\n定期演奏会の場においても、皆さんとともに素敵なステージを作り上げたいと思っています🌟\nまた、全バンドのうちのトリを飾るということで、締めくくりにふさわしいバンドを目指して、精一杯がんばります🔥\n特にキーボードソロ・ギターソロは、練習の成果をぶつけられるように努めるので、是非前の方で聴いてくださいね💖"
      "",
    photo: "/image/2024teien/nadetaiA-sya.jpg",
    order: 8,
  },
];

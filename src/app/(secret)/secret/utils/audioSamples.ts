import { AudioSample, SampleCategory } from "../types/audio";

// 利用可能な音源に基づいてサンプルカテゴリーを更新
export const sampleCategories: SampleCategory[] = [
  {
    id: "character",
    name: "キャラクター音声",
    description: "アニメやキャラクターの音声",
    color: "from-purple-500 to-pink-700",
    samples: [
      {
        id: "baikinman",
        name: "バイキンマン",
        category: "character",
        file: "/secret/audio/baikinman.mp3",
        color: "from-purple-400 to-purple-600",
        description: "バイキンマンのセリフ",
        tags: ["アンパンマン", "キャラクター", "セリフ"],
      },
    ],
  },
  {
    id: "animal",
    name: "動物の鳴き声",
    description: "動物の鳴き声や効果音",
    color: "from-green-500 to-teal-700",
    samples: [
      {
        id: "meow",
        name: "ニャー",
        category: "animal",
        file: "/secret/audio/meow.mp3",
        color: "from-green-400 to-emerald-600",
        description: "猫の鳴き声",
        tags: ["動物", "猫", "鳴き声"],
      },
    ],
  },
  {
    id: "game",
    name: "ゲーム音源",
    description: "ゲーム関連の音源",
    color: "from-blue-500 to-indigo-700",
    samples: [
      {
        id: "wii",
        name: "Wii",
        category: "game",
        file: "/secret/audio/wii.mp3",
        color: "from-blue-400 to-blue-600",
        description: "Wiiコンソールの音声",
        tags: ["ゲーム", "任天堂", "起動音"],
      },
    ],
  },
  {
    id: "effect",
    name: "効果音",
    description: "様々な効果音",
    color: "from-red-500 to-orange-700",
    samples: [
      {
        id: "dosu",
        name: "ドス",
        category: "effect",
        file: "/secret/audio/dosu.mp3",
        color: "from-red-400 to-red-600",
        description: "ドスという効果音",
        tags: ["効果音", "アクセント"],
      },
      {
        id: "burudo-za-",
        name: "ブルドーザー",
        category: "effect",
        file: "/secret/audio/burudo-za-.mp3",
        color: "from-yellow-400 to-amber-600",
        description: "ブルドーザーの音",
        tags: ["乗り物", "建設", "機械"],
      },
    ],
  },
];

// すべてのサンプルをフラット化したリストを作成
export const allSamples: AudioSample[] = sampleCategories.flatMap((category) => category.samples);

// IDからサンプルを検索する関数
export const findSampleById = (id: string): AudioSample | undefined => {
  return allSamples.find((sample) => sample.id === id);
};

// カテゴリーIDからサンプルのリストを取得する関数
export const getSamplesByCategory = (categoryId: string): AudioSample[] => {
  const category = sampleCategories.find((cat) => cat.id === categoryId);
  return category ? category.samples : [];
};

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type SecretFeatureOptions = {
  keyNumber?: number;
  redirectPath?: string;
  sessionKey?: string;
  expirationMinutes?: number;
};

export const useSecretFeature = ({
  keyNumber = 7,
  redirectPath = "/secret",
  sessionKey = "accessAllowed",
  expirationMinutes = 60,
}: SecretFeatureOptions = {}) => {
  const [firstCounter, setFirstCounter] = useState(0);
  const [secondCounter, setSecondCounter] = useState(0);
  const router = useRouter();

  // 第一段階のカウンターの状態
  const firstStageCompleted = firstCounter == keyNumber;

  // 第二段階のカウンターの状態
  const secondStageCompleted = secondCounter >= keyNumber;

  // 全段階完了の状態
  const allStagesCompleted = firstStageCompleted && secondStageCompleted;

  // シークレット機能をアクティベートする関数
  const activateSecretFeature = () => {
    if (allStagesCompleted) {
      // セッションストレージにアクセス許可を保存
      sessionStorage.setItem(sessionKey, "true");
      sessionStorage.setItem("setTime", new Date().getTime().toString());

      // 指定されたパスにリダイレクト
      router.push(redirectPath);
    }
  };

  // カウンターをインクリメントする関数
  const incrementFirstCounter = () => {
    setFirstCounter((prev) => prev + 1);
  };

  const incrementSecondCounter = () => {
    setSecondCounter((prev) => {
      const newValue = prev + 1;
      // 第二段階が完了して、第一段階も完了している場合、自動的に機能をアクティベート
      if (newValue >= keyNumber && firstStageCompleted) {
        setTimeout(() => activateSecretFeature(), 500); // 視覚効果を確認できるよう少し遅延
      }
      return newValue;
    });
  };

  // 現在の状態に基づくクラス名を計算
  const getSecretClassNames = () => {
    if (allStagesCompleted) {
      return "secret-all-completed";
    } else if (firstStageCompleted) {
      return "secret-first-completed";
    }
    return "";
  };

  // 進行状況の表示用データを提供
  const getProgress = () => {
    return {
      firstStage: {
        current: firstCounter,
        max: keyNumber,
        percent: Math.min(100, Math.round((firstCounter / keyNumber) * 100)),
      },
      secondStage: {
        current: secondCounter,
        max: keyNumber,
        percent: Math.min(100, Math.round((secondCounter / keyNumber) * 100)),
      },
    };
  };

  return {
    firstStageCompleted,
    secondStageCompleted,
    allStagesCompleted,
    incrementFirstCounter,
    incrementSecondCounter,
    activateSecretFeature,
    getSecretClassNames,
    getProgress, // 進行状況を追加
    firstCounter, // 現在値も返す
    secondCounter,
  };
};

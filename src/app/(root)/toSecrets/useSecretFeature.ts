import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type SecretFeatureOptions = {
  keyNumber?: number;
  redirectPath?: string;
  sessionKey?: string;
  expirationMinutes?: number;
  soundEffects?: boolean;
};

export const useSecretFeature = ({
  keyNumber = 7,
  redirectPath = "/secret",
  sessionKey = "accessAllowed",
  expirationMinutes = 60,
  soundEffects = true,
}: SecretFeatureOptions = {}) => {
  const [firstCounter, setFirstCounter] = useState(0);
  const [secondCounter, setSecondCounter] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [lastActivationTime, setLastActivationTime] = useState<number | null>(null);
  const [activationProgress, setActivationProgress] = useState(0);
  const router = useRouter();

  // 第一段階のカウンターの状態
  const firstStageCompleted = firstCounter >= keyNumber;

  // 第二段階のカウンターの状態
  const secondStageCompleted = secondCounter >= keyNumber;

  // 全段階完了の状態
  const allStagesCompleted = firstStageCompleted && secondStageCompleted;

  // AudioContext初期化
  useEffect(() => {
    if (typeof window !== "undefined" && soundEffects) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);

      return () => {
        if (context && context.state !== "closed") {
          context.close();
        }
      };
    }
  }, [soundEffects]);

  // 音を鳴らす関数
  const playTone = useCallback(
    (frequency: number, duration: number, volume: number = 0.1) => {
      if (!audioContext || !soundEffects) return;

      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.error("Error playing tone:", error);
      }
    },
    [audioContext, soundEffects]
  );

  // シークレットアクティベーションの進行状態を更新
  useEffect(() => {
    const total = keyNumber * 2; // 両方のカウンターの合計目標
    const current = firstCounter + secondCounter; // 現在の合計進行状況
    setActivationProgress(Math.min((current / total) * 100, 100));
  }, [firstCounter, secondCounter, keyNumber]);

  // シークレット機能をアクティベートする関数
  const activateSecretFeature = useCallback(() => {
    if (allStagesCompleted) {
      // 完了音を鳴らす
      if (soundEffects && audioContext) {
        // 成功音のシーケンス
        playTone(523.25, 0.1, 0.2); // C5
        setTimeout(() => playTone(659.25, 0.1, 0.2), 150); // E5
        setTimeout(() => playTone(783.99, 0.2, 0.3), 300); // G5
      }

      // アクティベーション時刻を記録
      const now = new Date().getTime();
      setLastActivationTime(now);

      // セッションストレージにアクセス許可を保存
      sessionStorage.setItem(sessionKey, "true");
      sessionStorage.setItem("secretAccessTime", now.toString());

      // アクティベーションビジュアルエフェクトのためのスリープ
      setTimeout(() => {
        // 指定されたパスにリダイレクト
        router.push(redirectPath);
      }, 1500);
    }
  }, [allStagesCompleted, audioContext, playTone, redirectPath, router, sessionKey, soundEffects]);

  // カウンターをインクリメントする関数 - 高度化
  const incrementFirstCounter = useCallback(() => {
    setFirstCounter((prev) => {
      const newValue = prev + 1;

      // サウンドフィードバック
      if (soundEffects && audioContext) {
        // 段階的に周波数を上げる
        const freqBase = 220;
        const freq = freqBase + newValue * 50;
        playTone(freq, 0.1);

        // 第一段階完了時は特別な音
        if (newValue === keyNumber) {
          setTimeout(() => {
            playTone(440, 0.15, 0.15);
            setTimeout(() => playTone(523.25, 0.2, 0.15), 160);
          }, 200);
        }
      }

      return newValue;
    });
  }, [audioContext, keyNumber, playTone, soundEffects]);

  const incrementSecondCounter = useCallback(() => {
    // 第一段階が完了していない場合は何もしない
    if (!firstStageCompleted) return;

    setSecondCounter((prev) => {
      const newValue = prev + 1;

      // サウンドフィードバック
      if (soundEffects && audioContext) {
        // 第二段階用の異なる音色
        const freqBase = 330;
        const freq = freqBase + newValue * 60;
        playTone(freq, 0.08, 0.15);

        // 全段階完了時
        if (newValue >= keyNumber) {
          setTimeout(() => activateSecretFeature(), 300);
        }
      } else if (newValue >= keyNumber) {
        // 音なしでもアクティベーション
        setTimeout(() => activateSecretFeature(), 300);
      }

      return newValue;
    });
  }, [activateSecretFeature, audioContext, firstStageCompleted, keyNumber, playTone, soundEffects]);

  // 現在の状態に基づくクラス名を計算
  const getSecretClassNames = useCallback(() => {
    const classes = [];

    if (firstStageCompleted) {
      classes.push("secret-first-completed");
    }

    if (allStagesCompleted) {
      classes.push("secret-all-completed");
    }

    // 進捗に基づく追加のクラス
    if (activationProgress > 0) {
      classes.push(`secret-progress-${Math.floor(activationProgress / 10) * 10}`);
    }

    return classes.join(" ");
  }, [activationProgress, allStagesCompleted, firstStageCompleted]);

  // シークレットの有効期限をチェックする
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTimeStr = sessionStorage.getItem("secretAccessTime");
      if (storedTimeStr) {
        const storedTime = parseInt(storedTimeStr, 10);
        const currentTime = new Date().getTime();
        const minutesPassed = (currentTime - storedTime) / (1000 * 60);

        if (minutesPassed > expirationMinutes) {
          // 期限切れ
          sessionStorage.removeItem(sessionKey);
          sessionStorage.removeItem("secretAccessTime");
        }
      }
    }
  }, [expirationMinutes, sessionKey]);

  return {
    firstStageCompleted,
    secondStageCompleted,
    allStagesCompleted,
    incrementFirstCounter,
    incrementSecondCounter,
    activateSecretFeature,
    getSecretClassNames,
    activationProgress,
  };
};

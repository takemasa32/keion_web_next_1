import { useCallback, useEffect, useState } from "react";
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
  const firstStageCompleted = firstCounter >= keyNumber;
  const secondStageCompleted = secondCounter >= keyNumber;
  const allStagesCompleted = firstStageCompleted && secondStageCompleted;
  const activateSecretFeature = useCallback(() => {
    if (!allStagesCompleted) return;
    try {
      sessionStorage.setItem(sessionKey, "true");
      sessionStorage.setItem("secretAccessTime", Date.now().toString());
      sessionStorage.setItem("secretExpirationMinutes", expirationMinutes.toString());
    } catch {
      return;
    }
    router.push(redirectPath);
  }, [allStagesCompleted, expirationMinutes, redirectPath, router, sessionKey]);
  useEffect(() => {
    if (!allStagesCompleted) return;
    const timer = setTimeout(activateSecretFeature, 300);
    return () => clearTimeout(timer);
  }, [allStagesCompleted, activateSecretFeature]);
  return {
    firstStageCompleted,
    secondStageCompleted,
    allStagesCompleted,
    incrementFirstCounter: () => setFirstCounter((value) => Math.min(value + 1, keyNumber)),
    incrementSecondCounter: () => {
      if (firstStageCompleted) setSecondCounter((value) => Math.min(value + 1, keyNumber));
    },
    activateSecretFeature,
    getSecretClassNames: () =>
      allStagesCompleted
        ? "secret-all-completed"
        : firstStageCompleted
          ? "secret-first-completed"
          : "",
  };
};

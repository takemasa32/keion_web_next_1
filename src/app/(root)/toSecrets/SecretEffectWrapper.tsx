"use client";
import React, { ReactNode } from "react";

type SecretEffectWrapperProps = {
  children: ReactNode;
  secretClassName: string;
};

// シークレットエフェクトを全画面に適用するためのラッパーコンポーネント
const SecretEffectWrapper = ({ children, secretClassName }: SecretEffectWrapperProps) => {
  return <div className={`min-h-screen ${secretClassName}`}>{children}</div>;
};

export default SecretEffectWrapper;

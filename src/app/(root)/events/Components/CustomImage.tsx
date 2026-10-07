"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
export default function CustomImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      {...props}
      src={failed ? "/icons/icon-512x512.png" : props.src}
      alt={props.alt || ""}
      onError={() => setFailed(true)}
    />
  );
}

"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export default function PhotoViewer({ src, alt }: { src: string; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <>
      <button
        className="photo-open"
        aria-label={alt + "の写真を拡大"}
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
        <span aria-hidden="true">拡大 ↗</span>
      </button>
      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label={alt}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="photo-dialog-body">
          <button
            className="photo-close"
            onClick={() => dialog.current?.close()}
            aria-label="写真を閉じる"
          >
            閉じる ×
          </button>
          <div className="photo-full">
            <Image src={src} alt={alt} fill sizes="90vw" className="object-contain" />
          </div>
          <p>{alt}</p>
        </div>
      </dialog>
    </>
  );
}

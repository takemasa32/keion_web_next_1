"use client";
import { useEffect } from "react";
import Modal from "react-modal";
import CustomImage from "./CustomImage";
import { useSwipeable } from "react-swipeable";
import { BandData } from "../2024teikiensoukai/data";
interface Props {
  selectedBand: BandData | null;
  closeModal: () => void;
  handleSwipeLeft: () => void;
  handleSwipeRight: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  totalBands: number;
}
export default function ModalComponent({
  selectedBand,
  closeModal,
  handleSwipeLeft,
  handleSwipeRight,
  setLoading,
}: Props) {
  const handlers = useSwipeable({ onSwipedLeft: handleSwipeLeft, onSwipedRight: handleSwipeRight });
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleSwipeLeft();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleSwipeRight();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleSwipeLeft, handleSwipeRight]);
  return (
    <Modal
      appElement={
        typeof document !== "undefined"
          ? (document.getElementById("__next") ?? undefined)
          : undefined
      }
      isOpen={Boolean(selectedBand)}
      onRequestClose={closeModal}
      contentLabel={selectedBand?.name ?? "バンド紹介"}
      className="relative mx-4 max-h-[85dvh] w-full max-w-3xl overflow-y-auto bg-[#faf9f5] p-6 sm:p-8"
      overlayClassName="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
      shouldReturnFocusAfterClose
    >
      <div {...handlers}>
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs tracking-widest text-slate-600">BAND PROFILE</span>
          <button
            onClick={closeModal}
            aria-label="バンド紹介を閉じる"
            className="min-h-11 min-w-11 text-xl"
          >
            ×
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-square bg-slate-100">
            {selectedBand?.photo && (
              <CustomImage
                src={selectedBand.photo}
                alt={selectedBand.name}
                fill
                sizes="(max-width: 640px) 90vw, 350px"
                className="object-cover"
                onLoad={() => setLoading(false)}
              />
            )}
          </div>
          <div>
            <p className="mb-2 text-sm text-slate-600">{selectedBand?.copyFrom}</p>
            <h2 className="mb-4 text-2xl font-bold">{selectedBand?.name}</h2>
            <p className="whitespace-pre-line text-sm text-slate-700">{selectedBand?.comment}</p>
          </div>
        </div>
        <div className="mt-8 flex justify-between gap-4 border-t border-slate-300 pt-5">
          <button className="button" onClick={handleSwipeRight}>
            ← 前のバンド
          </button>
          <button className="button" onClick={handleSwipeLeft}>
            次のバンド →
          </button>
        </div>
      </div>
    </Modal>
  );
}

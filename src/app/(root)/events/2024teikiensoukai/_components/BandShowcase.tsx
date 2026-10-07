"use client";
import { useState } from "react";
import Image from "next/image";
import { BandData } from "../data";
import ModalComponent from "../../Components/ModalComponent";
export default function BandShowcase({ data }: { data: BandData[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const move = (direction: number) => {
    setSelectedIndex((index) =>
      index === null ? null : (index + direction + data.length) % data.length
    );
    setLoading(true);
  };
  return (
    <section className="mb-12 border-b border-[#d7dcd7] pb-10">
      <h2 className="mb-3 text-2xl font-bold">出演バンド</h2>
      <p className="mb-6 text-sm text-slate-600">写真から、バンドの紹介をご覧いただけます。</p>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
        {data.map((band, index) => (
          <button
            key={band.name}
            onClick={() => {
              setSelectedIndex(index);
              setLoading(true);
            }}
            className="text-left"
            aria-label={band.name + "の紹介を見る"}
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <Image
                src={band.photo}
                alt={band.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <span className="mt-3 block text-sm font-bold">{band.name}</span>
            <span className="text-xs text-slate-600">{band.copyFrom}</span>
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <ModalComponent
          selectedBand={data[selectedIndex]}
          closeModal={() => setSelectedIndex(null)}
          handleSwipeLeft={() => move(1)}
          handleSwipeRight={() => move(-1)}
          loading={loading}
          setLoading={setLoading}
          totalBands={data.length}
        />
      )}
    </section>
  );
}

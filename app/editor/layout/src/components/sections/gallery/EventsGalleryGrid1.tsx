"use client";

import { useState } from "react";
import Image from "next/image";

import type { GalleryCardData, SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { useOptionalPreview } from "../../context/PreviewContext";
import EventsGalleryPreview from "./EventsGalleryPreview";

export default function EventsGalleryGrid1({ data = {} }: SectionProps) {
  const previewContext = useOptionalPreview();
  const canOpenPreview = previewContext?.isPreview ?? true;
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const tabs = (data.tabs ?? [
    "WEDDINGS",
    "CORPORATE",
    "BUSINESS",
    "ENTERTAINMENT",
  ]) as string[];
  const cards = (data.cards ?? []) as GalleryCardData[];
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0] ?? "WEDDINGS");
  const selectedTabKey = selectedTab.toLowerCase();
  const filteredCards = cards.filter(
    (card) =>
      card.subtitle?.toLowerCase() === selectedTabKey ||
      card.badge?.toLowerCase() === selectedTabKey,
  );
  const emptyLabel =
    data.noImagesLabel ??
    `No gallery items found for ${selectedTab}. Please choose another category.`;
  const previewImages = filteredCards
    .map((card) => card.image ?? "")
    .filter(Boolean);

  return (
    <>
      <section
        data-editor-section-label="Gallery Grid"
        data-editor-fields="tabs cards noImagesLabel"
        className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 md:mt-10 lg:mt-14 lg:px-8"
      >
        <div className="flex flex-wrap justify-center gap-3 text-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                tab === selectedTab
                  ? "border-[#d61b58] bg-[#fce7ef] text-[#b01648] shadow-md shadow-[#d61b58]/20"
                  : "border-[#d61b58] text-[#d61b58] hover:bg-[#fce7ef]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div data-box-layout-grid="grid" className="mt-10 grid grid-cols-1 content-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-[#f4d4e1] bg-white p-10 text-center text-slate-600 shadow-[0_20px_60px_-35px_rgba(214,27,88,0.12)]">
              {emptyLabel}
            </div>
          ) : (
            filteredCards.map((card, idx) => (
              <button
                key={`${card.image ?? card.title}-${idx}`}
                type="button"
                onClick={() => {
                  if (canOpenPreview) setPreviewIndex(idx);
                }}
                aria-label={card.title ?? card.subtitle ?? "Gallery image"}
                className="group overflow-hidden rounded-[2rem] border border-[#f4d4e1] bg-white text-left shadow-[0_20px_60px_-35px_rgba(214,27,88,0.18)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-35px_rgba(214,27,88,0.25)]"
              >
                <div className="relative h-64 overflow-hidden sm:h-72">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.title ?? card.subtitle ?? "Gallery card image"}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      unoptimized={isUnoptimizedImageSrc(card.image)}
                    />
                  ) : null}
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {previewIndex !== null && previewImages.length > 0 && (
        <EventsGalleryPreview
          images={previewImages}
          activeIndex={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </>
  );
}

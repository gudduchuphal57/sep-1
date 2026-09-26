"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiEye, FiX } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type GalleryItem = {
  src?: string;
  image?: string;
  alt?: string;
  category?: string;
  title?: string;
};

type Category = { label?: string; value?: string; active?: boolean };

export default function NGOGalleryGrid2({ data = {} }: SectionProps) {
  const categories = (Array.isArray(data.categories)
    ? data.categories
    : [{ label: "All", value: "all", active: true }]) as Category[];
  const images = (Array.isArray(data.images)
    ? data.images
    : Array.isArray(data.cards)
      ? data.cards
      : []) as GalleryItem[];
  const defaultCategory =
    categories.find((c) => c.active)?.value || categories[0]?.value || "all";
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((item) => item.category === activeCategory);

  return (
    <>
      <section
        data-editor-section-label="Gallery Grid"
        data-editor-fields="categories images cards"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value ?? cat.label}
              type="button"
              onClick={() => setActiveCategory(cat.value || "all")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === cat.value
                  ? "border-[#ff541b] bg-[#ff541b] text-white"
                  : "border-orange-200 text-[#ff541b] hover:bg-orange-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => {
            const src = item.src || item.image || "";
            return (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className="group relative h-64 overflow-hidden rounded-2xl bg-slate-100"
              >
                {src ? (
                  <Image
                    src={src}
                    alt={item.alt || item.title || "Gallery image"}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized={isUnoptimizedImageSrc(src)}
                  />
                ) : null}
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/35">
                  <FiEye className="text-2xl text-white opacity-0 transition group-hover:opacity-100" />
                </span>
              </button>
            );
          })}
        </div>
      </section>
      {selectedIndex !== null && filtered[selectedIndex] ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setSelectedIndex(null)}
          >
            <FiX className="text-2xl" />
          </button>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() =>
              setSelectedIndex(
                (selectedIndex - 1 + filtered.length) % filtered.length,
              )
            }
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <div className="relative h-[70vh] w-full max-w-5xl">
            <Image
              src={
                filtered[selectedIndex].src ||
                filtered[selectedIndex].image ||
                ""
              }
              alt={
                filtered[selectedIndex].alt ||
                filtered[selectedIndex].title ||
                "Preview"
              }
              fill
              className="object-contain"
              unoptimized={isUnoptimizedImageSrc(
                filtered[selectedIndex].src || filtered[selectedIndex].image,
              )}
            />
          </div>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white sm:right-16"
            onClick={() =>
              setSelectedIndex((selectedIndex + 1) % filtered.length)
            }
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      ) : null}
    </>
  );
}

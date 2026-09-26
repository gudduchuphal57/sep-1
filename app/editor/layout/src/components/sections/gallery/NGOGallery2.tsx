"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiEye, FiX } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const itemMatchesCategory = (item: GalleryItem, category: Category) => {
  const wanted = (category.value || slugify(category.label || "")).toLowerCase();
  const itemValue = (item.category || "").trim().toLowerCase();
  if (!wanted || wanted === "all") return true;
  if (itemValue === wanted) return true;
  if (itemValue === slugify(category.label || "")) return true;
  if (itemValue === (category.label || "").trim().toLowerCase()) return true;
  return false;
};

export default function NGOGallery2({ data = {} }: SectionProps) {
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle.trim()) ||
    (isRecord(data.badge) && typeof data.badge.label === "string"
      ? data.badge.label
      : "Our Gallery");
  const titleObject = isRecord(data.title) ? data.title : undefined;
  const title =
    (typeof data.title === "string" && data.title.trim()) ||
    [titleObject?.line1, titleObject?.highlight, titleObject?.line2]
      .filter(
        (part): part is string =>
          typeof part === "string" && Boolean(part.trim()),
      )
      .join(" ")
      .trim() ||
    "Moments of Impact";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const categories = (Array.isArray(data.categories)
    ? data.categories
    : Array.isArray(data.tabs)
      ? (data.tabs as string[]).map((t) => ({
          label: t,
          value: slugify(t) || t.toLowerCase(),
        }))
      : [{ label: "All", value: "all", active: true }]) as Category[];
  const images = (Array.isArray(data.images)
    ? data.images
    : Array.isArray(data.cards)
      ? data.cards
      : Array.isArray(data.galleryItems)
        ? data.galleryItems
        : []) as GalleryItem[];

  const defaultCategory =
    categories.find((c) => c.active)?.value ||
    categories[0]?.value ||
    "all";
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const activeCategoryMeta =
    categories.find(
      (cat) => (cat.value || slugify(cat.label || "")) === activeCategory,
    ) ?? { label: "All", value: "all" };

  const filteredImages =
    activeCategory === "all"
      ? images
      : images.filter((item) => itemMatchesCategory(item, activeCategoryMeta));

  const handleNext = useCallback(() => {
    if (selectedIndex === null || !filteredImages.length) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % filteredImages.length : 0,
    );
  }, [selectedIndex, filteredImages.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null || !filteredImages.length) return;
    setSelectedIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredImages.length) % filteredImages.length
        : 0,
    );
  }, [selectedIndex, filteredImages.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, handleNext, handlePrev]);

  return (
    <>
      <section
        data-editor-section-label="Gallery"
        data-editor-fields="pretitle title desc categories images"
        data-editor-card-fields="image category"
        className="relative overflow-hidden bg-[#fafafa] px-0 py-8 md:py-12"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#FF4500]">
              <HiOutlineHeart className="text-base text-[#FF4500]" />
              <span>{pretitle}</span>
            </div>
            <h2 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>

          {categories.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => {
                const value = cat.value || slugify(cat.label || "") || "all";
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setActiveCategory(value)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      activeCategory === value
                        ? "border-[#ff541b] bg-[#ff541b] text-white"
                        : "border-orange-200 text-[#ff541b] hover:bg-orange-50"
                    }`}
                  >
                    {cat.label || cat.value}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((item, idx) => {
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
        </div>
      </section>

      {selectedIndex !== null && filteredImages[selectedIndex] ? (
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
            onClick={handlePrev}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <div className="relative h-[70vh] w-full max-w-5xl">
            <Image
              src={
                filteredImages[selectedIndex].src ||
                filteredImages[selectedIndex].image ||
                ""
              }
              alt={
                filteredImages[selectedIndex].alt ||
                filteredImages[selectedIndex].title ||
                "Gallery preview"
              }
              fill
              className="object-contain"
              unoptimized={isUnoptimizedImageSrc(
                filteredImages[selectedIndex].src ||
                  filteredImages[selectedIndex].image,
              )}
            />
          </div>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white sm:right-16"
            onClick={handleNext}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      ) : null}
    </>
  );
}

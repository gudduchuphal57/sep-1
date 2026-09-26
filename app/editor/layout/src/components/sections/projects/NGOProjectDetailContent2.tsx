"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import {
  HiOutlineHeart,
  HiOutlineUserGroup,
  HiOutlineSparkles,
} from "react-icons/hi2";
import {
  IoWaterOutline,
  IoShieldCheckmarkOutline,
  IoStatsChartOutline,
} from "react-icons/io5";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type GalleryImage = { id?: string | number; url?: string; src?: string; alt?: string };
type ImpactStat = { icon?: string; value?: string; label?: string };

export default function NGOProjectDetailContent2({ data = {} }: SectionProps) {
  const badge =
    (typeof data.badge === "string" && data.badge) ||
    (isRecord(data.badge) && typeof data.badge.label === "string"
      ? data.badge.label
      : "") ||
    "OUR PROJECT";
  const title = (typeof data.title === "string" && data.title) || "";
  const summary =
    (typeof data.summary === "string" && data.summary) ||
    (typeof data.description === "string" && data.description) ||
    (typeof data.desc === "string" && data.desc) ||
    "";
  const mainImage = isRecord(data.mainImage) ? data.mainImage : undefined;
  const mainImageUrl =
    (typeof mainImage?.url === "string" && mainImage.url) ||
    (typeof mainImage?.src === "string" && mainImage.src) ||
    (typeof data.image === "string" && data.image) ||
    "";
  const meta = isRecord(data.meta) ? data.meta : undefined;
  const overview = isRecord(data.overview) ? data.overview : undefined;
  const impactSoFar = isRecord(data.impactSoFar) ? data.impactSoFar : undefined;
  const gallery = isRecord(data.gallery) ? data.gallery : undefined;
  const keyHighlights = isRecord(data.keyHighlights)
    ? data.keyHighlights
    : undefined;
  const ctaSidebar = isRecord(data.ctaSidebar) ? data.ctaSidebar : undefined;

  const overviewParagraphs = Array.isArray(overview?.paragraphs)
    ? (overview.paragraphs as string[])
    : [];
  const goalCard = isRecord(overview?.goalCard) ? overview.goalCard : undefined;
  const impactStats = Array.isArray(impactSoFar?.stats)
    ? (impactSoFar.stats as ImpactStat[])
    : [];
  const galleryImages = Array.isArray(gallery?.images)
    ? (gallery.images as GalleryImage[])
    : [];
  const highlightItems = Array.isArray(keyHighlights?.items)
    ? (keyHighlights.items as string[])
    : Array.isArray(data.highlights)
      ? (data.highlights as string[])
      : Array.isArray(data.details)
        ? (data.details as string[])
        : [];

  const projectStarted = isRecord(meta?.projectStarted)
    ? meta.projectStarted
    : undefined;
  const locationMeta = isRecord(meta?.location) ? meta.location : undefined;
  const beneficiaries = isRecord(meta?.beneficiaries)
    ? meta.beneficiaries
    : undefined;

  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<
    number | null
  >(null);

  const handleNextImage = () => {
    if (selectedGalleryIndex === null || galleryImages.length === 0) return;
    setSelectedGalleryIndex(
      (prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0),
    );
  };

  const handlePrevImage = () => {
    if (selectedGalleryIndex === null || galleryImages.length === 0) return;
    setSelectedGalleryIndex((prev) =>
      prev !== null
        ? (prev - 1 + galleryImages.length) % galleryImages.length
        : 0,
    );
  };

  const renderStatIcon = (iconName?: string) => {
    switch (iconName) {
      case "people":
        return <HiOutlineUserGroup className="text-2xl text-[#FF4500]" />;
      case "water-drop":
        return <IoWaterOutline className="text-2xl text-[#FF4500]" />;
      case "shield-check":
        return <IoShieldCheckmarkOutline className="text-2xl text-[#FF4500]" />;
      case "heart-percentage":
        return <IoStatsChartOutline className="text-2xl text-[#FF4500]" />;
      default:
        return <HiOutlineSparkles className="text-2xl text-[#FF4500]" />;
    }
  };

  return (
    <>
      <section
        data-editor-section-label="Project Detail"
        data-editor-fields="badge title mainImage summary meta overview impactSoFar gallery keyHighlights ctaSidebar"
        className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm lg:col-span-7">
            <div className="relative h-[300px] w-full sm:h-[400px] lg:h-[460px]">
              {mainImageUrl ? (
                <Image
                  src={mainImageUrl}
                  alt={
                    (typeof mainImage?.alt === "string" && mainImage.alt) ||
                    title ||
                    "Project"
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                  unoptimized={isUnoptimizedImageSrc(mainImageUrl)}
                />
              ) : (
                <div className="h-full w-full bg-orange-50" />
              )}
              {typeof mainImage?.badgeText === "string" ? (
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-[#FF4500] px-3.5 py-1.5 text-sm font-bold text-white shadow-md">
                  <IoWaterOutline className="text-sm" />
                  <span>{mainImage.badgeText}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-5 lg:pl-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#FF4500]">
              <HiOutlineHeart className="text-base" />
              <span>{badge}</span>
            </div>

            <h1 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <div className="mt-2 h-[2px] w-12 bg-orange-200" />

            {summary ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                {summary}
              </p>
            ) : null}

            <div className="mt-8 grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-center sm:gap-4">
              <div className="flex flex-col items-center justify-center">
                <FiCalendar className="text-lg text-[#FF4500]" />
                <span className="mt-1 text-[11px] font-semibold text-slate-400">
                  {(typeof projectStarted?.label === "string" &&
                    projectStarted.label) ||
                    "Project Started"}
                </span>
                <span className="mt-0.5 text-sm font-bold text-slate-800">
                  {(typeof projectStarted?.value === "string" &&
                    projectStarted.value) ||
                    ""}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center border-x border-slate-200/60 px-2">
                <FiMapPin className="text-lg text-[#FF4500]" />
                <span className="mt-1 text-[11px] font-semibold text-slate-400">
                  {(typeof locationMeta?.label === "string" &&
                    locationMeta.label) ||
                    "Location"}
                </span>
                <span className="mt-0.5 text-sm font-bold text-slate-800">
                  {(typeof locationMeta?.value === "string" &&
                    locationMeta.value) ||
                    ""}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <FiUsers className="text-lg text-[#FF4500]" />
                <span className="mt-1 text-[11px] font-semibold text-slate-400">
                  {(typeof beneficiaries?.label === "string" &&
                    beneficiaries.label) ||
                    "Beneficiaries"}
                </span>
                <span className="mt-0.5 text-sm font-bold text-slate-800">
                  {(typeof beneficiaries?.value === "string" &&
                    beneficiaries.value) ||
                    ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100/70 text-[#FF4500]">
                <HiOutlineSparkles className="text-lg" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#0F172A] sm:text-2xl">
                {(typeof overview?.title === "string" && overview.title) ||
                  "Project Overview"}
              </h2>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {overviewParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {goalCard ? (
              <div className="mt-6 flex items-start gap-4 rounded-xl border border-orange-200/60 bg-gradient-to-r from-orange-50/70 via-orange-50/40 to-transparent p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#FF4500]">
                  <HiOutlineHeart className="text-xl" />
                </div>
                <div>
                  {typeof goalCard.title === "string" ? (
                    <h3 className="text-base font-bold text-slate-900">
                      {goalCard.title}
                    </h3>
                  ) : null}
                  {typeof goalCard.description === "string" ? (
                    <p className="mt-1 text-sm text-slate-600">
                      {goalCard.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#FF4500]">
                <IoStatsChartOutline className="text-lg" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#0F172A]">
                {(typeof impactSoFar?.title === "string" &&
                  impactSoFar.title) ||
                  "Impact So Far"}
              </h2>
            </div>

            <div className="mt-6 divide-y divide-slate-200/60">
              {impactStats.map((stat, idx) => (
                <div
                  key={`${stat.label}-${idx}`}
                  className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                    {renderStatIcon(stat.icon)}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-extrabold text-[#0F172A]">
                      {stat.value}
                    </h4>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {galleryImages.length > 0 ? (
          <div className="mt-14">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#0F172A] sm:text-2xl">
                {(typeof gallery?.title === "string" && gallery.title) ||
                  "Project Gallery"}
              </h2>

              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => setSelectedGalleryIndex(0)}
                  aria-label="Open gallery view"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#FF4500] hover:text-[#FF4500]"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGalleryIndex(0)}
                  aria-label="Open gallery view"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#FF4500] hover:text-[#FF4500]"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {galleryImages.map((img, idx) => {
                const src = img.url || img.src || "";
                return (
                  <button
                    type="button"
                    key={img.id ?? idx}
                    onClick={() => setSelectedGalleryIndex(idx)}
                    className="group relative h-40 w-full cursor-pointer overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all duration-300 hover:shadow-md sm:h-44"
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt={img.alt || "Project detail image"}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={isUnoptimizedImageSrc(src)}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-xl font-bold text-[#0F172A] sm:text-2xl">
              {(typeof keyHighlights?.title === "string" &&
                keyHighlights.title) ||
                "Key Highlights"}
            </h2>

            <ul className="mt-6 space-y-3.5">
              {highlightItems.map((highlight, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FiCheckCircle className="shrink-0 text-lg text-[#FF4500]" />
                  <span className="text-sm font-medium text-slate-700 sm:text-base">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {ctaSidebar ? (
            <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/80 via-white to-orange-100/30 p-4 text-center shadow-sm lg:col-span-5">
              <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
                <div className="mx-auto flex h-24 w-24 shrink-0 md:mx-0 md:h-28 md:w-28">
                  <Image
                    src="/heartImage.png"
                    alt="Support our cause"
                    width={112}
                    height={112}
                    sizes="112px"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="text-center md:text-left">
                  {typeof ctaSidebar.title === "string" ? (
                    <h3 className="font-serif text-2xl font-extrabold text-[#0F172A]">
                      {ctaSidebar.title}
                    </h3>
                  ) : null}

                  {typeof ctaSidebar.description === "string" ? (
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {ctaSidebar.description}
                    </p>
                  ) : null}

                  <Link
                    href={
                      (typeof ctaSidebar.buttonLink === "string" &&
                        ctaSidebar.buttonLink) ||
                      "/donate"
                    }
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4500] px-8 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#e03d00] hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    {(typeof ctaSidebar.buttonText === "string" &&
                      ctaSidebar.buttonText) ||
                      "Donate Now"}
                    <span className="text-lg leading-none">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {selectedGalleryIndex !== null && galleryImages.length > 0 ? (
        <div
          onClick={() => setSelectedGalleryIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all"
        >
          <button
            type="button"
            onClick={() => setSelectedGalleryIndex(null)}
            aria-label="Close modal"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black"
          >
            <FiX className="text-xl" />
          </button>

          {galleryImages.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              aria-label="Previous image"
              className="absolute left-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black sm:h-12 sm:w-12"
            >
              <FiChevronLeft className="text-2xl" />
            </button>
          ) : null}

          {galleryImages.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              aria-label="Next image"
              className="absolute right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black sm:h-12 sm:w-12"
            >
              <FiChevronRight className="text-2xl" />
            </button>
          ) : null}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center justify-center overflow-hidden rounded-2xl"
          >
            <div className="relative h-[80vh] w-[90vw]">
              {(() => {
                const current = galleryImages[selectedGalleryIndex];
                const src = current?.url || current?.src || "";
                if (!src) return null;
                return (
                  <Image
                    src={src}
                    alt={current?.alt || "Gallery preview"}
                    fill
                    sizes="90vw"
                    quality={80}
                    className="rounded-2xl object-contain"
                    unoptimized={isUnoptimizedImageSrc(src)}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

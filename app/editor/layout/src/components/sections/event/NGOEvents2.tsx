"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";

type EventCard = {
  title?: string;
  image?: { src?: string; alt?: string } | string;
  href?: string;
  button?: { label?: string; href?: string; variant?: string };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTitleText = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  if (typeof value.title === "string") return value.title;
  return [value.line1, value.highlight, value.line2]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ");
};

export default function NGOEvents2({ data = {} }: SectionProps) {
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (isRecord(data.badge) && typeof data.badge.label === "string"
      ? data.badge.label
      : "Upcoming Events");
  const title = toTitleText(data.title);
  const description =
    typeof data.desc === "string"
      ? data.desc
      : typeof data.description === "string"
        ? data.description
        : undefined;
  const events = (Array.isArray(data.events)
    ? data.events
    : Array.isArray(data.eventItems)
      ? data.eventItems
      : Array.isArray(data.items)
        ? data.items
        : []) as EventCard[];
  const exploreButton = isRecord(data.exploreButton)
    ? (data.exploreButton as { label?: string; href?: string })
    : { label: "Explore More Events", href: "/events" };
  const showExplore = data.showExploreButton !== false;
  const boxesPerRow =
    collectionBoxesPerRow(data, "events") ?? sectionWrapperBoxesPerRow(data);
  const visibleEvents =
    boxesPerRow || !showExplore ? events : events.slice(0, 3);

  const buttonBgStyles = [
    "bg-[#D32F2F] hover:bg-[#B71C1C]",
    "bg-[#4C35A8] hover:bg-[#3B2885]",
    "bg-[#FF5722] hover:bg-[#E64A19]",
  ];

  return (
    <section
      data-editor-section-label="Events Content"
      data-editor-fields="pretitle title desc events exploreButton showExploreButton"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      className="relative overflow-hidden bg-[#fafafa] px-0 py-8 font-sans md:py-12"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-orange-100/60 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-orange-100/40 blur-[120px]" />
      <div className="pointer-events-none absolute -right-16 top-28 h-20 w-20 rounded-full bg-orange-100 sm:h-32 sm:w-32" />
      <div className="pointer-events-none absolute left-6 top-28 grid grid-cols-6 gap-1.5 opacity-20">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        ))}
      </div>
      <div className="pointer-events-none absolute right-6 top-5 grid grid-cols-6 gap-1.5 opacity-20">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        ))}
      </div>

      <div className="relative mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-[#FF4500]">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span>{pretitle}</span>
          </div>
          {title ? (
            <h2 className="mt-0 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div
          data-box-layout-grid="grid"
          className="mt-4 grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 md:mt-12 lg:grid-cols-3 lg:px-8"
        >
          {visibleEvents.map((event, index) => {
            const btnBg = buttonBgStyles[index % buttonBgStyles.length];
            const imgSrc =
              typeof event.image === "string"
                ? event.image
                : event.image?.src ?? "";
            const imgAlt =
              typeof event.image === "string"
                ? event.title ?? "Event"
                : event.image?.alt ?? event.title ?? "Event";

            return (
              <div
                key={`${event.title}-${index}`}
                className="group relative flex h-[420px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-slate-900 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={imgAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={isUnoptimizedImageSrc(imgSrc)}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black transition-opacity duration-300 group-hover:opacity-95" />
                <div className="relative z-10 flex flex-col items-start p-6 sm:p-8">
                  <div className="mb-3 h-0.5 w-10 bg-[#FF4500]" />
                  <h3 className="font-serif text-xl font-bold leading-snug text-white hover:text-orange-500 sm:text-2xl">
                    <a href={event.href || "#"}>{event.title}</a>
                  </h3>
                  <div className="mt-6">
                    <Link
                      href={event.button?.href || event.href || "#"}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg md:px-12 ${btnBg}`}
                    >
                      <span>{event.button?.label || "Join Now"}</span>
                      <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showExplore && exploreButton?.label ? (
          <div className="mb-4 mt-4 flex justify-center md:mb-0">
            <Link
              href={exploreButton.href || "#"}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              <span>{exploreButton.label}</span>
              <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";

type ProjectCard = {
  category?: string;
  title?: string;
  description?: string;
  image?: { src?: string; alt?: string } | string;
  button?: { label?: string; href?: string };
  icon?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getProjectIcon = (icon?: string) =>
  renderNgoIcon(icon || "heart", "text-xl text-white");

const HandDrawnHeart = ({
  className = "w-24 h-24",
  color = "#FFD5CE",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 33 78 C 50 63 85 49 85 38 C 85 27 70 23 60 32 C 55 36 53 41 53 41 C 53 41 50 33 46 29 C 40 23 27 25 27 38 C 27 52 50 72 75 85"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const toTitleText = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  if (typeof value.title === "string") return value.title;
  return [value.line1, value.highlight, value.line2]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ");
};

export default function NGOProjects2({ data = {} }: SectionProps) {
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (isRecord(data.badge) && typeof data.badge.label === "string"
      ? data.badge.label
      : "Our Projects");
  const title = toTitleText(data.title) || toTitleText(data.heading);
  const description =
    typeof data.desc === "string"
      ? data.desc
      : typeof data.description === "string"
        ? data.description
        : undefined;
  const items = (Array.isArray(data.items) ? data.items : []) as ProjectCard[];
  const exploreButton = isRecord(data.exploreButton)
    ? (data.exploreButton as { label?: string; href?: string })
    : undefined;
  const hideExploreEditor = data.hideExploreControls === true;
  const showExplore = !hideExploreEditor && data.showExploreButton !== false;
  const boxesPerRow =
    collectionBoxesPerRow(data, "items") ?? sectionWrapperBoxesPerRow(data);
  const visibleItems =
    boxesPerRow || !showExplore ? items : items.slice(0, 3);
  const editorFields = hideExploreEditor
    ? "pretitle title desc items"
    : "pretitle title desc items exploreButton showExploreButton";

  return (
    <section
      data-editor-section-label="Projects"
      data-editor-fields={editorFields}
      data-editor-card-fields="image icon category title description button"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      className="relative overflow-hidden bg-[#fafafa] px-0 pt-8 font-sans md:pt-12"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-orange-100/60 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-orange-100/40 blur-[120px]" />
      <div className="pointer-events-none absolute -left-15 -top-15 rounded-full bg-orange-200 sm:h-32 sm:w-32" />
      <div className="pointer-events-none absolute left-0 top-5 grid grid-cols-6 gap-1.5 opacity-20 md:left-6 md:top-28">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-5 grid grid-cols-6 gap-1.5 opacity-20 md:right-6 md:top-28">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        ))}
      </div>
      <div className="absolute right-5 top-10 rotate-6 md:right-60 md:top-40">
        <HandDrawnHeart />
      </div>

      <div className="relative mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3.5 pt-1 text-sm font-bold uppercase tracking-wider text-[#FF4500]">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span>{pretitle}</span>
          </div>
          {title ? (
            <h2 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
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
          {visibleItems.map((item, index) => {
            const isPurple = index === 1 || index === 3;
            const primaryTextColor = isPurple
              ? "text-[#5B3CC4]"
              : "text-[#FF4500]";
            const circleBgColor = isPurple ? "bg-[#5B3CC4]" : "bg-[#FF4500]";
            const imgSrc =
              typeof item.image === "string"
                ? item.image
                : item.image?.src ?? "";
            const imgAlt =
              typeof item.image === "string"
                ? item.title ?? "Project"
                : item.image?.alt ?? item.title ?? "Project";

            return (
              <div
                key={`${item.title}-${index}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={isUnoptimizedImageSrc(imgSrc)}
                    />
                  ) : null}
                  <div
                    className={`absolute bottom-0 left-0 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${circleBgColor}`}
                  >
                    {getProjectIcon(item.icon)}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${primaryTextColor}`}
                    >
                      {item.category}
                    </span>
                    <h3 className="mt-0 text-base font-bold text-slate-900 transition-colors group-hover:text-[#FF4500]">
                      <Link href={item.button?.href || "/project-detail"}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-800">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-0 pt-2">
                    <Link
                      href={item.button?.href || "/project-detail"}
                      className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5 ${primaryTextColor}`}
                    >
                      <span>{item.button?.label || "Learn More"}</span>
                      <FiArrowRight className="text-sm" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showExplore && exploreButton?.label ? (
          <div className="mb-12 mt-4 flex justify-center">
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

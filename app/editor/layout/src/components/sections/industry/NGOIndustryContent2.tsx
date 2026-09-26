"use client";

import Image from "next/image";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { toDisplayText } from "../../../lib/ngoTitle";
import { renderNgoIcon } from "../../../lib/ngoIcons";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";

type Sector = {
  id?: string | number;
  title?: string;
  description?: string;
  iconName?: string;
  icon?: string;
  image?: { src?: string; alt?: string } | string;
  button?: { label?: string; href?: string };
  cta?: { text?: string; url?: string };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOIndustryContent2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : undefined;
  const titleObj = isRecord(header?.title) ? header.title : undefined;
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header?.topBadge === "string" && header.topBadge) ||
    "TOGETHER WE EMPOWER";
  const rawTitle =
    typeof data.title === "string" &&
    data.title.trim() &&
    data.title.trim().toLowerCase() !== "industry we serve"
      ? data.title.trim()
      : "";
  const highlight =
    (typeof data.titleHighlight === "string" && data.titleHighlight.trim()) ||
    (typeof titleObj?.part2 === "string" && titleObj.part2.trim()) ||
    "";
  const title =
    (rawTitle &&
    highlight &&
    !rawTitle.toLowerCase().includes(highlight.toLowerCase())
      ? `${rawTitle} ${highlight}`
      : rawTitle) ||
    [titleObj?.part1, titleObj?.part2]
      .filter(
        (part): part is string =>
          typeof part === "string" && Boolean(part.trim()),
      )
      .join(" ") ||
    toDisplayText(header?.title) ||
    "Industries We Serve";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof header?.pretitle === "string" && header.pretitle) ||
    "";
  const sectionTag =
    (typeof data.sectionTag === "string" && data.sectionTag) ||
    (typeof header?.sectionTag === "string" && header.sectionTag) ||
    "";
  const sectors = (Array.isArray(data.sectors)
    ? data.sectors
    : Array.isArray(data.industries)
      ? data.industries
      : []) as Sector[];
  const boxesPerRow =
    collectionBoxesPerRow(data, "sectors") ?? sectionWrapperBoxesPerRow(data);

  return (
    <section
      data-editor-section-label="Industry"
      data-editor-fields="pretitle title desc sectionTag sectors"
      data-editor-card-fields="image icon title description"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      className="mx-auto max-w-7xl px-4 py-8 font-sans text-[#0F172A] sm:px-6 md:py-12 lg:px-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-3">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          {typeof pretitle === "string" ? (
            <span className="text-sm font-bold uppercase tracking-wider text-orange-500 sm:text-sm">
              {pretitle}
            </span>
          ) : null}
        </div>

        {title ? (
          <h2 className="mt-0 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {title}
          </h2>
        ) : null}

        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            {description}
          </p>
        ) : null}

        {sectionTag ? (
          <div className="mt-8 inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 sm:text-sm">
              {sectionTag}
            </span>
            <span className="h-2 w-2 rounded-full bg-orange-600" />
          </div>
        ) : null}
      </div>

      <div
        data-box-layout-grid="grid"
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      >
        {sectors.map((sector) => {
          const img = isRecord(sector.image) ? sector.image : undefined;
          const src =
            typeof sector.image === "string"
              ? sector.image
              : typeof img?.src === "string"
                ? img.src
                : "";
          const alt =
            typeof sector.image === "string"
              ? sector.title || "Sector"
              : (typeof img?.alt === "string" && img.alt) ||
                sector.title ||
                "Sector";
          return (
            <div
              key={sector.id ?? sector.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  {src ? (
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      unoptimized={isUnoptimizedImageSrc(src)}
                    />
                  ) : null}
                </div>

                <div className="relative z-10 -mt-7 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-orange-500 shadow-md">
                    {renderNgoIcon(
                      sector.icon || sector.iconName || "heart",
                      "h-6 w-6 text-white",
                    )}
                  </div>
                </div>

                <div className="p-5 pt-3 text-center">
                  <h3 className="font-serif text-base font-bold text-slate-900 transition-colors group-hover:text-orange-500">
                    {sector.title}
                  </h3>
                  {sector.description ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                      {sector.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

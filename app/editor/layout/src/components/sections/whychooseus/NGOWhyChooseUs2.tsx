"use client";

import { cloneElement, isValidElement } from "react";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const renderIcon = (icon?: string) => {
  const node = renderNgoIcon(
    icon === "donation" ? "FiDollarSign" : icon || "target",
    "h-[30px] w-[30px] shrink-0",
  );
  if (!isValidElement(node)) return node;
  return cloneElement(node, {
    size: 30,
    strokeWidth: 2,
    className: "h-[30px] w-[30px] shrink-0",
    style: { width: 30, height: 30 },
  } as never);
};

export default function NGOWhyChooseUs2({ data = {} }: SectionProps) {
  const badge =
    typeof data.badge === "string"
      ? data.badge
      : typeof (data.badge as { label?: string } | undefined)?.label === "string"
        ? (data.badge as { label: string }).label
        : "WHY CHOOSE US";
  const titleText =
    typeof data.title === "string"
      ? data.title
      : data.title && typeof data.title === "object" && !Array.isArray(data.title)
        ? [
            (data.title as { line1?: string }).line1,
            (data.title as { line2?: string }).line2,
          ]
            .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
            .join(" ")
        : "";
  const desc = typeof data.desc === "string" ? data.desc : "";
  const image = typeof data.image === "string" ? data.image : "";
  const imageAlt =
    typeof data.imageAlt === "string" ? data.imageAlt : "Why choose us";
  const imageOverlay =
    data.imageOverlay &&
    typeof data.imageOverlay === "object" &&
    !Array.isArray(data.imageOverlay)
      ? (data.imageOverlay as {
          icon?: string;
          text?: string;
          highlight?: string;
        })
      : { icon: "heart-hand", text: "", highlight: "" };
  const cards = Array.isArray(data.cards) ? data.cards : [];

  return (
    <section
      data-editor-section-label="Why Choose Us"
      data-editor-fields="badge title desc image imageAlt imageOverlay cards"
      data-editor-card-fields="icon title desc"
      className="relative overflow-hidden bg-[#fafafa] md:px-32 px-2 py-8 "
    >
      <div className="relative mx-auto  bg-[#fffcf9] md:p-6 p-2">
        {/* BACKGROUND DECORATION */}
        {/* Left Glow Curved Border */}
        <div className="pointer-events-none absolute -left-12 top-0 h-full w-24 rounded-r-full bg-[#ffefe9] opacity-60 blur-xl" />

        {/* Dotted Grid Pattern Top Right */}
        <div className="pointer-events-none absolute right-6 top-6 grid grid-cols-6 gap-2.5 opacity-40">
          {Array.from({ length: 30 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-[#ff784b]" />
          ))}
        </div>

        {/* MAIN GRID CONTENT */}
        <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN: TITLE, DESC & IMAGE */}
          <div className="flex flex-col lg:col-span-5">
            {/* BADGE */}
            <div className="mb-3 flex items-center gap-2 text-sm  font-bold tracking-wider text-[#ff541b] uppercase">
              <FiHeart size={15} className="fill-[#ff541b]" />
              <span>{badge}</span>
            </div>

            {/* TITLE */}
            <h2 className="text-3xl font-extrabold text-[#0f172a] sm:text-4xl md:text-4xl leading-[1.15]">
              {titleText}
            </h2>

            {/* RED UNDERLINE */}
            {/* <div className="mt-3 h-[3px] w-12 rounded-full bg-[#ff541b]" /> */}

            {/* DESCRIPTION */}
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#525b70]">
              {desc}
            </p>

            {/* IMAGE CARD */}
            <div className="relative z-20 mt-8 -mb-8 h-[420px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[460px] lg:h-[580px]">
              {image ? (
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  unoptimized={isUnoptimizedImageSrc(image)}
                />
              ) : null}

              {/* OVERLAY BADGE */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3.5 rounded-2xl bg-[#091024]/90 p-3.5 shadow-lg backdrop-blur-md sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#ff541b] shadow-md">
                  {renderIcon(imageOverlay.icon || "")}
                </div>

                <p className="text-sm font-normal leading-tight text-white sm:text-sm">
                  {imageOverlay.text}{" "}
                  <span className="font-bold text-[#ff541b]">
                    {imageOverlay.highlight}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 6 FEATURE CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
            {cards.map((card, index) => {
              const item = card as {
                icon?: string;
                title?: string;
                desc?: string;
              };
              return (
                <div
                  key={index}
                  className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.1)]"
                >
                  <div>
                    {/* ICON */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e8] text-[#ff541b] transition-colors duration-300 group-hover:bg-[#ff541b] group-hover:text-white">
                      {renderIcon(item.icon || "")}
                    </div>

                    {/* TITLE */}
                    <h3 className="mt-4 text-base md:text-xl font-bold leading-snug text-[#0f172a]">
                      {item.title}
                    </h3>

                    {/* UNDERLINE */}
                    <div className="mt-2.5 h-[2px] w-4 bg-[#ff541b]" />

                    {/* DESCRIPTION */}
                    <p className="mt-3 text-sm md:text-base leading-relaxed text-[#64748b]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DECORATIVE DASHED HEART LINE (BOTTOM-LEFT) */}
        <div className="pointer-events-none absolute -bottom-4 -left-4 hidden h-28 w-20 opacity-70 sm:block">
          <svg
            viewBox="0 0 70 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <path
              d="M31 8C24 0 12 3 12 13C12 22 22 29 31 38C40 29 51 22 51 13C51 3 39 0 31 8Z"
              stroke="#ff9e80"
              strokeWidth="1.5"
            />
            <path
              d="M31 38C25 48 12 52 14 66C16 78 30 77 39 84"
              stroke="#ff9e80"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <path
              d="M39 84L34 80M39 84L34 87"
              stroke="#ff9e80"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

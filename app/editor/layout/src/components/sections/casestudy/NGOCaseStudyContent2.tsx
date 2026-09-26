"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiUsers } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type CauseItem = {
  image?: { src?: string; alt?: string } | string;
  icon?: string;
  category?: string;
  title?: string;
  titleLink?: string;
  description?: string;
  button?: { label?: string; href?: string };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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

export default function NGOCaseStudyContent2({ data = {} }: SectionProps) {
  const titleObject = isRecord(data.title) ? data.title : {};
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (isRecord(data.badge) && typeof data.badge.label === "string"
      ? data.badge.label
      : "Our Causes");
  const rawTitle = typeof data.title === "string" ? data.title.trim() : "";
  const title =
    (typeof data.heading === "string" && data.heading.trim()) ||
    (rawTitle &&
    !["case study", "case study details"].includes(rawTitle.toLowerCase())
      ? rawTitle
      : "") ||
    [titleObject.line1, titleObject.highlight, titleObject.line2]
      .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
      .join(" ") ||
    "The Causes We Care About";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const items = (Array.isArray(data.items) ? data.items : []) as CauseItem[];

  return (
    <section
      data-editor-section-label="Case Studies"
      data-editor-fields="pretitle title desc items"
      data-editor-card-fields="image icon category title titleLink description button"
      className="relative overflow-hidden pt-10 md:pt-12"
    >
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-orange-100 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-orange-100 blur-[120px]" />
      <div className="pointer-events-none absolute -left-15 -top-15 rounded-full bg-orange-200 sm:h-32 sm:w-32" />
      <div className="absolute right-10 top-14 rotate-6 md:right-60 md:top-40">
        <HandDrawnHeart />
      </div>
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

      <div className="relative mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 pt-1 text-sm font-bold uppercase tracking-wider text-[#FF4500]">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span>{pretitle}</span>
          </div>
          <h2 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:px-6 md:mt-12 lg:grid-cols-3 lg:px-8">
          {items.map((item, index) => {
            const isPurple = index === 1;
            const primaryColorClass = isPurple
              ? "text-[#5B3CC4]"
              : "text-[#FF4500]";
            const bgIconClass = isPurple ? "bg-[#5B3CC4]" : "bg-[#FF4500]";
            const bgButtonClass = isPurple
              ? "bg-[#5B3CC4] hover:bg-[#4a2eb0]"
              : "bg-[#FF4500] hover:bg-[#e03d00]";
            const imgSrc =
              typeof item.image === "string"
                ? item.image
                : item.image?.src ?? "";
            const imgAlt =
              typeof item.image === "string"
                ? item.title ?? "Case study"
                : item.image?.alt ?? item.title ?? "Case study";

            return (
              <div
                key={`${item.title}-${index}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative h-56 w-full overflow-hidden">
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
                    className={`absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-br-2xl shadow-md ${bgIconClass}`}
                  >
                    {renderNgoIcon(item.icon || "heart", "text-xl text-white")}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <span
                      className={`text-sm font-bold uppercase tracking-wider ${primaryColorClass}`}
                    >
                      {item.category}
                    </span>
                    <h3 className="mt-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#FF4500]">
                      <a href={item.titleLink || "#"}>{item.title}</a>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative mt-2 flex items-center justify-between gap-3 pt-2 md:mt-6">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        isPurple
                          ? "bg-purple-50 text-[#5B3CC4]"
                          : "bg-orange-50 text-[#FF4500]"
                      }`}
                    >
                      <FiUsers className="text-lg" />
                    </div>
                    <Link
                      href={item.button?.href || item.titleLink || "#"}
                      className={`absolute left-[50%] flex w-[60%] -translate-x-1/2 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all md:left-[40%] md:w-[45%] ${bgButtonClass}`}
                    >
                      <span>
                        {item.button?.label?.trim() === "Donate Now"
                          ? "Read More"
                          : item.button?.label || "Read More"}
                      </span>
                      <FiArrowRight className="text-sm" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

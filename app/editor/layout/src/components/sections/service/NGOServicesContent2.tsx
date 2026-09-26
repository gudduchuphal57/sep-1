"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiHeart } from "react-icons/fi";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type ServiceItem = {
  id?: string | number;
  title?: string;
  description?: string;
  desc?: string;
  image?: string;
  icon?: string;
  href?: string;
  link?: string;
  label?: string;
};

const toTitleText = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  return [value.line1, value.highlight, value.line2, value.titlePrefix, value.titleHighlight]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ");
};

export default function NGOServicesContent2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : undefined;
  const items = (Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.services)
      ? data.services
      : Array.isArray(data.cards)
        ? data.cards
        : []) as ServiceItem[];

  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header?.subTag === "string" && header.subTag) ||
    "What We Do";
  const title =
    toTitleText(data.title) ||
    `${typeof header?.titlePrefix === "string" ? header.titlePrefix : ""}${
      typeof header?.titleHighlight === "string" ? header.titleHighlight : ""
    }`.trim() ||
    "Our Services";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    (typeof header?.description === "string" && header.description) ||
    "";
  const sectionTag =
    (typeof data.sectionTag === "string" && data.sectionTag) ||
    (typeof header?.sectionTag === "string" && header.sectionTag) ||
    "";

  return (
    <section
      data-editor-section-label="Services"
      data-editor-fields="pretitle title desc items"
      data-editor-card-fields="image icon title description link label"
      className="mx-auto max-w-7xl bg-[#fdfcfc] px-3 pt-8 text-[#1a1a1a] sm:px-6 sm:pt-12 lg:px-8"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-500">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          <span>{pretitle}</span>
        </div>

        <h1 className="mt-0 font-serif text-2xl font-extrabold tracking-tight text-[#111111] sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description ? (
          <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
            {description}
          </p>
        ) : null}
 
        
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {items.map((item, idx) => (
          <div
            key={item.id ?? `${item.title}-${idx}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative h-44 w-full bg-slate-100 sm:h-52">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title || "Service"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={isUnoptimizedImageSrc(item.image)}
                />
              ) : null}

              <div className="absolute -bottom-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-orange-500 text-white shadow-md ring-4 ring-white sm:-bottom-6 sm:h-13 sm:w-13">
                {item.icon ? (
                  renderNgoIcon(item.icon, "h-5 w-5 sm:h-6 sm:w-6")
                ) : (
                  <FiHeart className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-4 pt-7 text-center sm:p-6 sm:pt-8">
              <h3 className="font-serif text-base font-bold text-[#111111] sm:text-lg">
                {item.title}
              </h3>

              {item.description || item.desc ? (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                  {item.description || item.desc}
                </p>
              ) : null}

              <div className="mt-4 sm:mt-6">
                <Link
                  href={item.link || item.href || "#"}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 transition-colors hover:text-orange-600"
                >
                  <span>{item.label || "Learn More"}</span>
                  <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

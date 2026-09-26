"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type PartnerItem = {
  name?: string;
  logo?: string;
  image?: string;
  website?: string;
  href?: string;
  link?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTitle = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  return [value.line1, value.highlight, value.line2]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ")
    .trim();
};

export default function NGOPartners2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : undefined;
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof badge?.label === "string" && badge.label) ||
    "Our Partners";
  const title = toTitle(data.title) || "Partners & Sponsors";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const partners = (Array.isArray(data.partnersList)
    ? data.partnersList
    : Array.isArray(data.partners)
      ? data.partners
      : Array.isArray(data.cards)
        ? data.cards
        : []) as PartnerItem[];

  return (
    <section
      data-editor-section-label="Partners"
      data-editor-fields="pretitle title desc partnersList"
      data-editor-card-fields="logo name website"
      className="relative overflow-hidden bg-gray-100 py-8 md:py-12"
    >
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center gap-1">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span className="inline-flex text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
              {pretitle}
            </span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-12 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
          {partners.map((partner, idx) => {
            const logo = partner.logo || partner.image || "";
            const href =
              partner.website || partner.href || partner.link || "#";
            return (
              <Link
                key={`${partner.name}-${idx}`}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex h-28 items-center justify-center rounded-2xl bg-white px-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:h-32 sm:px-6"
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt={partner.name || "Partner logo"}
                    width={150}
                    height={70}
                    sizes="(max-width: 640px) 100px, 150px"
                    className="max-h-14 w-auto object-contain transition duration-300 group-hover:scale-105"
                    unoptimized={isUnoptimizedImageSrc(logo)}
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-600">
                    {partner.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";

import type { SectionProps, StatItemData } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

export default function EventsCaseStudyFeatured1({ data = {} }: SectionProps) {
  const featuredImage =
    typeof data.featuredImage === "string" ? data.featuredImage : undefined;
  const stats = (data.stats ?? []) as StatItemData[];

  return (
    <div className="rounded-[2rem] border border-[#f4d4e1] bg-white p-6 shadow-[0_24px_80px_-40px_rgba(214,27,88,0.28)] sm:p-8 lg:p-10">
      {featuredImage && (
        <div className="relative mb-8 h-72 overflow-hidden rounded-[1.5rem] sm:h-96">
          <Image
            src={featuredImage}
            alt={
              (typeof data.featuredImageAlt === "string" && data.featuredImageAlt) ||
              (typeof data.title === "string" && data.title) ||
              "Case study image"
            }
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            unoptimized={isUnoptimizedImageSrc(featuredImage)}
          />
        </div>
      )}

      {stats.length > 0 && (
        <div data-box-layout-grid="grid" className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="rounded-[1.25rem] border border-[#f4d4e1] bg-[#fff5f8] p-4"
            >
              <p className="text-2xl font-black text-[#d61b58]">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

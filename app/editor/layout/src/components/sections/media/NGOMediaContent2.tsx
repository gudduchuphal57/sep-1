"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type MediaCard = {
  title?: string;
  logoUrl?: string;
  image?: string;
  articleUrl?: string;
  href?: string;
  link?: string;
};

export default function NGOMediaContent2({ data = {} }: SectionProps) {
  const content: Record<string, unknown> = isRecord(data.content)
    ? data.content
    : {};
  const sectionTitle =
    (typeof data.sectionTitle === "string" && data.sectionTitle.trim()) ||
    (typeof content.sectionTitle === "string" && content.sectionTitle.trim()) ||
    (typeof data.title === "string" &&
    data.title.trim() &&
    data.title.trim().toLowerCase() !== "media"
      ? data.title.trim()
      : "") ||
    (isRecord(data.title) && typeof data.title.line1 === "string"
      ? data.title.line1
      : "") ||
    "Latest Media Highlights";

  const mediaCards = (Array.isArray(data.mediaCards)
    ? data.mediaCards
    : Array.isArray(content.mediaCards)
      ? content.mediaCards
      : Array.isArray(data.mediaItems)
        ? data.mediaItems
        : Array.isArray(data.cards)
          ? data.cards
          : Array.isArray(data.items)
            ? data.items
            : []) as MediaCard[];

  return (
    <section
      data-editor-section-label="Media"
      data-editor-fields="sectionTitle mediaCards"
      data-editor-card-fields="image title articleUrl"
      className="mx-auto max-w-7xl px-2 py-8 sm:px-4"
    >
      <div className="rounded-3xl p-0 shadow-sm">
        <div className="mb-8 text-center">
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1B3D] sm:text-3xl">
              {sectionTitle}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-4">
          {mediaCards.map((item, index) => {
            const href = item.articleUrl || item.href || item.link;
            const logoSrc = item.image || item.logoUrl || "";
            const className =
              "group flex flex-col justify-between overflow-hidden rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md";

            const inner = (
              <>
                <div className="flex h-40 items-center justify-center overflow-hidden bg-white p-4 sm:h-44">
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={item.title || "Partner logo"}
                      width={200}
                      height={120}
                      sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px"
                      className="h-full w-full scale-110 object-contain transition-transform duration-300 group-hover:scale-115"
                      loading="lazy"
                      unoptimized={isUnoptimizedImageSrc(logoSrc)}
                    />
                  ) : null}
                </div>
                <div className="bg-[#3D3E3E] px-4 py-3 text-center text-white">
                  <h3 className="text-sm font-semibold tracking-wide">
                    {item.title}
                  </h3>
                </div>
              </>
            );

            if (href) {
              return (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              );
            }

            return (
              <div key={index} className={className}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCaseDetailsArticle2({ data = {} }: SectionProps) {
  const mainContent = isRecord(data.mainContent) ? data.mainContent : {};
  const primary = isRecord(mainContent.primaryArticle)
    ? mainContent.primaryArticle
    : {};
  const secondary = isRecord(mainContent.secondaryArticle)
    ? mainContent.secondaryArticle
    : {};
  const nestedImage = isRecord(primary.mainImage) ? primary.mainImage : {};
  const pageTitle =
    (typeof data.pageTitle === "string" && data.pageTitle) ||
    "Case Study Detail";
  const primaryTitle =
    (typeof data.primaryTitle === "string" && data.primaryTitle) ||
    (typeof primary.title === "string" && primary.title) ||
    "";
  const imageSrc =
    (typeof data.primaryImage === "string" && data.primaryImage) ||
    (typeof nestedImage.src === "string" && nestedImage.src) ||
    "";
  const imageAlt =
    (typeof data.primaryImageAlt === "string" && data.primaryImageAlt) ||
    (typeof nestedImage.alt === "string" && nestedImage.alt) ||
    primaryTitle ||
    "Case study";
  const primaryParagraphs = (
    Array.isArray(data.primaryParagraphs)
      ? data.primaryParagraphs
      : Array.isArray(primary.paragraphs)
        ? primary.paragraphs
        : []
  ) as string[];
  const postedOn =
    (typeof data.postedOn === "string" && data.postedOn) ||
    (typeof secondary.postedOn === "string" && secondary.postedOn) ||
    "";
  const secondaryTitle =
    (typeof data.secondaryTitle === "string" && data.secondaryTitle) ||
    (typeof secondary.title === "string" && secondary.title) ||
    "";
  const secondaryParagraphs = (
    Array.isArray(data.secondaryParagraphs)
      ? data.secondaryParagraphs
      : Array.isArray(secondary.paragraphs)
        ? secondary.paragraphs
        : []
  ) as string[];

  return (
    <div>
      <h1 className="mb-8 text-center text-3xl font-extrabold text-[#1a0c2e] sm:text-4xl md:text-5xl">
        {pageTitle}
      </h1>
      <article className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              unoptimized={isUnoptimizedImageSrc(imageSrc)}
            />
          ) : null}
        </div>
        {primaryTitle ? (
          <h2 className="mt-6 p-2 text-xl font-bold tracking-tight text-[#1a0c2e] sm:p-3 sm:text-2xl md:text-3xl">
            {primaryTitle}
          </h2>
        ) : null}
        <div className="mt-0 space-y-4 p-2 text-sm leading-relaxed text-gray-600 sm:p-3">
          {primaryParagraphs.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>

      <article className="mt-8 rounded-xl border border-gray-100 bg-[#fefaf9] p-2 shadow-sm sm:p-3">
        {postedOn ? (
          <p className="text-sm font-semibold text-[#ff5a36]">
            Posted On:{" "}
            <span className="font-normal text-gray-600">{postedOn}</span>
          </p>
        ) : null}
        {secondaryTitle ? (
          <h2 className="mt-2 text-xl font-bold tracking-tight text-[#1a0c2e] sm:text-2xl md:text-3xl">
            {secondaryTitle}
          </h2>
        ) : null}
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
          {secondaryParagraphs.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

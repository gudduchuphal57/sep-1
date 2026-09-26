"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOFrenchiseCta2({ data = {} }: SectionProps) {
  const contactBanner = isRecord(data.contactBanner) ? data.contactBanner : {};
  const nestedImage = isRecord(contactBanner.image) ? contactBanner.image : {};
  const ctaTitle =
    (typeof data.ctaTitle === "string" && data.ctaTitle) ||
    (typeof contactBanner.title === "string" && contactBanner.title) ||
    "Have Questions?";
  const ctaPretitle =
    (typeof data.ctaPretitle === "string" && data.ctaPretitle) ||
    (typeof contactBanner.pretitle === "string" && contactBanner.pretitle) ||
    "";
  const ctaDesc =
    (typeof data.ctaDesc === "string" && data.ctaDesc) ||
    (typeof contactBanner.description === "string" &&
      contactBanner.description) ||
    "";
  const ctaPhone =
    (typeof data.ctaPhone === "string" && data.ctaPhone) ||
    (typeof contactBanner.phone === "string" && contactBanner.phone) ||
    "";
  const ctaEmail =
    (typeof data.ctaEmail === "string" && data.ctaEmail) ||
    (typeof contactBanner.email === "string" && contactBanner.email) ||
    "";
  const ctaHours =
    (typeof data.ctaHours === "string" && data.ctaHours) ||
    (typeof contactBanner.workingHours === "string" &&
      contactBanner.workingHours) ||
    "";
  const ctaImage =
    (typeof data.ctaImage === "string" && data.ctaImage) ||
    (typeof nestedImage.src === "string" && nestedImage.src) ||
    "";
  const ctaImageAlt =
    (typeof data.ctaImageAlt === "string" && data.ctaImageAlt) ||
    (typeof nestedImage.alt === "string" && nestedImage.alt) ||
    ctaTitle;

  return (
    <section
      data-editor-section-label="Franchise CTA"
      data-editor-fields="ctaTitle ctaPretitle ctaDesc ctaPhone ctaEmail ctaHours ctaImage ctaImageAlt"
      className="mx-auto max-w-6xl bg-white px-0 pb-16 sm:px-4"
    >
      <div className="relative overflow-hidden bg-gray-900 p-4 text-white sm:px-8 sm:py-10 md:rounded-2xl md:px-12">
        {ctaImage ? (
          <div className="absolute inset-y-0 right-0 hidden w-1/3 md:block">
            <Image
              src={ctaImage}
              alt={ctaImageAlt}
              fill
              className="object-cover object-center"
              unoptimized={isUnoptimizedImageSrc(ctaImage)}
            />
          </div>
        ) : null}
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center">
          <div className="max-w-md md:border-r-2 md:border-white/50 md:pr-8">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                {renderNgoIcon("phone", "h-6 w-6")}
              </div>
              <div>
                <p className="text-sm font-medium text-orange-400">{ctaTitle}</p>
                {ctaPretitle ? (
                  <h3 className="text-2xl font-bold">{ctaPretitle}</h3>
                ) : null}
              </div>
            </div>
            {ctaDesc ? (
              <p className="text-sm leading-relaxed text-gray-300">{ctaDesc}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-4 md:pl-8">
            {ctaPhone ? (
              <div className="flex items-center gap-3">
                {renderNgoIcon("phone", "h-5 w-5 text-orange-400")}
                <span className="text-sm font-medium">{ctaPhone}</span>
              </div>
            ) : null}
            {ctaEmail ? (
              <div className="flex items-center gap-3">
                {renderNgoIcon("mail", "h-5 w-5 text-orange-400")}
                <span className="text-sm font-medium">{ctaEmail}</span>
              </div>
            ) : null}
            {ctaHours ? (
              <div className="flex items-center gap-3">
                {renderNgoIcon("clock", "h-5 w-5 text-orange-400")}
                <span className="text-sm font-medium">{ctaHours}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

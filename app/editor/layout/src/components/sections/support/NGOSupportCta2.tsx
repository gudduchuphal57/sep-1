"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTitle = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  return [value.plainText, value.highlightedText, value.line1, value.highlight]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ")
    .trim();
};

export default function NGOSupportCta2({ data = {} }: SectionProps) {
  const ctaBanner = isRecord(data.ctaBanner) ? data.ctaBanner : {};
  const ctaImage = isRecord(ctaBanner.bannerImage) ? ctaBanner.bannerImage : {};
  const primaryAction = isRecord(ctaBanner.primaryAction)
    ? ctaBanner.primaryAction
    : isRecord(data.ctaPrimaryButton)
      ? data.ctaPrimaryButton
      : {};
  const secondaryAction = isRecord(ctaBanner.secondaryAction)
    ? ctaBanner.secondaryAction
    : isRecord(data.ctaSecondaryButton)
      ? data.ctaSecondaryButton
      : {};
  const pretitle =
    (typeof data.ctaPretitle === "string" && data.ctaPretitle) ||
    (typeof ctaBanner.topBadge === "string" && ctaBanner.topBadge) ||
    "BE A PART OF THE CHANGE";
  const title =
    (typeof data.ctaTitle === "string" && data.ctaTitle) ||
    toTitle(ctaBanner.heading) ||
    "Your Support Can Change a Life Today";
  const description =
    (typeof data.ctaDesc === "string" && data.ctaDesc) ||
    (typeof ctaBanner.description === "string" && ctaBanner.description) ||
    "";
  const image =
    (typeof data.ctaImage === "string" && data.ctaImage) ||
    (typeof ctaImage.src === "string" && ctaImage.src) ||
    "";
  const primaryLabel =
    (typeof primaryAction.label === "string" && primaryAction.label) ||
    "Donate Now";
  const primaryHref =
    (typeof primaryAction.href === "string" && primaryAction.href) ||
    (typeof primaryAction.url === "string" && primaryAction.url) ||
    "/donate";
  const secondaryLabel =
    (typeof secondaryAction.label === "string" && secondaryAction.label) ||
    "Be Member";
  const secondaryHref =
    (typeof secondaryAction.href === "string" && secondaryAction.href) ||
    (typeof secondaryAction.url === "string" && secondaryAction.url) ||
    "/team";

  return (
    <section
      data-editor-section-label="Support CTA"
      data-editor-fields="ctaPretitle ctaTitle ctaDesc ctaImage ctaPrimaryButton ctaSecondaryButton"
      className="w-full bg-[#FAF9F6] px-4 pb-8 font-sans text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto min-h-[300px] max-w-7xl overflow-hidden rounded-3xl border border-orange-100 shadow-sm">
        {image ? (
          <Image
            src={image}
            alt={
              (typeof ctaImage.alt === "string" && ctaImage.alt) || "Support CTA"
            }
            fill
            className="object-cover object-center"
            unoptimized={isUnoptimizedImageSrc(image)}
          />
        ) : null}
        <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-white via-white/95 to-transparent" />
        <div className="relative z-10 grid min-h-[300px] grid-cols-1 items-center lg:grid-cols-12">
          <div className="flex flex-col items-start p-4 sm:p-10 lg:col-span-7">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#EA580C]">
                {pretitle}
              </span>
              <div className="mt-1 h-[2px] w-8 bg-[#EA580C]" />
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-slate-900 sm:text-4xl">
              {title}
            </h3>
            {description ? (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-900">
                {description}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-1 sm:gap-3 md:justify-start">
              <a
                href={primaryHref}
                className="inline-flex items-center gap-1 rounded-full bg-[#EA580C] p-2 text-sm font-bold text-white shadow-xs transition-all hover:bg-orange-700 sm:gap-2 sm:px-6 sm:py-3"
              >
                {primaryLabel}
                <span>&rarr;</span>
              </a>
              <a
                href={secondaryHref}
                className="inline-flex items-center gap-1 rounded-full border border-[#EA580C] p-2 text-sm font-bold text-[#EA580C] transition-all hover:bg-orange-50 sm:gap-2 sm:px-6 sm:py-3"
              >
                {secondaryLabel}
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

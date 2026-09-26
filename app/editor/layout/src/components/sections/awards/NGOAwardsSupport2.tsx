"use client";

import type { SectionProps } from "../../../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOAwardsSupport2({ data = {} }: SectionProps) {
  const supportBanner = isRecord(data.supportBanner)
    ? data.supportBanner
    : undefined;
  const nestedTitle = isRecord(supportBanner?.title)
    ? supportBanner.title
    : undefined;
  const nestedCta = isRecord(supportBanner?.cta) ? supportBanner.cta : undefined;
  const trophyImage = isRecord(supportBanner?.trophyImage)
    ? supportBanner.trophyImage
    : undefined;
  const supportButton = isRecord(data.supportButton)
    ? data.supportButton
    : undefined;
  const label =
    (typeof data.supportLabel === "string" && data.supportLabel) ||
    (typeof supportBanner?.topBadge === "string" && supportBanner.topBadge) ||
    "TOGETHER WE ACHIEVE MORE";
  const line1 =
    (typeof data.supportTitle === "string" && data.supportTitle) ||
    (typeof nestedTitle?.line1 === "string" && nestedTitle.line1) ||
    "Your Support Builds";
  const line2 =
    (typeof data.supportTitleHighlight === "string" &&
      data.supportTitleHighlight) ||
    (typeof nestedTitle?.line2 === "string" && nestedTitle.line2) ||
    "Our Success";
  const description =
    (typeof data.supportDesc === "string" && data.supportDesc) ||
    (typeof supportBanner?.description === "string" &&
      supportBanner.description) ||
    "";
  const ctaText =
    (typeof supportButton?.label === "string" && supportButton.label) ||
    (typeof nestedCta?.text === "string" && nestedCta.text) ||
    "Support Our Mission";
  const ctaUrl =
    (typeof supportButton?.href === "string" && supportButton.href) ||
    (typeof nestedCta?.url === "string" && nestedCta.url) ||
    "/contact-us";
  const imageSrc =
    (typeof data.supportImage === "string" && data.supportImage) ||
    (typeof trophyImage?.src === "string" && trophyImage.src) ||
    "";
  const imageAlt =
    (typeof trophyImage?.alt === "string" && trophyImage.alt) || "";

  if (!label && !line1 && !description && !imageSrc) return null;

  return (
    <section
      data-editor-section-label="Awards Support"
      data-editor-fields="supportLabel supportTitle supportTitleHighlight supportDesc supportButton supportImage"
      className="bg-gradient-to-b from-orange-50/20 via-white to-white py-4 font-sans text-[#0F172A] md:py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-orange-100/80 bg-[#FFF8F6] shadow-sm">
          <div className="grid min-h-[280px] grid-cols-1 lg:grid-cols-[55%_45%]">
            <div className="relative z-20 flex items-center justify-center px-3 py-8 sm:px-10 sm:py-10 lg:justify-start lg:px-12 lg:py-12">
              <div className="flex w-full flex-col items-center justify-center gap-5 text-center sm:flex-row sm:gap-6 lg:items-start lg:justify-start lg:text-left">
                
                <div className="flex min-w-0 flex-col items-center lg:items-start">
                  <div className="inline-block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-orange-500 sm:text-sm">
                      {label}
                    </span>
                    <div className="mx-auto mt-1.5 h-[2px] w-9 rounded-full bg-orange-400 lg:mx-0" />
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-bold leading-[1.2] text-[#1E293B] sm:text-3xl lg:text-[30px]">
                    {line1}
                    <br />
                    <span className="text-orange-500">{line2}</span>
                  </h3>
                  {description ? (
                    <p className="mt-3.5 max-w-[340px] text-slate-600 leading-relaxed">
                      {description}
                    </p>
                  ) : null}
                  <div className="mt-6">
                    <a
                      href={ctaUrl}
                      className="inline-flex items-center gap-2.5 rounded-full bg-orange-500 px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-600 hover:shadow-md"
                    >
                      {ctaText}
                      <span className="translate-y-px text-base leading-none">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[240px] min-h-[280px] overflow-hidden sm:h-[300px] lg:h-auto">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="absolute inset-0 h-full w-full rounded-l-full object-cover object-center"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

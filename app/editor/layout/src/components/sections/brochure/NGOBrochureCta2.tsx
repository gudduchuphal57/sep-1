"use client";

import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type StatItem = {
  icon?: string;
  value?: string;
  label?: string;
};

export default function NGOBrochureCta2({ data = {} }: SectionProps) {
  const ctaSection = isRecord(data.ctaSection) ? data.ctaSection : {};
  const primary =
    isRecord(data.ctaPrimaryButton)
      ? data.ctaPrimaryButton
      : isRecord(ctaSection.primaryButton)
        ? ctaSection.primaryButton
        : {};
  const secondary =
    isRecord(data.ctaSecondaryButton)
      ? data.ctaSecondaryButton
      : isRecord(ctaSection.secondaryButton)
        ? ctaSection.secondaryButton
        : {};
  const pretitle =
    (typeof data.ctaPretitle === "string" && data.ctaPretitle) ||
    (typeof ctaSection.label === "string" && ctaSection.label) ||
    "TOGETHER WE CAN";
  const title =
    (typeof data.ctaTitle === "string" && data.ctaTitle) ||
    (typeof ctaSection.title === "string" && ctaSection.title) ||
    "Be a Part of the Change";
  const description =
    (typeof data.ctaDesc === "string" && data.ctaDesc) ||
    (typeof ctaSection.description === "string" && ctaSection.description) ||
    "";
  const primaryLabel =
    (typeof primary.label === "string" && primary.label) || "Donate Now";
  const primaryHref =
    (typeof primary.href === "string" && primary.href) || "/donate";
  const secondaryLabel =
    (typeof secondary.label === "string" && secondary.label) || "Join Us";
  const secondaryHref =
    (typeof secondary.href === "string" && secondary.href) || "/contact-us";
  const stats = (
    Array.isArray(data.ctaStats)
      ? data.ctaStats
      : Array.isArray(ctaSection.stats)
        ? ctaSection.stats
        : []
  ) as StatItem[];

  return (
    <section
      data-editor-section-label="Together We Can"
      data-editor-fields="ctaPretitle ctaTitle ctaDesc ctaPrimaryButton ctaSecondaryButton ctaStats"
      data-editor-card-fields="icon value label"
      className="mx-auto max-w-6xl pb-16 sm:px-4"
    >
      <div className="overflow-hidden bg-orange-50 sm:rounded-2xl">
        <div className="grid grid-cols-1 items-center gap-8 px-2 py-4 sm:p-8 md:grid-cols-2 md:p-10 lg:gap-12">
          <div className="flex flex-col items-center justify-center gap-5 text-center md:flex-row lg:items-start lg:justify-start lg:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-orange-300 bg-white text-orange-600">
              <Image
                src="/heartImage.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <p className="mb-1 text-sm font-semibold tracking-widest text-orange-600">
                {pretitle}
              </p>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
              {description ? (
                <p className="mb-5 max-w-sm text-sm leading-relaxed text-gray-600">
                  {description}
                </p>
              ) : null}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-3 lg:justify-start">
                <a
                  href={primaryHref}
                  className="inline-flex items-center gap-0.5 rounded-full bg-orange-600 px-2 py-1 text-sm font-semibold text-white transition hover:bg-orange-700 sm:gap-2 sm:px-5 sm:py-2.5"
                >
                  {primaryLabel}
                  {renderNgoIcon("arrow-right", "h-4 w-4")}
                </a>
                <a
                  href={secondaryHref}
                  className="inline-flex items-center gap-0.5 rounded-full border-2 border-orange-500 px-2 py-1 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 sm:gap-2 sm:px-5 sm:py-2.5"
                >
                  {secondaryLabel}
                  {renderNgoIcon("arrow-right", "h-4 w-4")}
                </a>
              </div>
            </div>
          </div>

          {stats.length ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm sm:h-16 sm:w-16">
                    {renderNgoIcon(stat.icon || "users", "h-5 w-5 sm:h-10 sm:w-10")}
                  </div>
                  <p className="text-lg font-bold text-orange-600">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

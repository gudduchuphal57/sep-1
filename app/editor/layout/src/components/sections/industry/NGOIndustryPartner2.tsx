"use client";

import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";

type Metric = {
  id?: string | number;
  value?: string;
  label?: string;
  iconName?: string;
  icon?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOIndustryPartner2({ data = {} }: SectionProps) {
  const partnerBanner = isRecord(data.partnerBanner)
    ? data.partnerBanner
    : undefined;
  const nestedTitle = isRecord(partnerBanner?.title)
    ? partnerBanner.title
    : undefined;
  const nestedCta = isRecord(partnerBanner?.cta) ? partnerBanner.cta : undefined;
  const partnerButton = isRecord(data.partnerButton)
    ? data.partnerButton
    : undefined;
  const line1 =
    (typeof data.partnerTitle === "string" && data.partnerTitle) ||
    (typeof nestedTitle?.line1 === "string" && nestedTitle.line1) ||
    "Partner With Us to";
  const line2 =
    (typeof data.partnerTitleHighlight === "string" &&
      data.partnerTitleHighlight) ||
    (typeof nestedTitle?.line2 === "string" && nestedTitle.line2) ||
    "Create Lasting Change";
  const description =
    (typeof data.partnerDesc === "string" && data.partnerDesc) ||
    (typeof partnerBanner?.description === "string" &&
      partnerBanner.description) ||
    "";
  const ctaText =
    (typeof partnerButton?.label === "string" && partnerButton.label) ||
    (typeof nestedCta?.text === "string" && nestedCta.text) ||
    "Get Involved";
  const ctaUrl =
    (typeof partnerButton?.href === "string" && partnerButton.href) ||
    (typeof nestedCta?.url === "string" && nestedCta.url) ||
    "#";
  const metrics = (
    Array.isArray(data.metrics)
      ? data.metrics
      : Array.isArray(partnerBanner?.metrics)
        ? partnerBanner.metrics
        : []
  ) as Metric[];
  const boxesPerRow =
    collectionBoxesPerRow(data, "metrics") ?? sectionWrapperBoxesPerRow(data);

  if (!line1 && !description && metrics.length === 0) return null;

  return (
    <section
      data-editor-section-label="Industry Partner"
      data-editor-fields="partnerTitle partnerTitleHighlight partnerDesc partnerButton metrics"
      data-editor-card-fields="icon value label"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      className="mx-auto max-w-7xl px-4 pb-12 font-sans text-[#0F172A] sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl border border-orange-100/80 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/60 p-6 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#dc2626_1px,transparent_1px)] opacity-5 [background-size:16px_16px]" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="text-left lg:col-span-5">
            <h3 className="font-serif text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
              {line1}
              <br />
              <span className="text-orange-500">{line2}</span>
            </h3>

            <div className="mt-2 h-[3px] w-12 bg-orange-500" />

            {description ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-sm">
                {description}
              </p>
            ) : null}

            {ctaText ? (
              <div className="mt-6">
                <a
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-700 hover:shadow-lg"
                >
                  {ctaText}
                  <span>→</span>
                </a>
              </div>
            ) : null}
          </div>

          <div
            data-box-layout-grid="grid"
            className="grid grid-cols-2 gap-4 border-t border-orange-100 pt-6 sm:grid-cols-4 sm:gap-6 lg:col-span-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
          >
            {metrics.map((metric, idx) => (
              <div
                key={metric.id ?? idx}
                className={`flex flex-col items-center p-2 text-center ${
                  idx < metrics.length - 1
                    ? "sm:border-r sm:border-orange-100"
                    : ""
                }`}
              >
                <div className="mb-2 text-[#DC2626]">
                  {renderNgoIcon(
                    metric.icon || metric.iconName || "heart",
                    "h-8 w-8 text-[#DC2626]",
                  )}
                </div>
                <span className="font-serif text-xl font-bold text-orange-500 sm:text-2xl">
                  {metric.value}
                </span>
                <span className="mt-1 text-sm font-medium text-slate-600">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

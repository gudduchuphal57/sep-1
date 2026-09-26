"use client";

import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";

type Benefit = {
  id?: string | number;
  icon?: string;
  title?: string;
  description?: string;
  desc?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCareersOverview2({ data = {} }: SectionProps) {
  const why = isRecord(data.whyWorkWithUs) ? data.whyWorkWithUs : undefined;
  const rawTitle =
    typeof data.title === "string" &&
    data.title.trim() &&
    data.title.trim().toLowerCase() !== "career"
      ? data.title.trim()
      : "";
  const title =
    rawTitle ||
    (typeof why?.title === "string" && why.title) ||
    "Why Work With Us?";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof why?.description === "string" && why.description) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const nestedBenefits = Array.isArray(why?.benefits)
    ? (why.benefits as Benefit[])
    : [];
  const benefits = (
    Array.isArray(data.benefits) ? data.benefits : nestedBenefits
  ) as Benefit[];
  const boxesPerRow =
    collectionBoxesPerRow(data, "benefits") ?? sectionWrapperBoxesPerRow(data);

  return (
    <section
      data-editor-section-label="Careers Overview"
      data-editor-fields="title desc benefits"
      data-editor-card-fields="icon title description"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      className="px-4 py-8 font-sans text-slate-900 sm:px-6 md:py-12 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {title ? (
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-[#0d152e] sm:text-4xl md:text-5xl">
              {title}
            </h1>
          ) : null}

          {description ? (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#525b70] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {benefits.length > 0 ? (
          <div
            data-box-layout-grid="grid"
            className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {benefits.map((benefit) => (
              <div
                key={benefit.id ?? benefit.title}
                className="group flex flex-col items-center rounded-xl border border-slate-100 bg-white px-5 py-7 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#fff0eb] text-[#ff541b] transition-all duration-300 group-hover:bg-[#ff541b] group-hover:text-white">
                  {renderNgoIcon(benefit.icon || "heart", "h-10 w-10")}
                </div>

                <h2 className="mt-6 font-serif text-lg font-bold leading-snug text-[#0d152e]">
                  {benefit.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[#525b70]">
                  {benefit.description || benefit.desc}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

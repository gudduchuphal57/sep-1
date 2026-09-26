"use client";

import type { SectionProps } from "../../../types/section";
import {
  collectionBoxesPerRow,
  sectionWrapperBoxesPerRow,
} from "../../../lib/boxLayout";

type AwardImage = { src?: string; alt?: string };
type AwardItem = {
  id?: string | number;
  title?: string;
  year?: string;
  description?: string;
  desc?: string;
  image?: AwardImage | string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOAwardsGrid2({ data = {} }: SectionProps) {
  const awardsSection = isRecord(data.awardsSection)
    ? data.awardsSection
    : undefined;
  const awards = (Array.isArray(data.awards)
    ? data.awards
    : Array.isArray(awardsSection?.awards)
      ? awardsSection.awards
      : Array.isArray(data.cards)
        ? data.cards
        : []) as AwardItem[];
  const label =
    (typeof data.awardsLabel === "string" && data.awardsLabel) ||
    (typeof awardsSection?.topBadge === "string" && awardsSection.topBadge) ||
    "HONORED FOR OUR IMPACT";
  const title =
    (typeof data.awardsTitle === "string" && data.awardsTitle) ||
    (typeof awardsSection?.title === "string" && awardsSection.title) ||
    "Recognitions That Motivate Us";
  const boxesPerRow =
    collectionBoxesPerRow(data, "awards") ?? sectionWrapperBoxesPerRow(data);

  return (
    <section
      data-editor-section-label="Awards Grid"
      data-editor-fields="awardsLabel awardsTitle awards"
      data-editor-card-fields="image title description year"
      data-boxes-per-row={
        boxesPerRow && boxesPerRow >= 1 && boxesPerRow <= 6
          ? boxesPerRow
          : undefined
      }
      className="bg-gradient-to-b from-white to-orange-50/20 py-4 font-sans text-[#0F172A] md:py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#EA580C]">
            {label}
          </span>
          {title ? (
            <h3 className="mt-0 font-serif text-2xl font-bold text-slate-900 sm:text-4xl">
              {title}
            </h3>
          ) : null}
        </div>

        <div
          data-box-layout-grid="grid"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {awards.map((award, idx) => {
            const img =
              typeof award.image === "string"
                ? { src: award.image, alt: award.title }
                : award.image;
            return (
              <div
                key={award.id ?? `${award.title}-${idx}`}
                className="group flex flex-col justify-between rounded-2xl border-black bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  {img?.src ? (
                    <div className="mb-5 h-64 w-full overflow-hidden rounded-t-xl bg-slate-50">
                      <img
                        src={img.src}
                        alt={img.alt || award.title || "Award"}
                        className="h-full w-full object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <h4 className="font-serif text-base font-bold text-slate-900 transition-colors group-hover:text-[#EA580C]">
                    {award.title}
                  </h4>
                  {award.description || award.desc ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {award.description || award.desc}
                    </p>
                  ) : null}
                </div>
                {award.year ? (
                  <div className="my-3 border-t border-slate-100 pt-3">
                    <span className="text-sm font-bold text-slate-400">
                      {award.year}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

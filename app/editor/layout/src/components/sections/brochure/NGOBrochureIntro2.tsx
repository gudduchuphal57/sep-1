"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type FeatureItem = {
  icon?: string;
  title?: string;
  description?: string;
};

export default function NGOBrochureIntro2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : {};
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header.label === "string" && header.label) ||
    "BROCHURES";
  const pageTitle =
    typeof data.title === "string" ? data.title.trim() : "";
  const title =
    (pageTitle && pageTitle.toLowerCase() !== "brochure" ? pageTitle : "") ||
    (typeof data.heading === "string" && data.heading) ||
    (typeof header.heading === "string" && header.heading) ||
    "Explore Our Brochures";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    (typeof header.description === "string" && header.description) ||
    "";
  const features = (
    Array.isArray(data.features) ? data.features : []
  ) as FeatureItem[];

  return (
    <div
      data-editor-section-label="Brochure Intro"
      data-editor-fields="pretitle title desc features"
      data-editor-card-fields="icon title description"
    >
      <section className="mx-auto max-w-4xl px-4 pb-10 pt-8 text-center sm:pt-12">
        <div className="flex items-center justify-center gap-2">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          <p className="text-sm font-semibold tracking-[0.2em] text-orange-600">
            {pretitle}
          </p>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h2>

        {description ? (
          <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
            {description}
          </p>
        ) : null}
      </section>

      {features.length ? (
        <section className="mx-auto max-w-5xl px-2 pb-16 sm:px-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-orange-50/70 p-2 sm:gap-5 sm:p-6 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={`${feature.title}-${index}`}
                className="flex flex-col items-center border-r border-r-orange-300 p-0 text-center sm:px-3 sm:py-4"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm sm:h-20 sm:w-20">
                  {renderNgoIcon(
                    feature.icon || "book-open",
                    "h-6 w-6 sm:h-12 sm:w-12",
                  )}
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-gray-900">
                  {feature.title}
                </h3>
                {feature.description ? (
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type FeatureCard = {
  icon?: string;
  title?: string;
  description?: string;
};

export default function NGOFrenchiseIntro2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : {};
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header.label === "string" && header.label) ||
    "FRANCHISE";
  const title =
    (typeof data.title === "string" && data.title) ||
    (typeof header.heading === "string" && header.heading) ||
    "Be a Part of Our Mission. Build a Better Tomorrow.";
  const desc =
    (typeof data.desc === "string" && data.desc) ||
    (typeof header.description === "string" && header.description) ||
    "";
  const features = (
    Array.isArray(data.features) ? data.features : []
  ) as FeatureCard[];

  return (
    <section
      data-editor-section-label="Franchise Intro"
      data-editor-fields="pretitle title desc features"
      data-editor-card-fields="icon title description"
      className="bg-white text-gray-800"
    >
      <div className="mx-auto max-w-4xl px-3 pb-12 pt-8 text-center md:pt-10">
        <div className="flex justify-center gap-1">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          <p className="text-sm font-semibold tracking-[0.2em] text-orange-600">
            {pretitle}
          </p>
        </div>
        <h2 className="mb-2 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
          {title}
        </h2>
        {desc ? (
          <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
            {desc}
          </p>
        ) : null}
      </div>

      {features.length ? (
        <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
          <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={`${feature.title}-${index}`}
                className="flex flex-col items-center border-r-0 bg-white p-1 text-center transition hover:shadow-md sm:p-6 md:border-r-2 md:border-orange-200 md:last:border-r-0"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600 sm:h-20 sm:w-20">
                  {renderNgoIcon(
                    feature.icon || "handshake",
                    "h-7 w-7 sm:h-12 sm:w-12",
                  )}
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

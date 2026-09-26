"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type Stat = {
  icon?: string;
  value?: string;
  label?: string;
  subLabel?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOBranchesContent2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : undefined;
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header?.label === "string" && header.label) ||
    "OUR BRANCHES";
  const title =
    (typeof data.title === "string" &&
    data.title.trim() &&
    data.title.trim().toLowerCase() !== "branches"
      ? data.title.trim()
      : "") ||
    (typeof header?.heading === "string" && header.heading) ||
    "Our Branches, Stronger Together";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof header?.description === "string" && header.description) ||
    "";
  const stats = (Array.isArray(data.stats) ? data.stats : []) as Stat[];

  return (
    <section
      data-editor-section-label="Branches"
      data-editor-fields="pretitle title desc stats"
      data-editor-card-fields="icon value label subLabel"
      className="mx-auto max-w-5xl px-2 pb-10 pt-10 font-sans text-gray-800 sm:px-4 md:pt-14"
    >
      <div className="text-center">
        <div className="flex justify-center gap-1">
          <HiOutlineHeart className="text-base text-[#FF4500]" />
          {pretitle ? (
            <p className="-mt-0.5 mb-0 text-sm font-semibold tracking-[0.2em] text-orange-600">
              {pretitle}
            </p>
          ) : null}
        </div>

        {title ? (
          <h2 className="mb-2 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
            {title}
          </h2>
        ) : null}

        {description ? (
          <p className="mx-auto max-w-2xl leading-relaxed text-gray-600">
            {description}
          </p>
        ) : null}
      </div>

      {stats.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label ?? index}
              className={`relative flex gap-4 px-5 py-5 text-left sm:px-6 sm:py-6 md:py-5 ${
                index !== stats.length - 1
                  ? "border-b border-gray-100 md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                {renderNgoIcon(stat.icon || "building", "h-7 w-7 text-orange-600")}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-2xl font-bold text-orange-600 md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {stat.label}
                </p>
                <p className="mt-0.5 min-h-9 text-sm text-gray-500">
                  {stat.subLabel}
                </p>
              </div>

              {index !== stats.length - 1 ? (
                <div className="absolute bottom-5 right-0 hidden h-[calc(100%-40px)] w-px bg-orange-600 md:block" />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

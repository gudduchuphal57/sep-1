"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type StatItem = {
  id?: string | number;
  icon?: string;
  iconName?: string;
  value?: string;
  label?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOSupportImpact2({ data = {} }: SectionProps) {
  const impactStats = isRecord(data.impactStats) ? data.impactStats : {};
  const pretitle =
    (typeof data.impactPretitle === "string" && data.impactPretitle) ||
    (typeof impactStats.topBadge === "string" && impactStats.topBadge) ||
    "YOUR SUPPORT, REAL IMPACT";
  const title =
    (typeof data.impactTitle === "string" && data.impactTitle) ||
    (typeof impactStats.heading === "string" && impactStats.heading) ||
    "Changing Lives, Building Futures";
  const stats = (
    Array.isArray(data.stats)
      ? data.stats
      : Array.isArray(impactStats.stats)
        ? impactStats.stats
        : []
  ) as StatItem[];
  const closingText =
    (typeof data.closingText === "string" && data.closingText) ||
    (typeof impactStats.closingText === "string" && impactStats.closingText) ||
    "";

  if (!stats.length && !title) return null;

  return (
    <section
      data-editor-section-label="Impact Stats"
      data-editor-fields="impactPretitle impactTitle stats closingText"
      data-editor-card-fields="icon value label"
      className="w-full bg-[#FAF9F6] px-4 pb-8 font-sans text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl rounded-3xl border border-orange-200/80 bg-orange-50/50 p-6 text-center sm:p-10">
        <div className="flex justify-center gap-1">
          <HiOutlineHeart className="text-base text-orange-500 sm:text-lg" />
          <span className="text-sm font-bold uppercase tracking-widest text-[#EA580C]">
            {pretitle}
          </span>
        </div>
        {title ? (
          <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-4xl">
            {title}
          </h2>
        ) : null}

        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.id ?? `${stat.label}-${index}`}
              className="flex flex-col items-center rounded-2xl border border-orange-100/60 bg-white p-5 shadow-2xs"
            >
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-orange-200 bg-orange-50 sm:h-24 sm:w-24">
                {renderNgoIcon(
                  stat.icon || stat.iconName || "heart",
                  "h-8 w-8 text-[#EA580C] sm:h-10 sm:w-10",
                )}
              </div>
              <span className="font-serif text-2xl font-bold text-[#EA580C] sm:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm font-semibold text-slate-700">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {closingText ? (
          <p className="mx-auto mt-8 max-w-xl text-sm font-medium text-slate-600">
            {closingText}
          </p>
        ) : null}
      </div>
    </section>
  );
}

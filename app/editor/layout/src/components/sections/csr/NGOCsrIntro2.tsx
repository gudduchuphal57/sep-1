"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { CsrIcon } from "./CsrIcon";

type StatItem = {
  id?: string | number;
  value?: string;
  label?: string;
  icon?: string;
  iconName?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTitle = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  return [value.part1, value.part2, value.plainText, value.highlightedText, value.line1, value.highlight]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ")
    .trim();
};

export default function NGOCsrIntro2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : {};
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header.topBadge === "string" && header.topBadge) ||
    "OUR CSR INITIATIVES";
  const pageTitle = toTitle(data.title);
  const headerTitle = toTitle(header.title);
  const title =
    (pageTitle && pageTitle.toLowerCase() !== "csr" ? pageTitle : "") ||
    headerTitle ||
    "We Care. We Act. We Make a Difference.";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    (typeof header.pretitle === "string" && header.pretitle) ||
    "";
  const stats = (Array.isArray(data.stats) ? data.stats : []) as StatItem[];

  return (
    <section
      data-editor-section-label="CSR Intro"
      data-editor-fields="pretitle title desc stats"
      data-editor-card-fields="icon value label"
      className="w-full bg-slate-50 px-4 pt-8 font-sans text-slate-800 sm:px-6 md:pt-12 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl space-y-1 text-center">
          <div className="inline-flex items-center space-x-3">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span className="text-sm font-bold uppercase tracking-widest text-orange-600">
              {pretitle}
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {stats.length > 0 ? (
          <div className="my-8 grid grid-cols-1 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:p-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.id ?? `${stat.label}-${index}`}
                className="space-y-2 pt-6 text-center first:pt-0 sm:pt-0 lg:border-r lg:border-r-orange-200 lg:last:border-r-0"
              >
                <CsrIcon name={stat.icon || stat.iconName} />
                <h3 className="pt-2 font-serif text-3xl font-bold text-orange-600">
                  {stat.value}
                </h3>
                <p className="text-sm font-bold text-slate-900">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

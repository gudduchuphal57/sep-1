"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type ValueItem = {
  id?: string | number;
  icon?: string;
  iconName?: string;
  title?: string;
  description?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTitle = (value: unknown) => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  return [value.plainText, value.highlightedText, value.line1, value.highlight]
    .filter((part): part is string => typeof part === "string" && Boolean(part.trim()))
    .join(" ")
    .trim();
};

export default function NGOSupportIntro2({ data = {} }: SectionProps) {
  const introduction = isRecord(data.introduction) ? data.introduction : {};
  const keyValues = isRecord(data.keyValues) ? data.keyValues : {};
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof introduction.topBadge === "string" && introduction.topBadge) ||
    "SUPPORT US";
  const title =
    (typeof data.title === "string" && data.title.trim() && data.title !== "Support"
      ? data.title
      : "") ||
    toTitle(introduction.heading) ||
    "Together, We Can Create a Better Tomorrow";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof data.description === "string" && data.description) ||
    (typeof introduction.description === "string" && introduction.description) ||
    "";
  const values = (
    Array.isArray(data.values)
      ? data.values
      : Array.isArray(keyValues.values)
        ? keyValues.values
        : []
  ) as ValueItem[];

  return (
    <section
      data-editor-section-label="Support Intro"
      data-editor-fields="pretitle title desc values"
      data-editor-card-fields="icon title description"
      className="w-full bg-[#FAF9F6] px-4 py-8 font-sans text-slate-800 sm:px-6 md:py-12 lg:px-8"
    >
      <div className="mx-auto max-w-7xl text-center">
        <div className="mx-auto max-w-2xl">
          <div className="flex justify-center gap-2">
            <HiOutlineHeart className="text-base text-orange-500 sm:text-lg" />
            <span className="mt-0.5 text-sm font-bold uppercase tracking-widest text-[#EA580C]">
              {pretitle}
            </span>
          </div>
          <h2 className="font-serif text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {values.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
            {values.map((val, index) => (
              <div
                key={val.id ?? `${val.title}-${index}`}
                className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
                  {renderNgoIcon(
                    val.icon || val.iconName || "heart",
                    "h-7 w-7 text-[#EA580C]",
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    {val.title}
                  </h3>
                  {val.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {val.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

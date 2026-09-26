"use client";

import { HiOutlineHeart } from "react-icons/hi2";
import type { SectionProps } from "../../../types/section";
import { renderNgoIcon } from "../../../lib/ngoIcons";

type Stat = {
  id?: string | number;
  label?: string;
  value?: string;
  iconName?: string;
  icon?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const LaurelWreathSVG = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 160 300"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M130 290 C120 220, 85 130, 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path d="M 20 20 C 10 10, 2 5, 0 0 C 10 2, 18 8, 23 20 Z" />
    <path d="M 23 28 C 10 20, -2 26, 0 40 C 12 38, 22 32, 26 27 Z" />
    <path d="M 29 22 C 38 10, 52 5, 60 10 C 54 22, 42 28, 32 25 Z" />
    <path d="M 33 55 C 16 48, 2 56, 4 72 C 18 68, 30 60, 35 53 Z" />
    <path d="M 40 46 C 52 32, 68 30, 75 36 C 68 48, 54 55, 43 49 Z" />
    <path d="M 46 88 C 26 80, 10 92, 14 108 C 28 102, 42 94, 48 85 Z" />
    <path d="M 53 76 C 68 62, 85 62, 92 70 C 83 82, 68 88, 56 80 Z" />
    <path d="M 60 125 C 38 118, 22 130, 28 148 C 42 140, 56 130, 62 120 Z" />
    <path d="M 68 112 C 85 98, 104 100, 110 110 C 98 122, 82 126, 72 116 Z" />
    <path d="M 76 168 C 52 162, 36 176, 44 194 C 58 184, 72 172, 78 162 Z" />
    <path d="M 84 152 C 103 138, 122 142, 126 154 C 112 166, 96 168, 88 156 Z" />
    <path d="M 92 215 C 68 210, 52 226, 62 244 C 76 232, 90 218, 96 208 Z" />
    <path d="M 101 198 C 122 184, 140 190, 144 204 C 128 214, 110 214, 104 201 Z" />
    <path d="M 112 262 C 88 260, 74 278, 86 294 C 98 280, 110 266, 115 256 Z" />
    <path d="M 120 244 C 142 232, 158 240, 160 255 C 144 263, 128 260, 123 247 Z" />
  </svg>
);

const ConfettiBackground = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <span className="absolute top-8 left-[5%] h-2 w-3 rotate-12 rounded-xs bg-red-500/70" />
    <span className="absolute top-20 left-[12%] h-2.5 w-2.5 -rotate-45 bg-amber-400/90" />
    <span className="absolute top-36 left-[4%] h-1.5 w-3 rotate-45 bg-orange-500/80" />
    <span className="absolute top-48 left-[18%] h-2.5 w-2 rotate-12 bg-red-600/60" />
    <span className="absolute top-10 right-[6%] h-3.5 w-2.5 -rotate-12 rounded-xs bg-amber-500/80" />
    <span className="absolute top-24 right-[15%] h-2 w-3 rotate-45 bg-orange-600/70" />
    <span className="absolute top-40 right-[5%] h-2 w-2 -rotate-12 bg-red-500/80" />
    <span className="absolute top-52 right-[20%] h-2 w-3 rotate-12 bg-amber-400/80" />
  </div>
);

export default function NGOAwardsContent2({ data = {} }: SectionProps) {
  const header = isRecord(data.header) ? data.header : undefined;
  const headerTitle = isRecord(header?.title) ? header.title : undefined;
  const rawTitle =
    typeof data.title === "string" &&
    data.title.trim() &&
    data.title.trim().toLowerCase() !== "awards & recognitions"
      ? data.title.trim()
      : "";
  const title =
    rawTitle ||
    [headerTitle?.part1, headerTitle?.part2]
      .filter(
        (part): part is string =>
          typeof part === "string" && Boolean(part.trim()),
      )
      .join(" ") ||
    "Awards & Recognition";
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof header?.topBadge === "string" && header.topBadge) ||
    "OUR AWARDS";
  const description =
    (typeof data.desc === "string" && data.desc) ||
    (typeof header?.pretitle === "string" && header.pretitle) ||
    "";
  const stats = (Array.isArray(data.stats) ? data.stats : []) as Stat[];

  return (
    <section
      data-editor-section-label="Awards"
      data-editor-fields="pretitle title desc stats"
      data-editor-card-fields="icon value label"
      className="relative overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-orange-50/20 py-8 font-sans text-[#0F172A] antialiased md:py-8"
    >
      <ConfettiBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl pb-6 pt-4 text-center">
          <LaurelWreathSVG className="pointer-events-none absolute -left-4 top-0 h-48 -scale-x-100 text-red-300/80 sm:left-2 sm:h-60" />
          <LaurelWreathSVG className="pointer-events-none absolute -right-4 top-0 h-48 text-red-300/80 sm:right-2 sm:h-60" />

          <div className="flex justify-center gap-1">
            <HiOutlineHeart className="text-base text-[#FF4500]" />
            <span className="text-sm font-bold uppercase tracking-widest text-[#EA580C]">
              {pretitle}
            </span>
          </div>

          {title ? (
            <h2 className="mt-0 font-serif text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {stats.length > 0 ? (
          <div className="relative z-10 mt-10 grid grid-cols-2 gap-6 rounded-2xl border border-orange-100/80 bg-white p-6 text-center shadow-sm sm:p-8 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.id ?? `${stat.label}-${idx}`}
                className={`flex flex-col items-center ${
                  idx < stats.length - 1 ? "border-orange-100 md:border-r" : ""
                }`}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
                  {renderNgoIcon(
                    stat.icon || stat.iconName || "star",
                    "h-7 w-7 text-[#EA580C]",
                  )}
                </div>
                <span className="font-serif text-2xl font-bold text-[#EA580C] sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm font-semibold text-slate-700">
                  {stat.label}
                </span>
                <span className="mt-2 h-[2px] w-6 bg-[#EA580C]" />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

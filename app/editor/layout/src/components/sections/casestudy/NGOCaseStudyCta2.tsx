"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOCaseStudyCta2({ data = {} }: SectionProps) {
  const nested = isRecord(data.cta) ? data.cta : {};
  const nestedButton = isRecord(nested.button) ? nested.button : {};
  const editorButton = isRecord(data.ctaButton) ? data.ctaButton : {};
  const title =
    (typeof data.ctaTitle === "string" && data.ctaTitle) ||
    (typeof nested.title === "string" && nested.title) ||
    "Want You Know How Can Help?";
  const description =
    (typeof data.ctaDesc === "string" && data.ctaDesc) ||
    (typeof nested.description === "string" && nested.description) ||
    "";
  const buttonLabel =
    (typeof editorButton.label === "string" && editorButton.label) ||
    (typeof nestedButton.label === "string" && nestedButton.label) ||
    "Donate Now";
  const buttonHref =
    (typeof editorButton.href === "string" && editorButton.href) ||
    (typeof nestedButton.href === "string" && nestedButton.href) ||
    "/donate";

  return (
    <section
      data-editor-section-label="Case Study CTA"
      data-editor-fields="ctaTitle ctaDesc ctaButton"
      className="relative mt-12 flex h-[260px] items-center justify-center overflow-hidden bg-[#232042] py-10 text-center text-white shadow-2xl sm:h-[280px]"
    >
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-between overflow-hidden px-2 sm:px-6">
        <svg
          className="-ml-4 h-[85%] w-auto text-[#3C3666]"
          viewBox="0 0 100 200"
          fill="currentColor"
        >
          <path d="M 15 200 C 10 140 30 70 80 10 C 95 40 90 90 65 140 C 45 175 30 190 15 200 Z" />
          <path
            d="M 15 200 Q 40 100 80 10"
            stroke="#232042"
            strokeWidth="2.5"
            fill="none"
          />
          <path d="M 60 55 L 82 65 L 65 80 Z" fill="#232042" />
          <path d="M 50 95 L 72 108 L 54 120 Z" fill="#232042" />
          <path d="M 38 140 L 58 152 L 42 162 Z" fill="#232042" />
        </svg>
        <svg
          className="-ml-6 h-[95%] w-auto text-[#3C3666] sm:-ml-2"
          viewBox="0 0 140 200"
          fill="none"
          stroke="currentColor"
        >
          <path d="M 130 -10 Q 100 80 10 160" strokeWidth="3" strokeLinecap="round" />
          <path d="M 110 25 Q 70 20 40 30" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 98 48 Q 58 40 28 55" strokeWidth="5" strokeLinecap="round" />
          <path d="M 85 72 Q 48 65 18 82" strokeWidth="5" strokeLinecap="round" />
          <path d="M 70 98 Q 36 92 10 112" strokeWidth="5" strokeLinecap="round" />
          <path d="M 55 122 Q 26 120 4 140" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 120 15 Q 95 40 75 60" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 108 38 Q 82 65 62 88" strokeWidth="5" strokeLinecap="round" />
          <path d="M 92 62 Q 68 90 50 112" strokeWidth="5" strokeLinecap="round" />
          <path d="M 76 88 Q 54 118 38 138" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
        <svg
          className="-mr-6 h-[105%] w-auto text-[#3C3666] sm:-mr-2"
          viewBox="0 0 160 200"
          fill="currentColor"
        >
          <path d="M 30 -20 C 95 -20 160 40 150 120 C 140 170 95 200 50 180 C 15 160 -10 100 5 40 Z" />
          <path
            d="M 30 -20 Q 65 70 100 165"
            stroke="#232042"
            strokeWidth="3"
            fill="none"
          />
          <path d="M 48 25 Q 95 20 128 35" stroke="#232042" strokeWidth="2" fill="none" />
          <path d="M 58 65 Q 108 65 138 85" stroke="#232042" strokeWidth="2" fill="none" />
          <path d="M 68 105 Q 112 112 132 138" stroke="#232042" strokeWidth="2" fill="none" />
        </svg>
        <svg
          className="-mr-4 h-[95%] w-auto text-[#3C3666]"
          viewBox="0 0 130 200"
          fill="none"
          stroke="currentColor"
        >
          <path d="M 105 210 Q 90 110 10 10" strokeWidth="3" strokeLinecap="round" />
          <path d="M 20 22 Q 55 20 88 32" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 32 38 Q 66 36 98 52" strokeWidth="5" strokeLinecap="round" />
          <path d="M 44 58 Q 78 55 108 75" strokeWidth="5" strokeLinecap="round" />
          <path d="M 56 80 Q 88 78 118 100" strokeWidth="5" strokeLinecap="round" />
          <path d="M 68 102 Q 96 105 122 128" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 12 15 Q 32 50 52 80" strokeWidth="4" strokeLinecap="round" />
          <path d="M 24 35 Q 44 70 64 102" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 38 58 Q 56 92 74 125" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 52 82 Q 70 118 86 148" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-xl px-4">
        <h2 className="font-serif text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-slate-300 opacity-90 sm:text-sm">
            {description}
          </p>
        ) : null}
        <div className="mt-6">
          <Link
            href={buttonHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#463E75] px-7 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#524989] md:px-12"
          >
            <span>{buttonLabel}</span>
            <FiArrowRight className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
